import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Dashboard({ data }) {
  const total = data.length;
  const sudah = data.filter((w) => w.status === "sudah").length;
  const belum = data.filter((w) => w.status === "belum").length;
  const persen = total ? Math.round((sudah / total) * 100) : 0;

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("LAPORAN DISTRIBUSI DAGING QURBAN", 14, 20);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Masjid Taqwa Muhammadiyah Aek Kanopan Timur", 14, 28);
    doc.text("Idul Adha 1446 H", 14, 34);
    doc.text("Tanggal: " + new Date().toLocaleDateString("id-ID"), 14, 40);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Ringkasan:", 14, 52);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Total Penerima : " + total + " warga", 14, 60);
    doc.text("Sudah Diambil  : " + sudah + " warga", 14, 67);
    doc.text("Belum Diambil  : " + belum + " warga", 14, 74);
    doc.text("Progress       : " + persen + "%", 14, 81);
    autoTable(doc, {
      startY: 90,
      head: [["No", "Nama", "Alamat", "ID Kupon", "Status", "Waktu"]],
      body: data.map((w, i) => [
        i + 1,
        w.nama,
        w.alamat,
        w.id,
        w.status === "sudah" ? "Sudah Diambil" : "Belum Diambil",
        w.waktuScan || "-",
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [26, 107, 58] },
    });
    doc.save("laporan-qurban-1446H.pdf");
  };

  return (
    <div>
      <h2>📊 Dashboard</h2>
      <div className="stats">
        <div className="stat-card">
          <h3>{total}</h3>
          <p>Total Penerima</p>
        </div>
        <div className="stat-card">
          <h3>{sudah}</h3>
          <p>Sudah Diambil</p>
        </div>
        <div className="stat-card">
          <h3>{belum}</h3>
          <p>Belum Diambil</p>
        </div>
      </div>
      <div className="progress-wrap">
        <p>Progress: <strong>{persen}%</strong></p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: persen + "%" }} />
        </div>
      </div>
      <button onClick={exportPDF} style={{ background: "#c0392b", marginBottom: 16 }}>
        📄 Export Laporan PDF
      </button>
      <h3>Aktivitas Terakhir</h3>
      {sudah === 0 ? (
        <p>Belum ada distribusi</p>
      ) : (
        data.filter((w) => w.status === "sudah").map((w) => (
          <div key={w.id} className="aktivitas-card">
            <p><strong>{w.nama}</strong></p>
            <p>{w.alamat}</p>
            <p>🕐 {w.waktuScan}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;