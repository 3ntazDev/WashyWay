import { useState } from "react"
import { Car, MessageSquare, Star, Users } from "lucide-react"
import YellowLogo from "./assets/logo-yellow.png";

// Reusable Components
const TabButton = ({ activeTab, setActiveTab, tabName, label }) => (
  <button
    className={`px-6 py-3 rounded-md transition ${activeTab === tabName ? "bg-white text-blue-600" : "text-white"}`}
    onClick={() => setActiveTab(tabName)}
  >
    {label}
  </button>
)

const Section = ({ title, description, buttonText, imageSrc, icon: Icon, bgColor }) => (
  <div className={`bg-white rounded-2xl p-8 text-gray-800 max-w-4xl mx-auto shadow-xl`}>
    <div className="flex flex-col md:flex-row gap-8 items-center">
      <div className="md:w-1/2">
        <div className={`bg-${bgColor}-100 p-4 rounded-full inline-block mb-4`}>
          <Icon className={`h-10 w-10 text-${bgColor}-600`} />
        </div>
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-lg mb-6">{description}</p>
        <div className="flex gap-4">
          <button
            className={`bg-${bgColor}-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-${bgColor}-700 transition flex items-center gap-2`}
          >
            {buttonText}
          </button>
          <button
            className={`border border-${bgColor}-600 text-${bgColor}-600 px-6 py-3 rounded-lg font-medium hover:bg-${bgColor}-50 transition`}
          >
            تعرف على المزيد
          </button>
        </div>
      </div>
      <div className="md:w-1/2">
        <img src={YellowLogo || "/placeholder.svg"} alt={title} className="rounded-lg shadow-lg" />
      </div>
    </div>
  </div>
)

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
)

const ComingSoonCard = ({ title, description, children }) => (
  <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl relative">
    <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold animate-bounce">
      قريباً
    </div>
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
    <p className="mb-4">{description}</p>
    {children}
  </div>
)

function Home() {
  const [activeTab, setActiveTab] = useState("users")

  const features = [
    { icon: Star, title: "جودة عالية", description: "نضمن لك أفضل خدمة غسيل بأعلى معايير الجودة والاحترافية." },
    {
      icon: MessageSquare,
      title: "دعم على مدار الساعة",
      description: "فريق خدمة العملاء متاح دائماً للرد على استفساراتكم وحل مشاكلكم.",
    },
    { icon: Car, title: "خدمة سريعة", description: "نوفر لك خدمة سريعة وفعالة توفر وقتك وجهدك." },
  ]

  const tabContent = {
    users: {
      title: "احصل على أفضل خدمة غسيل",
      description: "استمتعوا بخدماتنا السريعة والموثوقة لغسيل السيارات. نوفر لكم تجربة سلسة من البداية إلى النهاية عبر منصتنا التي تربطكم بمغاسل السيارات.",
      buttonText: "احجز الآن",
      imageSrc: "https://placehold.co/400x300",
      icon: Car,
      bgColor: "blue",
    },
    washers: {
      title: "انضم إلى شبكة المغاسل",
      description: "انضموا إلينا لتقديم خدماتكم لأكبر عدد من العملاء وزيادة أرباحكم من خلال منصتنا المتكاملة التي تربطكم بالمستخدمين.",
      buttonText: "انضم الآن",
      imageSrc: "https://placehold.co/400x300",
      icon: Users,
      bgColor: "purple",
    },
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16 px-4" dir="rtl">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">مرحباً بكم في WashyWay</h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">أفضل خدمة غسيل السيارات في المملكة العربية السعودية، نقدم لكم منصة تربط بين العملاء وأصحاب المغاسل.</p>

            <div className="bg-white/10 backdrop-blur-sm p-1 rounded-lg inline-flex mb-12">
              <TabButton activeTab={activeTab} setActiveTab={setActiveTab} tabName="users" label="للمستخدمين" />
              <TabButton activeTab={activeTab} setActiveTab={setActiveTab} tabName="washers" label="للمغاسل" />
            </div>

            {/* Dynamic Tab Content */}
            <Section {...tabContent[activeTab]} />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-gray-50" dir="rtl">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">لماذا تختار WashyWay؟</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon Sections */}
        <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white" dir="rtl">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <ComingSoonCard
                title="شهادات العملاء"
                description="قريباً ستتمكن من مشاهدة آراء وتجارب عملائنا مع خدمة WashyWay."
              >
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-gray-400" />
                  ))}
                </div>
              </ComingSoonCard>

              <ComingSoonCard
                title="شركاؤنا"
                description="قريباً ستتمكن من التعرف على شركائنا الاستراتيجيين الذين يساهمون في تقديم أفضل تجربة لعملائنا."
              >
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {[1, 2, 3].map((partner) => (
                    <div key={partner} className="bg-white/20 h-16 rounded-lg"></div>
                  ))}
                </div>
              </ComingSoonCard>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
