const Services = () => {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-5xl font-extrabold text-blue-600 mb-6 drop-shadow-md">
        خدمات WashyWay
      </h1>
      <p className="text-lg text-gray-700 mb-10">
        نقدم لك أفضل تجربة غسيل سيارات أينما كنت، بجودة عالية واحترافية.
      </p>

      <div className="grid md:grid-cols-3 gap-10">
        {[
          {
            title: "غسيل خارجي متكامل",
            description: "تنظيف دقيق للسيارة من الخارج باستخدام مواد صديقة للبيئة.",
          },
          {
            title: "تنظيف داخلي فاخر",
            description:
              "إزالة الأوساخ وتنظيف المقاعد والسجاد والعناية بكل التفاصيل الداخلية.",
          },
          {
            title: "تلميع وحماية",
            description:
              "تلميع الهيكل والزجاج وإضافة طبقة حماية للحفاظ على بريق السيارة.",
          },
        ].map((service, index) => (
          <div
            key={index}
            className="p-8 bg-white shadow-xl rounded-lg border-t-4 border-blue-500 transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <h2 className="text-2xl font-semibold text-blue-500">{service.title}</h2>
            <p className="text-gray-600 mt-3">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
