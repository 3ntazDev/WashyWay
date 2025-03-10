import { Droplet } from "lucide-react"
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-900 py-12 px-4" dir="rtl">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Droplet className="h-6 w-6" />
              <span className="text-xl font-bold text-white">WashyWay</span>
            </div>
            <p className="max-w-xs text-blue-100">أفضل خدمة غسيل سيارات في الخرج، نوفر لك تجربة مميزة وسهلة.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-white">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-100 hover:text-white transition">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-blue-100 hover:text-white transition">
                  خدماتنا
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-blue-100 hover:text-white transition">
                  عن الشركة
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-100 hover:text-white transition">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-white">تواصل معنا</h3>
            <ul className="space-y-2 text-blue-100">
              <li>الخرج، المملكة العربية السعودية</li>
              <li>info@washyway.com</li>
              <li>+966 123 456 789</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-100">
          <p>© {new Date().getFullYear()} WashyWay. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

