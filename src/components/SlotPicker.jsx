import { useState, useEffect } from 'react';
import api from '../services/api';

const SlotPicker = ({ doctorId, onSlotSelect }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    // ডেট সিলেক্ট করলে API কল করে স্লট আনবে
    useEffect(() => {
        if (selectedDate) {
            setLoading(true);
            api.get(`/doctors/${doctorId}/slots?date=${selectedDate}`) //[cite: 1]
                .then(res => setSlots(res.data.slots))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [selectedDate, doctorId]);

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">অ্যপয়েন্টমেন্ট স্লট বেছে নিন</h3>
            
            {/* Date Input - Mobile Friendly */}
            <input 
                type="date" 
                className="w-full p-3 mb-6 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
            />

            {/* Slots Grid */}
            {loading ? (
                <div className="text-center text-gray-500 py-4">স্লট খোঁজা হচ্ছে...</div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {slots.length > 0 ? slots.map((slot, idx) => {
                        // ফ্রন্টএন্ডে ইউজারের লোকাল টাইমজোনে কনভার্ট করে দেখানো হবে[cite: 1]
                        const localTime = new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        return (
                            <button 
                                key={idx}
                                onClick={() => onSlotSelect(slot)}
                                className="py-2 px-3 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
                            >
                                {localTime}
                            </button>
                        )
                    }) : selectedDate && (
                        <div className="col-span-full text-center text-red-500 text-sm py-4">এই দিনে কোনো স্লট ফাঁকা নেই।</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SlotPicker;