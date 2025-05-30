import React, { useEffect, useState } from "react";
import { db, auth } from "../auth/Firebase"; // Pastikan 'auth' diimpor dari Firebase config Anda
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import AddProdukModal from "./modals/AddProdukModal";
import { AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { capitalizeWords } from "../utils/helper";
import { toast } from "react-toastify";

const Produk = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  //   const [selectedProduk, setSelectedProduk] = useState(null);
  const [dataProduk, setDataProduk] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Mendapatkan UID pengguna yang sedang login
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return; // Jika tidak ada user yang login, hentikan eksekusi

    // Query untuk mendapatkan produk berdasarkan UID pengguna yang login
    const q = query(
      collection(db, "produk"),
      where("uid", "==", user.uid), // Filter berdasarkan UID
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const produkList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDataProduk(produkList);
    });

    return () => unsubscribe();
  }, [user]); // Tambahkan `user` sebagai dependensi

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("ID produk tidak ditemukan.");
      return;
    }

    const konfirmasi = window.confirm(
      "Apakah Anda yakin ingin menghapus produk ini?"
    );

    if (!konfirmasi) return;

    try {
      if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
        await deleteDoc(doc(db, "produk", id));
        toast.success("Produk berhasil dihapus!");
      }
    } catch (error) {
      console.error("Gagal menghapus produk:", error);

      // Penanganan error spesifik Firebase
      if (error.code === "permission-denied") {
        toast.error("Anda tidak memiliki izin untuk menghapus produk ini.");
      } else {
        toast.error("Terjadi kesalahan saat menghapus produk.");
      }
    }
  };

  const filteredData = dataProduk.filter((produk) =>
    produk.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2">
      <AnimatePresence>
        {openAddModal && <AddProdukModal setIsOpenModalAdd={setOpenAddModal} />}
      </AnimatePresence>

      <div className="bg-white rounded shadow-lg">
         <header className="border-b px-6 py-5 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800">Data Produk</h1>
        </header>

        <div className="px-3 py-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setOpenAddModal(true)}
              className="btn-add"
              translate="no"
            >
              Tambah
            </button>
            <div className="flex p-2 border rounded border-gray-200 items-center">
              <input
                type="text"
                placeholder="Cari produk"
                className="text-sm outline-0 w-32 sm:w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IoSearch color="silver" />
            </div>
          </div>
          <div className="w-full max-w-full overflow-x-auto">
            <div className="sm:w-auto w-3">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="border px-4 py-2">No</th>
                    <th className="border px-4 py-2 whitespace-nowrap">
                      Nama Produk
                    </th>
                    <th className="border px-4 py-2 whitespace-nowrap">
                      Harga
                    </th>
                    <th className="border px-4 py-2 whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((produk, index) => (
                      <tr key={produk.id} className="hover:bg-gray-100">
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">
                          {capitalizeWords(produk.nama)}
                        </td>
                        <td className="border px-4 py-2 text-green-600 font-medium whitespace-nowrap">
                          Rp {Number(produk.harga).toLocaleString()}
                        </td>
                        <td className="border px-4 py-2 space-x-3 whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(produk.id)}
                            className="text-red-500 hover:underline "
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="border px-4 py-2 text-center text-gray-500"
                      >
                        Tidak ada data produk
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Produk;
