import { useEffect, useRef } from "react";

function QRCode({ value, size = 160 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    import("qrcode").then((QR) => {
      QR.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
      });
    });
  }, [value, size]);

  return <canvas ref={canvasRef} />;
}

function KuponCard({ data }) {
  return (
    <div>
      <h2>🎫 Kupon Penerima</h2>
      <p>Tunjukkan QR Code ini kepada panitia</p>

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
            <QRCode value={w.id} size={160} />
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
        </div>
      ))}
    </div>
  );
}

export default KuponCard;