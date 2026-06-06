import { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, onValue, set } from "firebase/database";
import "./App.css";
import Dashboard from "./components/Dashboard";
import DaftarPenerima from "./components/DaftarPenerima";
import Scanner from "./components/Scanner";
import KuponCard from "./components/KuponCard";
import dataPenerima from "./data/penerima";

function App() {
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "penerima",  label: "👥 Penerima"  },
    { id: "scanner",   label: "📷 Scanner"   },
    { id: "kupon",     label: "🎫 Kupon"     },
  ];

  // AMBIL DATA DARI FIREBASE
  useEffect(() => {
    const dbRef = ref(db, "penerima");
    onValue(dbRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setData(Object.values(val));
      } else {
        // Kalau database kosong, isi dengan data awal
        const obj = {};
        dataPenerima.forEach((w) => { obj[w.id] = w; });
        set(ref(db, "penerima"), obj);
        setData(dataPenerima);
      }
      setLoading(false);
    });
  }, []);

  // SIMPAN DATA KE FIREBASE
  const updateData = (newData) => {
    const obj = {};
    newData.forEach((w) => { obj[w.id] = w; });
    set(ref(db, "penerima"), obj);
    setData(newData);
  };

  if (loading) {
    return (
      <div className="app" style={{ textAlign: "center", padding: 40 }}>
        <p>⏳ Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="app">

      {/* HEADER */}
      <div className="header">
        <h1>🐄 Kupon Qurban Digital</h1>
        <p>Masjid Taqwa Muhammadiyah Aek Kanopan Timur · Idul Adha 1446 H</p>
      </div>

      {/* NAVIGASI TAB */}
      <div className="tabs">
        {navItems.map((nav) => (
          <button
            key={nav.id}
            className={tab === nav.id ? "aktif" : ""}
            onClick={() => setTab(nav.id)}
          >
            {nav.label}
          </button>
        ))}
      </div>

      {/* ISI HALAMAN */}
      <div className="content">
        {tab === "dashboard" && <Dashboard data={data} />}
        {tab === "penerima"  && <DaftarPenerima data={data} setData={updateData} />}
        {tab === "scanner"   && <Scanner data={data} setData={updateData} />}
        {tab === "kupon"     && <KuponCard data={data} />}
      </div>

    </div>
  );
}

export default App;