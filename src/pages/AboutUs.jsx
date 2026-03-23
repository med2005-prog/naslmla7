import React from 'react';
import { Truck, CheckCircle, Wallet, Info, Heart, ShieldCheck } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#fbf9f6] pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Floating Background Elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-[#b35d25]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-[#19539d]/5 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16 fade-in">
          <div className="inline-block p-3 bg-[#b35d25]/10 rounded-2xl mb-6">
            <Info className="text-[#b35d25]" size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#19539d] mb-6 leading-tight">
            ناس الملاح.. <br className="md:hidden" />
            <span className="text-[#b35d25]">جودة ملاح وكلام موزون</span>
          </h1>
          <p className="text-xl text-[#57463a] max-w-3xl mx-auto leading-relaxed px-4">
            نحن هنا لنقدم لكم تجربة تسوق فريدة، تجمع بين الجودة العالية والشفافية التامة، ليكون كل منتج تشترونه هو الأفضل على الإطلاق.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <div className="h-1.5 w-12 bg-[#b35d25] rounded-full"></div>
            <div className="h-1.5 w-4 bg-[#19539d] rounded-full opacity-30"></div>
          </div>
        </div>

        {/* Section 1: Our Story */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-[#e3dcd1] mb-20 fade-in translate-y-10" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#19539d] mb-6 flex items-center gap-3">
                <Heart className="text-[#b35d25]" /> قصتنا وثقتنا
              </h2>
              <div className="space-y-4 text-lg text-[#57463a] leading-relaxed">
                <p>
                  بدأت "ناس الملاح" برؤية واضحة: تقديم منتجات ذات جودة استثنائية للمستهلك المغربي، مع الحرص الدائم على بناء علاقة قوية مبنية على الثقة والاحترام المتبادل.
                </p>
                <p className="font-semibold text-[#19539d]">
                  نحن لا نبيع المنتجات فحسب، بل نبيع راحة البال والجودة التي تستحقونها.
                </p>
                <p>
                  لكل زبناءنا في مختلف أنحاء المغرب، نعدكم أن نظل دائماً عند حسن ظنكم، مختارين بعناية كل قطعة لتلبي تطلعاتكم وتسهل حياتكم اليومية.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.03]">
                <img 
                  src="/nas_logo.jpg" 
                  alt="NasLmla7 Brand" 
                  className="w-full h-auto object-cover aspect-square md:aspect-auto"
                />
              </div>
              <div className="absolute -inset-4 border-2 border-[#b35d25]/20 rounded-3xl -z-10 group-hover:inset-0 transition-all duration-500"></div>
            </div>
          </div>
        </div>

        {/* Section 2: Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { 
              icon: <Wallet size={48} className="text-[#b35d25]" />, 
              title: "الدفع عند الاستلام", 
              desc: "خلص حتال لباب الدار، ثقة تامة وراحة بال أكيدة" 
            },
            { 
              icon: <CheckCircle size={48} className="text-[#b35d25]" />, 
              title: "مراقبة الجودة", 
              desc: "كل منتج كيتم الفحص ديالو بدقة باش يوصلك بأحسن حلة" 
            },
            { 
              icon: <Truck size={48} className="text-[#b35d25]" />, 
              title: "توصيل سريع", 
              desc: "فينما كنتي في المغرب، طلبيتك كتوصلك في وقت قياسي" 
            }
          ].map((feature, idx) => (
            <div 
              key={idx} 
              className="group bg-white p-10 rounded-[2rem] shadow-lg border-2 border-transparent hover:border-[#b35d25]/30 transition-all duration-500 hover:-translate-y-3 text-center fade-in" 
              style={{ animationDelay: `${0.2 * (idx + 3)}s` }}
            >
              <div className="bg-[#fbf9f6] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-[#b35d25]/10 transition-colors duration-500">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-[#19539d] mb-4">{feature.title}</h3>
              <p className="text-lg text-[#57463a] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="relative overflow-hidden bg-[#19539d] rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl fade-in" style={{ animationDelay: '1s' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#b35d25] opacity-20 -mr-32 -mt-32 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 -ml-20 -mb-20 rounded-full"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">واجد باش تعيش تجربة "الملاح"؟</h2>
            <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
              تصفح مجموعتنا المختارة بعناية واستمتع بأفضل العروض والخدمات في المغرب.
            </p>
            <a 
              href="/#products" 
              className="inline-flex items-center gap-3 bg-[#b35d25] text-white font-bold py-5 px-12 rounded-full hover:bg-white hover:text-[#19539d] transition-all transform hover:scale-105 shadow-xl text-lg"
            >
              بدا التسوق دابا
              <Truck size={24} />
            </a>
          </div>
        </div>
      </div>
      
      {/* Styles for animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          opacity: 0;
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;
