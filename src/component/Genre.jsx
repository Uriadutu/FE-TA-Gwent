import React, { useEffect, useState } from "react";
import AddGenreModal from "./modals/AddGenreModal"; // ganti ke modal genre
import { AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { capitalizeWords } from "../utils/helper";
import axios from "axios";
import { toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from "./items/Pagenation";
import EditGenreModal from "./modals/EditGenreModal";
import { GoPencil } from "react-icons/go";


const Genre = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [dataGenre, setDataGenre] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const itemsPerPage = 10; // jumlah data per halaman

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/genres/${id}`);
      getGenre();
      toast.success("Genre berhasil dihapus!");
    } catch (error) {}
  };

  const getGenre = async () => {
    try {
      const response = await axios.get("http://localhost:8000/genres");
      setDataGenre(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredGenre = dataGenre.filter((genre) =>
    genre.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hitung pagination
  const totalPages = Math.ceil(filteredGenre.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGenre.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    getGenre();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="p-2">
      <AnimatePresence>
        {openAddModal && (
          <AddGenreModal
            setIsOpenModalAdd={setOpenAddModal}
            getGenre={getGenre}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {openEditModal && selectedGenre && (
          <EditGenreModal
            setIsOpenModalEdit={setOpenEditModal}
            selectedGenre={selectedGenre}
            getGenre={getGenre}
          />
        )}
      </AnimatePresence>

      <div className="bg-white rounded shadow-lg">
        <header className="border-b px-6 py-5 bg-gray-50">
          <h1 className="text-xl font-bold text-gray-800">Data Genre</h1>
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
                placeholder="Cari genre"
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
                      Nama Genre
                    </th>
                    <th className="border px-4 py-2 whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((genre, index) => (
                      <tr key={genre.id} className="hover:bg-gray-100">
                        <td className="border px-4 py-2">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="border px-4 py-2">
                          {capitalizeWords(genre.nama)}
                        </td>
                        <td className="border px-4 py-2 space-x-3 whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(genre.id)}
                            className="btn-hapus"
                          >
                            <RiDeleteBin6Line />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedGenre(genre);
                              setOpenEditModal(true);
                            }}
                            className="btn-edit"
                          >
                            <GoPencil/>
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
                        Tidak ada data genre
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
          <p>Jumlah Data Genre: {dataGenre.length}</p>
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

export default Genre;
