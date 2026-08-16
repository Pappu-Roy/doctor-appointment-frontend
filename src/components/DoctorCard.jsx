export default function DoctorCard({ doctor }) {
  return (
    <div className="doctor-card">
      <div className="doctor-card__header">
        <h3>{doctor.user?.name || "নাম নেই"}</h3>
        <span className="doctor-card__specialty">{doctor.specialty}</span>
      </div>

      <div className="doctor-card__meta">
        <span>{doctor.experience} বছর অভিজ্ঞতা</span>
        {doctor.location && <span>{doctor.location}</span>}
      </div>

      {doctor.bio && <p className="doctor-card__bio">{doctor.bio}</p>}

      <div className="doctor-card__footer">
        <span className="doctor-card__fee">৳ {doctor.fee}</span>
        <button type="button">অ্যাপয়েন্টমেন্ট দেখুন</button>
      </div>
    </div>
  );
}