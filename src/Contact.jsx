import { useState } from 'react'
import { MapPin, Phone, Mail, Send, Clock, ArrowRight, Construction } from 'lucide-react'


function Contact() {
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow" dir="rtl">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-900 opacity-20"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 rounded-full opacity-20"></div>
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-400 rounded-full opacity-20"></div>
          
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">تواصل معنا</h1>
                <p className="text-xl text-blue-100 mb-8">نحن هنا للإجابة على جميع استفساراتكم ومساعدتكم في كل ما تحتاجون</p>
                
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold">
                  <Construction className="h-5 w-5" />
                  <span>صفحة التواصل قيد التطوير</span>
                </div>
              </div>
              
              <div className="md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-30 rounded-full transform -translate-x-4 translate-y-4"></div>
                  <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl">
                    <div className="text-center mb-6">
                      <Clock className="h-12 w-12 mx-auto mb-2 text-blue-300" />
                      <h2 className="text-2xl font-bold">قريباً</h2>
                      <p className="text-blue-200">نعمل على تجهيز نموذج التواصل</p>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-16 h-1 bg-blue-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Info Preview */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md transform hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">العنوان</h3>
                <p className="text-gray-600 text-center">الخرج، المملكة العربية السعودية</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md transform hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Phone className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">الهاتف</h3>
                <p className="text-gray-600 text-center">+966 123 456 789</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md transform hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">البريد الإلكتروني</h3>
                <p className="text-gray-600 text-center">info@washyway.com</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Coming Soon Form */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">نموذج التواصل</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">قريباً ستتمكن من التواصل معنا مباشرة من خلال هذا النموذج. نحن نعمل على تجهيزه لكم!</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-md relative">
              <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                قريباً
              </div>
              
              <form onSubmit={handleSubmit} className="opacity-60">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">الاسم</label>
                    <input 
                      type="text" 
                      id="name" 
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="أدخل اسمك"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      id="email" 
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="أدخل بريدك الإلكتروني"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-gray-700 mb-2">الموضوع</label>
                  <input 
                    type="text" 
                    id="subject" 
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="أدخل موضوع الرسالة"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 mb-2">الرسالة</label>
                  <textarea 
                    id="message" 
                    rows={5} 
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="اكتب رسالتك هنا..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 w-full md:w-auto"
                >
                  <span>إرسال الرسالة</span>
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </section>
        
        {/* Map Preview */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">موقعنا</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">قريباً ستتمكن من رؤية موقعنا على الخريطة</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-md relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="text-center p-8">
                  <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">خريطة الموقع</h3>
                  <p className="text-gray-600 mb-4">سيتم إضافة خريطة تفاعلية هنا قريباً</p>
                  <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto">
                    <span>الحصول على الاتجاهات</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="aspect-video"></div>
            </div>
          </div>
        </section>
      </main>
      
    </div>
  )
}

export default Contact
