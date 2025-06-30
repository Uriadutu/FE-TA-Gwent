import React, { useState } from "react";
import axios from "axios";
import { PiMathOperationsLight } from "react-icons/pi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import DetailLaguModal from "./modals/DetailLaguModal";
import { AnimatePresence } from "framer-motion";

const Pemrosesan = () => {
  const [keyword, setKeyword] = useState("");
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [idLagu, setIdLagu] = useState("")

  const [showAll, setShowAll] = useState(false);
  const [showAllCosine, setShowAllCosine] = useState(false);

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

  console.log(hasil);
  

  const handleDetail = (id) => {
    setIdLagu(id);
    setOpenModalDetail(true);
    console.log(id, "dayta");
    
  };

  return (
    <div className="p-2">
       <AnimatePresence>
        {openModalDetail && (
          <DetailLaguModal onClose={setOpenModalDetail} idLagu={idLagu} />
        )}
      </AnimatePresence>
      <div className="bg-white rounded shadow-lg">
        <header className="border-b px-6 py-5 bg-gray-50">
          <h1 className="text-xl font-bold">Pemrosesan Lagu</h1>
        </header>
        <div className="px-4 py-5">
          <form onSubmit={handleCari} className="space-y-3 mb-6">
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
                className="btn-add"
              >
                Cari
              </button>
            </div>
          </form>

          {loading && <p className="text-gray-500">⏳ Memuat perhitungan...</p>}
          {errorMsg && <p className="text-red-500">{errorMsg}</p>}

          {hasil && (
            <div className="space-y-6">
              {/* Informasi Ringkas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Keyword Asli:</strong> {hasil.keyword_asli}
                </div>
                <div>
                  <strong>Setelah Normalisasi:</strong>{" "}
                  {hasil.keyword_setelah_normalisasi}
                </div>
                <div>
                  <strong>Jumlah Data Dibandingkan:</strong>{" "}
                  {hasil.jumlah_data_dibandingkan}
                </div>
              </div>

              <div>
                <h3 className="text-lg flex items-center gap-2  font-semibold text-indigo-700">
                  <IoDocumentTextOutline /> Corpus (Dokumen)
                </h3>
                <div className="overflow-x-auto max-h-[300px]">
                  <table className="min-w-full text-xs border mt-2">
                    <thead className=" sticky top-[-1.2px] bg-purple-400 text-white p-1">
                      <tr>
                        <th className="border px-2 py-1">No</th>
                        <th className="border px-2 py-1">Isi Dokumen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hasil.step_by_step?.corpus?.map((doc, i) => (
                        <tr key={i}>
                          <td className="border px-2 py-1 text-center">
                            {i + 1}
                          </td>
                          <td className="border px-2 py-1 whitespace-pre-wrap text-justify">
                            {doc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-1 text-purple-700 inline-block text-sm bg-purple-100 rounded">
                  <p>Total: {hasil.step_by_step.tf_dokumen.length} Corpus</p>
                </div>
              </div>

              <h3 className="text-lg flex items-center gap-2  font-semibold text-indigo-700">
                <PiMathOperationsLight /> Langkah 1: Perhitungan Term Frequency
                (TF)
              </h3>

              <p className="text-sm text-gray-700">
                <strong>Rumus:</strong>{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded">
                  TF(term) = Jumlah kemunculan term ÷ Total kata dalam dokumen
                </code>
              </p>
              <div className="">
                <div className="overflow-x-auto mt-4 max-h-[300px]">
                  <table className="min-w-full text-xs border">
                    <thead className=" sticky top-[-1.2px] bg-purple-400 text-white p-1">
                      <tr>
                        <th className="border px-2 py-1 text-center">#</th>
                        <th className="border px-2 py-1 text-center">
                          Total Kata
                        </th>
                        {Object.keys(hasil.step_by_step.tf_dokumen[0]).map(
                          (term, i) => (
                            <React.Fragment key={i}>
                              <th className="border px-2 py-1 text-center">
                                "{term}" Muncul
                              </th>
                              <th className="border px-2 py-1 text-center">
                                TF("{term}")
                              </th>
                            </React.Fragment>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {hasil.step_by_step.tf_dokumen.map((tfRow, i) => {
                        const doc = hasil.step_by_step.corpus[i] || "";
                        const tokens = doc.split(" ");
                        const totalKata = tokens.length;

                        return (
                          <tr key={i}>
                            <td className="border px-2 py-1 text-center">
                              {i + 1}
                            </td>
                            <td className="border px-2 py-1 text-center">
                              {totalKata}
                            </td>

                            {Object.keys(tfRow).map((term, j) => {
                              const jumlahMuncul = tokens.filter(
                                (t) => t === term
                              ).length;
                              const tfVal = tfRow[term];

                              return (
                                <React.Fragment key={j}>
                                  <td className="border px-2 py-1 text-center">
                                    {jumlahMuncul}
                                  </td>
                                  <td className="border px-2 py-1 text-center">
                                    {tfVal}
                                  </td>
                                </React.Fragment>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="p-1 text-purple-700 inline-block text-sm bg-purple-100 rounded">
                  <p>
                    Total: {hasil.step_by_step.tf_dokumen.length} Data Term
                    Frequency
                  </p>
                </div>
              </div>

              {/* Tabel DF */}
              <div>
                <h3 className="text-lg flex items-center gap-2  font-semibold text-indigo-700">
                  <IoDocumentTextOutline /> Document Frequency (DF)
                </h3>
                <table className="min-w-full text-xs border mt-2">
                  <thead className="bg-purple-400 text-white">
                    <tr>
                      <th className="border px-2 py-1">Term</th>
                      <th className="border px-2 py-1">DF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(hasil.step_by_step?.df || {}).map(
                      ([term, dfVal], i) => (
                        <tr key={i}>
                          <td className="border px-2 py-1">{term}</td>
                          <td className="border px-2 py-1">{dfVal}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <div className="p-1 text-purple-700 inline-block text-sm bg-purple-100 rounded">
                  <p>
                    Total: {Object.keys(hasil.step_by_step.df).length} Kata
                    Kunci
                  </p>
                </div>
              </div>

              {/* Tabel IDF */}

              <div className="mt-6">
                <h3 className="text-lg flex items-center gap-2  font-semibold text-indigo-700">
                  <PiMathOperationsLight /> Perhitungan IDF (Inverse Document
                  Frequency)
                </h3>
                <p className="text-sm text-gray-600 mt-2 mb-4">
                  IDF dihitung menggunakan rumus: <br />
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm text-purple-700">
                    IDF(term) = log₁₀(N / DF(term))
                  </code>
                  <br />
                  Di mana:
                  <ul className="list-disc ml-6">
                    <li>
                      <strong>N</strong> = Total jumlah dokumen
                    </li>
                    <li>
                      <strong>DF(term)</strong> = Jumlah dokumen yang mengandung
                      term tersebut
                    </li>
                  </ul>
                </p>

                <table className="min-w-full text-xs border mt-2">
                  <thead className="bg-purple-400 text-white">
                    <tr>
                      <th className="border px-2 py-1">Term</th>
                      <th className="border px-2 py-1">DF(term)</th>
                      <th className="border px-2 py-1">N</th>
                      <th className="border px-2 py-1">Perhitungan</th>
                      <th className="border px-2 py-1">Hasil IDF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(hasil.step_by_step?.idf || {}).map(
                      ([term, idfVal], i) => {
                        const dfTerm = hasil.step_by_step?.df?.[term] || 0;
                        const N = hasil.step_by_step?.corpus?.length || 1;
                        const perhitungan = `log₁₀(${N} / ${dfTerm})`;
                        return (
                          <tr key={i}>
                            <td className="border px-2 py-1">{term}</td>
                            <td className="border px-2 py-1 text-center">
                              {dfTerm}
                            </td>
                            <td className="border px-2 py-1 text-center">
                              {N}
                            </td>
                            <td className="border px-2 py-1 text-center">
                              {perhitungan}
                            </td>
                            <td className="border px-2 py-1 text-center">
                              {idfVal}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
                <div className="p-1 text-purple-700 inline-block text-sm bg-purple-100 rounded">
                  <p>
                    Total: {Object.keys(hasil.step_by_step.df).length} Kata
                    Kunci
                  </p>
                </div>
              </div>

              <div className="my-6">
                <h3 className="text-lg flex items-center gap-2  font-semibold text-indigo-700 mb-2">
                  <PiMathOperationsLight /> Perhitungan TF-IDF Keyword
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  Rumus:{" "}
                  <code className="bg-gray-100 px-1 py-0.5 rounded">
                    TF-IDF = TF × IDF
                  </code>
                </p>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs border">
                    <thead className="bg-purple-400 text-white">
                      <tr>
                        <th className="border px-2 py-1">Term</th>
                        <th className="border px-2 py-1">TF</th>
                        <th className="border px-2 py-1">IDF</th>
                        <th className="border px-2 py-1">TF × IDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(hasil.step_by_step?.tf_keyword || {}).map(
                        ([term, tfVal], i) => {
                          const idfVal = hasil.step_by_step?.idf?.[term] ?? 0;
                          const tfidfVal =
                            hasil.step_by_step?.tfidf_keyword?.[term] ?? 0;

                          return (
                            <tr key={i}>
                              <td className="border px-2 py-1 text-center">
                                {term}
                              </td>
                              <td className="border px-2 py-1 text-center">
                                {tfVal}
                              </td>
                              <td className="border px-2 py-1 text-center">
                                {idfVal}
                              </td>
                              <td className="border px-2 py-1 text-center">
                                {tfidfVal}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                  <div className="p-1 text-purple-700 inline-block text-sm bg-purple-100 rounded">
                    <p>
                      Total: {Object.keys(hasil.step_by_step.df).length} Kata
                      Kunci
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg flex items-center gap-2  font-semibold text-indigo-700">
                    <PiMathOperationsLight /> Perhitungan Cosine Similarity
                    Untuk Doc
                  </h3>
                  <button
                    onClick={() => setShowAllCosine(!showAllCosine)}
                    className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded shadow"
                  >
                    {showAllCosine ? "Tutup" : "Lihat Perhitungan"}
                  </button>
                </div>
                {showAllCosine &&
                  hasil.step_by_step.tfidf_dokumen.map(
                    (docVector, selectedIdx) => {
                      const keywordVector = hasil.step_by_step.tfidf_keyword;
                      const terms = Object.keys(keywordVector);

                      const dotProduct = terms.reduce((sum, term) => {
                        return sum + keywordVector[term] * docVector[term];
                      }, 0);

                      const normKeyword = Math.sqrt(
                        terms.reduce(
                          (sum, term) => sum + Math.pow(keywordVector[term], 2),
                          0
                        )
                      );

                      const normDoc = Math.sqrt(
                        terms.reduce(
                          (sum, term) => sum + Math.pow(docVector[term], 2),
                          0
                        )
                      );

                      const cosine =
                        normKeyword && normDoc
                          ? dotProduct / (normKeyword * normDoc)
                          : 0;

                      return (
                        <div
                          key={selectedIdx}
                          className="mt-6 border p-4 rounded shadow bg-white"
                        >
                          <p>Doc {selectedIdx + 1}</p>
                          <table className="min-w-full text-sm border mb-4 mt-2">
                            <thead className="bg-purple-400 text-white">
                              <tr>
                                <th className="border px-2 py-1">Term</th>
                                <th className="border px-2 py-1">
                                  TF-IDF Keyword
                                </th>
                                <th className="border px-2 py-1">
                                  TF-IDF Dokumen
                                </th>
                                <th className="border px-2 py-1">Perkalian</th>
                              </tr>
                            </thead>
                            <tbody>
                              {terms.map((term, i) => (
                                <tr key={i}>
                                  <td className="border px-2 py-1">{term}</td>
                                  <td className="border px-2 py-1">
                                    {keywordVector[term]}
                                  </td>
                                  <td className="border px-2 py-1">
                                    {docVector[term]}
                                  </td>
                                  <td className="border px-2 py-1">
                                    {(
                                      keywordVector[term] * docVector[term]
                                    ).toFixed(4)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="p-1 text-purple-700 inline-block text-sm bg-purple-100 rounded">
                            <p>
                              Total: {Object.keys(hasil.step_by_step.df).length}{" "}
                              Kata Kunci
                            </p>
                          </div>

                          <div className="text-sm text-gray-700">
                            <p>
                              <strong>Dot Product:</strong>{" "}
                              {dotProduct.toFixed(4)}
                            </p>
                            <p>
                              <strong>Magnitude Keyword:</strong>{" "}
                              {normKeyword.toFixed(4)}
                            </p>
                            <p>
                              <strong>Magnitude Dokumen:</strong>{" "}
                              {normDoc.toFixed(4)}
                            </p>
                            <p className="mt-2 text-purple-700 font-bold">
                              Cosine Similarity = Dot Product / (Magnitude
                              Keyword × Magnitude Dokumen)
                            </p>
                            <p>
                              <strong>Hasil Cosine Similarity:</strong>{" "}
                              <span className="text-green-600 font-semibold">
                                {cosine.toFixed(4)}
                              </span>
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
              </div>

              <div className="my-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg flex items-center gap-2  font-semibold text-indigo-700">
                    <PiMathOperationsLight /> Rincian Perhitungan TF-IDF Dokumen
                  </h3>
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded shadow"
                  >
                    {showAll ? "Tutup" : "Lihat Perhitungan"}
                  </button>
                </div>

                <p className="text-sm text-gray-700 mb-3">
                  Rumus:{" "}
                  <code className="bg-gray-100 px-1 py-0.5 rounded">
                    TF-IDF = TF × IDF
                  </code>
                </p>

                {showAll &&
                  hasil.step_by_step?.tfidf_dokumen?.map(
                    (tfidfRow, docIndex) => (
                      <div
                        key={docIndex}
                        className="mb-6 border p-3 rounded-md shadow-sm bg-white"
                      >
                        <h4 className="flex items-center gap-2  semibold text-purple-700 mb-2">
                          <IoDocumentTextOutline /> Doc {docIndex + 1}
                        </h4>
                        <table className="min-w-full text-xs border">
                          <thead className="bg-purple-400 text-white">
                            <tr>
                              <th className="border px-2 py-1">Term</th>
                              <th className="border px-2 py-1">TF</th>
                              <th className="border px-2 py-1">IDF</th>
                              <th className="border px-2 py-1">TF × IDF</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(tfidfRow).map((term, i) => {
                              const tf =
                                hasil.step_by_step?.tf_dokumen?.[docIndex]?.[
                                  term
                                ] || 0;
                              const idf = hasil.step_by_step?.idf?.[term] || 0;
                              const tfidf = tfidfRow[term] || 0;
                              return (
                                <tr key={i}>
                                  <td className="border px-2 py-1 text-center">
                                    {term}
                                  </td>
                                  <td className="border px-2 py-1 text-center">
                                    {tf}
                                  </td>
                                  <td className="border px-2 py-1 text-center">
                                    {idf}
                                  </td>
                                  <td className="border px-2 py-1 text-center">
                                    {tfidf}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div className="p-1 text-purple-700 inline-block text-sm bg-purple-100 rounded">
                          <p>
                            Total: {Object.keys(hasil.step_by_step.df).length}{" "}
                            Kata Kunci
                          </p>
                        </div>
                      </div>
                    )
                  )}
              </div>

              {/* TF-IDF Dokumen */}
              <div>
                <h3 className="text-lg flex items-center gap-2  font-semibold text-indigo-700">
                  <PiMathOperationsLight /> TF-IDF Dokumen
                </h3>
                <div className="overflow-x-auto max-h-[300px]">
                  <table className="min-w-full text-xs border mt-2">
                    <thead className=" sticky top-[-1.2px] bg-purple-400 text-white p-1">
                      <tr className="">
                        <th className="border px-2 py-1">Doc</th>
                        {Object.keys(
                          hasil.step_by_step?.tfidf_dokumen?.[0] || {}
                        ).map((term, idx) => (
                          <th key={idx} className="border px-2 py-1">
                            {term}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {hasil.step_by_step?.tfidf_dokumen?.map((row, i) => (
                        <tr key={i}>
                          <td className="border px-2 py-1 font-semibold">
                            Doc {i}
                          </td>
                          {Object.values(row).map((val, j) => (
                            <td
                              key={j}
                              className={`border px-2 py-1 ${
                                val > 0
                                  ? "font-semibold text-gray-800 bg-purple-300"
                                  : ""
                              } `}
                            >
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                 <div className="p-1 text-purple-700 inline-block text-sm bg-purple-100 rounded">
                  <p>Total: {hasil.step_by_step.tfidf_dokumen.length} Dokumen Lagu</p>
                </div>
              </div>

              {/* Cosine Similarity */}
              <div>
                <h3 className="text-lg flex items-center gap-2  font-semibold text-indigo-700">
                  <PiMathOperationsLight /> Cosine Similarity Semua Dokumen
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                  {hasil.step_by_step?.cosine_semua_dokumen?.map(
                    (score, idx) => (
                      <div
                        key={idx}
                        className="bg-purple-400 text-white px-2 py-1 rounded text-center"
                      >
                        <span className="font-medium">Doc {idx}:</span> {score}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Rekomendasi Lagu */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-indigo-700">
                  🎵 Top 5 Rekomendasi Lagu
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border border-gray-200">
                    <thead className="bg-purple-400 text-white">
                      <tr>
                        <th className="border px-3 py-2">#</th>
                        <th className="border px-3 py-2">Judul</th>
                        <th className="border px-3 py-2">Penyanyi</th>
                        <th className="border px-3 py-2">Tahun</th>
                        <th className="border px-3 py-2">Genre</th>
                        <th className="border px-3 py-2">Label</th>
                        <th className="border px-3 py-2">Skor Cosine</th>
                        <th className="border px-3 py-2">Index Vektor</th>
                        <th className="border px-3 py-2">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hasil.top_5_rekomendasi?.map((lagu, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border px-3 py-2">{index + 1}</td>
                          <td className="border px-3 py-2">{lagu.judul}</td>
                          <td className="border px-3 py-2">
                            {lagu.penyanyi?.join(", ")}
                          </td>
                          <td className="border px-3 py-2">{lagu.tahun}</td>
                          <td className="border px-3 py-2">
                            {lagu.genre?.join(", ")}
                          </td>
                          <td className="border px-3 py-2">
                            {lagu.label?.join(", ")}
                          </td>
                          <td className="border px-3 py-2">
                            {lagu.skor_kemiripan}
                          </td>
                          <td className="border px-3 py-2 text-center">
                            {lagu.vektor_index}
                          </td>
                          <td className="border px-3 py-2 text-center">
                            <button
                              className=""
                              onClick={() => handleDetail(lagu.id)}
                            >
                                <MdOutlineRemoveRedEye/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pemrosesan;
