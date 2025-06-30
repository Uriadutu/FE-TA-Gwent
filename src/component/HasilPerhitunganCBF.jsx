import React, { useState } from "react";
import axios from "axios";

const HasilPerhitunganCBF = () => {
  const [keyword, setKeyword] = useState("");
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCari = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setHasil(null);

    try {
      const response = await axios.post("http://localhost:8000/pemrosesan", {
        keyword,
      });
      setHasil(response.data);
    } catch (err) {
      setErrorMsg("❌ Gagal memuat hasil rekomendasi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md space-y-6">
      <h2 className="text-xl font-bold text-indigo-600 mb-2">
        🔍 Rekomendasi Lagu - CBF
      </h2>

      <form onSubmit={handleCari} className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Masukkan keyword lagu..."
            className="border px-3 py-2 rounded w-full"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Cari
          </button>
        </div>
      </form>

      {loading && <p className="text-gray-500">⏳ Memuat perhitungan...</p>}
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      {hasil && (
        <div className="space-y-6">
          {/* Info Ringkas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <strong>Keyword Asli:</strong> {hasil.keyword_asli || "-"}
            </div>
            <div>
              <strong>Setelah Normalisasi:</strong>{" "}
              {hasil.keyword_setelah_normalisasi || "-"}
            </div>
            <div>
              <strong>Jumlah Data Dibandingkan:</strong>{" "}
              {hasil.jumlah_data_dibandingkan || 0}
            </div>
            <div>
              <strong>Nilai Cosine Tertinggi:</strong>{" "}
              {hasil.nilai_cosine_tertinggi || 0}
            </div>
            <div className="col-span-2">
              <strong>Judul Tercocok:</strong>
              <div className="bg-gray-100 p-2 mt-1 rounded text-sm whitespace-pre-wrap">
                {hasil.judul_tercocok || "-"}
              </div>
            </div>
          </div>

          {/* Step by Step */}
          <div className="text-sm space-y-4">
            <h3 className="text-lg font-semibold text-indigo-700">
              📊 Step-by-Step Perhitungan
            </h3>

            {/* Corpus */}
            {hasil.step_by_step?.tfidf_dokumen && (
              <div>
                <strong>TF-IDF Dokumen:</strong>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs border mt-2">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">Dokumen</th>
                        {Object.keys(
                          hasil.step_by_step.tfidf_dokumen[0] || {}
                        ).map((term, idx) => (
                          <th key={idx} className="border px-2 py-1">
                            {term}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {hasil.step_by_step.tfidf_dokumen.map((row, i) => (
                        <tr key={i}>
                          <td className="border px-2 py-1 font-semibold">
                            Doc {i}
                          </td>
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="border px-2 py-1">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TF-IDF Keyword */}
            <div>
              <strong>TF-IDF Keyword:</strong>
              <table className="min-w-full text-xs border mt-2">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">Fitur</th>
                    <th className="border px-2 py-1">TF-IDF</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    hasil.step_by_step?.tfidf_keyword || {}
                  ).map(([term, val], idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{term}</td>
                      <td className="border px-2 py-1">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cosine Scores */}
            <div>
              <strong>Cosine Score Semua Dokumen:</strong>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-1">
                {hasil.step_by_step?.cosine_semua_dokumen?.map(
                  (score, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-100 px-2 py-1 rounded text-center"
                    >
                      <span className="font-medium">Doc {idx}:</span> {score}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Rekomendasi */}
          <div>
            <h3 className="text-lg font-semibold mb-2">🎵 Top 5 Rekomendasi</h3>
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">#</th>
                  <th className="border px-3 py-2">Judul</th>
                  <th className="border px-3 py-2">Penyanyi</th>
                  <th className="border px-3 py-2">Tahun</th>
                  <th className="border px-3 py-2">Genre</th>
                  <th className="border px-3 py-2">Label</th>
                  <th className="border px-3 py-2">Skor Cosine</th>
                  <th className="border px-3 py-2">Index Vektor</th>
                </tr>
              </thead>
              <tbody>
                {hasil.top_5_rekomendasi?.map((lagu, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{index + 1}</td>
                    <td className="border px-3 py-2">{lagu.judul}</td>
                    <td className="border px-3 py-2">
                      {lagu.penyanyi?.join(", ") || "-"}
                    </td>
                    <td className="border px-3 py-2">{lagu.tahun || "-"}</td>
                    <td className="border px-3 py-2">
                      {lagu.genre?.join(", ") || "-"}
                    </td>
                    <td className="border px-3 py-2">
                      {lagu.label?.join(", ") || "-"}
                    </td>
                    <td className="border px-3 py-2">
                      {lagu.skor_kemiripan || 0}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {lagu.vektor_index}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HasilPerhitunganCBF;
