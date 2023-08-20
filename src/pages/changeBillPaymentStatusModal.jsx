import React,{useEffect,useState} from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axiosInstance  from "../axios/axiosInstance";
import {getIndividualBillEndpoint,getDetailedBillEndpoint} from  "../constants"
import toast from 'react-hot-toast';
import Paper from '@mui/material/Paper';


const ChangeBillPaymentStatusModal = ({fetchAllBills,bill_id,onClose,isChangeBillPaymentStatusModalOpen}) => {
    const [paymentStatus,setPaymentStatus] = useState('')
    const getDetailedBill = (bill_id) => {
        axiosInstance.get(getDetailedBillEndpoint(bill_id))
        .then((resp) => {
            if(resp.status === 200) { 
                setPaymentStatus(resp.data.data.bill.payment_status)
                }
        })
        .catch((error)=> {
            let error_msg = error?.response?.data?.data ? error.response.data.data.error : error.response.data.error
            toast.error(error_msg)
        })

    }
    useEffect(() => {
        if(bill_id && isChangeBillPaymentStatusModalOpen){
            getDetailedBill(bill_id)
        }
    },[bill_id])

    const handlePaymentStatusSubmit = (e) => {
        e.preventDefault();
        axiosInstance.patch(getIndividualBillEndpoint(bill_id),{"payment_status":paymentStatus})
        .then((resp) => {
            if(resp.status === 200){
                toast.success(resp?.data?.data?.message)
                fetchAllBills()
                onClose()
            }

        })
        .catch((error)=> {
            let error_msg = error?.response?.data?.data ? error.response.data.data.error : error.response.data.error
            toast.error(error_msg)
        })
    }
  
    return <>
    <Modal
        open={isChangeBillPaymentStatusModalOpen}
        onClose={onClose}
    >
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100vh', // Set an appropriate height for the modal
        overflow: 'auto', 
        maxWidth: '60%',
        marginX: 'auto', 
        outline: 'none',
        '& > :not(style)': {
        marginX: 'auto',
        marginY: 4,
        width: '70%', // Adjust the width as needed
        padding: 4,

        },
      }}
    >
    <Paper elevation={1} sx={{ width: '100%',height: '250px' }}>
      <div>
        <form onSubmit={handlePaymentStatusSubmit}>
        <div className="w-1/2 mx-auto">
            <p className="font-semibold whitespace-nowrap mb-4">Payment Status</p>
            <select id="payment_status" name="payment_status" value={paymentStatus} onChange={(e) => {setPaymentStatus(e.target.value)}}
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                {/* <option value="select-gender">Select Gender</option> */}
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
        </select>

        </div>
        <div className="flex justify-center mt-8">
        <button 
        type="submit" 
        className="w-2/12 text-white bg-teal-400 hover:bg-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">Submit</button>
        </div>
        

        </form>

      </div>
    
    </Paper> 
    </Box>
    </Modal>
    </>
}
export default ChangeBillPaymentStatusModal;