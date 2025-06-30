import React from "react";
import { FiUser } from "react-icons/fi";
import { auth } from "../auth/Firebase";
const Navbar = () => {
  const user = auth.currentUser;
  return (
    <div>
      <div className="px-5 pl-10 py-4  top-0 left-0 w-full flex justify-between items-center">
        <div className="relative z-40 w-10 h-10 flex items-center justify-center">
          <p className="text-purple-600 font-medium" translate="no">
            Suarahani
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 items-center">
            <p className="font-medium text-sm">{user.email}</p>
            <div
              className={`inset-0 bg-purple-600 text-white p-2 rounded-full flex items-center justify-center
              transition-opacity duration-200`}
            >
              <FiUser size={15} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
