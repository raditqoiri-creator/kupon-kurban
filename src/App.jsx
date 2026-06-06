import { useState } from "react";
import "./App.css";
import Dashboard     from "./components/Dashboard";
import DaftarPenerima from "./components/DaftarPenerima";
import Scanner       from "./components/Scanner";
import KuponCard     from "./components/KuponCard";
import dataPenerima  from "./data/penerima";

function App() {
  const [tab, setTab]   = useState("dashboard");
  const [data, setData] = useState(dataPenerima);

  const navItems = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "penerima",  label: "👥 Penerima"  },
    { id: "scanner",   label: "📷 Scanner"   },
    { id: "kupon",     label: "🎫 Kupon"     },
  ];

  return (
    <div className="app">

      {/* HEADER */}
      <div className="header">
        <h1>🐄 Kupon Kurban Digital</h1>
        <p>Masjid Al-Ikhlas · Idul Adha 1446 H</p>
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
        {tab === "penerima"  && <DaftarPenerima data={data} setData={setData} />}
        {tab === "scanner"   && <Scanner data={data} setData={setData} />}
        {tab === "kupon"     && <KuponCard data={data} />}
      </div>

    </div>
  );
}

export default App;