const API_URL = import.meta.env.VITE_API_URL;

export async function fetchStatus() {
  const res = await fetch(`${API_URL}/status`);
  if (!res.ok) throw new Error("Failed to fetch status");
  return res.json();
}

export async function fetchDevices() {
  const res = await fetch(`${API_URL}/devices`);
  if (!res.ok) throw new Error("Failed to fetch devices");
  return res.json();
}

export async function startDevice(device_id, role) {
  const res = await fetch(
    `${API_URL}/start?device_id=${device_id}`,
    {
      method: "POST",
      headers: {
        "x-role": role,
      },
    }
  );

  if (!res.ok) throw new Error("Start failed");
  return res.json();
}

export async function stopDevice(device_id, role) {
  const res = await fetch(
    `${API_URL}/stop?device_id=${device_id}`,
    {
      method: "POST",
      headers: {
        "x-role": role,
      },
    }
  );

  if (!res.ok) throw new Error("Stop failed");
  return res.json();
}