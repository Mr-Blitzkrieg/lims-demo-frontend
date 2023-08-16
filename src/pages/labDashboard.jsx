import React,{useState,useEffect,useReducer,useRef} from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {GET_ALL_BILLS,GET_ALL_TESTS,GET_ALL_PATIENT,CREATE_BILL} from "../constants";
import axiosInstance  from "../axios/axiosInstance";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {generateRandomNumber,returnFormattedNumbert} from '../utils'


const LabDashBoard = () => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 950,
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      };
    const initialState = {
        "patientuser": 0,
        "bill_number": generateRandomNumber(),
        "total": 0,
        "payment_status": "unpaid",
        "bill_items": [
            {
                "test_id":0,
                "value":0,
                "quantity":0,
                "price":0,
                "sub_total":0,
                "status": "pending"
            }
        ]
    }
    const reducer = (state, action) => {
        console.log('actions',action)
        switch (action.type) {
          case "SET_PATIENT":
            return { ...state, patientuser: action.payload.patientuser };
          case "SET_BILL_ITEMS":
            return { ...state, bill_items: action.payload };
          case "SET_PAYMENT_STATUS":
            return { ...state, payment_status: action.payload.payment_status};
          case "RESET":
            return initialState;
          default:
            return state;
        }
      };
    const [state, dispatch] = useReducer(reducer, initialState);
    const  billFormRef= useRef(null);
    const [rows,setRows] = useState([])
    const [tests,setTests] = useState([])
    const [allPatients,setAllPatients] = useState([])
    const [isModalOpen,setIsModalOpen] = useState(false)
    

    const fetchAllBills = () => {
        axiosInstance.get(GET_ALL_BILLS)
        .then((resp) => {
            setRows(resp.data.data.bills)
        })
        .catch((error)=> {
            let error_msg = error?.response?.data?.data ? error.response.data.data.error : error.response.data.error
            toast.error(error_msg)
        })

    }
    const fetchAllTests = () => {
        axiosInstance.get(GET_ALL_TESTS)
        .then((resp) => {
            setTests(resp.data.data.tests)
        })
        .catch((error)=> {
            let error_msg = error?.response?.data?.data ? error.response.data.data.error : error.response.data.error
            console.log("error",error)
            toast.error(error_msg)
        })

    }

    const fetchPatients = () => {
        axiosInstance.get(GET_ALL_PATIENT)
        .then((resp) => {
            setAllPatients(resp.data.data.patientusers)
        })
        .catch((error)=> {
            let error_msg = error?.response?.data?.data ? error.response.data.data.error : error.response.data.error
            console.log("error",error)
            toast.error(error_msg)
        })

    }
    useEffect(()=> {
        fetchAllBills()
        fetchAllTests()
        fetchPatients()
    },[])

    const handleBillTestChanges = (event,index) => {
        let name = event.target.name
        let value = event.target.value
        const updatedBillItems = state.bill_items.map((item, idx) => {
            if (idx === index) {
                if (name === "quantity") {
                    return {
                      ...item,
                      [name]: value,
                      sub_total: returnFormattedNumbert(value) * item.price,
                    };
                  } else if (name === "price") {
                    return {
                      ...item,
                      [name]: value,
                      sub_total: item.quantity * returnFormattedNumbert(value),
                    };
                  }
                  else if (name === "test_id") {
                    console.log(tests,value)
                    const selectedTest = tests.find((test) => test.id === parseInt(value));
                    const selectedTestPrice = selectedTest ? selectedTest.price : 0;
                    console.log("price",selectedTestPrice)
                    return {
                      ...item,
                      [name]: value,
                      quantity: 1,
                      price: returnFormattedNumbert(selectedTestPrice)
                    };
                  }
                  else {
                    return {
                        ...item,
                      [name]: value,
                    }
                  }
            }
            return item;
          });
       
          dispatch({ type: "SET_BILL_ITEMS", payload: updatedBillItems });
    }
    const calculateTotalSubTotal = () => {
        return state.bill_items.reduce((total, item) => total + (item.sub_total || 0), 0);
      };
    const addNewRow = () => {
        const newRow = {
            "test_id":0,
            "value":0,
            "quantity":0,
            "price":0,
            "sub_total":0,
            "status": "pending"
        };
        const updatedBillItems = [...state.bill_items, newRow];
        dispatch({ type: "SET_BILL_ITEMS", payload: updatedBillItems });
      };

    const handleBillSubmit = (e) => {
        e.preventDefault();
        let payload = {
            "patientuser_id": state.patientuser,
            "bill_number": state.bill_number,
            "bill_items": state.bill_items
        }
        axiosInstance.post(CREATE_BILL,{...payload})
        .then((resp) => {
            if(resp.status == 201){
                toast.success(resp?.data?.data?.message)
                setIsModalOpen(false)
                dispatch({ type: "RESET" })
                billFormRef.current.reset();
                fetchAllBills()
            }

        })
        .catch((error)=> {
            let error_msg = error?.response?.data?.data ? error.response.data.data.error : error.response.data.error
            toast.error(error_msg)
        })

    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        billFormRef.current.reset();
    }

    return (
    <>
    <Modal
        open={isModalOpen}
        onClose={() => handleModalClose()}
    >
    <Box sx={style}>
    <div className="">
        <form onSubmit={handleBillSubmit} ref={billFormRef}>
        <div className="mb-4 flex align-center w-full gap-x-4">
        <div className="w-9/12">
        <label
          className="block text-gray-700 text-sm font-bold mb-2 text-left"
          htmlFor="patientuser"
        >
        Patient Name
        </label>
        <select id="patientuser" name="patientuser" onChange={(e) => dispatch({ type: "SET_PATIENT", payload: {"patientuser":e.target.value} })}
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        {/* <option value="select-gender">Select Gender</option> */}
        <option value={state.patientuser}>Select a Patient</option> {/* Provide a default option */}
            {allPatients.map((patient) => (
            <option key={patient.id} value={patient.id}>
                {patient.name}
            </option>
            ))}
        </select>
        </div>
        <div className="w-3/12">
        <label
          className="block text-gray-700 text-sm font-bold mb-2 text-left"
          htmlFor="bill_number"
        >
        Bill Number
        </label>
        <input
            readOnly
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="bill_number"
            name="bill_number"
            type="number"
            value={state.bill_number}
            // onChange={(e) => handleBillTestChanges(e,idx)}
          />

        </div>
        </div>
        <h2 className="font-bold">Tests</h2>
        <div className="overflow-y-scroll">
        <div className="mt-2 grid grid-cols-5 gap-x-3">
     <div className="col-span-2">
      <p className="">Test Name</p>
    </div>
    <div className="">
      <p className="">Quantity</p>
    </div>
    <div className="">
      <p className="">Price</p>
    </div>
    <div className="">
      <p className="">Sub Total</p>
    </div>
  </div> 
        {state.bill_items.map((ele,idx) => {return <div className="mt-2 grid grid-cols-5 gap-x-3">
        <div className="mb-4 col-span-2">
        {/* <p className="mb-2">Test Name</p> */}
        <select id="test_id" name="test_id" onChange={(e) => handleBillTestChanges(e,idx)}
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        <option value={ele.id}>Select a Test</option>
            {tests.map((ele) => (
            <option key={ele.id} value={ele.id}>
                {ele.name}
            </option>
            ))}
        </select>
        </div>
        <div className="mb-4">
        {/* <p className="mb-2">Quantity</p> */}
        <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="quantity"
            name="quantity"
            type="number"
            value={ele.quantity}
            onChange={(e) => handleBillTestChanges(e,idx)}
          />
        </div>
        <div className="mb-4">
        {/* <p className="mb-2">Price</p> */}
        <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            name="price"
            type="number"
            value={ele.price}
            onChange={(e) => handleBillTestChanges(e,idx)}
          />
        </div>
        <div className="mb-4 flex items-center gap-x-1">
        {/* <p className="mb-2">Sub Total</p> */}
        <input
            readOnly
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            name="price"
            type="number"
            value={ele.sub_total}
            // onChange={(e) => handleBillTestChanges(e,idx)}
          />
          

        </div>
        </div>})}
        </div>
        <div className="flex mb-4 grid grid-cols-5 gap-x-3">
        <div></div>
        <div></div>
        <div></div>
        <div className="text-right self-center font-bold">
            Total
        </div>
        <div>
        <input
            readOnly
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            name="price"
            type="number"
            value={calculateTotalSubTotal()}
            // onChange={(e) => handleBillTestChanges(e,idx)}
          />
          </div>
        </div>
        <div className="flex items-center justify-between">

        <div className="flex items-center gap-x-2">
            <p className="font-semibold whitespace-nowrap">Payment Status</p>
            <select id="payment_status" name="payment_status" onChange={(e) => dispatch({ type: "SET_PAYMENT_STATUS", payload: {"payment_status":e.target.value} })}
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                {/* <option value="select-gender">Select Gender</option> */}
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
        </select>

        </div>

        <button type="button" onClick={addNewRow} className="text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">Add Test</button>

        </div>
        <div className="flex items-center justify-center mt-4">
        <button type="submit" onClick={addNewRow} className="w-2/12 text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">Bill</button>
        </div>
        </form>

    </div>
          
    </Box>
    
    </Modal>
    

    <div className="my-12 w-9/12 mx-auto">
    <div className="flex items-center justify-end my-2">
    <button type="button" 
    class="text-white bg-teal-700 hover:bg-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
    onClick={() => setIsModalOpen(true)}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>

    Create Bill
    </button>
    </div>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{fontWeight:900}}>Bill Number</TableCell>
            <TableCell style={{fontWeight:900}} align="right">Bill To</TableCell>
            <TableCell style={{fontWeight:900}} align="right">Total</TableCell>
            <TableCell style={{fontWeight:900}} align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.bill_number}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.bill_number}
              </TableCell>
              <TableCell align="right">{row.patientuser.name}</TableCell>
              <TableCell align="right">{row.total}</TableCell>
              <TableCell>
                {row.status == "completed" && 
                <div className="flex justify-end">
                <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-green-700 bg-green-100 border border-green-300 ">
                <div className="text-xs font-normal leading-none max-w-full flex-initial">Completed</div>
                </div>
                </div>
                }
                {row.status == "pending" && 
                <div className="flex justify-end">
                <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-red-700 bg-red-100 border border-red-300 ">
                <div className="text-xs font-normal leading-none max-w-full flex-initial">Pending</div>
                </div>
                </div>
                }
                {row.status == "partially completed" && 
                <div className="flex justify-end">
                <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-blue-700 bg-blue-100 border border-blue-300 ">
                <div className="text-xs font-normal leading-none max-w-full flex-initial">Partially Completed</div>
                </div>
                </div>
                }
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    </>
    )
}
export default LabDashBoard