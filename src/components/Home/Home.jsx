import React, {useState, useEffect} from "react";
import axios from "../../api/axios";
import RevenueThisMonth from "../Charts/RevenueThisMonth";

export default function Home() {
    const [ordersProcessing, setOrdersProcessing] = useState(0);
    const [ordersTodayCompleted, setOrdersTodayCompleted] = useState(0);
    const [revenueToday, setRevenueToday] = useState(0);
    const [revenueMonth, setRevenueMonth] = useState(0);

    const [revenueEachDayThisMonth, setRevenueEachDayThisMonth] = useState();
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
                    className="col-start-1 col-end-5 row-start-2 row-end-7 flex flex-col items-center justify-center border-solid border-black border mx-8">
                    <span className="font-semibold text-lg">BIỂU ĐỒ DOANH THU THÁNG NÀY</span>
                    <RevenueThisMonth chartData={chartData}/>
                </div>
            )}
        </div>
    );
}
