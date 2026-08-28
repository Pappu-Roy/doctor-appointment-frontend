import { useState, useEffect } from 'react';
import api from '../services/api'; // আপনার তৈরি করা axios instance

const PatientDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            // ইউজারের সব বুকিং ডেটা ব্যাকএন্ড থেকে আনছি
            const res = await api.get('/appointments/my'); 
            setAppointments(res.data.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("আপনি কি নিশ্চিত যে বুকিং বাতিল করতে চান?")) return;
        
        try {
            await api.patch(`/appointments/${id}/status`, { status: 'CANCELLED' });
            alert("বুকিং বাতিল করা হয়েছে!");
            fetchAppointments(); // লিস্ট রিফ্রেশ করার জন্য আবার কল করা
        } catch (error) {
            alert("কিছু একটা ভুল হয়েছে।");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">আমার অ্যাপয়েন্টমেন্টসমূহ</h2>
            
            {loading ? (
                <p className="text-center text-gray-500">লোড হচ্ছে...</p>
            ) : appointments.length === 0 ? (
                <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-100">
                    <p className="text-gray-500">আপনার কোনো অ্যাপয়েন্টমেন্ট নেই।</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {appointments.map((app) => (
                        <div key={app.id} className="bg-white p-4 md:p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    ডাঃ {app.doctor.user.name}
                                </h3>
                                <p className="text-sm text-gray-500">{app.doctor.specialty}</p>
                                <p className="text-sm text-blue-600 mt-2 font-medium">
                                    {new Date(app.startTime).toLocaleString('bn-BD', { 
                                        dateStyle: 'medium', 
                                        timeStyle: 'short' 
                                    })}
                                </p>
                            </div>
                            
                            <div className="mt-4 md:mt-0 flex flex-col items-end gap-2 w-full md:w-auto">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                                    app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    app.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                    app.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {app.status}
                                </span>
                                
                                {app.status === 'PENDING' && (
                                    <button 
                                        onClick={() => handleCancel(app.id)}
                                        className="text-sm text-red-500 hover:text-red-700 underline mt-2"
                                    >
                                        বাতিল করুন
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;