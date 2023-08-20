import React,{useEffect,useState} from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axiosInstance  from "../axios/axiosInstance";
import {getBillItemsEndpoint,updateBillItems} from  "../constants"
import toast from 'react-hot-toast';

const EditModal = ({fetchAllBills,bill_id,onClose, isEditModalOpen}) => {
    const [billItems,setBillItems] = useState([])
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
    const getBillItemForBill = (bill_id) => {
        axiosInstance.get(getBillItemsEndpoint(bill_id))
        .then((resp) => {
            if(resp.status === 200) { 
                const modifiedBillItems = resp.data.data.bill_items.map((billItem) => {
                    return {
                      ...billItem,
                      isModified: false, 
                    };
                  });
                  setBillItems(modifiedBillItems);
                }
        })
        .catch((error)=> {
            let error_msg = error?.response?.data?.data ? error.response.data.data.error : error.response.data.error
            toast.error(error_msg)
        })

    }
    useEffect(() => {
        if(bill_id && isEditModalOpen){
            getBillItemForBill(bill_id)
        }
    },[bill_id])
    const handleValueChanges = (event,index) => {
        let name = event.target.name
        let value = event.target.value
        const updatedBillItems = billItems.map((item, idx) => {
            if (idx === index) {
                    return {
                      ...item,
                      [name]: value,
                      isModified: true,
                    };
                  
            }
            return item;
          });
          
        setBillItems([...updatedBillItems])
        
    }
    const markRowsAsComplete = () => {
        const updatedBillItems = billItems.map((item) => {
          if (item.isModified && item.status !== "completed") {
            return {
              ...item,
              status: "completed",
            };
          }
          return item;
        });
        return updatedBillItems
      };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        let payload = {"bill_items": markRowsAsComplete()}
        axiosInstance.patch(updateBillItems(bill_id),{...payload})
        .then((resp) => {
            if(resp.status === 200){
                toast.success(resp.data.data.message)
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
        open={isEditModalOpen}
        onClose={onClose}
    >
    <Box sx={style}>
    <div className="">
        <h2 className="font-bold text-center mb-8 text-xl">Edit Report</h2>
        <form onSubmit={handleEditSubmit}>
        <div className="grid grid-cols-4 gap-x-3">
            <div className="">Test Name</div>
            {/* <div className="">Unit</div> */}
            <div className="">Value</div>
            <div className="">Unit</div>
            <div className="">Reference Range</div>
        </div>
        {billItems.map((ele,idx) => {return <div className="grid grid-cols-4 mt-6 gap-x-3" key={idx}>
            <div className="self-center">{ele.test.name}</div>
            {/* <div className="">{ele.test.unit}</div> */}
            <div className="self-center">
            <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="value"
                name="value"
                type="number"
                value={ele.value}
                onChange={(e) => handleValueChanges(e,idx)}
                readOnly={ele.status === "completed"}
            />
            </div>
            <div className="self-center">{ele.test.unit}</div>
            <div className="self-center">{ele.test.reference_range ? ele.test.reference_range : '-'}</div>
        </div>})}
        <div className="flex justify-center mt-8"> 
        <button type="submit" className="w-2/12 text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">Submit</button>

        </div>
        </form>

    </div>
          
    </Box>
    
    </Modal>
    </>
}
export default EditModal;