import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import Home from "../../components/Home/Home";
import Orders from "../../Orders/Orders";
import Products from "../../components/Products/Products";
import Customers from "../../components/Customers/Customers";
import Staffs from "../../components/Staffs/Staffs";
import Schedule from "../../components/Schedule/Schedule";
import Statistics from "../../components/Statistics/Statistics";

export default function Management() {
  return (
    <div className="management grid grid-cols-7 grid-rows-">
      {/* <div className="sidebar w-full h-screen col-start-1 col-end-2 row-start-1 row-end-7">
        <Sidebar />
      </div>
      <div className="navbar w-full h-[10vh] col-start-2 col-end-8 row-start-1 row-end-2  ">
        <Navbar />
      </div>
      <div className="content w-full h-[90vh] col-start-2 col-end-8 row-start-2 row-end-7">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/staffs" element={<Staffs />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div> */}
    </div>
  );
}
