import api from "./api";

// Kept separate from the component on purpose: DoctorList.jsx shouldn't
// need to know axios exists, it just calls getDoctors(filters) and gets
// data back. If we ever swap axios for fetch(), only this file changes.
export async function getDoctors({ page = 1, limit = 10, specialty = "", location = "" } = {}) {
  const response = await api.get("/doctors", {
    params: { page, limit, specialty: specialty || undefined, location: location || undefined },
  });
  return response.data; // { success, message, data: [...], pagination: {...} }
}