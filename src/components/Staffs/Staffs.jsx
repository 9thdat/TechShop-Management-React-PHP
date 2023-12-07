import React, {useEffect} from "react";

export default function Staffs() {
    useEffect(() => {
        localStorage.setItem("menu", "staffs");
    }, []);
    return <div className={"orders"}>Hello</div>;
}
