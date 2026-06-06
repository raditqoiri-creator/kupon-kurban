import { useState } from "react";
function Scanner({ data, setData }) {
  const [inputId, setInputId] = useState("");
  const [hasil, setHasil] = useState(null);
  const [petugas, setPetugas] = useState("Panitia 1");

  const handleScan = () => {
    const id = inputId.trim().toUpperCase();
    if (!id) return;

    const warga = data.find((w) => w.id === id);

    if (!warga) {
      setHasil({ tipe: "tidakAda", id });
      return;
    }

    if (warga.status === "sudah") {
      setHasil({ tipe: "sudah", warga });
      return;
    }

    const waktu = new Date().toLocaleString("id-ID");
    setData(data.map((w) =>
      w.id === id
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

      <p>Input ID Kupon:</p>
      <input
        value={inputId}
        onChange={(e) => setInputId(e.target.value.toUpperCase())}
        placeholder="KRB-1446-RT01-0001"
      />
      <button onClick={handleScan}>Verifikasi</button>

      {hasil && (
        <div>
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
            </div>
          )}
          {hasil.tipe === "tidakAda" && (
            <div className="hasil-error">
              <p>❌ Kupon tidak terdaftar!</p>
              <p>ID: {hasil.id}</p>
            </div>
          )}
          <button onClick={() => setHasil(null)}>Scan Berikutnya</button>
        </div>
      )}
    </div>
  );
}

export default Scanner;