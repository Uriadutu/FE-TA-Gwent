import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ModalPortal from "../../utils/ModalPortal";

const EditGenreModal = ({ setIsOpenModalEdit, selectedGenre, getGenre }) => {
  const [namaGenre, setNamaGenre] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedGenre) {
      setNamaGenre(selectedGenre.nama || "");
    }
  }, [selectedGenre]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaGenre.trim()) {
      toast.error("Nama genre tidak boleh kosong");
      return;
    }

    setLoading(true);
    try {
      await axios.put(`http://localhost:8000/genres/${selectedGenre.id}`, {
        nama: namaGenre.trim(),
      });

      toast.success("Genre berhasil diperbarui");
      setIsOpenModalEdit(false);
      getGenre();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal memperbarui genre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 px-2 flex items-center sm:items-start sm:pt-3 justify-center bg-black z-40 bg-opacity-60">
        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg bg-white rounded-lg shadow-lg"
          >
            <div className="flex items-start justify-between p-4 border-b border-gray-200 rounded-t">
              <h3 className="text-xl font-semibold text-gray-700">
                Edit Genre
              </h3>
              <button
                onClick={() => setIsOpenModalEdit(false)}
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-700 bg-transparent rounded-lg hover:bg-red-500 hover:text-white transition duration-300"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4 text-gray-700">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <label className="text-sm font-medium">Nama Genre</label>
                  <input
                    type="text"
                    value={namaGenre}
                    onChange={(e) => setNamaGenre(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Masukkan nama Genre"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end p-4 space-x-3 border-t border-gray-200 rounded-b">
              <button
                type="button"
                onClick={() => setIsOpenModalEdit(false)}
                className="px-4 py-2 bg-gray-200 border border-gray-400 text-gray-500 text-sm rounded hover:bg-gray-100 transition duration-300"
              >
                Batal
              </button>
              <button type="submit" disabled={loading} className="btn-add">
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </motion.div>
        </form>
      </div>
    </ModalPortal>
  );
};

export default EditGenreModal;
