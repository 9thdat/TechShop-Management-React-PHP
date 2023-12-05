import react, {useState, useEffect} from "react";
import axios from "../../api/axios";

export default function CustomerStatus({customerData, visible, onClose}) {

    if (!visible) return null;

    return (
        <div>
            Hello
        </div>
    );
}