import React, { useEffect, useState } from "react";
import AddLabelModal from "./modals/AddLabelModal";
import { AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { capitalizeWords } from "../utils/helper";
import { toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Pagination from "./items/Pagenation";
import { GoPencil } from "react-icons/go";
import EditLabelModal from "./modals/EditLabelModal";

const Label = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [dataLabel, setDataLabel] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // jumlah data per halaman
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);

  const getLabel = async () => {
    try {
      const response = await axios.get("http://localhost:8000/label");
      setDataLabel(response.data);
    } catch (error) {
      console.error("Gagal mengambil data label:", error);
      toast.error("Gagal mengambil data label.");
    }
  };

/*************  ✨ Windsurf Command ⭐  *************/
  /**

/*******  7354d7cc-0f56-4895-80a8-bfa4ea38bdce  *******/

  const handleEdit = (label) => {
    setSelectedLabel(label);
    setIsOpenModalEdit(true);
  };

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("ID label tidak ditemukan.");
      return;
    }

    const konfirmasi = window.confirm(
      "Apakah Anda yakin ingin menghapus label ini?"
    );
    if (!konfirmasi) return;

    try {
      await axios.delete(`http://localhost:8000/label/${id}`);
      toast.success("Label berhasil dihapus!");
      getLabel();
    } catch (error) {
      console.error("Gagal menghapus label:", error);
      toast.error("Terjadi kesalahan saat menghapus label.");
    }
  };

  const filteredData = dataLabel.filter((item) =>
    item.nama_label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hitung pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    getLabel();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="p-2">
      <AnimatePresence>
        {openAddModal && (
          <AddLabelModal
            setIsOpenModalAdd={setOpenAddModal}
            getLabel={getLabel}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpenModalEdit && (
          <EditLabelModal
            setIsOpenModalEdit={setIsOpenModalEdit}
            selectedLabel={selectedLabel}
            getLabel={getLabel}
          />
        )}
      </AnimatePresence>

      <div className="bg-white rounded shadow-lg">
        <header className="border-b px-6 py-5 bg-gray-50">
          <h1 className="text-xl font-bold text-gray-800">Data Label</h1>
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
                placeholder="Cari label"
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
                      Nama Label
                    </th>
                    <th className="border px-4 py-2 whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((label, index) => (
                      <tr key={label.id} className="hover:bg-gray-100">
                        <td className="border px-4 py-2">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="border px-4 py-2">
                          {capitalizeWords(label.nama_label)}
                        </td>
                        <td className="border px-4 py-2 space-x-3 whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(label.id)}
                            className="btn-hapus"
                          >
                            <RiDeleteBin6Line />
                          </button>
                          <button
                            onClick={() => handleEdit(label)}
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
                        Tidak ada data label
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="bg-white rounded shadow p-2">
          <p>Jumlah Data Label: {dataLabel.length}</p>
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

export default Label;
