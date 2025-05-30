import React, { useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import DetailLagu from "./DetailLagu";
import { AnimatePresence } from "framer-motion";
import LiveCam from "./Gambar";
import { youtubeThumbnailFromUrl } from "../../utils/helper";

const Splash = () => {
  const [search, setSearch] = useState("");
  const [laguList, setLaguList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [judul, setJudul] = useState("");
  const [fullData, setFullData] = useState([]);
  console.log(fullData);

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/rekomendasi", {
        keyword: search,
      });
      setLaguList(response.data.rekomendasi || []);
      setFullData(response.data || []);
    } catch (error) {
      console.error("Gagal mengambil rekomendasi:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleOpenModal = (judulPilih) => {
    setIsModalOpen(true);
    setJudul(judulPilih);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-12 flex flex-col items-center">
      <AnimatePresence>
        {isModalOpen && <DetailLagu onClose={setIsModalOpen} judul={judul} />}
      </AnimatePresence>

      {/* Judul Aplikasi */}
      <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
        Suarahani
      </h1>
      {/* Input Pencarian */}
      <div className="w-full max-w-xl relative mb-10">
        <input
          type="text"
          placeholder="Cari judul lagu, penyanyi, lirik..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full py-3 px-5 pr-12 rounded-xl bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <FiSearch
          onClick={handleSearch}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-600 hover:text-indigo-500 cursor-pointer transition-colors"
        />
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-gray-500 mb-4">Mencari rekomendasi...</p>}

      {/* Daftar Lagu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {laguList.length > 0 ? (
          laguList.map((lagu, index) => (
            <div
              key={index}
              onClick={() => handleOpenModal(lagu.judul)}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all duration-200 cursor-pointer"
            >
              {/* Gambar Thumbnail dari YouTube */}
              <div className="w-20 h-20 overflow-hidden rounded-lg shadow">
                <img
                  src={youtubeThumbnailFromUrl(lagu.link)}
                  // alt={`Thumbnail ${lagu.judul}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Informasi Lagu */}
              <div className="flex flex-col justify-center flex-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  {lagu.judul}
                </h2>
                <p className="text-sm text-gray-600">{lagu.penyanyi}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1 justify-between space-x-4">
                  <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs font-medium">
                    Skor: {(lagu.skor_kemiripan?.toFixed(2) * 100).toFixed(0)}%
                  </span>
                  <span>Tahun: {lagu.tahun}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mb-4">Tidak ada lagu yang cocok.</p>
        )}
      </div>
      {/* <LiveCam/> */}
    </div>
  );
};

export default Splash;
