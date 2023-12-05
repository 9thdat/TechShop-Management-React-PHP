import React, { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    localStorage.setItem("menu", "home");
  }, []);
  return (
    <div className={"home grid grid-cols-4 grid-rows-6 w-full h-full py-5"}>
      <div className="pending-order col-start-1 col-end-2 row-start-1 row-end-2 flex flex-col items-center justify-center border-solid border-black border mx-8">
        <span className="font-semibold text-lg">ĐƠN HÀNG CHỜ XỬ LÝ</span>
        <div className="revenue-month-value text-xl">0</div>
      </div>
      <div className="successed-order-today col-start-2 col-end-3 row-start-1 row-end-2 flex flex-col items-center justify-center border-solid border-black border mx-8">
        <span className="font-semibold text-lg">
          ĐƠN HÀNG HOÀN THÀNH HÔM NAY
        </span>
        <div className="revenue-month-value text-xl">0</div>
      </div>
      <div className="revenue-today col-start-3 col-end-4 row-start-1 row-end-2 flex flex-col items-center justify-center border-solid border-black border mx-8">
        <span className="font-semibold text-lg">DOANH THU HÔM NAY</span>
        <div className="revenue-month-value text-xl">0</div>
      </div>
      <div className="revenue-month col-start-4 col-end-5 row-start-1 row-end-2 flex flex-col items-center justify-center border-solid border-black border mx-8">
        <span className="font-semibold text-lg">DOANH THU THÁNG NÀY</span>
        <div className="revenue-month-value text-xl">0</div>
      </div>
    </div>
  );
}
