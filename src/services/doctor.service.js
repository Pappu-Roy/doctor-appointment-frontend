import api from "./api";

// Component গুলো axios চেনে না — শুধু এই ফাংশনগুলো ডাকে।

export async function getDoctors({ page = 1, limit = 9, specialty = "", location = "" } = {}) {
  const res = await api.get("/doctors", {
    params: { page, limit, specialty: specialty || undefined, location: location || undefined },
  });
  return res.data; // { data: [...], pagination }
}

export async function getDoctorById(id) {
  const res = await api.get(`/doctors/${id}`);
  return res.data.data;
}

export async function getDoctorSlots(id, date) {
  const res = await api.get(`/doctors/${id}/slots`, { params: { date } });
  return res.data.data; // { date, bufferTime, slots: [{startTime,endTime,available}] }
}

// ---- শুধু Doctor এর জন্য ----
export async function getMyDoctorProfile() {
  const res = await api.get("/doctors/me");
  return res.data.data;
}

export async function updateDoctorProfile(id, data) {
  const res = await api.put(`/doctors/${id}`, data);
  return res.data.data;
}

export async function setDoctorAvailability(id, slots) {
  const res = await api.put(`/doctors/${id}/availability`, { slots });
  return res.data.data;
}