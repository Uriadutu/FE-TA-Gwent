import React, { useEffect, useState } from "react";
import axios from "axios";

import AddLaguModal from "./modals/AddLaguModal";
import { AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { capitalizeWords, youtubeThumbnailFromUrl } from "../utils/helper";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from "./items/Pagenation";
import EditLaguModal from "./modals/EditLaguModal";
import { GoPencil } from "react-icons/go";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import DetailLaguModal from "./modals/DetailLaguModal";

const Lagu = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [dataLagu, setDataLagu] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // jumlah data per halaman
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedLagu, setSelectedLagu] = useState(null);
  const [openDetailModal, setOpenModal] = useState(false)
  const [idLagu, setIdLagu] = useState(false)

  // ✅ Ambil data lagu dari backend
  const getLagu = async () => {
    try {
      const response = await axios.get("http://localhost:8000/lagu");
      setDataLagu(response.data);
    } catch (error) {
      toast.error("Gagal memuat data lagu");
    }
  };

  const handleDetail = (idLagu) => {
    setOpenModal(true)
    setIdLagu(idLagu)
  }

  useEffect(() => {
    getLagu();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/lagu/${id}`);
      toast.success("Lagu berhasil dihapus");
      getLagu(); // refresh data
    } catch (error) {
      toast.error("Gagal menghapus lagu");
    }
  };

 const filteredData = dataLagu.filter((lagu) =>
  lagu.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
  lagu.tahun_rilis.toString().includes(searchTerm) ||
  lagu.penyanyi_list.some((penyanyi) =>
    penyanyi.nama.toLowerCase().includes(searchTerm.toLowerCase())
  ) ||
   lagu.genre_list.some((genre) =>
    genre.toLowerCase().includes(searchTerm.toLowerCase())
  ) ||
  lagu.penyanyi_list.some((label) =>
    label.label.toLowerCase().includes(searchTerm.toLowerCase())
  )
);


  // Hitung pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-2">
      {openEditModal && selectedLagu && (
        <EditLaguModal
          selectedLagu={selectedLagu}
          setIsOpenModalEdit={setOpenEditModal}
          getLagu={getLagu}
        />
      )}
      <AnimatePresence>
        {openAddModal && (
          <AddLaguModal setIsOpenModalAdd={setOpenAddModal} getLagu={getLagu} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {openDetailModal && (
          <DetailLaguModal onClose={setOpenModal} idLagu={idLagu} />
        )}
      </AnimatePresence>

      <div className="bg-white rounded shadow-lg">
        <header className="border-b px-6 py-5 bg-gray-50">
          <h1 className="text-xl font-bold text-gray-800">Data Lagu</h1>
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
                placeholder="Cari lagu"
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
                    <th className="border px-4 py-2 whitespace-nowrap text-center">
                      Thumbnail
                    </th>
                    <th className="border px-4 py-2 whitespace-nowrap">
                      Judul Lagu
                    </th>
                    <th className="border px-4 py-2 whitespace-nowrap">
                      Penyanyi
                    </th>
                    <th className="border px-4 py-2 whitespace-nowrap">
                      Label
                    </th>
                    <th className="border px-4 py-2 whitespace-nowrap">
                      Tahun Rilis
                    </th>
                    <th className="border px-4 py-2 whitespace-nowrap">
                      Genre
                    </th>
                    <th className="border px-4 py-2 whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((lagu, index) => (
                      <tr key={lagu.id} className="hover:bg-gray-100">
                        <td className="border px-4 py-2">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>{" "}
                        <td className="border px-4 py-2 whitespace-nowrap text-center">
                          <Link target="_blank" to={lagu.link}>
                            <img
                              className="w-20"
                              src={youtubeThumbnailFromUrl(lagu.link)}
                              alt=""
                            />
                          </Link>
                        </td>
                        <td className="border px-4 py-2">
                          {capitalizeWords(lagu.judul)}
                        </td>
                        <td className="border px-4 py-2">
                          {lagu.penyanyi_list && lagu.penyanyi_list.length > 0
                            ? lagu.penyanyi_list.map((p) => p.nama).join(", ")
                            : "-"}
                        </td>
                        <td className="border px-4 py-2">{lagu.penyanyi_list?.map(p => p.label).join(", ")}</td>
                        <td className="border px-4 py-2">{lagu.tahun_rilis}</td>
                        <td className="border px-4 py-2">
                          {lagu.genre_list && lagu.genre_list.length > 0
                            ? lagu.genre_list.join(", ")
                            : "-"}
                        </td>
                        <td className="border px-4 py-2 whitespace-nowrap space-x-3">
                          <button
                            onClick={() => handleDelete(lagu.id)}
                            className="btn-hapus"
                          >
                            <RiDeleteBin6Line />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLagu(lagu);
                              setOpenEditModal(true);
                            }}
                          >
                            <GoPencil />
                          </button>
                          <button
                            onClick={() => {
                             handleDetail(lagu.id)
                            }}
                          >
                            <MdOutlineRemoveRedEye />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="border px-4 py-2 text-center text-gray-500"
                      >
                        Tidak ada data lagu
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
          <p>Jumlah Data Lagu: {dataLagu.length}</p>
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

export default Lagu;
