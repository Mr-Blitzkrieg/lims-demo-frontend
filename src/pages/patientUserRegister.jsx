import React,{useState,useRef} from "react";
import axiosInstance  from "../axios/axiosInstance";
import {PATIENT_USER_CREATE_URL} from "../constants"
import toast from 'react-hot-toast';



const PatientUserRegister = () => {
    const formRef = useRef(null);
    const [formData, setFormData] = useState({
        // email: '',
        // password: '',
        // name: '',
        // department: '',
        // address: '',
        // city: '',
        // state: '',
        // pincode: '',
      });
    
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        axiosInstance.post(PATIENT_USER_CREATE_URL,{...formData})
        .then((resp) => {

            if(resp.status == 201){
                toast.success(resp?.data?.data?.message)
                formRef.current.reset();
            }
        })
        .catch((error)=> {
            let error_msg = error?.response?.data?.data ? error.response.data.data.error : error.response.data.error
            toast.error(error_msg)

        })
        
    
      };
    const patientRegisterFormElements = [
        {"name":"email","label":"Email","type":"email"},
        {"name":"password","label":"Password","type":"password"},
        {"name":"name","label":"Name","type":"text"},
        {"name":"gender","label":"Gender","type":"select"},
        {"name":"height","label":"height","type":"number"},
        {"name":"weight","label":"weight","type":"number"},
        {"name":"address","label":"Address","type":"text"},
        {"name":"city","label":"City","type":"text"},
        {"name":"state","label":"State","type":"text"},
        {"name":"pincode","label":"Pincode","type":"number"},
        {"name":"country","label":"Country","type":"text"},
    ]
    return (
        <div className="flex justify-center my-12">
        <div class="w-2/3 p-6 bg-white border border-gray-200 rounded-lg shadow">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Register Patient</h5>
      <form
        className="px-4 pt-4"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
        {patientRegisterFormElements.map((ele,idx) => {return (
        ele.name == "gender" ?         
        <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2 text-left"
          htmlFor={ele.name}
        >
        {ele.label}
        </label>
        <select id={ele.name} name={ele.name} onChange={handleChange}
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        <option value="select-gender">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        </select>
      </div>:
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
          />
        </div>
        )})}
        </div>
        <div className="flex items-center justify-center mt-4">
        <button type="submit" className="text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">Register</button>
        </div>
      </form>
    </div>
        </div>
    )
}
export default PatientUserRegister;