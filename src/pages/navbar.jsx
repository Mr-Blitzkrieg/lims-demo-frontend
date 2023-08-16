import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
    const navbarElements = [
        {"name":"Home","url":"/"},
        {"name":"Lab Register","url":"/lab-user-registration"},
        {"name":"Patient Register","url":"/patient-registration"}

    ]
    return (

    <nav class="bg-transparent border-teal-500 border-b ">
    <div class="w-full flex flex-wrap items-center justify-between mx-auto py-4 px-16">
    <a href="" class="flex items-center">
        {/* <img src={LabLogo} class="h-8 mr-3" alt="Flowbite Logo" /> */}
        <span class="self-center text-4xl  whitespace-nowrap text-teal-600 font-bold">LIMS</span>
    </a>
    <div class="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul class="font-medium flex space-x-5 p-4 md:p-0 mt-4">
        {navbarElements.map((ele,idx) => {
            return <li key={idx}>
            <Link to={ele.url}><p class="block py-2 pl-3 pr-4 text-black rounded md:bg-transparent md:p-0 hover:text-teal-600">{ele.name}</p></Link>
          </li>
        })}
      </ul>
    </div>
  </div>
</nav>

    )
}
export default NavBar;