import React,{useState,useRef} from "react";
import axiosInstance  from "../axios/axiosInstance";
import {ADD_TEST_URL} from "../constants"
import toast from 'react-hot-toast';

const AddTest = () => {
    const formRef = useRef(null);
    const [formData, setFormData] = useState({});
    const testFormElements = [
        {"name":"name","label":"Name","type":"text","required":true},
        {"name":"description","label":"Description","type":"text","required":false},
        {"name":"unit","label":"Unit","type":"text","required":true},
        {"name":"reference_range","label":"Reference Range","type":"text","required":false},
        {"name":"price","label":"Price","type":"number","required":false},
    ]
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    const handleSubmit = (e) => {
        e.preventDefault();
        axiosInstance.post(ADD_TEST_URL,{...formData})
        .then((resp) => {
            if (resp.status === 200){
              toast.success(resp.data.data.message)
              formRef.current.reset();
            }
            
        })
        .catch((error)=> {
            let error_msg = error?.response?.data?.data ? error.response.data.data.error : error.response.data.error
            toast.error(error_msg)

        })


    }
    return (
        <>
        <div className="flex justify-center my-12">
        <div className="w-7/12 p-6 bg-white border border-gray-200 rounded-lg shadow">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">Add Test</h5>
      <form
        className="px-4 pt-4"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
        {testFormElements.map((ele,idx) => {return (
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 text-left"
            htmlFor={ele.name}
          >
        {ele.label}
        </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id={ele.name}
            name={ele.name}
            type={ele.type}
            value={formData.ele}
            onChange={handleChange}
            required={ele.required}
          />
        </div>
        )})}
        </div>
        <div className="flex items-center justify-center mt-8">
        <button type="submit" className="text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">Add</button>
        {/* <button type="submit" className="flex w-full justify-center rounded-md border-transparent bg-cyan-500 py-2 px-4 text-md text-white shadow-sm hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 font-semibold">Login</button> */}
        </div>
      </form>
    </div>
        </div>
        </>

    )
}
export default AddTest