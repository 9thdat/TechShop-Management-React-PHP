import React, {useEffect} from "react";

export default function Orders() {
    useEffect(() => {
        localStorage.setItem("menu", "orders");
    }, []);

    return <div className={"orders"}>Orders</div>;
}
