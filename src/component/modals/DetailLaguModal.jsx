import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { youtubeThumbnailFromUrl, capitalizeWords } from "../../utils/helper";

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: { y: "-100vh", opacity: 0 },
  visible: {
    y: "0",
    opacity: 1,
    transition: { delay: 0.2 },
  },
};

const DetailLaguModal = ({ idLagu, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idLagu) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/lagu/${idLagu}`);
        setData(response.data);
      } catch (err) {
        setError("Gagal mengambil data lagu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idLagu]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={() => onClose(false)}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]"
          variants={modal}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onClose(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 text-xl transition"
            aria-label="Close"
          >
            &times;
          </button>

          <h2 className="text-center text-xl font-bold text-gray-800 mb-6">
            Detail Lagu
          </h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : data ? (
            <>
              {/* Table Info */}
              <div className="w-full overflow-x-auto">
                <table className="min-w-full text-sm text-gray-700 border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">No</th>
                      <th className="border px-4 py-2 text-center">Thumbnail</th>
                      <th className="border px-4 py-2">Judul</th>
                      <th className="border px-4 py-2">Penyanyi</th>
                      <th className="border px-4 py-2">Label</th>
                      <th className="border px-4 py-2">Tahun</th>
                      <th className="border px-4 py-2">Genre</th>
                      <th className="border px-4 py-2">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2">1</td>
                      <td className="border px-4 py-2 text-center">
                        <a href={data.link} target="_blank" rel="noreferrer">
                          <img
                            className="w-20"
                            src={youtubeThumbnailFromUrl(data.link)}
                            alt="Thumbnail"
                          />
                        </a>
                      </td>
                      <td className="border px-4 py-2">{capitalizeWords(data.judul)}</td>
                      <td className="border px-4 py-2">
                        {data.penyanyi_list?.map(p => p.nama).join(", ")}
                      </td>
                      <td className="border px-4 py-2">
                        {data.penyanyi_list?.map(p => p.label).join(", ")}
                      </td>
                      <td className="border px-4 py-2">{data.tahun_rilis}</td>
                      <td className="border px-4 py-2">
                        {data.genre_list?.join(", ")}
                      </td>
                      <td className="border px-4 py-2">
                        <a
                          href={data.link}
                          className="text-blue-600 underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Lihat
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Lirik Lagu */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Lirik Lagu:</h3>
                <div className="bg-white border border-gray-300 p-4 rounded-lg text-sm text-gray-800 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-line shadow-inner">
                  {data.lirik
                    ? data.lirik
                        .split(".")
                        .filter((line) => line.trim() !== "")
                        .map((line, index) => (
                          <p key={index}>{line.trim()}.</p>
                        ))
                    : "Tidak ada lirik"}
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Tidak ada data.</p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DetailLaguModal;
