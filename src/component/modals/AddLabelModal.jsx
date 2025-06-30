import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ModalPortal from "../../utils/ModalPortal";

const AddLabelModal = ({ setIsOpenModalAdd }) => {
  const [namaLabel, setNamaLabel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaLabel.trim()) {
      toast.error("Nama Label tidak boleh kosong");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/label", {
        nama_label: namaLabel.trim(),
      });

      toast.success("Label berhasil ditambahkan");
      setNamaLabel("");
      setIsOpenModalAdd(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal menambahkan Label");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 px-2 flex items-center sm:items-start sm:pt-3 justify-center bg-black z-[999] bg-opacity-60">
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
                Tambah Label
              </h3>
              <button
                onClick={() => setIsOpenModalAdd(false)}
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-700 bg-transparent rounded-lg hover:bg-red-500 hover:text-white transition duration-300"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4 text-gray-700">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <label className="text-sm font-medium">Nama Label</label>
                  <input
                    type="text"
                    value={namaLabel}
                    onChange={(e) => setNamaLabel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Masukkan nama Label"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end p-4 space-x-3 border-t border-gray-200 rounded-b">
              <button
                type="button"
                onClick={() => setIsOpenModalAdd(false)}
                className="px-4 py-2 bg-gray-200 border border-gray-400 text-gray-500 text-sm rounded hover:bg-gray-100 transition duration-300"
              >
                Batal
              </button>
              <button type="submit" disabled={loading} className="btn-add">
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </motion.div>
        </form>
      </div>
    </ModalPortal>
  );
};

export default AddLabelModal;
