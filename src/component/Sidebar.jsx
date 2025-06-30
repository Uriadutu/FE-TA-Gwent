import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../auth/Firebase";
import logo from "../img/logo.png";
import { LiaIndustrySolid } from "react-icons/lia";
import {
  FiMenu,
  FiLogOut,
  FiMusic,
  FiMic,
  FiSettings,
  FiCpu,
  FiCheckCircle,
  FiSidebar,
} from "react-icons/fi";
import { GiSelect } from "react-icons/gi";

const Sidebar = ({ isCollapsed, setIsCollapsed, onUbahSandi }) => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <aside
      className={`h-screen fixed bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
      ${isCollapsed ? "w-20" : "w-64"} flex flex-col`}
    >
      <div className="flex items-center justify-center px-4 py-4  relative group">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div
            className={`absolute inset-0flex items-center justify-center transition-opacity duration-200 ${
              isCollapsed ? "group-hover:opacity-0" : "opacity-100"
            }`}
          >
            <img src={logo} alt="" />
          </div>

          {/* Tombol Hamburger muncul saat hover */}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="absolute inset-0 text-gray-600 hover:text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <FiMenu size={20} />
            </button>
          )}
        </div>

        {/* Nama dan tombol collapse */}
        {!isCollapsed && (
          <>
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-gray-500 hover:text-gray-800 transition ml-auto cursor-e-resize"
            >
              <FiSidebar />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-4">
        <SidebarItem
          to="/genre"
          icon={<GiSelect />}
          label="Genre"
          collapsed={isCollapsed}
        />
        <SidebarItem
          to="/label"
          icon={<LiaIndustrySolid />}
          label="Label"
          collapsed={isCollapsed}
        />
        <SidebarItem
          to="/penyanyi"
          icon={<FiMic />}
          label="Penyanyi"
          collapsed={isCollapsed}
        />
        <SidebarItem
          to="/lagu"
          icon={<FiMusic />}
          label="Lagu"
          collapsed={isCollapsed}
        />
        <SidebarItem
          to="/pra-pemrosesan"
          icon={<FiSettings />}
          label="Pra-Pemrosesan"
          collapsed={isCollapsed}
        />
        <SidebarItem
          to="/pemrosesan"
          icon={<FiCpu />}
          label="Pemrosesan"
          collapsed={isCollapsed}
        />
        <SidebarItem
          to="/validasi"
          icon={<FiCheckCircle />}
          label="Validasi"
          collapsed={isCollapsed}
        />
      </nav>

      {/* Actions */}
      <div className="px-2 pb-4 flex flex-col gap-1">
        <SidebarButton
          onClick={logout}
          icon={<FiLogOut />}
          label="Keluar"
          collapsed={isCollapsed}
        />
      </div>
    </aside>
  );
};

const SidebarItem = ({ to, icon, label, collapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all
      ${collapsed ? "justify-center" : ""}
      ${
        isActive
          ? "bg-purple-100 border border-purple-700 text-purple-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
      }`
    }
  >
    {icon}
    {!collapsed && <span>{label}</span>}
  </NavLink>
);

const SidebarButton = ({ onClick, icon, label, collapsed }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full transition-all
    ${collapsed ? "justify-center" : ""}
    text-red-600 hover:bg-red-50`}
  >
    {icon}
    {!collapsed && <span>{label}</span>}
  </button>
);

export default Sidebar;
