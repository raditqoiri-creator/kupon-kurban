import { useState } from "react";

function DaftarPenerima({ data, setData }) {
  const [cari, setCari] = useState("");
  const [filter, setFilter] = useState("");

  const handleTambah = () => {
    const nama   = prompt("Nama warga:");
    const alamat = prompt("Alamat:");
    const noHp   = prompt("No HP (WhatsApp):");

    if (!nama || !alamat) return;

    // ✅ Pakai backtick, bukan kutip biasa
    const id = `KRB-1446-RT01-${String(data.length + 1).padStart(4, "0")}`;

    const wargaBaru = {
      id,
      nama,
      alamat,
      noHp   : noHp || "-",
      paket  : 1,
      status : "belum",
      waktuScan   : null,
      petugasScan : null,
    };

    setData([...data, wargaBaru]);
  };

  const handleHapus = (id) => {
    if (!window.confirm(`Hapus kupon ${id}?`)) return;
    setData(data.filter((w) => w.id !== id));
  };

  // Filter + pencarian
  const tampil = data.filter((w) => {
    const cocokCari = w.nama.toLowerCase().includes(cari.toLowerCase()) ||
                      w.id.toLowerCase().includes(cari.toLowerCase());
    const cocokFilter = filter === "" || w.status === filter;
    return cocokCari && cocokFilter;
  });

  return (
    <div>
      <h2>👥 Daftar Penerima</h2>

      <button onClick={handleTambah}>+ Tambah Penerima</button>

      {/* Pencarian & Filter */}
      <div style={{ display: "flex", gap: "8px", margin: "12px 0" }}>
        <input
          type="search"
          placeholder="🔍 Cari nama atau ID..."
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          style={{ flex: 1 }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "10px", border: "1.5px solid #e0e0e0",
            borderRadius: "10px", fontSize: "13px", background: "white"
          }}
        >
          <option value="">Semua</option>
          <option value="belum">Belum</option>
          <option value="sudah">Sudah</option>
        </select>
      </div>

      <p style={{ fontSize: "13px", color: "#888", marginBottom: "10px" }}>
        Menampilkan {tampil.length} dari {data.length} warga
      </p>

      {tampil.length === 0 && (
        <p style={{ textAlign: "center", color: "#aaa", padding: "30px 0" }}>
          Tidak ada data.
        </p>
      )}

      {tampil.map((w) => (
        <div key={w.id} className="warga-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p><strong>{w.nama}</strong></p>
              <p style={{ fontSize: "11px", color: "#888", fontFamily: "monospace" }}>{w.id}</p>
            </div>
            <span className={w.status === "sudah" ? "badge-sudah" : "badge-belum"}>
              {w.status === "sudah" ? "✅ Sudah" : "⬜ Belum"}
            </span>
          </div>
          <p>📍 {w.alamat}</p>
          <p>📱 {w.noHp}</p>
          {w.status === "sudah" && (
            <p style={{ fontSize: "12px", color: "#856404" }}>
              🕐 Diambil: {w.waktuScan || "-"}
            </p>
          )}
          <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
            <button
              onClick={() => handleHapus(w.id)}
              style={{ fontSize: "12px", padding: "6px 10px", background: "#e74c3c" }}
            >
              🗑️ Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DaftarPenerima;