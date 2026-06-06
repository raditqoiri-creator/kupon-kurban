import { useEffect, useRef } from "react";

function QRKupon({ kupon }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof QRCode === "undefined") return;
    ref.current.innerHTML = "";
    new QRCode(ref.current, {
      text: kupon.id + "|" + kupon.nama + "|Paket" + kupon.paket,
      width: 100,
      height: 100,
      colorDark: "#0f4a28",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M,
    });
  }, [kupon.id]);

  function downloadQR() {
    if (!ref.current) return;
    const canvas = ref.current.querySelector("canvas");
    if (!canvas) { alert("QR belum siap."); return; }
    const pad = 20;
    const out = document.createElement("canvas");
    out.width = canvas.width + pad * 2;
    out.height = canvas.height + pad * 2 + 44;
    const ctx = out.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(canvas, pad, pad);
    ctx.fillStyle = "#0f4a28";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText(kupon.id, out.width / 2, canvas.height + pad + 18);
    ctx.fillStyle = "#555555";
    ctx.font = "11px sans-serif";
    ctx.fillText(kupon.nama, out.width / 2, canvas.height + pad + 34);
    const a = document.createElement("a");
    a.download = "QR-" + kupon.id + ".png";
    a.href = out.toDataURL("image/png");
    a.click();
  }

  const wrapStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  };

  const kotak = {
    background: "white",
    padding: 6,
    borderRadius: 10,
    width: 112,
    height: 112,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const btnStyle = {
    fontSize: 11,
    padding: "4px 12px",
    marginBottom: 0,
    background: "#f0c94d",
    color: "#0f4a28",
    border: "none",
    borderRadius: 99,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "none",
  };

  return (
    <div style={wrapStyle}>
      <div ref={ref} style={kotak} />
      <button onClick={downloadQR} style={btnStyle}>
        Simpan QR
      </button>
    </div>
  );
}

function buatURLWA(w) {
  var no = (w.noHp || "").replace(/\D/g, "");
  if (no.charAt(0) === "0") { no = "62" + no.slice(1); }
  if (no.slice(0, 2) !== "62") { no = "62" + no; }
  var p = "Kupon Qurban Digital\n";
  p += "Masjid Taqwa Muhammadiyah Aek Kanopan Timur - 1446 H\n\n";
  p += "Nama: " + w.nama + "\n";
  p += "Alamat: " + w.alamat + "\n";
  p += "ID Kupon: " + w.id + "\n";
  p += "Paket: " + w.paket + " paket daging\n";
  p += "Lokasi: Halaman Masjid\n";
  p += "Waktu: 06.00 - 12.00 WIB\n\n";
  p += "Tunjukkan ID atau QR Code saat pengambilan.\n";
  p += "Jazakallahu khairan";
  return "https://wa.me/" + no + "?text=" + encodeURIComponent(p);
}

const cardStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 8,
};

const waStyle = {
  background: "#25D366",
  color: "white",
  padding: "5px 14px",
  borderRadius: 99,
  fontSize: 12,
  fontWeight: 600,
  textDecoration: "none",
};

const waktuStyle = {
  fontSize: 11,
  color: "#f0c94d",
};

const idStyle = {
  fontFamily: "monospace",
  fontSize: 11,
  opacity: 0.6,
  marginTop: 6,
};

const bodyStyle = {
  display: "flex",
  gap: 12,
  alignItems: "flex-start",
};

function KuponCard(props) {
  const data = props.data;

  if (!data || data.length === 0) {
    return (
      <div>
        <h2>Kupon Penerima</h2>
        <p style={{ textAlign: "center", color: "#aaa", padding: "30px 0", fontSize: 13 }}>
          Belum ada penerima. Tambahkan di tab Penerima.
        </p>
      </div>
    );
  }

  const items = data.map(function(w) {
    const urlWA = buatURLWA(w);
    const badgeClass = w.status === "sudah" ? "badge-sudah" : "badge-belum";
    const badgeText = w.status === "sudah" ? "Sudah Diambil" : "Belum Diambil";
    const tampilWA = w.noHp && w.status !== "sudah";
    const tampilWaktu = w.status === "sudah";

    return (
      <div key={w.id} className="kupon-card">
        <div className="kupon-header">
          <h3>Kupon Qurban Digital</h3>
          <p>Masjid Taqwa Muhammadiyah Aek Kanopan Timur - 1446 H</p>
        </div>

        <div className="kupon-body" style={bodyStyle}>
          <div style={{ flex: 1 }}>
            <p><strong>Nama:</strong> {w.nama}</p>
            <p><strong>Alamat:</strong> {w.alamat}</p>
            <p><strong>No HP:</strong> {w.noHp || "-"}</p>
            <p><strong>Paket:</strong> {w.paket} paket daging</p>
            <p><strong>Lokasi:</strong> Halaman Masjid</p>
            <p><strong>Waktu:</strong> 06.00 - 12.00 WIB</p>
            <p style={idStyle}>{w.id}</p>
          </div>
          <QRKupon kupon={w} />
        </div>

        <div className="kupon-footer" style={cardStyle}>
          <span className={badgeClass}>{badgeText}</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {tampilWA ? <a href={urlWA} target="_blank" rel="noreferrer" style={waStyle}>Kirim WA</a> : null}
            {tampilWaktu ? <span style={waktuStyle}>{w.waktuScan || "-"}</span> : null}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div>
      <h2>Kupon Penerima</h2>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>
        Total {data.length} kupon
      </p>
      {items}
    </div>
  );
}

export default KuponCard;