import React, { useState } from "react";
import axios from "axios";
import { FiSearch, FiLogIn } from "react-icons/fi";
import DetailLagu from "./DetailLagu";
import { AnimatePresence } from "framer-motion";
import { FiHeart } from "react-icons/fi"; // pastikan sudah import
import { youtubeThumbnailFromUrl } from "../../utils/helper";
import LoadingPopup from "../LoadingPopup"; // pastikan path-nya sesuai
import logo from "../../img/logo.png";

const Splash = () => {
  const [search, setSearch] = useState("");
  const [laguList, setLaguList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedMap, setLikedMap] = useState({});
  const [judul, setJudul] = useState("");
  const [top5Rekomendasi, setTop5Rekomendasi] = useState([]);

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/rekomendasi", {
        keyword: search,
      });

      const all = response.data.rekomendasi || [];
      const filtered = all.filter((lagu) => lagu.skor_kemiripan !== 0);
      const top5 = filtered.slice(0, 5);

      setLaguList(filtered);
      setTop5Rekomendasi(top5);
      setLikedMap({});

      // ✅ Simpan top 5 ke likes.json walau tidak ada yang dilike
      if (top5.length > 0) {
        await axios.post("http://localhost:8000/like", {
          keyword: search,
          liked_title: null,
          recommended: top5.map((item) => item.judul),
        });
      }
    } catch (error) {
      console.error("Gagal mengambil rekomendasi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleOpenModal = (idPilih) => {
    setIsModalOpen(true);
    setJudul(idPilih);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b py-8 flex flex-col items-center">
      <AnimatePresence>
        {isModalOpen && <DetailLagu onClose={setIsModalOpen} judul={judul} />}
      </AnimatePresence>
      <AnimatePresence>
        {loading && <LoadingPopup value={"Mencari Lagu"} />}
      </AnimatePresence>

      {/* Header dengan Login */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6">
        <div className="flex gap-3 items-center">
          <img src={logo} alt="" className="w-10" />
          <h1 className="text-2xl font-extrabold text-purple-700 tracking-tight">
            Suarahani
          </h1>
        </div>
        <button
          onClick={() => (window.location.href = "/masuk")}
          className="flex items-center gap-2 px-4 py-2 text-white bg-purple-700 hover:bg-purple-600 rounded-full shadow transition"
        >
          <FiLogIn className="text-lg" />
          <span>Login</span>
        </button>
      </div>

      {/* Input Pencarian */}
      <div className="w-full max-w-xl relative mb-10">
        <input
          type="text"
          placeholder="Cari judul lagu, penyanyi, atau lirik..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full py-3 px-5 pr-12 rounded-xl bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
        <FiSearch
          onClick={handleSearch}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-600 hover:text-indigo-500 cursor-pointer transition"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {laguList.length > 0
          ? laguList
              .filter((lagu) => lagu.skor_kemiripan !== 0)
              .sort((a, b) => {
                const skorA = parseFloat(a.skor_kemiripan.toFixed(4));
                const skorB = parseFloat(b.skor_kemiripan.toFixed(4));
                if (skorA === skorB) {
                  return parseInt(b.tahun) - parseInt(a.tahun);
                }
                return skorB - skorA;
              })
              .map((lagu, index) => (
                <div
                  key={index}
                  onClick={() => handleOpenModal(lagu.id)}
                  className="cursor-pointer flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-400 transition-all"
                >
                  {/* Gambar Thumbnail */}
                  <div className="w-full h-48 overflow-hidden rounded-t-xl">
                    <img
                      src={youtubeThumbnailFromUrl(lagu.link)}
                      alt={`Thumbnail ${lagu.judul}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info Lagu */}
                  <div className="p-4 flex flex-col gap-1 flex-grow">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {lagu.judul}
                    </h2>
                    <p className="text-sm text-gray-600">{lagu.penyanyi}</p>
                    <div className="flex w-full items-center justify-between text-xs mt-2 text-gray-500">
                      <div className="flex items-center">
                        <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                          Skor: {Math.round(lagu.skor_kemiripan * 100)}%
                        </span>
                      </div>
                      <div className="mt-3 flex justify-end items-center gap-4">
                        <span>Tahun: {lagu.tahun}</span>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (likedMap[lagu.judul]) return;

                            try {
                              await axios.post("http://localhost:8000/like", {
                                keyword: search,
                                liked_title: lagu.judul,
                                recommended: top5Rekomendasi.map(
                                  (item) => item.judul
                                ),
                              });

                              setLikedMap((prev) => ({
                                ...prev,
                                [lagu.judul]: true,
                              }));
                            } catch (err) {
                              console.error("Gagal menyimpan like:", err);
                            }
                          }}
                          className={`flex items-center transition ${
                            likedMap[lagu.judul]
                              ? "text-pink-600"
                              : "text-gray-500 hover:text-pink-600"
                          }`}
                        >
                          <FiHeart className="mr-1" />
                          <span className="text-sm">Like</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          : !loading && (
              <p className="text-gray-500 text-sm col-span-full text-center">
                Tidak ada lagu yang cocok.
              </p>
            )}
      </div>
    </div>
  );
};

export default Splash;
