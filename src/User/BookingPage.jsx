// src/components/Laundries.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function BookingsPage() {
    const [laundries, setLaundries] = useState([]);

    useEffect(() => {
        const fetchLaundries = async () => {
            const { data, error } = await supabase
                .from('laundries')  // اسم الجدول في قاعدة البيانات
                .select('*');        // جلب جميع الأعمدة من جدول المغاسل

            if (error) {
                console.error('Error fetching laundries:', error);
            } else {
                setLaundries(data);
            }
        };

        fetchLaundries();
    }, []);

    return (
        <div>
            <h1>المغاسل المتاحة</h1>
            <ul>
                {laundries.map((laundry) => (
                    <li key={laundry.id}>
                        {laundry.name} - {laundry.location}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BookingsPage;
