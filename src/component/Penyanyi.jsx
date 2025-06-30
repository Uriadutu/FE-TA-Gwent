import React, { useEffect, useState } from "react";
import AddPenyanyiModal from "./modals/AddPenyanyiModal";
import { AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { capitalizeWords } from "../utils/helper";
import { toast } from "react-toastify";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from "./items/Pagenation";
import EditPenyanyiModal from "./modals/EditPenyanyiModal";
import { GoPencil } from "react-icons/go";

const Penyanyi = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [dataPenyanyi, setDataPenyanyi] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // jumlah data per halaman
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedPenyanyi, setSelectedPenyanyi] = useState(null);

  const getPenyanyi = async () => {
    try {
      const response = await axios.get("http://localhost:8000/penyanyi");
      setDataPenyanyi(response.data);
    } catch (error) {
      console.error("Gagal mengambil data penyanyi:", error);
      toast.error("Gagal mengambil data penyanyi.");
    }
  };

  useEffect(() => {
    getPenyanyi();
  }, []);

  const filteredData = dataPenyanyi.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/penyanyi/${id}`);
      getPenyanyi();
      toast.success("Penyanyi berhasil dihapus!");
    } catch (error) {
      console.error("Gagal menghapus penyanyi:", error);
      toast.error("Terjadi kesalahan saat menghapus penyanyi.");
    }
  };

  // Hitung pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleEdit = (penyanyi) => {
    setSelectedPenyanyi(penyanyi);
    setOpenEditModal(true);
  };

  return (
    <div className="p-2">
      <AnimatePresence>
        {openAddModal && (
          <AddPenyanyiModal
            setIsOpenModalAdd={setOpenAddModal}
            getPenyanyi={getPenyanyi}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {openEditModal && selectedPenyanyi && (
          <EditPenyanyiModal
            setIsOpenModalEdit={setOpenEditModal}
            selectedPenyanyi={selectedPenyanyi}
            getPenyanyi={getPenyanyi}
          />
        )}
      </AnimatePresence>

      <div className="bg-white rounded shadow-lg">
        <header className="border-b px-6 py-5 bg-gray-50">
          <h1 className="text-xl font-bold text-gray-800">Data Penyanyi</h1>
        </header>

        <div className="px-3 py-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setOpenAddModal(true)}
              className="btn-add"
              translate="no"
            >
              Tambah
            </button>
            <div className="flex p-2 border rounded border-gray-200 items-center">
              <input
                type="text"
                placeholder="Cari penyanyi"
                className="text-sm outline-0 w-32 sm:w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IoSearch color="silver" />
            </div>
          </div>
          <div className="w-full max-w-full overflow-x-auto">
            <div className="sm:w-auto w-3">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="border px-4 py-2">No</th>
                    <th className="border px-4 py-2 whitespace-nowrap">
                      Nama Penyanyi
                    </th>
                    <th className="border px-4 py-2 whitespace-nowrap">
                      Label
                    </th>
                    <th className="border px-4 py-2 whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((penyanyi, index) => (
                      <tr key={penyanyi.id} className="hover:bg-gray-100">
                        <td className="border px-4 py-2">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>{" "}
                        <td className="border px-4 py-2">
                          {capitalizeWords(penyanyi.nama)}
                        </td>
                        <td className="border px-4 py-2">
                          {capitalizeWords(penyanyi.nama_label)}
                        </td>
                        <td className="border px-4 py-2 space-x-3 whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(penyanyi.id)}
                            className="btn-hapus"
                          >
                            <RiDeleteBin6Line />
                          </button>
                          <button
                          onClick={() => handleEdit(penyanyi)}
                            className="btn-hapus"
                          >
                            <GoPencil />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="border px-4 py-2 text-center text-gray-500"
                      >
                        Tidak ada data penyanyi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="bg-white rounded shadow p-2">
          <p>Jumlah Data Penyanyi: {dataPenyanyi.length}</p>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Penyanyi;
