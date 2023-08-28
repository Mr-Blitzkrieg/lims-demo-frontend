import React,{useEffect,useState} from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axiosInstance  from "../axios/axiosInstance";
import {getBillItemsEndpoint,getDetailedBillEndpoint,getReceiptDownloadEndpoint} from  "../constants"
import toast from 'react-hot-toast';
import Paper from '@mui/material/Paper';
import {getFormattedDateDDMMYYYY,downloadPDF,capitalizeFirstLetter} from '../utils'


const ReportPreviewModal = ({bill_id,onClose, isReportPreviewModalOpen}) => {
    const [bill,setBill] = useState({"bill": {},"bill_items":[]})
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
        if(bill_id && isReportPreviewModalOpen){
            getDetailedBill(bill_id)
        }
    },[bill_id])
   const handlePrintClick = () => {
    toast.promise(downloadPDF(getReceiptDownloadEndpoint(bill_id,'REPORT')), {
        loading: "Downloading",
        error: "Report status is Pending or Partially Completed",
        success: "Downloaded Successfully !"
      }).then(() => onClose())
   }


      
    return <>
        <Modal open={isReportPreviewModalOpen} onClose={onClose} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <div style={{
            backgroundColor: 'white',
            width: '80%',
            maxHeight: '80vh', // 80% of viewport height
            overflowY: 'auto', // Add scroll if content exceeds modal height
            padding: '20px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
          }}>
        <Paper style={{ width: '210mm', height: '297mm', padding: '20mm' }} elevation={3}>
        <div class="border-b-2 py-4" style={{borderColor:'black'}}>
            <h1 class="text-center text-gray-700 text-2xl font-bold">Report</h1>
        </div>
        <div class="mb-10 mt-4">
            <p class="text-right font-bold">Date: { bill?.bill?.created_on && getFormattedDateDDMMYYYY(bill?.bill?.created_on) }</p>
        <div class="mt-5">
            <p class="font-semibold">Patient Name</p>
            <h3 class="text-xl">{ bill?.bill?.patientuser?.name }</h3>
            <p class="font-semibold">Gender</p>
            <h3 class="text-xl">{ capitalizeFirstLetter(bill?.bill?.patientuser?.gender) }</h3>

        </div>
    </div>

    <h3 class="text-xl">Tests</h3>
    <table class="w-full border-collapse my-5">
        <thead>
            <tr className="bg-gray-100">
                <th class="border p-2">Test Name</th>
                <th class="border p-2">Value</th>
                <th class="border p-2">Unit</th>
                <th class="border p-2">Reference Range</th>
            </tr>
        </thead>
        <tbody>
            
            {bill && bill?.bill_items?.map((item) => { return <tr>
                <td class="border p-2">{ item?.test?.name }</td>
                <td class="border p-2">{ item?.value }</td>
                <td class="border p-2">{ item?.unit}</td>
                <td class="border p-2">{ item?.reference_range ? item?.reference_range: '-' }</td>
            </tr>})}
        </tbody>
    </table>
        
    </Paper>
    <div className="self-center gap-x-2 w-3/12 text-center">
          <button 
            onClick={() => handlePrintClick()}
            type="button" 
            className="text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">Print</button>
          </div>
    </div>
    
      </Modal>
    {/* <Modal
        open={isReportPreviewModalOpen}
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
        <h1 class="text-center text-gray-700 text-2xl font-bold">Report</h1>
    </div>
    <div class="mb-10 mt-4">
        <p class="text-right font-bold">Date: { bill?.bill?.created_on && getFormattedDateDDMMYYYY(bill?.bill?.created_on) }</p>
        <div class="mt-5">
            <p class="font-semibold">Patient Name</p>
            <h3 class="text-xl">{ bill?.bill?.patientuser?.name }</h3>
            <p class="font-semibold">Gender</p>
            <h3 class="text-xl">{ capitalizeFirstLetter(bill?.bill?.patientuser?.gender) }</h3>

        </div>
    </div>

    <h3 class="text-xl">Tests</h3>
    <table class="w-full border-collapse my-5">
        <thead>
            <tr className="bg-gray-100">
                <th class="border p-2">Test Name</th>
                <th class="border p-2">Value</th>
                <th class="border p-2">Unit</th>
                <th class="border p-2">Reference Range</th>
            </tr>
        </thead>
        <tbody>
            
            {bill && bill?.bill_items?.map((item) => { return <tr>
                <td class="border p-2">{ item?.test?.name }</td>
                <td class="border p-2">{ item?.value }</td>
                <td class="border p-2">{ item?.unit}</td>
                <td class="border p-2">{ item?.reference_range ? item?.reference_range: '-' }</td>
            </tr>})}
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
   
    
    </Modal> */}

    </>
}
export default ReportPreviewModal;