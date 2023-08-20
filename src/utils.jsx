import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance  from "./axios/axiosInstance";
import toast from 'react-hot-toast';

export const redirectTo = (path) => {
  const nav = useNavigate();
  nav.push(path);
};

export const generateRandomNumber = ()=>  {
    const min = 100000; // Minimum value (inclusive)
    const max = 999999; // Maximum value (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

export const returnFormattedNumbert = (num) => {
    if (isNaN(num)) return 0
    return parseFloat(num)
}

export const getFormattedDateDDMMYYYY = (ipdate) => {
    if(!ipdate) return '-'
    const date = new Date(ipdate);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate
}
export const  capitalizeFirstLetter = (str) => {
    if (!str) return '-'
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

// export const downloadPDF = (url) => {
//     axiosInstance.get(url, {
//         responseType: 'arraybuffer',
//     })
//     .then((resp) => {
//       console.log('resp',resp)
//       const blob = new Blob([resp.data], { type: 'application/pdf' });
//       const url = URL.createObjectURL(blob);

//       const a = document.createElement('a');
//       a.style.display = 'none';
//       a.href = url;
//       a.download = 'downloaded.pdf';
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);

//       // Clean up the object URL
//       URL.revokeObjectURL(url);

//     })
//     .then((error) => {
//         console.log('inm')
//         // let error_msg = error?.response?.data?.data ? error.response.data.data.error : error.response.data.error
//         // console.log('error_msg',error_msg)
//         // toast.error(error_msg,{position: "bottom-center"})
//         let error_msg = error?.response?.data?.error || 'An error occurred during PDF download';
//         console.log('error_msg', error_msg);
//         toast.error(error_msg, { position: 'bottom-center' });
//     })

//   };
export const downloadPDF = (url) => {
    return new Promise((resolve, reject) => {
        axiosInstance.get(url, {
            responseType: 'arraybuffer',
        })
        .then((resp) => {
            const blob = new Blob([resp.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'downloaded.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Clean up the object URL
            URL.revokeObjectURL(url);

            resolve(); 
        })
        .catch((error) => {
            let error_msg = error?.response?.data?.data ? error.response.data.data.error : error.response.data.error
        
            if (error_msg){
                reject(error_msg);
            }
            else {
                reject('An error occurred during PDF download')
            }
            
        });
    });
};


export const logout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('role');
    window.location.href = '/';
}