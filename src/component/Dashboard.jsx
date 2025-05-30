import React, { useState, useEffect } from "react";
import { db, auth } from "../auth/Firebase"; // Pastikan 'auth' diimpor dari Firebase config Anda
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts";
import { FiBox, FiShoppingCart, FiDollarSign, FiPackage } from "react-icons/fi";

const Dashboard = () => {
  const [dataProduk, setDataProduk] = useState([]);
  const [dataTransaksi, setDataTransaksi] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  let filter = "today";
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "transaksi"),
      where("user", "==", user.uid),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transaksiList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
        };
      });
      setDataTransaksi(transaksiList);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const now = new Date();
    let result = [...dataTransaksi];

    if (filter === "today") {
      result = result.filter(
        (item) => item.createdAt.toDateString() === now.toDateString()
      );
    }

    setFilteredData(result);
  }, [dataTransaksi, filter]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "produk"),
      where("uid", "==", user.uid),
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
  }, [user]);

  const totalHariIni = filteredData.reduce((total, transaksi) => {
    const transaksiTotal = transaksi.items.reduce((subTotal, item) => {
      return subTotal + item.harga * item.jumlah;
    }, 0);
    return total + transaksiTotal;
  }, 0);

  const getLast7DaysData = () => {
    const days = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);

      const dayName = date.toLocaleDateString("id-ID", { weekday: "short" }); // "Sen", "Sel", dll

      const matchingTransaksi = dataTransaksi.filter((trx) => {
        return trx.createdAt?.toDateString() === date.toDateString();
      });

      const totalTransaksi = matchingTransaksi.length;

      days.push({
        date: dayName, // hanya nama hari
        transaksi: totalTransaksi,
      });
    }

    return days;
  };

  return (
    <div className="p-2">
      <div className="bg-white rounded shadow-md overflow-hidden">
        {/* Header */}
        <header className="border-b px-6 py-5 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </header>

        {/* Konten */}
        <div className="px-6 py-6">
          {/* Ringkasan Kartu */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {/* Transaksi */}
            <div className="bg-gray-50 hover:bg-white transition rounded-xl p-5 shadow-sm border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-2">
                <FiShoppingCart className="text-green-500 text-xl" />
                <h2 className="text-sm text-gray-500">Transaksi Hari Ini</h2>
              </div>
              <p className="text-2xl font-bold text-gray-800" translate="no">
                {filteredData.reduce(
                  (total, trx) => total + trx.items.length,
                  0
                )}{" "}
                Transaksi
              </p>
            </div>

            {/* Pendapatan */}
            <div className="bg-gray-50 hover:bg-white transition rounded-xl p-5 shadow-sm border-l-4 border-yellow-500">
              <div className="flex items-center gap-3 mb-2">
                <FiDollarSign className="text-yellow-500 text-xl" />
                <h2 className="text-sm text-gray-500">Pendapatan Hari Ini</h2>
              </div>
              <p className="text-2xl font-bold text-gray-800" translate="no">
                Rp {totalHariIni.toLocaleString()}
              </p>
            </div>

            {/* Produk */}
            <div className="bg-gray-50 hover:bg-white transition rounded-xl p-5 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-2">
                <FiPackage className="text-blue-500 text-xl" />
                <h2 className="text-sm text-gray-500">Total Produk</h2>
              </div>
              <p className="text-2xl font-bold text-gray-800" translate="no">
                {dataProduk.length} Produk
              </p>
            </div>
          </div>

          {/* Produk Populer */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-10">
            <h2 className="text-xl font-semibold text-[#0c8e20] flex items-center gap-2 mb-4">
              <FiBox />
              Produk Kami
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {dataProduk.slice(0, 6).map((produk, index) => (
                <div
                  key={index}
                  className="bg-gray-50 hover:bg-white transition rounded-xl p-4 shadow border border-gray-100"
                >
                  <h3 className="text-base font-semibold text-gray-800 truncate mb-1">
                    {produk.nama}
                  </h3>
                  <p className="text-sm font-bold text-green-700">
                    Rp {produk.harga.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => navigate("/produk")}
                className="text-sm font-medium text-green-700 hover:text-green-600"
              >
                Lihat Produk Lainnya <span className="ml-1">{">>"}</span>
              </button>
            </div>
          </div>

          {/* Grafik */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#0c8e20] mb-4">
              Grafik Transaksi (7 Hari Terakhir)
            </h2>
            <div className="w-full overflow-x-auto h-64">
              <ResponsiveContainer width="120%" height={250}>
                <LineChart data={getLast7DaysData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="transaksi"
                    stroke="#0c8e20"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
