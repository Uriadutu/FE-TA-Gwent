const LiveCam = () => {
  const handleSnapshot = async () => {
    const snapshotUrl = "http://192.168.89.127/capture";

    try {
      const response = await fetch(snapshotUrl);
      const blob = await response.blob(); // Ambil data sebagai blob

      const url = window.URL.createObjectURL(blob); // Buat URL lokal
      const link = document.createElement("a");
      link.href = url;
      link.download = `jepretan-${Date.now()}.jpg`; // Nama file otomatis
      document.body.appendChild(link);
      link.click(); // Mulai download
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Bersihkan URL setelah download
    } catch (error) {
      console.error("Gagal mengambil gambar:", error);
      alert("Gagal jepret. Pastikan ESP32-CAM terhubung.");
    }
  };

  return (
    <div>
      <h2>Live ESP32-CAM</h2>
      <img
        src="http://192.168.89.127:81/stream"
        alt="ESP32-CAM Stream"
        width="640"
        height="480"
        style={{ border: "2px solid #333" }}
      />
      <br />
      <button
        onClick={handleSnapshot}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          fontSize: "16px",
          background: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Jepret 📸
      </button>
    </div>
  );
};

export default LiveCam;
