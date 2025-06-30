import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ModalPortal from "../../utils/ModalPortal";

const AddPenyanyiModal = ({ setIsOpenModalAdd, getPenyanyi }) => {
  const [namaPenyanyi, setNamaPenyanyi] = useState("");
  const [labelList, setLabelList] = useState([]);
  const [selectedLabelId, setSelectedLabelId] = useState("");
  const [loading, setLoading] = useState(false);

  // Ambil semua label dari backend
  const fetchLabels = async () => {
    try {
      const response = await axios.get("http://localhost:8000/label");
      setLabelList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data label:", error);
      toast.error("Gagal mengambil data label");
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!namaPenyanyi.trim() || !selectedLabelId) {
    toast.error("Nama penyanyi dan label wajib diisi");
    return;
  }

  setLoading(true);
  try {
    await axios.post("http://localhost:8000/penyanyi", {
      nama: namaPenyanyi.trim(),            // <-- diperbaiki di sini
      id_label: selectedLabelId,
    });

    toast.success("Penyanyi berhasil ditambahkan");
    setNamaPenyanyi("");
    setSelectedLabelId("");
    setIsOpenModalAdd(false);
    getPenyanyi();
  } catch (error) {
    console.error("Gagal menambahkan penyanyi:", error);
    toast.error("Gagal menambahkan penyanyi");
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
              Tambah Penyanyi
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
                <label className="text-sm font-medium">Nama Penyanyi</label>
                <input
                  type="text"
                  value={namaPenyanyi}
                  onChange={(e) => setNamaPenyanyi(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Masukkan nama penyanyi"
                />
              </div>

              <div className="grid grid-cols-2 items-center gap-4">
                <label className="text-sm font-medium">Label</label>
                <select
                  value={selectedLabelId}
                  onChange={(e) => setSelectedLabelId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Pilih Label</option>
                  {labelList.map((label) => (
                    <option key={label.id} value={label.id}>
                      {label.nama_label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end p-4 space-x-3 border-t border-gray-200 rounded-b">
            <button
              type="button"
              onClick={() => setIsOpenModalAdd(false)}
              className="btn-batal"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-add"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </motion.div>
      </form>
    </div>
    </ModalPortal>
  );
};

export default AddPenyanyiModal;
