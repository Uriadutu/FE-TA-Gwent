import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ModalPortal from "../../utils/ModalPortal";

const EditPenyanyiModal = ({
  setIsOpenModalEdit,
  selectedPenyanyi,
  getPenyanyi,
}) => {
  const [nama, setNama] = useState("");
  const [namaLabel, setNamaLabel] = useState("");
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPenyanyi) {
      setNama(selectedPenyanyi.nama || "");
      setNamaLabel(selectedPenyanyi.nama_label || "");
    }
  }, [selectedPenyanyi]);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await axios.get("http://localhost:8000/label");
        setLabels(response.data);
      } catch (error) {
        console.error("Gagal mengambil data label:", error);
        toast.error("Gagal mengambil data label.");
      }
    };

    fetchLabels();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nama.trim()) {
      toast.error("Nama penyanyi tidak boleh kosong");
      return;
    }

    setLoading(true);
    try {
      await axios.put(`http://localhost:8000/penyanyi/${selectedPenyanyi.id}`, {
        nama: nama.trim(),
        nama_label: namaLabel,
      });

      toast.success("Penyanyi berhasil diperbarui");
      setIsOpenModalEdit(false);
      getPenyanyi();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal memperbarui penyanyi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPortal>
      <div className="fixed  inset-0 px-2 flex items-center sm:items-start sm:pt-3 justify-center bg-black z-50 bg-opacity-60">
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
                Edit Penyanyi
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
                  <label className="text-sm font-medium">Nama Penyanyi</label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Masukkan nama penyanyi"
                  />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <label className="text-sm font-medium">Nama Label</label>
                  <select
                    value={namaLabel}
                    onChange={(e) => setNamaLabel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="" disabled>
                      Pilih Label
                    </option>
                    {labels.map((label) => (
                      <option key={label.id} value={label.nama_label}>
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

export default EditPenyanyiModal;
