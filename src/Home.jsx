import React from 'react';
import Header from './Components/Header';
const Home = () => {
  return (
    <>
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">مرحباً بكم في WashyWay</h1>
        <p className="text-lg text-gray-700 mt-2">أفضل خدمة غسيل السيارات في الخرج </p>
      </header>
      <section className="bg-white shadow-lg rounded-lg p-6 mb-6 w-3/4">
        <h2 className="text-2xl font-semibold text-gray-800">للمستخدمين</h2>
        <p className="text-gray-600 mt-2">استمتعوا بخدماتنا السريعة والموثوقة لغسيل السيارات.</p>
      </section>
      <section className="bg-white shadow-lg rounded-lg p-6 w-3/4">
        <h2 className="text-2xl font-semibold text-gray-800">للمغاسل</h2>
        <p className="text-gray-600 mt-2">انضموا إلينا لتقديم خدماتكم لأكبر عدد من العملاء.</p>
      </section>
    </div>
    </>
  );
};

export default Home;