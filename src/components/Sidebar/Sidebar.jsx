import React, { useState, useEffect, useRef } from "react";
import {
  BiSolidHome,
  BiSolidTruck,
  BiSolidUser,
  BiSolidDiscount,
  BiLogOutCircle,
} from "react-icons/bi";
import { BsFillBoxSeamFill, BsFillCalendar2RangeFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { SiGoogleanalytics } from "react-icons/si";
import techShopLogo from "../../assets/images/logo/techShopLogo.svg";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [dateTime, setDateTime] = useState("");
  const [menu, setMenu] = useState(
    localStorage.getItem("menu") ? localStorage.getItem("menu") : "home"
  );
  const navigate = useNavigate();

  const sidebarRef = useRef(null);

  const normalLink = "w-full shadow-xl h-10 justify-center items-center flex rounded-md hover:bg-blue-200"
  const activeLink = "w-full shadow-xl h-10 justify-center items-center flex rounded-md hover:bg-blue-200 bg-green-300"

  useEffect(() => {
    const updateDateTime = () => {
      const date = new Date();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      setDateTime(
        `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute
        }:${second < 10 ? `0${second}` : second} - ${day < 10 ? `0${day}` : day
        }/${month < 10 ? `0${month}` : month}/${year}`
      );
    };

    // Update the date and time every 500 milliseconds
    const interval = setInterval(updateDateTime, 500);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleMenuClick = (e) => {
    const value = e.currentTarget.value;

    switch (value) {
      case "logo":
        setMenu("home");
        navigate("/home");
        break;

      case "home":
        setMenu("home");
        navigate("/home");
        break;
      case "orders":
        setMenu("orders");
        navigate("/orders");
        break;
      case "products":
        setMenu("products");
        navigate("/products");
        break;
      case "customers":
        setMenu("customers");
        navigate("/customers");
        break;
      case "discounts":
        setMenu("discounts");
        navigate("/discounts");
        break;
      case "staffs":
        setMenu("staffs");
        navigate("/staffs");
        break;
      case "schedule":
        setMenu("schedule");
        navigate("/schedule");
        break;
      case "statistics":
        setMenu("statistics");
        navigate("/statistics");
        break;

      case "logout":
        setMenu("home");
        localStorage.removeItem("isLogin");
        window.location.href = "/login";
        break;

      default:
        break;
    }
  };
  return (
    <div className="items-center">
      <button value={"logo"} onClick={(e) => handleMenuClick(e)} className="w-full h-fit center flex items-center justify-center">
        <img className="w-3/5" src={techShopLogo} alt="logo" />
      </button>

      <div className="w-full h-full pt-14 bg-white rounded-lg">
        <button
          onClick={(e) => handleMenuClick(e)}
          value={"home"}
          className={(menu == "home") ? activeLink : normalLink}
        >
          <BiSolidHome className="inline-block" />
          <span className="pl-1">Trang chính</span>
        </button>
        <button
          onClick={(e) => handleMenuClick(e)}
          value={"orders"}
          className={(menu == "orders") ? activeLink : normalLink}
        >
          <BiSolidTruck className="inline-block" />
          <span className="pl-1">Đơn hàng</span>
        </button>
        <button
          onClick={(e) => handleMenuClick(e)}
          value={"products"}
          className={(menu == "products") ? activeLink : normalLink}
        >
          <BsFillBoxSeamFill className="inline-block" />
          <span className="pl-1">Sản phẩm</span>
        </button>
        <button
          onClick={(e) => handleMenuClick(e)}
          value={"customers"}
          className={(menu == "customers") ? activeLink : normalLink}
        >
          <BiSolidUser className="inline-block" />
          <span className="pl-1">Khách hàng</span>
        </button>
        <button
          onClick={(e) => handleMenuClick(e)}
          value={"discounts"}
          className={(menu == "discounts") ? activeLink : normalLink}
        >
          <BiSolidDiscount className="inline-block" />
          <span className="pl-1">Mã giảm giá</span>
        </button>
        <button
          onClick={(e) => handleMenuClick(e)}
          value={"staffs"}
          className={(menu == "staffs") ? activeLink : normalLink}
        >
          <FaUsers className="inline-block" />
          <span className="pl-1">Nhân viên</span>
        </button>
        <button
          onClick={(e) => handleMenuClick(e)}
          value={"schedule"}
          className={(menu == "schedule") ? activeLink : normalLink}
        >
          <BsFillCalendar2RangeFill className="inline-block" />
          <a href="" className="pl-1">
            Lịch biểu
          </a>
        </button>
        <button
          onClick={(e) => handleMenuClick(e)}
          value={"statistics"}
          className={(menu == "statistics") ? activeLink : normalLink}
        >
          <SiGoogleanalytics className="inline-block" />
          <span className="pl-1">Thống kê</span>
        </button>

        <button
          value={"logout"}
          onClick={(e) => handleMenuClick(e)}
          className="logout w-full shadow-xl h-10 justify-center items-center flex rounded-md mt-16 hover:bg-red-300"
        >
          <BiLogOutCircle className="inline-block" />
          <span className="pl-1">Đăng xuất</span>
        </button>

        <div className="date-time h-28 w-full justify-center items-center flex">
          {dateTime}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
