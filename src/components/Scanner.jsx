import { useState, useRef } from "react";
import { BrowserQRCodeReader } from "@zxing/library";

function Scanner({ data, setData }) {
  const [inputId, setInputId] = useState("");
  const [hasil, setHasil] = useState(null);
  const [petugas, setPetugas] = useState("Panitia 1");
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const readerRef = useRef(null);

  const startScan = async () => {
    setHasil(null);
    setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      readerRef.current = new BrowserQRCodeReader();
      readerRef.current.decodeFromStream(
        stream,
        videoRef.current,
        (result, err) => {
          if (result) {
            const teks = result.getText();
            const idBersih = teks.trim().toUpperCase().split("|")[0];
            handleScan(idBersih);
            stopScan();
          }
        }
      );
    } catch (err) {
      console.error("Kamera error:", err);
      setScanning(false);
      alert("Gagal membuka kamera: " + err.message);
    }
  };

  const stopScan = () => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const handleScan = (id) => {
    const idBersih = id.trim().toUpperCase().split("|")[0];
    if (!idBersih) return;

    const warga = data.find((w) => w.id === idBersih);

    if (!warga) {
      setHasil({ tipe: "tidakAda", id: idBersih });
      return;
    }

    if (warga.status === "sudah") {
      setHasil({ tipe: "sudah", warga });
      return;
    }

    const waktu = new Date().toLocaleString("id-ID");
    setData(data.map((w) =>
      w.id === idBersih
        ? { ...w, status: "sudah", waktuScan: waktu, petugasScan: petugas }
        : w
    ));
    setHasil({ tipe: "valid", warga, waktu });
    setInputId("");
  };

  return (
    <div>
      <h2>📷 Pemindai Kupon</h2>

      <p>Nama Petugas:</p>
      <input
        value={petugas}
        onChange={(e) => setPetugas(e.target.value)}
        placeholder="Nama petugas"
      />

      <div style={{ marginBottom: 10 }}>
        {!scanning ? (
          <button onClick={startScan}>📷 Buka Kamera Scanner</button>
        ) : (
          <button onClick={stopScan}>❌ Tutup Kamera</button>
        )}
      </div>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          borderRadius: 12,
          display: scanning ? "block" : "none",
          minHeight: 250,
          background: "#000",
          marginBottom: 16,
        }}
      />

      <hr style={{ margin: "16px 0" }} />

      <p>Atau masukkan ID manual:</p>
      <input
        value={inputId}
        onChange={(e) => setInputId(e.target.value.toUpperCase())}
        placeholder="KRB-1446-RT01-0001"
      />
      <button onClick={() => handleScan(inputId)}>Verifikasi</button>

      {hasil && (
        <div style={{ marginTop: 16 }}>
          {hasil.tipe === "valid" && (
            <div className="hasil-valid">
              <p>✅ VALID — Serahkan Daging!</p>
              <p><strong>Nama:</strong> {hasil.warga.nama}</p>
              <p><strong>Alamat:</strong> {hasil.warga.alamat}</p>
              <p><strong>Waktu:</strong> {hasil.waktu}</p>
              <p><strong>Petugas:</strong> {petugas}</p>
            </div>
          )}
          {hasil.tipe === "sudah" && (
            <div className="hasil-sudah">
              <p>⚠️ Kupon sudah digunakan!</p>
              <p><strong>Nama:</strong> {hasil.warga.nama}</p>
              <p><strong>Waktu scan:</strong> {hasil.warga.waktuScan}</p>
              <p><strong>Petugas:</strong> {hasil.warga.petugasScan}</p>
            </div>
          )}
          {hasil.tipe === "tidakAda" && (
            <div className="hasil-error">
              <p>❌ Kupon tidak terdaftar!</p>
              <p><strong>ID:</strong> {hasil.id}</p>
            </div>
          )}
          <button onClick={() => setHasil(null)}>Pindai Berikutnya</button>
        </div>
      )}
    </div>
  );
}

export default Scanner;