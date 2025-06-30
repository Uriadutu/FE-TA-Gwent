import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Validasi = () => {
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleValidasi = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/validasi");
      setHasil(response.data);
      toast.success("Validasi berhasil!");
    } catch (error) {
      console.error("Gagal memvalidasi:", error);
      toast.error("Gagal memvalidasi.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Validasi Rekomendasi Lagu
        </h2>

        <div className="flex justify-between flex-wrap items-start gap-4 mb-4">
          <button
            onClick={handleValidasi}
            disabled={loading}
            className="btn-add"
          >
            {loading ? "Memvalidasi..." : "Validasi Sekarang"}
          </button>

          {/* Ringkasan Metrik */}
          {hasil && (
            <div className="grid grid-cols-3 gap-4 w-full max-w-xl mt-6 border border-gray-100 py-7">
              {/* HitRate */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-2">
                  <div className="flex relative w-2 h-10 bg-gray-200 rounded-full overflow-hidden ">
                    <div
                      className="absolute bottom-0 w-full  rounded-full bg-blue-200 transition-all border border-blue-500 duration-700"
                      style={{ height: `${(hasil["HitRate@5"] || 0) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-start">
                    <p>HitRate@5</p>
                    <div className="">
                      {(hasil["HitRate@5"] * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* MRR */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-2">
                  <div className="flex relative w-2 h-10 bg-gray-200 rounded-full overflow-hidden ">
                    <div
                      className="absolute bottom-0 w-full  rounded-full bg-green-200 transition-all border border-green-500 duration-700"
                      style={{ height: `${(hasil["MRR@5"] || 0) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-start">
                    <p>MRR@5</p>
                    <div className="">
                      {(hasil["MRR@5"] * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* nDCG */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-2">
                  <div className="flex relative w-2 h-10 bg-gray-200 rounded-full overflow-hidden ">
                    <div
                      className="absolute bottom-0 w-full  rounded-full bg-purple-200 transition-all border border-purple-500 duration-700"
                      style={{ height: `${(hasil["nDCG@5"] || 0) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-start">
                    <p>nDCG@5</p>
                    <div className="">
                      {(hasil["nDCG@5"] * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabel Detail */}
        {hasil && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-800 border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2 text-left">No</th>
                  <th className="border px-4 py-2 text-left">Kata Kunci</th>
                  <th className="border px-4 py-2 text-left">Recommended</th>
                  <th className="border px-4 py-2 text-left">Relevan</th>
                  <th className="border px-4 py-2 text-left">Hit@5</th>
                  <th className="border px-4 py-2 text-left">MRR@5</th>
                  <th className="border px-4 py-2 text-left">nDCG@5</th>
                </tr>
              </thead>
              <tbody>
                {hasil.detail.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2 capitalize">
                      {item.keyword}
                    </td>
                    <td className="border px-4 py-2">
                      {item.recommended.join(", ")}
                    </td>
                    <td className="border px-4 py-2">
                      {item.relevan.length > 0 ? item.relevan.join(", ") : "-"}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {item["Hit@5"]}
                    </td>
                    <td className="border px-4 py-2 text-center text-blue-600 font-semibold">
                      {item["MRR@5"]}
                    </td>
                    <td className="border px-4 py-2 text-center text-green-600 font-semibold">
                      {item["nDCG@5"]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Validasi;
