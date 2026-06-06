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
    readerRef.current = new BrowserQRCodeReader();
    try {
      await readerRef.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, err) => {
          if (result) {
            handleScan(result.getText());
            stopScan();
          }
        }
      );
    } catch (err) {
      console.error("Kamera error:", err);
      setScanning(false);
    }
  };

  const stopScan = () => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    setScanning(false);
  };

  const handleScan = (id) => {
    const idBersih = id.trim().toUpperCase();
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
      <h2>📷 Scanner Kupon</h2>

      <p>Nama Petugas:</p>
      <input
        value={petugas}
        onChange={(e) => setPetugas(e.target.value)}
        placeholder="Nama petugas"
      />

      {/* TOMBOL KAMERA */}
      <div style={{ marginBottom: 10 }}>
        {!scanning ? (
          <button onClick={startScan}>
            📷 Buka Kamera Scanner
          </button>
        ) : (
          <button onClick={stopScan}>
            ❌ Tutup Kamera
          </button>
        )}
      </div>

      {/* VIDEO KAMERA */}
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

      {/* GARIS PEMISAH */}
      <hr style={{ margin: "16px 0" }} />

      {/* INPUT MANUAL */}
      <p>Atau input ID manual:</p>
      <input
        value={inputId}
        onChange={(e) => setInputId(e.target.value.toUpperCase())}
        placeholder="KRB-1446-RT01-0001"
      />
      <button onClick={() => handleScan(inputId)}>
        Verifikasi
      </button>

      {/* HASIL SCAN */}
      {hasil && (
        <div style={{ marginTop: 16 }}>
          {hasil.tipe === "valid" && (
            <div className="hasil-valid">
              <p>✅ VALID — Serahkan Daging!</p>
              <p>Nama: {hasil.warga.nama}</p>
              <p>Alamat: {hasil.warga.alamat}</p>
              <p>Waktu: {hasil.waktu}</p>
            </div>
          )}
          {hasil.tipe === "sudah" && (
            <div className="hasil-sudah">
              <p>⚠️ Kupon sudah digunakan!</p>
              <p>Nama: {hasil.warga.nama}</p>
              <p>Waktu scan: {hasil.warga.waktuScan}</p>
              <p>Petugas: {hasil.warga.petugasScan}</p>
            </div>
          )}
          {hasil.tipe === "tidakAda" && (
            <div className="hasil-error">
              <p>❌ Kupon tidak terdaftar!</p>
              <p>ID: {hasil.id}</p>
            </div>
          )}
          <button onClick={() => setHasil(null)}>
            Scan Berikutnya
          </button>
        </div>
      )}
    </div>
  );
}

export default Scanner;