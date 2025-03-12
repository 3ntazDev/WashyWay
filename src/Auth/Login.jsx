// src/Auth/Login.jsx
import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // هنا يمكن إضافة منطق تسجيل الدخول باستخدام Supabase أو أي خدمة أخرى
        console.log('User logged in with:', email, password);
    };

    return (
        <div>
            <h2>تسجيل الدخول</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">تسجيل الدخول</button>
            </form>
        </div>
    );
};

export default Login; // تأكد من تصدير المكون بهذا الشكل
