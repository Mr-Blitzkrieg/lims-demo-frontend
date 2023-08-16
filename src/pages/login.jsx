import React,{useState,useRef} from "react";
import {GET_TOKEN_URL} from "../constants";
import axiosInstance  from "../axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';


const Login = () => {
    const navigate = useNavigate()
    const formRef = useRef(null);
    const [formData, setFormData] = useState({});
    const loginFormElements = [
        {"name":"email","label":"Email","type":"email"},
        {"name":"password","label":"Password","type":"password"},
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
        axiosInstance.post(GET_TOKEN_URL,{...formData},{headers: {
            Authorization: false
          }})
        .then((resp) => {
            let role = resp.data.data.role
            sessionStorage.setItem("accessToken", resp.data.data.token);
            sessionStorage.setItem("role", role);
            if (role == 'lab') {navigate('/lab-dashboard')};
            
        })
        .catch((error)=> {
            let error_msg = error?.response?.data?.data ? error.response.data.data.error : error.response.data.error
            console.log("error",error)
            toast.error(error_msg)

        })


    }
    return (
        <div className="flex justify-center my-12">
        <div className="w-5/12 p-6 bg-white border border-gray-200 rounded-lg shadow">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Login</h5>
      <form
        className="px-4 pt-4"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <div className="">
        {loginFormElements.map((ele,idx) => {return (
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
            required
          />
        </div>
        )})}
        </div>
        <div className="flex items-center justify-center mt-4">
        <button type="submit" className="text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">Login</button>
        </div>
      </form>
    </div>
        </div>
    )
}

export default Login