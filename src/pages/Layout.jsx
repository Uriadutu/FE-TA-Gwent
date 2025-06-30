import React, { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import UbahSandiModal from "../component/modals/UbahSandiModal";
import { AnimatePresence } from "framer-motion";

const Layout = ({ children }) => {
  const [ubahSandiModal, setUbahSandiModal] = useState(false);

  // Ambil status collapse dari localStorage saat pertama kali
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    return stored === "true"; // default: false
  });

  // Simpan ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", isCollapsed.toString());
  }, [isCollapsed]);

  return (
    <div className="relative bg-[#F1F1F1] min-h-screen w-full">
      {/* Blobs dekorasi */}
      <div className="absolute z[-2] w-[300px] h-[200px] bg-green-300 opacity-30 blur-3xl rounded-full top-5 left-5 md:w-[400px] md:h-[250px] md:left-32"></div>
      <div className="absolute z[-2] w-[350px] h-[220px] bg-purple-300 opacity-30 blur-3xl rounded-full bottom-5 right-5 md:w-[500px] md:h-[300px] md:right-32"></div>

      <AnimatePresence>
        {ubahSandiModal && (
          <UbahSandiModal onClose={() => setUbahSandiModal(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar & Navbar */}
      <div className="flex absolute z-10 w-full">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onUbahSandi={() => setUbahSandiModal(true)}
        />
      </div>

      {/* Konten utama */}
      <main
        className={`top-0 relative transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
          <div className="sticky z-20 left-0 top-0 w-full">
            <Navbar />
          </div>
        <div className="px-4 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
