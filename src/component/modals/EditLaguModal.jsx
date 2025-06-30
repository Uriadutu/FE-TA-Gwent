import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ModalPortal from "../../utils/ModalPortal";

const EditLaguModal = ({ setIsOpenModalEdit, getLagu, selectedLagu }) => {
  const [judul, setJudul] = useState("");
  const [tahunRilis, setTahunRilis] = useState("");
  const [lirik, setLirik] = useState("");
  const [link, setLink] = useState("");
  const [penyanyiList, setPenyanyiList] = useState([]);
  const [genreList, setGenreList] = useState([]);
  const [selectedPenyanyiIds, setSelectedPenyanyiIds] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ambil data penyanyi & genre dari server
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [resPenyanyi, resGenre] = await Promise.all([
          axios.get("http://localhost:8000/penyanyi"),
          axios.get("http://localhost:8000/genres"),
        ]);
        setPenyanyiList(resPenyanyi.data);
        setGenreList(resGenre.data);
      } catch (error) {
        toast.error("Gagal mengambil data penyanyi/genre");
      }
    };
    fetchOptions();
  }, []);

  // Isi data lagu yang diedit
  useEffect(() => {
    if (selectedLagu) {
      setJudul(selectedLagu.judul || "");
      setTahunRilis(selectedLagu.tahun_rilis || "");
      setLirik(selectedLagu.lirik || "");
      setLink(selectedLagu.link || "");
      setSelectedPenyanyiIds(
        selectedLagu.penyanyi_list?.map((p) => p.id.toString()) || []
      );

      // ⬇️ Ubah dari nama genre jadi id genre
      const matchedGenreIds = genreList
        .filter((g) => selectedLagu.genre_list.includes(g.nama))
        .map((g) => g.id);

      setSelectedGenres(matchedGenreIds);
    }
  }, [selectedLagu, genreList]); // ⬅️ Pastikan genreList jadi dependency juga!

  const handleGenreToggle = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((gid) => gid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul.trim() || selectedPenyanyiIds.length === 0) {
      toast.error("Judul dan minimal satu penyanyi wajib diisi");
      return;
    }

    setLoading(true);
    try {
      await axios.put(`http://localhost:8000/lagu/${selectedLagu.id}`, {
        judul: judul.trim(),
        tahun_rilis: tahunRilis,
        lirik,
        link,
        penyanyi_ids: selectedPenyanyiIds,
        genre_ids: selectedGenres,
      });

      toast.success("Lagu berhasil diperbarui");
      setIsOpenModalEdit(false);
      getLagu?.();
    } catch (error) {
      toast.error("Gagal memperbarui lagu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 bg-black/50 flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-xl my-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-t-sm shadow-xl h-[35rem]"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="text-base font-semibold text-gray-800">
                Edit Lagu
              </h2>
              <button
                type="button"
                onClick={() => setIsOpenModalEdit(false)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <div className="px-4 py-5 space-y-4 text-sm text-gray-700 h-full overflow-y-auto bg-white">
              <div>
                <label className="block mb-1">Judul Lagu</label>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block mb-1">Tahun Rilis</label>
                <input
                  type="text"
                  value={tahunRilis}
                  onChange={(e) => setTahunRilis(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block mb-1">Lirik</label>
                <textarea
                  rows="3"
                  value={lirik}
                  onChange={(e) => setLirik(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block mb-1">Link Lagu</label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block mb-1">Pilih Penyanyi</label>
                <select
                  multiple
                  value={selectedPenyanyiIds}
                  onChange={(e) =>
                    setSelectedPenyanyiIds(
                      Array.from(e.target.selectedOptions, (opt) => opt.value)
                    )
                  }
                  className="w-full border rounded-md px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  {penyanyiList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Genre</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {genreList.map((g) => (
                    <label
                      key={g.id}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <input
                        type="checkbox"
                        value={g.id}
                        checked={selectedGenres.includes(Number(g.id))}
                        onChange={() => handleGenreToggle(Number(g.id))}
                        className="accent-green-500"
                      />

                      <span>{g.nama}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-3 px-4 py-3 border-t bg-white rounded-b-sm">
              <button
                type="button"
                onClick={() => setIsOpenModalEdit(false)}
                className="btn-batal"
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

export default EditLaguModal;
