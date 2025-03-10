import { Target, Cpu, Users, Award, Clock, ChevronRight, Zap, Globe, Sparkles, Shield, Star } from "lucide-react"


function About() {
  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-grow" dir="rtl">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">من نحن</h1>
              <p className="text-xl text-blue-100 mb-8">
                WashyWay هي منصة تقنية متكاملة تربط بين أصحاب السيارات ومغاسل السيارات، نسعى لتقديم تجربة سلسة وسهلة
                لغسيل السيارات بأعلى معايير الجودة.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition flex items-center gap-2">
                  <span>تعرف على خدماتنا</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
                  <Target className="h-4 w-4" />
                  <span>رؤيتنا ورسالتنا</span>
                </div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">نحو مستقبل أكثر نظافة وكفاءة</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-2 text-blue-600">رؤيتنا</h3>
                    <p className="text-gray-700">
                      أن نكون المنصة الرائدة في مجال خدمات غسيل السيارات في المملكة العربية السعودية، ونساهم في تحقيق
                      رؤية 2030 من خلال تقديم حلول تقنية مبتكرة.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-2 text-purple-600">رسالتنا</h3>
                    <p className="text-gray-700">
                      تسهيل وتحسين تجربة غسيل السيارات من خلال منصة تقنية متكاملة تربط بين العملاء ومقدمي الخدمة، مع
                      الالتزام بأعلى معايير الجودة والاستدامة.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <img src="https://placehold.co/600x400" alt="رؤية WashyWay" className="rounded-xl shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Vision 2030 Support */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
                <Globe className="h-4 w-4" />
                <span>دعم رؤية 2030</span>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">كيف ندعم رؤية المملكة 2030</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                نساهم في تحقيق رؤية المملكة 2030 من خلال تقديم حلول تقنية مبتكرة في قطاع خدمات السيارات، وتمكين الشباب
                السعودي، ودعم التحول الرقمي.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Cpu className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">التحول الرقمي</h3>
                <p className="text-gray-600">
                  نساهم في التحول الرقمي للمملكة من خلال أتمتة خدمات غسيل السيارات وتقديمها عبر منصة رقمية متكاملة.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Zap className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">تمكين الشباب</h3>
                <p className="text-gray-600">
                  نوفر فرص عمل للشباب السعودي في مجال التقنية وخدمات السيارات، ونساهم في تطوير مهاراتهم وقدراتهم.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">الاستدامة البيئية</h3>
                <p className="text-gray-600">
                  نلتزم باستخدام مواد صديقة للبيئة وتقنيات توفر المياه في عمليات غسيل السيارات، مما يساهم في الحفاظ على
                  البيئة.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 flex justify-center">
                <img src="https://placehold.co/600x400" alt="تقنية WashyWay" className="rounded-xl shadow-lg" />
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
                  <Cpu className="h-4 w-4" />
                  <span>التقنية</span>
                </div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">قوة التقنية في خدمتك</h2>
                <p className="text-gray-700 mb-6">
                  نستخدم أحدث التقنيات لتقديم تجربة سلسة وسهلة لعملائنا ومقدمي الخدمة. من خلال منصتنا المتطورة، يمكن
                  للعملاء حجز خدمات غسيل السيارات بسهولة، ومتابعة حالة الطلب في الوقت الفعلي.
                </p>
                <div className="space-y-4">
                  {[
                    "تطبيق جوال متكامل للعملاء ومقدمي الخدمة",
                    "نظام حجز ذكي يراعي الوقت والموقع",
                    "نظام دفع إلكتروني آمن وسهل",
                    "تقييم وتعليقات للخدمات لضمان الجودة",
                    "تحليلات متقدمة لتحسين الخدمة باستمرار",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 bg-blue-500 rounded-full p-1">
                        <ChevronRight className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-gray-700">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
                <Users className="h-4 w-4" />
                <span>فريقنا</span>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">القائمين على المشروع</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                فريق متميز من الخبراء والمتخصصين في مجال التقنية وخدمات السيارات، يعملون معاً لتقديم أفضل تجربة لعملائنا.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[1, 2].map((person) => (
                <div key={person} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/3 bg-gray-200 aspect-square"></div>
                    <div className="sm:w-2/3 p-6">
                      <h3 className="text-xl font-bold mb-1 text-gray-800">[اسم الشخص]</h3>
                      <p className="text-blue-600 mb-4">[المنصب]</p>
                      <p className="text-gray-600 mb-4">سيتم إضافة نبذة عن الشخص ودوره في المشروع وخبراته السابقة.</p>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                        <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                        <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
                <Award className="h-4 w-4" />
                <span>قيمنا</span>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">قيمنا ومبادئنا</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                نلتزم بمجموعة من القيم والمبادئ التي توجه عملنا وتضمن تقديم أفضل خدمة لعملائنا.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  title: "الجودة",
                  icon: <Award className="h-8 w-8 text-blue-600" />,
                  description: "نلتزم بتقديم خدمات عالية الجودة تلبي توقعات عملائنا وتتجاوزها.",
                },
                {
                  title: "الابتكار",
                  icon: <Sparkles className="h-8 w-8 text-blue-600" />,
                  description: "نسعى دائماً للابتكار وتطوير حلول جديدة تحسن تجربة العملاء.",
                },
                {
                  title: "النزاهة",
                  icon: <Shield className="h-8 w-8 text-blue-600" />,
                  description: "نعمل بشفافية ونزاهة في جميع تعاملاتنا مع العملاء والشركاء.",
                },
                {
                  title: "التميز",
                  icon: <Star className="h-8 w-8 text-blue-600" />,
                  description: "نسعى للتميز في كل ما نقوم به، ونعمل باستمرار على تحسين خدماتنا.",
                },
              ].map((value, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
                <Clock className="h-4 w-4" />
                <span>مسيرتنا</span>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">رحلة WashyWay</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                تعرف على مسيرة WashyWay منذ البداية وحتى الآن، وكيف تطورت خدماتنا لتلبية احتياجات عملائنا.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {[
                {
                  year: "2023",
                  title: "بداية الفكرة",
                  description: "انطلاق فكرة المشروع وإجراء دراسات السوق الأولية.",
                },
                { year: "2024", title: "تأسيس الشركة", description: "تأسيس شركة WashyWay وبناء الفريق الأساسي." },
                {
                  year: "2024",
                  title: "إطلاق النسخة التجريبية",
                  description: "إطلاق النسخة التجريبية من المنصة واختبارها مع مجموعة محدودة من المستخدمين.",
                },
                { year: "2025", title: "التوسع", description: "التوسع في مناطق جديدة وإضافة خدمات متنوعة." },
              ].map((event, index) => (
                <div key={index} className="relative flex items-start pb-12">
                  {index < 3 && <div className="absolute top-0 left-0 ml-[19px] h-full w-0.5 bg-blue-200"></div>}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center z-10">
                    <span className="text-white text-xs font-bold">{event.year.substring(2)}</span>
                  </div>
                  <div className="mr-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">انضم إلينا في رحلتنا</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              سواء كنت عميلاً يبحث عن خدمة غسيل سيارات مميزة، أو مغسلة ترغب في الانضمام إلى شبكتنا، نحن هنا لمساعدتك.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition">
                تواصل معنا
              </button>
              <button className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition">
                تعرف على خدماتنا
              </button>
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}

export default About

