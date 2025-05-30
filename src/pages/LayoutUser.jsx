import React from "react";

const LayoutUser = ({ children }) => {
  return (
    <div className="relative">
      <main className="pt-2 sm:px-6 md:px-12 lg:px-20 mx-auto">{children}</main>
    </div>
  );
};

export default LayoutUser;
