import { useAuth } from "../context/AuthContext";

export default function DeviceCard({ device, onCommand, loading }) {
  const { role } = useAuth();

  return (
    <div className="card device-card">
      <div className="device-left">
        <h3>{device.name}</h3>
        <span className={`status ${device.status.toLowerCase()}`}>
          {device.status}
        </span>
      </div>

      {role === "operator" && (
        <div className="device-controls">
          <button
            disabled={device.status === "ON" || loading}
            onClick={() => onCommand(device.id, "start")}
          >
            {loading && device.status !== "ON" ? "…" : "Start"}
          </button>
          <button
            className="secondary"
            disabled={device.status === "OFF" || loading}
            onClick={() => onCommand(device.id, "stop")}
          >
            {loading && device.status !== "OFF" ? "…" : "Stop"}
          </button>
        </div>
      )}
    </div>
  );
}
