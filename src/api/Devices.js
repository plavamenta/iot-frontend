
// Fake 
let devices = [
  { id: 1, name: "Kamera", status: "ON" },
  { id: 2, name: "Pokretna traka", status: "OFF" },
  { id: 3, name: "Senzor pokreta", status: "OFF" },
];

let wasteStats = { plastic: 12, metal: 5, paper: 20 };

// Exported functions
export async function fetchStatus() {
  await new Promise((res) => setTimeout(res, 200)); // simulate network delay
  return { devices, wasteStats };
}

export async function startDevice(id) {
  await new Promise((res) => setTimeout(res, 200));
  devices = devices.map((d) => (d.id === id ? { ...d, status: "ON" } : d));
}

export async function stopDevice(id) {
  await new Promise((res) => setTimeout(res, 200));
  devices = devices.map((d) => (d.id === id ? { ...d, status: "OFF" } : d));
}
