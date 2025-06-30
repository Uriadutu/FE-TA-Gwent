import React, { useEffect, useState } from "react";
import axios from "axios";
import DetailLaguModal from "./modals/DetailLaguModal";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Pagination from "./items/Pagenation";

const Prapemroses = () => {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [idLagu, setIdLagu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // jumlah data per halaman

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/prapemroses");
      setData(response.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLihat = (id) => {
    setIdLagu(id);
    setOpenModal(true);
  };

  // Hitung pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-2">
      <div className="bg-white rounded shadow-lg">
        <header className="border-b px-6 py-5 bg-gray-50">
          <h1 className="text-xl font-bold">Data Lagu (Pra-pemrosesan)</h1>
        </header>
        <div className="px-3 py-4">
          <div className="w-full max-w-full overflow-x-auto">
            <div className="sm:w-auto w-3">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 whitespace-nowrap">No</th>
                    <th className="border px-4 py-2 whitespace-nowrap text-left">
                      Data Original
                    </th>
                    <th className="border px-4 py-2 whitespace-nowrap text-left">
                      Hasil Pra-pemrosesan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border px-4 py-2">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="border px-4 py-2 whitespace-nowrap">
                          <button
                            className="btn-add"
                            onClick={() => handleLihat(item.id_lagu)}
                          >
                            Lihat
                          </button>
                        </td>
                        <td className="border px-4 py-2 whitespace-nowrap min-w-[300px]">
                          <div className="flex items-start gap-2">
                            <textarea
                              className="border rounded px-2 py-1 text-xs font-mono w-full resize-y overflow-x-auto"
                              value={item.editedText ?? item.prosesing}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setData((prev) =>
                                  prev.map((row) =>
                                    row.id === item.id
                                      ? {
                                          ...row,
                                          editedText: newValue,
                                          isChanged:
                                            newValue !== item.prosesing,
                                        }
                                      : row
                                  )
                                );
                              }}
                            />
                            {item.isChanged && (
                              <button
                                onClick={async () => {
                                  try {
                                    await axios.put(
                                      `http://localhost:8000/prapemroses/${item.id}`,
                                      {
                                        prosesing: item.editedText,
                                      }
                                    );
                                    // Refresh data
                                    fetchData();
                                  } catch (err) {
                                    alert("Gagal menyimpan perubahan");
                                  }
                                }}
                                className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
                              >
                                Simpan
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center text-gray-500 py-4"
                      >
                        Tidak ada data prapemroses
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contoh tampilan modal data lagu */}
          {openModal && (
            <DetailLaguModal idLagu={idLagu} onClose={setOpenModal} />
          )}
        </div>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="bg-white rounded shadow p-2">
          <p>Jumlah Data Pra-pemrosesan: {data.length}</p>
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

export default Prapemroses;
