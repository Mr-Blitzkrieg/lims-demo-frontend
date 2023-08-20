import React,{useEffect,useState} from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axiosInstance  from "../axios/axiosInstance";
import {getBillItemsEndpoint,getDetailedBillEndpoint,getReceiptDownloadEndpoint} from  "../constants"
import toast from 'react-hot-toast';
import Paper from '@mui/material/Paper';
import {getFormattedDateDDMMYYYY,downloadPDF} from '../utils'


const BillPreviewModal = ({bill_id,onClose, isBillPreviewModalOpen}) => {
    const [bill,setBill] = useState({"bill": {},"bill_items":[]})
    const getDetailedBill = (bill_id) => {
        axiosInstance.get(getDetailedBillEndpoint(bill_id))
        .then((resp) => {
            if(resp.status === 200) { 
                setBill(resp.data.data)
                }
        })
        .catch((error)=> {
            let error_msg = error?.response?.data?.data ? error.response.data.data.error : error.response.data.error
            toast.error(error_msg)
        })

    }
    useEffect(() => {
        if(bill_id && isBillPreviewModalOpen){
            getDetailedBill(bill_id)
        }
    },[bill_id])
   const handlePrintClick = () => {
        toast.promise(downloadPDF(getReceiptDownloadEndpoint(bill_id,'RECEIPT')), {
        loading: "Downloading",
        error: "Report status is Pending or Partially Completed",
        success: "Downloaded Successfully !"
      });
        // downloadPDF(getReceiptDownloadEndpoint(bill_id,'RECEIPT'))
        // .then(() => {onClose()})
        // .catch((err) => {toast.error(err)})
   }


      
    return <>
    <Modal
        open={isBillPreviewModalOpen}
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
        width: '100%', // Adjust the width as needed
        padding: 4,

        },
      }}
    >
    
    <Paper elevation={1} sx={{ width: '100%',height: '800px' }}>

    {bill && 
    <div className="">
    <div class="border-b-2 py-4" style={{borderColor:'black'}}>
        <h1 class="text-center text-gray-700 text-2xl font-bold">Receipt</h1>
    </div>
    <div class="mb-10 mt-4">
        <p class="text-right font-bold">Date: { bill?.bill?.created_on && getFormattedDateDDMMYYYY(bill?.bill?.created_on) }</p>
        <p class="text-right font-bold">Bill Number: { bill?.bill?.bill_number }</p>
        <div class="mt-5">
            <p class="font-semibold">Bill To</p>
            <h3 class="text-xl">{ bill?.bill?.patientuser?.name }</h3>
            <p>{ bill?.bill?.patientuser?.address }, { bill?.bill?.patientuser?.city }</p>
            <p>{bill?.bill?.patientuser?.state }, { bill?.bill?.patientuser?.country }</p>
            <p>{ bill?.bill?.patientuser?.pincode }</p>
        </div>
    </div>

    <h3 class="text-xl">Bill Items</h3>
    <table class="w-full border-collapse my-5">
        <thead>
            <tr className="bg-gray-100">
                <th class="border p-2">Test Name</th>
                <th class="border p-2">Quantity</th>
                <th class="border p-2">Price</th>
                <th class="border p-2">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            
            {bill && bill?.bill_items?.map((item) => { return <tr>
                <td class="border p-2">{ item?.test?.name }</td>
                <td class="border p-2">{ item?.quantity }</td>
                <td class="border p-2">{ item?.price}</td>
                <td class="border p-2">{ item?.sub_total}</td>
            </tr>})}
           
            <tr class="">
                <td colspan="3" class="border p-2 text-right"><strong>Total</strong></td>
                <td class="border p-2"><strong>{ bill?.bill?.total }</strong></td>
            </tr>
        </tbody>
    </table>
    
    
    </div>
    }
    </Paper> 
    <div className="flex justify-center">
    <button 
    onClick={() => handlePrintClick()}
    type="button" 
    className="w-2/12 text-white bg-teal-400 hover:bg-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">Print</button>
    </div>


    </Box>
   
    
    </Modal>

    </>
}
export default BillPreviewModal;