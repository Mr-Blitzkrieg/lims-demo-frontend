import React from 'react'
import { BrowserRouter as Router,Routes, Route, Link } from "react-router-dom"
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Layout} from './pages/layout'
import LabUserRegister from './pages/labUserRegister'
import { Toaster } from 'react-hot-toast';
import PatientUserRegister from './pages/patientUserRegister'
import Login from './pages/login'
import LabDashBoard from './pages/labDashboard'


function App() {


  return (
    <Router>
      <Layout>
      <Routes>
        <Route exact path='/' element={<Login/>}></Route>
        <Route exact path='/lab-user-registration' element={< LabUserRegister />}></Route>
        <Route exact path='/patient-registration' element={< PatientUserRegister />}></Route>
        <Route exact path='/lab-dashboard' element={<LabDashBoard />}></Route>
      </Routes>
      </Layout>
      <Toaster/>
    </Router>
      
    

  )
}

export default App
