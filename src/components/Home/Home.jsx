import React, {useState, useEffect} from "react";
import axios from "../../api/axios";
import LineChart from "../Charts/LineChart";
import defaultAvatar from "../../assets/images/defaultAvatar/defaultAvatar.jpeg";

export default function Home() {
    const [ordersProcessing, setOrdersProcessing] = useState(0);
    const [ordersTodayCompleted, setOrdersTodayCompleted] = useState(0);
    const [revenueToday, setRevenueToday] = useState(0);
    const [revenueMonth, setRevenueMonth] = useState(0);

    const [revenueEachDayThisMonth, setRevenueEachDayThisMonth] = useState();
    const [TopCustomer, setTopCustomer] = useState();
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
        sessionStorage.setItem("menu", "home");
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
        fetchTop9Customers().then((res) => {
            setTopCustomer(res);
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

    const fetchTop9Customers = async () => {
        try {
            const res = await axios.get("/Order/Top9Customers");
            return res.data;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    return (
        <div className={"home grid grid-cols-2 lg:grid-cols-4 grid-rows-6 w-full h-full"}>
            <div
                className="col-start-1 row-start-1 col-span-2 flex flex-row items-center justify-center text-center text-sm">
                <div
                    className=""
                >
                    <div
                        className="bg-red-300 border rounded-xl py-2"
                    >
                        <span className="">ĐƠN HÀNG CHỜ XỬ LÝ</span>
                        <div className=""> {ordersProcessing} </div>
                    </div>
                    <div
                        className="bg-green-400 border rounded-xl py-2"
                    >
                        <span className="">
                            ĐƠN HÀNG HOÀN THÀNH HÔM NAY
                        </span>
                        <div className="">
                            {ordersTodayCompleted}
                        </div>
                    </div>
                </div>
                <div
                    className=""
                >
                    <div
                        className="bg-blue-300 border rounded-xl py-2"
                    >
                        <span className="">DOANH THU HÔM NAY</span>
                        <div className="">{revenueToday}</div>
                    </div>
                    <div
                        className="bg-yellow-200 border rounded-xl py-2"
                    >
                        <span className="">DOANH THU THÁNG NÀY</span>
                        <div className="">{revenueMonth}</div>
                    </div>
                </div>
            </div>

            {chartData && chartData.labels && (
                <div className="col-start-1 col-span-3 row-start-2 row-span-3 text-center">
                    <span className="">BIỂU ĐỒ DOANH THU THÁNG NÀY</span>
                    <LineChart chartData={chartData}/>
                </div>
            )}

            <div className="col-start-1 col-span-2 row-start-4 row-span-2 text-center m-auto">
                <span className="">TOP KHÁCH HÀNG</span>
                <div className="">
                    <table
                        className=""
                    >
                        <thead className="">
                        <tr>
                            <th scope="col" className="">
                                STT
                            </th>
                            <th scope="col" className="">
                                Ảnh
                            </th>
                            <th scope="col" className="">
                                Tên khách hàng
                            </th>
                            <th scope="col" className="">
                                Số điện thoại
                            </th>
                        </tr>
                        </thead>
                        <tbody className="">
                        {TopCustomer && TopCustomer.length > 0 && TopCustomer.map((item, index) => (
                            <tr key={index} className={""}>
                                <td className="">{index + 1}</td>
                                <td className="">
                                    <img
                                        className="w-14"
                                        src={item.avatar ? `data:image/jpeg;base64, ${item.image}` : defaultAvatar}
                                        alt=""
                                    />
                                </td>
                                <td className="">{item.name}</td>
                                <td className="">{item.phone}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
