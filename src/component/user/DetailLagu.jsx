import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMusic,
  FaMicrophoneAlt,
  FaCalendarAlt,
  FaTags,
  FaCompactDisc,
} from "react-icons/fa";
import { youtubeThumbnailFromUrl } from "../../utils/helper";
import { Link } from "react-router-dom";

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

const DetailLagu = ({ onClose, judul }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/lagu/${judul}`);
        setData(response.data);
      } catch (err) {
        setError("Gagal mengambil data lagu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [judul]);

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
          className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]"
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

          {/* Header */}
          <h2 className="text-center text-xl font-bold text-gray-800 mb-6">
            Detail Lagu
          </h2>

          {/* Konten */}
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Gambar */}
              <div className="w-full h-full">
                <Link to={data.link}>
                  <img
                    src={youtubeThumbnailFromUrl(data.link)}
                    alt="Thumbnail"
                    className="w-full h-auto rounded-xl shadow-md object-cover"
                  />
                </Link>
              </div>

              {/* Detail */}
              <div className="space-y-4 text-gray-700 text-sm">
                <div className="flex items-center gap-2">
                  <FaMusic className="text-indigo-500" />
                  <span className="font-medium text-gray-500">Judul:</span>
                  <span className="ml-auto text-right font-semibold">
                    {data.judul}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMicrophoneAlt className="text-indigo-500" />
                  <span className="font-medium text-gray-500">Penyanyi:</span>
                  <span className="ml-auto text-right">
                    {data.penyanyi_list && data.penyanyi_list.length > 0
                      ? data.penyanyi_list.map((p) => p.nama).join(", ")
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-indigo-500" />
                  <span className="font-medium text-gray-500">
                    Tahun Rilis:
                  </span>
                  <span className="ml-auto text-right">{data.tahun_rilis}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTags className="text-indigo-500" />
                  <span className="font-medium text-gray-500">Genre:</span>
                  <span className="ml-auto text-right">
                    <span className="ml-auto text-right">
                      {data.genre_list && data.genre_list.length > 0
                        ? data.genre_list.join(", ")
                        : "-"}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCompactDisc className="text-indigo-500" />
                  <span className="font-medium text-gray-500">Label:</span>
                  <span className="ml-auto text-right">
                    {data.penyanyi_list && data.penyanyi_list.length > 0
                      ? data.penyanyi_list.map((p) => p.label).join(", ")
                      : "-"}
                  </span>
                </div>

                {/* Lirik */}
                <div>
                  <h4 className="text-gray-600 font-medium mb-2 mt-4">Lirik</h4>
                  <div className="bg-white border border-gray-200 p-5 rounded-lg text-sm text-gray-800 max-h-64 overflow-y-auto leading-relaxed font-light tracking-wide shadow-inner">
                    {data.lirik
                      ? data.lirik
                          .split(".")
                          .filter((kalimat) => kalimat.trim() !== "")
                          .map((kalimat, idx) => (
                            <p key={idx} className="mb-2 whitespace-pre-wrap">
                              {kalimat.trim() + "."}
                            </p>
                          ))
                      : "Tidak ada lirik"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">Tidak ada data.</p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DetailLagu;
