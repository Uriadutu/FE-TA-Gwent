import React from "react";

const LayoutUser = ({ children }) => {
  return (
    <div className="relative">
      <div className="absolute -z-20 w-[300px] h-[200px] bg-green-300 opacity-30 blur-3xl rounded-full top-5 left-5 md:w-[400px] md:h-[250px] md:left-32"></div>
      <div className="absolute -z-20 w-[350px] h-[220px] bg-purple-300 opacity-30 blur-3xl rounded-full bottom-5 right-5 md:w-[500px] md:h-[300px] md:right-32"></div>

      <main className="pt-2 z-10 sm:px-6 md:px-12 lg:px-20 mx-auto">{children}</main>
    </div>
  );
};

export default LayoutUser;
