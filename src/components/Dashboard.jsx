function Dashboard({ data }) {
  const total  = data.length;
  const sudah  = data.filter((w) => w.status === "sudah").length;
  const belum  = data.filter((w) => w.status === "belum").length;
  const persen = total ? Math.round((sudah / total) * 100) : 0;

  const aktivitas = data
    .filter((w) => w.status === "sudah")
    .sort((a, b) => new Date(b.waktuScan) - new Date(a.waktuScan))
    .slice(0, 5);

  return (
    <div>
      <h2>📊 Dashboard</h2>

      {/* STATISTIK */}
      <div className="stats">
        <div className="stat-card">
          <h3 style={{ color: "#1a6b3a" }}>{total}</h3>
          <p>Total Penerima</p>
        </div>
        <div className="stat-card">
          <h3 style={{ color: "#856404" }}>{sudah}</h3>
          <p>Sudah Diambil</p>
        </div>
        <div className="stat-card">
          <h3 style={{ color: "#1a6b3a" }}>{belum}</h3>
          <p>Belum Diambil</p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="progress-wrap">
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
          <span>Progress Distribusi</span>
          <strong style={{ color: "#1a6b3a" }}>{persen}%</strong>
        </div>
        <div className="progress-bar">
          {/* ✅ Backtick — ini fix utamanya */}
          <div className="progress-fill" style={{ width: `${persen}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#aaa", marginTop: 4 }}>
          <span>{sudah} sudah diambil</span>
          <span>{belum} belum diambil</span>
        </div>
      </div>

      {/* INFO KOSONG */}
      {total === 0 && (
        <div style={{
          background: "#f0faf4", border: "1px dashed #a8d5b5",
          borderRadius: 12, padding: "20px", textAlign: "center",
          fontSize: 13, color: "#888", marginBottom: 16,
        }}>
          <p style={{ fontSize: 28, marginBottom: 8 }}>🐄</p>
          <p>Belum ada penerima terdaftar.</p>
          <p>Tambahkan di tab <strong>Penerima</strong>.</p>
        </div>
      )}

      {/* AKTIVITAS TERAKHIR */}
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "#444", marginBottom: 10 }}>
        🕐 Aktivitas Terakhir
      </h3>

      {aktivitas.length === 0 ? (
        <div className="aktivitas-card" style={{ textAlign: "center", color: "#aaa" }}>
          <p>Belum ada distribusi daging.</p>
        </div>
      ) : (
        aktivitas.map((w) => (
          <div key={w.id} className="aktivitas-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p><strong>{w.nama}</strong></p>
                <p style={{ fontSize: 12, color: "#555" }}>📍 {w.alamat}</p>
                <p style={{ fontSize: 12, color: "#888" }}>🆔 {w.id}</p>
              </div>
              <span className="badge-sudah">✅ Diambil</span>
            </div>
            <p style={{ fontSize: 11, color: "#856404", marginTop: 6 }}>
              🕐 {w.waktuScan} &bull; 👮 {w.petugasScan || "Panitia"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;