import {
  Target,
  Cpu,
  Users,
  Award,
  Clock,
  ChevronRight,
  Zap,
  Globe,
  Sparkles,
  Shield,
  Star,
} from "lucide-react";
import F from "./assets/FahadAlghamdiImg.jpg";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { Users as LucideUsers } from "lucide-react";


function About() {
  const teamMembers = [
    {
      name: "فهد الغامدي",
      role: "المؤسس - مهندس برمجيات ومختبر برمجيات",
      description:
        "مؤسس المشروع، مهندس برمجيات متخصص في تطوير واجهات المستخدم، وضمان الجودة والاختبار الآلي، يسعى لتقديم حلول تقنية مبتكرة.",
      image : F,  
      skills: ["React", "Vite", "اختبار البرمجيات", "تحليل الأنظمة"],
    },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow" dir="rtl">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">من نحن</h1>
              <p className="text-xl text-blue-100 mb-8">
                WashyWay هي منصة تكنولوجية تربط بين أصحاب السيارات ومغاسل
                السيارات. نعمل كوسيط لتقديم تجربة حجز سهلة وآمنة بين المستخدمين
                وأصحاب المغاسل، مع ضمان أعلى معايير الجودة والخدمة.
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
                <h2 className="text-3xl font-bold mb-6 text-gray-800">
                  نحو مستقبل أكثر نظافة وكفاءة
                </h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-2 text-blue-600">
                      رؤيتنا
                    </h3>
                    <p className="text-gray-700">
                      أن نكون المنصة الرائدة في ربط أصحاب السيارات ومغاسل
                      السيارات في المملكة العربية السعودية، لتسهيل وتيسير عملية
                      الحجز بأعلى معايير الجودة.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-2 text-purple-600">
                      رسالتنا
                    </h3>
                    <p className="text-gray-700">
                      تسهيل وتحسين تجربة غسيل السيارات عبر منصة تربط بين العملاء
                      ومغاسل السيارات، مع الالتزام بتقديم حلول مبتكرة وخدمات ذات
                      جودة عالية.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="https://placehold.co/600x400"
                  alt="رؤية WashyWay"
                  className="rounded-xl shadow-lg"
                />
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
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                كيف ندعم رؤية المملكة 2030
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                نساهم في تحقيق رؤية المملكة 2030 من خلال تسهيل وتحسين خدمات غسيل
                السيارات عبر الإنترنت ودعم التحول الرقمي وتقديم فرص عمل للشباب
                السعودي.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Cpu className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  التحول الرقمي
                </h3>
                <p className="text-gray-600">
                  نساهم في التحول الرقمي للمملكة من خلال أتمتة خدمات غسيل
                  السيارات وتقديمها عبر منصة رقمية متكاملة.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Zap className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  تمكين الشباب
                </h3>
                <p className="text-gray-600">
                  نوفر فرص عمل للشباب السعودي في مجال التقنية وخدمات السيارات،
                  ونساهم في تطوير مهاراتهم وقدراتهم.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  الاستدامة البيئية
                </h3>
                <p className="text-gray-600">
                  نلتزم باستخدام مواد صديقة للبيئة وتقنيات توفر المياه في عمليات
                  غسيل السيارات، مما يساهم في الحفاظ على البيئة.
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
                <img
                  src="https://placehold.co/600x400"
                  alt="تقنية WashyWay"
                  className="rounded-xl shadow-lg"
                />
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
                  <Cpu className="h-4 w-4" />
                  <span>التقنية</span>
                </div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">
                  قوة التقنية في خدمتك
                </h2>
                <p className="text-gray-700 mb-6">
                  نستخدم أحدث التقنيات لتقديم تجربة سلسة وسهلة لعملائنا ومقدمي
                  الخدمة. من خلال منصتنا المتطورة، يمكن للعملاء حجز خدمات غسيل
                  السيارات بسهولة، ومتابعة حالة الطلب في الوقت الفعلي.
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
        <section className="py-16 px-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto">
        {/* عنوان القسم */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <LucideUsers className="h-4 w-4" />
            <span>فريقنا</span>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-800">القائمون على المشروع</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            فريق متميز يجمع بين الخبرة والشغف في تقديم حلول برمجية مبتكرة.
          </p>
        </div>

        {/* بطاقات الفريق */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl relative border border-gray-200 backdrop-blur-lg bg-opacity-80"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-20"></div>
              {/* صورة العضو */}
              <div className="flex justify-center pt-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* بيانات العضو */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 font-medium">{member.role}</p>
                <p className="text-gray-600 text-sm mt-2">{member.description}</p>

                {/* المهارات */}
                <div className="mt-4">
                  <span className="text-gray-700 font-semibold">المهارات:</span>
                  <span className="text-gray-600 text-sm ml-2">
                    {member.skills.join(" • ")}
                  </span>
                </div>

                {/* أيقونات التواصل */}
                <div className="flex justify-center gap-4 mt-4">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition duration-300 text-blue-500"
                  >
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-800 hover:text-white transition duration-300 text-gray-600"
                  >
                    <FaGithub className="w-5 h-5" />
                  </a>
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
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                قيمنا ومبادئنا
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                نلتزم بمجموعة من القيم والمبادئ التي توجه عملنا وتضمن تقديم أفضل
                خدمة لعملائنا.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  title: "الجودة",
                  icon: <Award className="h-8 w-8 text-blue-600" />,
                  description:
                    "نلتزم بتقديم خدمات عالية الجودة تلبي توقعات عملائنا وتتجاوزها.",
                },
                {
                  title: "الابتكار",
                  icon: <Sparkles className="h-8 w-8 text-blue-600" />,
                  description:
                    "نسعى دائماً للابتكار وتطوير حلول جديدة تحسن تجربة العملاء.",
                },
                {
                  title: "النزاهة",
                  icon: <Shield className="h-8 w-8 text-blue-600" />,
                  description:
                    "نعمل بشفافية ونزاهة في جميع تعاملاتنا مع العملاء والشركاء.",
                },
                {
                  title: "التميز",
                  icon: <Star className="h-8 w-8 text-blue-600" />,
                  description:
                    "نسعى للتميز في كل ما نقوم به، ونعمل باستمرار على تحسين خدماتنا.",
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-xl text-center"
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default About;
