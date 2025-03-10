import { Car, Droplets, Shield, Star, Clock, Check, ArrowRight } from 'lucide-react'


function Services() {
  const mainServices = [
    {
      title: "غسيل خارجي متكامل",
      description: "تنظيف دقيق للسيارة من الخارج باستخدام مواد صديقة للبيئة.",
      icon: <Car className="h-10 w-10 text-blue-500" />,
      features: ["تنظيف الهيكل", "غسيل الإطارات", "تنظيف الزجاج", "تلميع المرايا"]
    },
    {
      title: "تنظيف داخلي فاخر",
      description: "إزالة الأوساخ وتنظيف المقاعد والسجاد والعناية بكل التفاصيل الداخلية.",
      icon: <Droplets className="h-10 w-10 text-blue-500" />,
      features: ["تنظيف المقاعد", "تنظيف السجاد", "تعقيم الداخلية", "إزالة الروائح"]
    },
    {
      title: "تلميع وحماية",
      description: "تلميع الهيكل والزجاج وإضافة طبقة حماية للحفاظ على بريق السيارة.",
      icon: <Shield className="h-10 w-10 text-blue-500" />,
      features: ["تلميع الهيكل", "طبقة حماية", "تلميع الزجاج", "حماية من الأشعة فوق البنفسجية"]
    },
  ];

  const packages = [
    {
      name: "الباقة الأساسية",
      price: "99",
      features: [
        "غسيل خارجي",
        "تنظيف الإطارات",
        "تنظيف الزجاج",
        "تلميع سريع"
      ],
      popular: false,
      color: "blue"
    },
    {
      name: "الباقة المميزة",
      price: "199",
      features: [
        "غسيل خارجي متكامل",
        "تنظيف داخلي",
        "تلميع الهيكل",
        "تعطير الداخلية",
        "تنظيف المحرك"
      ],
      popular: true,
      color: "purple"
    },
    {
      name: "الباقة الفاخرة",
      price: "299",
      features: [
        "غسيل خارجي متكامل",
        "تنظيف داخلي فاخر",
        "تلميع وحماية",
        "تعطير الداخلية",
        "تنظيف المحرك",
        "تلميع الإطارات",
        "خدمة التوصيل"
      ],
      popular: false,
      color: "blue"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow" dir="rtl">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              خدمات WashyWay
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              نقدم لك أفضل تجربة غسيل سيارات أينما كنت، بجودة عالية واحترافية.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition">
                احجز الآن
              </button>
              <button className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition">
                تعرف على المزيد
              </button>
            </div>
          </div>
        </section>

        {/* Main Services */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">خدماتنا الرئيسية</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">نقدم مجموعة متكاملة من خدمات غسيل وتنظيف السيارات بأعلى معايير الجودة</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {mainServices.map((service, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-md border-t-4 border-blue-500 transform transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">كيف تعمل خدماتنا</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">عملية بسيطة وسهلة للحصول على خدمة غسيل سيارات مميزة</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { title: "احجز موعد", icon: <Clock className="h-10 w-10 text-blue-500" />, description: "اختر الخدمة والوقت المناسب لك" },
                { title: "تأكيد الحجز", icon: <Check className="h-10 w-10 text-blue-500" />, description: "سنؤكد حجزك ونرسل لك تفاصيل الموعد" },
                { title: "تقديم الخدمة", icon: <Car className="h-10 w-10 text-blue-500" />, description: "سيقوم فريقنا بتقديم الخدمة بأعلى جودة" },
                { title: "استلم سيارتك", icon: <Star className="h-10 w-10 text-blue-500" />, description: "استلم سيارتك نظيفة ولامعة" }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {step.icon}
                    </div>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-blue-200">
                        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
                          <ArrowRight className="h-6 w-6 text-blue-300" />
                        </div>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

       
         

        {/* CTA */}
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">جاهز لتجربة خدماتنا؟</h2>
          
          </div>
        </section>
      </main>
      
    </div>
  )
}

export default Services
