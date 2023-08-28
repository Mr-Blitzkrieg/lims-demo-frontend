import React, {useState,useEffect}from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {PATIENT_BILL_URL} from "../constants";
import axiosInstance  from "../axios/axiosInstance";
import Tooltip from '@mui/material/Tooltip';
import BillPreviewModal from "./billPreviewModal";
import ReportPreviewModal from "./reportPreviewModal";
import toast from 'react-hot-toast';

const PatientDashboard = () => {
    const [rows,setRows] = useState([])
    const [selectedBillID,setSelectedBillId] = useState(null)
    const [isBillPreviewModalOpen,setIsBillPreviewModalOpen] = useState(false)
    const [isReportPreviewModalOpen,setIsReportPreviewModalOpen] = useState(false)
    const fetchAllBills = () => {
        axiosInstance.get(PATIENT_BILL_URL)
        .then((resp) => {
            setRows(resp.data.data.bills)
        })
        .catch((error)=> {
            let error_msg = error?.response?.data?.data ? error.response.data.data.error : error.response.data.error
            toast.error(error_msg)
        })

    }
    useEffect(() => {fetchAllBills()},[])
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
    return (
    <>
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
    <div className="my-12 w-9/12 mx-auto">

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{fontWeight:900}}>Bill Number</TableCell>
            <TableCell style={{fontWeight:900}} align="right">Bill To</TableCell>
            <TableCell style={{fontWeight:900}} align="right">Payment Status</TableCell>
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
              <TableCell>
                {row.payment_status == "paid" && 
                <div className="flex justify-end">
                <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-green-700 bg-green-100 border border-green-300 ">
                <div className="text-xs font-normal leading-none max-w-full flex-initial">Paid</div>
                </div>
                </div>
                }
                {row.payment_status == "unpaid" && 
                <div className="flex justify-end">
                <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-red-700 bg-red-100 border border-red-300 ">
                <div className="text-xs font-normal leading-none max-w-full flex-initial">Unpaid</div>
                </div>
                </div>
                }
              </TableCell>
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
export default PatientDashboard;