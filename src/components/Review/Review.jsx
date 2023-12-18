import React, {useEffect} from "react";

export default function Review() {
    useEffect(() => {
        localStorage.setItem("menu", "review");
    }, []);
    return <div className={"review"}>Review</div>;
}
