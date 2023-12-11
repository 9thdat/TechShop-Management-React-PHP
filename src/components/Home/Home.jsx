import React, {useState, useEffect} from "react";
import axios from "../../api/axios";
import RevenueThisMonth from "../Charts/RevenueThisMonth";
import defaultAvatar from "../../assets/images/defaultAvatar/defaultAvatar.jpeg";

export default function Home() {
    const [ordersProcessing, setOrdersProcessing] = useState(0);
    const [ordersTodayCompleted, setOrdersTodayCompleted] = useState(0);
    const [revenueToday, setRevenueToday] = useState(0);
    const [revenueMonth, setRevenueMonth] = useState(0);

    const [revenueEachDayThisMonth, setRevenueEachDayThisMonth] = useState();
    const [Top5Customers, setTop5Customers] = useState();
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Doanh thu",
                data: [],
                backgroundColor: ["rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgba(255, 99, 132, 1)"],
                borderWidth: 1,
            },
        ],
    });


    useEffect(() => {
        localStorage.setItem("menu", "home");
    }, []);

    useEffect(() => {
        fetchOrdersProcessing().then((res) => {
            setOrdersProcessing(res);
        });
    }, []);

    useEffect(() => {
        fetchOrdersTodayCompleted().then((res) => {
            setOrdersTodayCompleted(res);
        });
    }, []);

    useEffect(() => {
        fetchRevenueToday().then((res) => {
            setRevenueToday(res);
        });
    }, []);

    useEffect(() => {
        fetchRevenueMonth().then((res) => {
            setRevenueMonth(res);
        });
    }, []);

    useEffect(() => {
        fetchRevenueEachDayThisMonth().then((res) => {
            setRevenueEachDayThisMonth(res);
        });
    }, []);

    useEffect(() => {
        if (revenueEachDayThisMonth && revenueEachDayThisMonth.length > 0) {
            setChartData({
                labels: revenueEachDayThisMonth.map((item) => item.day),
                datasets: [
                    {
                        label: "Doanh thu",
                        data: revenueEachDayThisMonth.map((item) => item.revenue),
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                        ],
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [revenueEachDayThisMonth]);

    useEffect(() => {
        fetchTop5Customers().then((res) => {
            setTop5Customers(res);
        });
    }, []);

    const fetchOrdersProcessing = async () => {
        try {
            const res = await axios.get("/Order/Processing");
            return res.data;
        } catch (err) {
            console.log(err);
            return 0;
        }
    }

    const fetchOrdersTodayCompleted = async () => {
        try {
            const res = await axios.get("/Order/TodayCompleted");
            return res.data;
        } catch (err) {
            console.log(err);
            return 0;
        }
    }

    const fetchRevenueToday = async () => {
        try {
            const res = await axios.get("/Order/RevenueToday");
            return res.data;
        } catch (err) {
            console.log(err);
            return 0;
        }
    }

    const fetchRevenueMonth = async () => {
        try {
            const res = await axios.get("/Order/RevenueThisMonth");
            return res.data;
        } catch (err) {
            console.log(err);
            return 0;
        }
    }

    const fetchRevenueEachDayThisMonth = async () => {
        try {
            const res = await axios.get("/Order/RevenueEachDayThisMonth");
            return res.data;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    const fetchTop5Customers = async () => {
        try {
            const res = await axios.get("/Order/Top5Customers");
            return res.data;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    return (
        <div className={"home grid grid-cols-4 grid-rows-6 w-full h-full py-5"}>
            <div
                className="pending-order col-start-1 col-end-2 row-start-1 row-end-2 flex flex-col items-center justify-center border-solid border-black border mx-8">
                <span className="font-semibold text-lg">ĐƠN HÀNG CHỜ XỬ LÝ</span>
                <div className="revenue-month-value text-xl"> {ordersProcessing} </div>
            </div>
            <div
                className="successed-order-today col-start-2 col-end-3 row-start-1 row-end-2 flex flex-col items-center justify-center border-solid border-black border mx-8">
                <span className="font-semibold text-lg text-center">
                  ĐƠN HÀNG HOÀN THÀNH HÔM NAY
                </span>
                <div className="revenue-month-value text-xl">{ordersTodayCompleted}</div>
            </div>
            <div
                className="revenue-today col-start-3 col-end-4 row-start-1 row-end-2 flex flex-col items-center justify-center border-solid border-black border mx-8">
                <span className="font-semibold text-lg">DOANH THU HÔM NAY</span>
                <div className="revenue-month-value text-xl">{revenueToday}</div>
            </div>
            <div
                className="revenue-month col-start-4 col-end-5 row-start-1 row-end-2 flex flex-col items-center justify-center border-solid border-black border mx-8">
                <span className="font-semibold text-lg">DOANH THU THÁNG NÀY</span>
                <div className="revenue-month-value text-xl">{revenueMonth}</div>
            </div>

            {chartData && chartData.labels && (
                <div
                    className="col-start-1 col-end-4 row-start-2 row-end-7 flex flex-col items-center justify-center border-solid border-black border mx-8 p-5">
                    <span className="font-semibold text-lg">BIỂU ĐỒ DOANH THU THÁNG NÀY</span>
                    <RevenueThisMonth chartData={chartData}/>
                </div>
            )}

            <div
                className="top-5-customers col-start-4 col-end-5 row-start-2 row-end-7 flex flex-col items-center  border-solid border-black border mx-8 pt-5">
                <span className="font-semibold text-lg">TOP 5 KHÁCH HÀNG</span>
                <div className="top-5-customers-list">
                    <table
                        className="w-full text-sm text-left rtl:text-right text-gray-500"
                    >
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="text-center py-3">
                                STT
                            </th>
                            <th scope="col" className="text-center">
                                Ảnh
                            </th>
                            <th scope="col" className="text-center">
                                Tên khách hàng
                            </th>
                            <th scope="col" className="text-center">
                                Số điện thoại
                            </th>
                            <th scope="col" className="text-center">
                                Tổng tiền
                            </th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-700">
                        {Top5Customers && Top5Customers.length > 0 && Top5Customers.map((item, index) => (
                            <tr key={index}>
                                <td className="text-center py-3">{index + 1}</td>
                                <td className="text-center">
                                    <img
                                        className="w-10 h-10 rounded-full"
                                        src={item.avatar ? `data:image/jpeg;base64, ${item.image}` : defaultAvatar}
                                        alt=""
                                    />
                                </td>
                                <td className="text-center">{item.name}</td>
                                <td className="text-center">{item.phone}</td>
                                <td className="text-center">{item.revenue}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
