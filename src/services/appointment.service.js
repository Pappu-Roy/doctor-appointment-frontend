import api from "./api";

export async function createAppointment({ doctorId, startTime }) {
  const res = await api.post("/appointments", { doctorId, startTime });
  return res.data.data;
}

export async function getMyAppointments({ status, page = 1, limit = 8 } = {}) {
  const res = await api.get("/appointments/my", {
    params: { status: status || undefined, page, limit },
  });
  return res.data; // { data: [...], pagination }
}

export async function updateAppointmentStatus(id, status) {
  const res = await api.patch(`/appointments/${id}/status`, { status });
  return res.data.data;
}