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
import EditModal from "./editModal";
import BillPreviewModal from "./billPreviewModal";
import ReportPreviewModal from "./reportPreviewModal";
import ChangeBillPaymentStatusModal from "./changeBillPaymentStatusModal"
import Tooltip from '@mui/material/Tooltip';
import { Link } from "react-router-dom";


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
    const [isEditModalOpen,setIsEditModalOpen] = useState(false)
    const [isBillPreviewModalOpen,setIsBillPreviewModalOpen] = useState(false)
    const [isReportPreviewModalOpen,setIsReportPreviewModalOpen] = useState(false)
    const [isChangeBillPaymentStatusModalOpen,setIsChangeBillPaymentStatusModalOpen] = useState(false)
    const [selectedBillID,setSelectedBillId] = useState(null)
    
    

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
                    const selectedTest = tests.find((test) => test.id === parseInt(value));
                    const selectedTestPrice = selectedTest ? returnFormattedNumbert(selectedTest.price) : 0;
                    let quantity = 1
                    return {
                      ...item,
                      [name]: value,
                      quantity: quantity,
                      price: selectedTestPrice,
                      sub_total: quantity * selectedTestPrice,
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
            "bill_items": state.bill_items,
            "payment_status": state.payment_status
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
    const handleEditModalClose = () => {
      setSelectedBillId(null)
      setIsEditModalOpen(false)
      // billFormRef.current.reset();
    }
    const handleValueEditClick = (id) => {
      setSelectedBillId(id)
      setIsEditModalOpen(true)

    }
    const handleBillClick = (id) => {
      setSelectedBillId(id)
      setIsBillPreviewModalOpen(true)

    }
    const handleBillPreviewClose = () => {
      setSelectedBillId(null)
      setIsBillPreviewModalOpen(false)
    }
    const handleReportClick = (id,payment_status) => {
      if(payment_status==="unpaid"){
        toast.error("Bill are unpaid can't access Report")
        return
      }
      setSelectedBillId(id)
      setIsReportPreviewModalOpen(true)

    }
    const handleReportPreviewClose = () => {
      setSelectedBillId(null)
      setIsReportPreviewModalOpen(false)
      // billFormRef.current.reset();
    }
    const handlePaymentStatusClick = (id) => {
      setSelectedBillId(id)
      setIsChangeBillPaymentStatusModalOpen(true)

    }
    const handleChangeBillPaymentStatusModalClose = () => {
      setSelectedBillId(null)
      setIsChangeBillPaymentStatusModalOpen(false)
      // billFormRef.current.reset();
    }

    return (
    <>
    <ChangeBillPaymentStatusModal
        fetchAllBills={fetchAllBills}
        bill_id={selectedBillID}
        isChangeBillPaymentStatusModalOpen={isChangeBillPaymentStatusModalOpen}
        onClose={handleChangeBillPaymentStatusModalClose}
    ></ChangeBillPaymentStatusModal>
    <EditModal 
    fetchAllBills={fetchAllBills}
    bill_id={selectedBillID}
    onClose={handleEditModalClose}
    isEditModalOpen={isEditModalOpen}
    >
    </EditModal>
    <BillPreviewModal
      bill_id={selectedBillID}
      isBillPreviewModalOpen={isBillPreviewModalOpen}
      onClose={handleBillPreviewClose}
    >
    </BillPreviewModal>
    <ReportPreviewModal
      bill_id={selectedBillID}
      isReportPreviewModalOpen={isReportPreviewModalOpen}
      onClose={handleReportPreviewClose}
    >
    </ReportPreviewModal>
    {isModalOpen && <Modal
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
        <button type="submit" className="w-2/12 text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">Bill</button>
        </div>
        </form>

    </div>
          
    </Box>
    </Modal>}
    <div className="my-12 w-9/12 mx-auto">
    <div className="flex items-center justify-end my-2 gap-x-3">
    <Link to={'/add-test'}>
    <button type="button" 
    class="text-white bg-teal-600 hover:bg-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
    >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 11.25l1.5 1.5.75-.75V8.758l2.276-.61a3 3 0 10-3.675-3.675l-.61 2.277H12l-.75.75 1.5 1.5M15 11.25l-8.47 8.47c-.34.34-.8.53-1.28.53s-.94.19-1.28.53l-.97.97-.75-.75.97-.97c.34-.34.53-.8.53-1.28s.19-.94.53-1.28L12.75 9M15 11.25L12.75 9" />
    </svg>



    Add Test
    </button>
    </Link>
    <button type="button" 
    class="text-white bg-teal-600 hover:bg-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
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
            <TableCell style={{fontWeight:900}} align="right">Actions</TableCell>
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
                <TableCell align="right">
                <div className="flex justify-end items-center gap-x-2">
                
                <Tooltip title="Edit Report">
                <svg id="val-" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 cursor-pointer" onClick={() => handleValueEditClick(row.id)}>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                </Tooltip>
                <Tooltip title="Change Payment Status">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0f766e" className="w-6 h-6 cursor-pointer" onClick={() => handlePaymentStatusClick(row.id)}>
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
                </Tooltip>
                <Tooltip title="Preview Bill">
                <svg id="receipt" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 cursor-pointer" onClick={() => handleBillClick(row.id)}>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                </svg>
                </Tooltip>
                <Tooltip title="Preview Report">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0f766e" className="w-6 h-6 cursor-pointer" onClick={() => handleReportClick(row.id,row.payment_status)}>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                </Tooltip>


                </div>
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