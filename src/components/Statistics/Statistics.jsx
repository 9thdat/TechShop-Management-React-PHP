import React, {useEffect} from "react";

export default function Statistics() {
    useEffect(() => {
        localStorage.setItem("menu", "statistics");
    }, []);
    return <div className={"orders"}>Hello</div>;
}
