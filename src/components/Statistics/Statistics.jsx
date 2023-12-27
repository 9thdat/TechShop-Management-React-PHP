import React, {useEffect, useState} from "react";
import {format} from 'date-fns';
import {vi} from 'date-fns/locale';
import axios from "../../api/axios";
import {parseISO} from 'date-fns';
import LineChart from "../Charts/LineChart";
import PieChart from "../Charts/PieChart";
import {Line} from "react-chartjs-2";

export default function Statistics() {
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
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [chartType, setChartType] = useState("MonthRevenue");
    const [productId, setProductId] = useState("");
    const [chartTitle, setChartTitle] = useState("");

    const [productsSold, setProductsSold] = useState([]);
    const [revenue, setRevenue] = useState([]);


    useEffect(() => {
        sessionStorage.setItem("menu", "statistics");
    }, []);

    useEffect(() => {
        const currentDate = new Date();
        const formattedFromDate = new Date(currentDate.getFullYear(), 0, 1);
        setFromDate(formattedFromDate);
    }, []);

    useEffect(() => {
        const currentDate = new Date();
        const formattedToDate = new Date(currentDate.getFullYear(), 11, 31);
        setToDate(formattedToDate);
    }, []);

    const handleAnalyze = async () => {
        const chartTypeText = chartType === "MonthRevenue" ? "Doanh thu" : "Số lượng sản phẩm bán ra";
        setChartTitle("BIỂU ĐỒ " + chartTypeText.toUpperCase() + " TỪ NGÀY " + format(new Date(fromDate), 'dd/MM/yyyy') + " ĐẾN NGÀY " + format(new Date(toDate), 'dd/MM/yyyy'));
        if (chartType === "MonthRevenue") {
            const revenueData = await fetchRevenue();
            setRevenue(revenueData);
        } else {
            if (productId === "") {
                const productsSoldData = await fetchProductsSold();
                setProductsSold(productsSoldData);
            } else {
                const productsSoldData = await fetchProductSold(productId);
                setProductsSold(productsSoldData);
            }
        }
    }

    useEffect(() => {
        if (revenue && revenue.length > 0) {
            const chartTypeText = chartType === "MonthRevenue" ? "Doanh thu" : "Số lượng sản phẩm bán ra";
            setChartData({
                labels: revenue.map((item) => item.date),
                datasets: [
                    {
                        label: chartTypeText,
                        data: revenue.map((item) => item.revenue),
                        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
                        borderColor: ["rgba(255, 99, 132, 1)"],
                        borderWidth: 1,
                    },
                ],
            })
        }
    }, [revenue]);

    useEffect(() => {
        if (productsSold && productsSold.length > 0) {
            const chartTypeText = chartType === "MonthRevenue" ? "Doanh thu" : "Số lượng sản phẩm bán ra";
            setChartData({
                labels: productsSold.map((item) => item.date),
                datasets: [
                    {
                        label: chartTypeText,
                        data: productsSold.map((item) => item.productsSold),
                        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
                        borderColor: ["rgba(255, 99, 132, 1)"],
                        borderWidth: 1,
                    },
                ],
            })
        }
    }, [productsSold]);

    const fetchRevenue = async () => {
        const startMonth = fromDate.getMonth() + 1;
        const startYear = fromDate.getFullYear();
        const endMonth = toDate.getMonth() + 1;
        const endYear = toDate.getFullYear();
        try {
            const res = await axios.get(`/Order/GetMonthlyRevenue?startMonth=${startMonth}&startYear=${startYear}&endMonth=${endMonth}&endYear=${endYear}`);
            return res.data;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    const fetchProductsSold = async () => {
        const startMonth = fromDate.getMonth() + 1;
        const startYear = fromDate.getFullYear();
        const endMonth = toDate.getMonth() + 1;
        const endYear = toDate.getFullYear();
        try {
            const res = await axios.get(`/Order/GetMonthlyProductsSold?startMonth=${startMonth}&startYear=${startYear}&endMonth=${endMonth}&endYear=${endYear}`);
            return res.data;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    const fetchProductSold = async (productId) => {
        const startMonth = fromDate.getMonth() + 1;
        const startYear = fromDate.getFullYear();
        const endMonth = toDate.getMonth() + 1;
        const endYear = toDate.getFullYear();
        try {
            const res = await axios.get(`/Order/GetMonthlyProductsSold?startMonth=${startMonth}&startYear=${startYear}&endMonth=${endMonth}&endYear=${endYear}&productId=${productId}`);
            return res.data;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    return (
        <div className="">
            <div
                className="top-0 right-0 backdrop-blur-sm grid grid-rows-7 lg:grid-cols-6 gap-2 lg:text-xl"
            >
                <div className="row-start-1 row-end-2 lg:col-start-2 lg:col-end-4">
                    <label className="pr-2 lg:inline-block" htmlFor={"sortValue"}>Loại biểu đồ:</label>
                    <select
                        className="border border-blue-300 rounded-md"
                        id="sortValue"
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                    >
                        <option value="MonthRevenue">Doanh thu theo tháng</option>
                        <option value="ProductSold">Số lượng sản phẩm bán ra</option>
                    </select>
                </div>
                <div className="row-start-2 row-end-3 lg:col-start-4 lg:col-end-5 lg:row-start-1 lg:row-end-2">
                    <label className="pr-2" htmlFor={"productId"}>Mã sản phẩm:</label>
                    <input
                        className="border border-blue-300 rounded-md"
                        type="text"
                        id="productId"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                    />
                </div>
                <div className={"row-start-3 row-end-4 lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-3"}>
                    <label className="pr-2" htmlFor={"fromDate"}>Từ:</label>
                    <input
                        className="border border-blue-300 rounded-md"
                        type="month"
                        id="fromDate"
                        value={format(new Date(fromDate), 'yyyy-MM', {locale: vi})}
                        onChange={(e) => setFromDate(parseISO(`${e.target.value}-01T00:00:00.000Z`))}
                    />
                </div>
                <div className={"row-start-4 row-end-5 lg:col-start-4 lg:col-end-6 lg:row-start-2 lg:row-end-3"}>
                    <label className="pr-2" htmlFor={"toDate"}>Đến:</label>
                    <input
                        className="border border-blue-300 rounded-md"
                        type="month"
                        id="toDate"
                        value={format(new Date(toDate), 'yyyy-MM', {locale: vi})}
                        onChange={(e) => setToDate(parseISO(`${e.target.value}-01T00:00:00.000Z`))}
                    />
                </div>
                <button
                    className="border border-blue-300 rounded-md bg-blue-400 text-white lg:col-start-6 lg:col-end-7 lg:row-start-2 lg:row-end-3 lg:h-fit"
                    onClick={() => handleAnalyze()}
                >
                    Thống kê
                </button>
            </div>
            <div className="">
                <div className="flex flex-col items-center p-2">
                    <span className="font-semibold text-xl">{chartTitle}</span>
                    {
                        chartData && chartData.labels &&
                        <Line data={chartData}/>
                    }
                </div>
            </div>
        </div>
    );
}
