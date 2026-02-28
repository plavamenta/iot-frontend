import { useEffect, useState } from "react";
import { fetchStatus, startDevice, stopDevice } from "../api/Devices";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { role, logout } = useAuth();
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(true);

  const wasteData = [
    { type: "paper", label: "Papir", icon: "🧃", color: "#3498db" },
    { type: "plastic", label: "Plastika", icon: "🧋", color: "#f1c40f" },
    { type: "metal", label: "Metal", icon: "🥫", color: "#e74c3c" },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchStatus();
        setDevices(data.devices || []);
        setStats(data.wasteStats || {});
        setConnected(true);
      } catch {
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, []);

  const handleCommand = async (id, cmd) => {
    setLoading(true);
    try {
      if (cmd === "start") await startDevice(id);
      else if (cmd === "stop") await stopDevice(id);
      const updated = await fetchStatus();
      setDevices(updated.devices || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      
      {/*NASLOV*/}
      <div className="top-header-cloud">
        <h2 className="dash_title">
          Razvrstavanje otpada 
        </h2>
        <div className="header-controls">
          <div className="status-indicator">
            <span className={`dot ${connected ? "on" : "off"}`} />
          </div>
          <button className="logout-btn" onClick={logout}>Odjavi se</button>
        </div>
      </div>

      <div className="main-split-content">
        {/* VIEWER PANEL */}
        <div className="viewer-section">
          <div className="waste-grid">
            {wasteData.map((item) => (
              <div key={item.type} className="waste-stack">
                <div className="white-square icon-box">
                  <span className="large-emoji">{item.icon}</span>
                  <span className="label-text">{item.label}</span>
                </div>
                <div className="white-square counter-box">
                  <strong className="count-number" style={{ color: item.color }}>
                    {stats[item.type] || 0}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OPERATOR PANEL*/}
        {(role === "operator") && (
          <div className="admin-side-panel">
            <div className="admin-light-box">
              <h3 className="admin-box-title">Kontrola uređaja</h3>
              <div className="device-list">
                {devices.map((device) => (
                  <div key={device.id} className="device-pill-row">
                    <span className="device-name-label">{device.name}</span>
                    <div className="pill-buttons">
                      <button
                        className="btn-pill-start"
                        disabled={device.status === "ON" || loading}
                        onClick={() => handleCommand(device.id, "start")}
                      >
                        ON
                      </button>
                      <button
                        className="btn-pill-stop"
                        disabled={device.status === "OFF" || loading}
                        onClick={() => handleCommand(device.id, "stop")}
                      >
                        OFF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Ko je u pitanju :3 */}
      <div className="admin-floating-circle">
        <span className="admin-emoji">
          {role === "operator"  ? "👩🏻‍💻" : "👩🏻"}
        </span>
      </div>


    </div>
  );
}