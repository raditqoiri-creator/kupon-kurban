import { useEffect, useRef } from "react";
import qrcode from "qrcode";

function QRCanvas({ value, size = 160 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    qrcode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
    });
  }, [value, size]);

  return <canvas ref={canvasRef} />;
}

function KuponCard({ data }) {
  const downloadQR = (warga) => {
    const canvas = document.getElementById("qr-" + warga.id);
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "kupon-" + warga.id + ".png";
    a.click();
  };

  const kirimWA = (warga) => {
    const pesan =
      "Assalamualaikum " + warga.nama + ",%0A%0A" +
      "Berikut kupon qurban digital Anda:%0A" +
      "ID Kupon: " + warga.id + "%0A" +
      "Alamat: " + warga.alamat + "%0A%0A" +
      "Tunjukkan QR Code ini kepada panitia pada hari distribusi.%0A" +
      "Waktu: 06.00 - 12.00 WIB%0A" +
      "Lokasi: Halaman Masjid Taqwa Muhammadiyah%0A%0A" +
      "Jazakallahu Khairan.";
    const noHp = warga.noHp.replace(/^0/, "62");
    window.open("https://wa.me/" + noHp + "?text=" + pesan, "_blank");
  };

  return (
    <div>
      <h2>🎫 Kupon Penerima</h2>
      <p>Download atau kirim kupon ke warga via WhatsApp</p>

      {data.length === 0 && <p>Belum ada data penerima</p>}

      {data.map((w) => (
        <div key={w.id} className="kupon-card">
          <div className="kupon-header">
            <h3>🐄 Kupon Qurban</h3>
            <p>Masjid Taqwa Muhammadiyah · 1446 H</p>
          </div>

          <div style={{
            background: "white",
            padding: 12,
            borderRadius: 10,
            display: "inline-block",
            margin: "12px 0"
          }}>
            <canvas id={"qr-" + w.id} ref={(el) => {
              if (!el) return;
              qrcode.toCanvas(el, w.id, { width: 160, margin: 2 });
            }} />
          </div>

          <div className="kupon-body">
            <p><strong>Nama:</strong> {w.nama}</p>
            <p><strong>Alamat:</strong> {w.alamat}</p>
            <p><strong>ID:</strong> {w.id}</p>
            <p><strong>Paket:</strong> {w.paket} paket daging</p>
            <p><strong>Lokasi:</strong> Halaman Masjid</p>
            <p><strong>Waktu:</strong> 06.00 – 12.00 WIB</p>
          </div>

          <div className="kupon-footer">
            <span className={w.status === "sudah" ? "badge-sudah" : "badge-belum"}>
              {w.status === "sudah" ? "✅ Sudah Diambil" : "⬜ Belum Diambil"}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              onClick={() => downloadQR(w)}
              style={{ flex: 1, background: "#1a6b3a", fontSize: 12 }}
            >
              📥 Download QR
            </button>
            <button
              onClick={() => kirimWA(w)}
              style={{ flex: 1, background: "#25D366", fontSize: 12 }}
            >
              📤 Kirim WA
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default KuponCard;