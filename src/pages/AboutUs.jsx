import React from 'react';
import { ShieldCheck, Truck, Clock, Heart } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#fbf9f6] pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#19539d] mb-4">
            من نحن - نـاس المـلاح
          </h1>
          <p className="text-xl text-[#57463a] max-w-2xl mx-auto">
            قصتنا بدأت بشغف لتقديم أفضل المنتجات لزبنائنا الكرام في المغرب، مع التركيز على الجودة والثقة.
          </p>
          <div className="mt-8 h-1 w-24 bg-[#b35d25] mx-auto rounded-full"></div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl font-bold text-[#19539d] mb-6 border-r-4 border-[#b35d25] pr-4">
              قيمنا ورؤيتنا
            </h2>
            <p className="text-lg text-[#57463a] mb-6 leading-relaxed">
              في "ناس الملاح"، نؤمن أن التجارة الإلكترونية ليست مجرد بيع وشراء، بل هي بناء علاقة ثقة مستدامة مع كل زبون. نحن نسعى دائماً لتوفير منتجات مختارة بعناية تلبي احتياجاتكم وتتجاوز توقعاتكم.
            </p>
            <p className="text-lg text-[#57463a] leading-relaxed">
              شعارنا هو "الجودة للجميع"، حيث نوفر لكم أفضل ما في السوق بأثمنة تنافسية وخدمة لا مثيل لها.
            </p>
          </div>
          <div className="relative fade-in flex justify-center" style={{ animationDelay: '0.4s' }}>
            <div className="rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500 max-w-md">
               <img 
                src="/nas_logo.jpg" 
                alt="Nas lmla7 Logo" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#b35d25] rounded-full opacity-20 -z-10"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#19539d] rounded-full opacity-10 -z-10"></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 text-center">
          {[
            { icon: <ShieldCheck size={40} className="text-[#b35d25] mx-auto" />, title: "جودة أصلية", desc: "نضمن لك جودة جميع منتجاتنا" },
            { icon: <Truck size={40} className="text-[#b35d25] mx-auto" />, title: "توصيل سريع", desc: "نوصل طلبك لباب دارك في أقصر وقت" },
            { icon: <Clock size={40} className="text-[#b35d25] mx-auto" />, title: "دعم 24/7", desc: "فريقنا في خدمتكم طوال الأسبوع" },
            { icon: <Heart size={40} className="text-[#b35d25] mx-auto" />, title: "رضى الزبناء", desc: "هدفنا الأساسي هو رضاكم التام" }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-[#e3dcd1] hover:border-[#b35d25] transition-all duration-300 hover:-translate-y-2 fade-in" style={{ animationDelay: `${0.2 * (idx + 3)}s` }}>
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-[#19539d] mb-2">{feature.title}</h3>
              <p className="text-[#57463a]">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#19539d] to-[#b35d25] rounded-3xl p-10 md:p-16 text-center text-white shadow-xl fade-in" style={{ animationDelay: '1s' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">مستعد لاكتشاف منتجاتنا؟</h2>
          <p className="text-xl mb-8 opacity-90">انضم إلى آلاف الزبناء الراضين عن خدماتنا اليوم</p>
          <a href="/#products" className="inline-block bg-white text-[#19539d] font-bold py-4 px-10 rounded-full hover:bg-opacity-90 transition-all transform hover:scale-110 shadow-lg">
            تسوق الآن
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
