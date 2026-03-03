import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  fetchStatus,
  fetchDevices,
  startDevice,
  stopDevice,
} from "../api/Devices";

export default function Dashboard() {
  const { role, logout } = useAuth();

  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState({
    paper: 0,
    plastic: 0,
    glass: 0,
  });
  const [loadingDevice, setLoadingDevice] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [connected, setConnected] = useState(true);

  const wasteData = [
    { type: "paper", label: "Papir", icon: "🧃", color: "#3498db" },
    { type: "plastic", label: "Plastika", icon: "🧋", color: "#f1c40f" },
    { type: "glass", label: "Staklo", icon: "🍷", color: "#e74c3c" },
  ];

  // ucitavanje
  useEffect(() => {
    const load = async () => {
      try {
        const [statusData, devicesData] = await Promise.all([
          fetchStatus(),
          fetchDevices(),
        ]);

        setStats({
          paper: statusData.counts?.cardboard || 0,
          plastic: statusData.counts?.plastic || 0,
          glass: statusData.counts?.glass || 0,
        });

        setDevices(Array.isArray(devicesData) ? devicesData : []);
        setConnected(true);
      } catch (err) {
        console.error("LOAD ERROR:", err);
        setConnected(false);
      } finally {
        setInitialLoading(false);
      }
    };

    load();
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, []);

  const handleCommand = async (device_id, action) => {
    const device = devices.find((d) => d.device_id === device_id);
    if (!device) return;

    if (device.connection_state !== "Connected") return;

 
    if (action === "start" && device.recognition_running) return;

    
    if (action === "stop" && !device.recognition_running) return;

    setLoadingDevice(device_id);

    try {
      if (action === "start") {
        await startDevice(device_id, role);
      } else {
        await stopDevice(device_id, role);
      }

      const updatedDevices = await fetchDevices();
      setDevices(Array.isArray(updatedDevices) ? updatedDevices : []);
    } catch (error) {
      console.error("Command failed:", error);
    } finally {
      setLoadingDevice(null);
    }
  };
const sortedDevices = [...devices].sort((a, b) => {
  const getPriority = (device) => {
    if (device.connection_state !== "Connected") return 2;
    return 1;
  };

  const priorityDiff = getPriority(a) - getPriority(b);
  if (priorityDiff !== 0) return priorityDiff;

  return a.device_id.localeCompare(b.device_id);
});
  return (
    <div className="dashboard-page">
      {/* heder */}
      <div className="top-header-cloud">
        <h2 className="dash_title">Razvrstavanje otpada</h2>

        <div className="header-controls">
          <div className="status-indicator">
            <span className={`dot ${connected ? "on" : "off"}`} />
          </div>

          <button className="logout-btn" onClick={logout}>
            Odjavi se
          </button>
        </div>
      </div>

      {initialLoading && (
        <div style={{ textAlign: "center", marginTop: "20px", color: "white" }}>
          Učitavanje podataka...
        </div>
      )}

      <div className="main-split-content">
        {/* posmatrac panel*/}
        <div className="viewer-section">
          <div className="waste-grid">
            {wasteData.map((item) => (
              <div key={item.type} className="waste-stack">
                <div className="white-square icon-box">
                  <span className="large-emoji">{item.icon}</span>
                  <span className="label-text">{item.label}</span>
                </div>

                <div className="white-square counter-box">
                  <strong
                    className="count-number"
                    style={{ color: item.color }}
                  >
                    {stats[item.type] || 0}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* operator panel */}
        {role === "operator" && (
          <div className="admin-side-panel">
            <div className="admin-light-box">
              <h3 className="admin-box-title">Kontrola uređaja</h3>

              <div className="device-list">
                {sortedDevices.map((device) => (
                  <div
                    key={device.device_id}
                    className={`device-pill-row ${
                      device.connection_state !== "Connected" ? "disconnected" : ""
                    }`}
                  >
                    <div className="device-info">
                      <span className="device-status">
                        <span
                          className={`status-dot ${
                            device.connection_state !== "Connected"
                              ? "offline"
                              : device.recognition_running
                              ? "running"
                              : "idle"
                          }`}
                        ></span>
                      </span>

                       <span className="device-name-label">
                        {device.device_id}
                      </span>
                    </div>

                    <div className="pill-buttons">
                      {/* start*/}
                      <button
                        className="btn-pill-start"
                        disabled={
                          loadingDevice === device.device_id ||
                          device.connection_state !== "Connected" ||
                          device.recognition_running === true
                        }
                        onClick={() =>
                          handleCommand(device.device_id, "start")
                        }
                      >
                        {loadingDevice === device.device_id ? "..." : "START"}
                      </button>

                      {/* stop */}
                      <button
                        className="btn-pill-stop"
                        disabled={
                          loadingDevice === device.device_id ||
                          device.connection_state !== "Connected" ||
                          device.recognition_running === false
                        }
                        onClick={() =>
                          handleCommand(device.device_id, "stop")
                        }
                      >
                        {loadingDevice === device.device_id ? "..." : "STOP"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* prikaz ikonice korisnika*/}
      <div className="admin-floating-circle">
        <span className="admin-emoji">
          {role === "operator" ? "👩🏻‍💻" : "👩🏻"}
        </span>
      </div>
    </div>
  );
}