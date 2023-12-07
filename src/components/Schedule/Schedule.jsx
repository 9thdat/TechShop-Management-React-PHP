import React, {useEffect} from "react";

export default function Schedule() {
    useEffect(() => {
        localStorage.setItem("menu", "schedule");
    }, []);
    return <div className={"orders"}>Hello</div>;
}
