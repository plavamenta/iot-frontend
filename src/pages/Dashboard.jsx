import { useEffect, useState } from "react";
import { fetchStatus, startDevice, stopDevice } from "../api/Devices";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { role, logout } = useAuth();

  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(true);

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

  const wasteTypes = ["paper", "plastic", "metal"];

  return (
    <div className="container">
      {/* Header */}
      <div className="page-header">
        <h2>IoT Dashboard</h2>
        <div className="header-right">
          <span
            className={`status ${connected ? "on" : "off"}`}
            style={{ width: 12, height: 12, borderRadius: "50%" }}
          />
          {connected ? "Connected" : "Disconnected"}
          <span className="role-badge">{role}</span>
          <button className="secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Waste Stats Boxes */}
      <div className="waste-boxes">
        {wasteTypes.map((type) => (
          <div key={type} className="waste-box">
            <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            <strong>{stats[type] || 0}</strong>
          </div>
        ))}
      </div>

      {/* Device Commands below */}
      {role === "operator" && (
        <div className="device-commands">
          {devices.map((device) => (
            <div key={device.id} className="device-command">
              <span>{device.name}</span>
              <button
                disabled={device.status === "ON" || loading}
                onClick={() => handleCommand(device.id, "start")}
              >
                Start
              </button>
              <button
                className="secondary"
                disabled={device.status === "OFF" || loading}
                onClick={() => handleCommand(device.id, "stop")}
              >
                Stop
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
