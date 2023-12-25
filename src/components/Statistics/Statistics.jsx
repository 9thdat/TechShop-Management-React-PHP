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
        <div className="relative h-[90vh] grid grid-cols-4 grid-rows-6 overflow-scroll shadow-md sm:rounded-lg">
            <div
                className=" top-0 right-0 sticky h-[10vh] p-4 backdrop-blur-sm col-start-1 col-end-5 row-start-1 row-end-2 ">
                <label className="mr-2">Loại biểu đồ:</label>
                <select
                    className="px-2 py-1 ml-2 rounded-md border border-black w-[10%]"
                    id="sortValue"
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                >
                    <option value="MonthRevenue">Doanh thu theo tháng</option>
                    <option value="ProductSold">Số lượng sản phẩm bán ra</option>
                </select>
                <label className="ml-4 mr-2">Từ:</label>
                <input
                    className="px-2 py-1 ml-2 rounded-md border border-black w-[15%]"
                    type="month"
                    id="fromDate"
                    value={format(new Date(fromDate), 'yyyy-MM', {locale: vi})}
                    onChange={(e) => setFromDate(parseISO(`${e.target.value}-01T00:00:00.000Z`))}
                />

                <label className="ml-4 mr-2">Đến:</label>
                <input
                    className="px-2 py-1 ml-2 rounded-md border border-black w-[15%]"
                    type="month"
                    id="toDate"
                    value={format(new Date(toDate), 'yyyy-MM', {locale: vi})}
                    onChange={(e) => setToDate(parseISO(`${e.target.value}-01T00:00:00.000Z`))}
                />

                <label className="ml-4 mr-2">Mã sản phẩm:</label>
                <input
                    className="px-2 py-1 ml-2 rounded-md border border-black w-[15%]"
                    type="text"
                    id="productId"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                />
                <button
                    className="px-2 py-1 ml-4 rounded-md border border-black"
                    onClick={() => handleAnalyze()}
                >
                    Thống kê
                </button>
            </div>
            <div className="col-start-1 col-end-5 row-start-2 row-end-7 h-[80vh]">
                <div className="flex flex-col items-center p-5">
                    <span className="font-semibold text-lg">{chartTitle}</span>
                    {
                        chartData && chartData.labels &&
                        <Line data={chartData}/>
                    }
                </div>
            </div>
        </div>
    );
}
