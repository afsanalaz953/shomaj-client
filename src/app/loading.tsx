import React from "react";
// import { HashLoader } from "react-spinners";

const loading = () => {
  return (
    <div className="flex justify-center items-center bg-[#F8F7F2] h-[85vh] font-bold text-5xl">
      Global loading......
     <span className="loading loading-spinner text-success"></span>
    </div>
  );
};

export default loading;