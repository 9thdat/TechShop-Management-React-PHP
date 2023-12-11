import React from "react";
import {Line} from "react-chartjs-2";
import {Chart as Chart} from "chart.js/auto";

export default function RevenueThisMonth({chartData}) {
    return <Line data={chartData}/>;
}

