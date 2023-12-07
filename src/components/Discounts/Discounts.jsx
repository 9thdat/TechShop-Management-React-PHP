import React, {useEffect} from "react";

export default function Discounts() {
    useEffect(() => {
        localStorage.setItem("menu", "discounts");
    }, []);
    return <div className={"orders"}>Hello</div>;
}
