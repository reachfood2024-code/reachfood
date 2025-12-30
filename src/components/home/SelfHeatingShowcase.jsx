import { useLanguage } from '../../context/LanguageContext';

export default function SelfHeatingShowcase() {
  const { isRTL } = useLanguage();

  const stats = [
    {
      value: '3-5',
      unit: 'min',
      label: isRTL ? 'جاهز للأكل' : 'Ready to Eat',
    },
    {
      value: '0',
      unit: '%',
      label: isRTL ? 'بدون كهرباء' : 'No Electricity',
    },
    {
      value: '100',
      unit: '%',
      label: isRTL ? 'صديق للبيئة' : 'Eco-Friendly',
    },
  ];

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-cream">
      {/* Subtle warm gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 50%, rgba(232, 134, 42, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 30% 70%, rgba(26, 95, 106, 0.04) 0%, transparent 50%)
          `
        }}
      />

      {/* Decorative dots pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0D4A52 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-14 ${isRTL ? 'direction-rtl' : ''}`}>
          <span
            className="inline-block text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-4"
            style={{ animation: 'fadeInUp 0.8s ease-out' }}
          >
            {isRTL ? 'التقنية المبتكرة' : 'Revolutionary Technology'}
          </span>

          <h2
            className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-heading mb-6"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.1s both' }}
          >
            {isRTL ? 'شاهد' : 'Watch the'}{' '}
            <span className="text-primary">
              {isRTL ? 'السحر' : 'Magic'}
            </span>
          </h2>

          <p
            className="text-heading-light text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
          >
            {isRTL
              ? 'تقنية التسخين الذاتي الحاصلة على براءة اختراع تجعل وجباتك ساخنة وطازجة في دقائق - بدون ميكروويف أو كهرباء'
              : 'Our patented self-heating technology brings your meals to perfect temperature in minutes — no microwave, no electricity, just pure innovation'
            }
          </p>
        </div>

        {/* Video Showcase */}
        <div
          className="relative max-w-4xl mx-auto mb-16"
          style={{ animation: 'fadeInScale 1s ease-out 0.3s both' }}
        >
          {/* Outer glow effect */}
          <div
            className="absolute -inset-3 rounded-[2rem] opacity-40"
            style={{
              background: 'linear-gradient(135deg, rgba(232, 134, 42, 0.4) 0%, rgba(232, 134, 42, 0.1) 50%, rgba(232, 134, 42, 0.4) 100%)',
              filter: 'blur(20px)',
              animation: 'pulse-glow 4s ease-in-out infinite',
            }}
          />

          {/* Video container */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-heading/20 border-4 border-white">
            {/* Video element */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full aspect-video object-cover"
            >
              <source src="/5/Animated_Steam_From_Food_Container.mp4" type="video/mp4" />
            </video>

            {/* Subtle vignette overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(13, 74, 82, 0.1) 100%)',
              }}
            />
          </div>

          {/* Floating badge */}
          <div
            className={`absolute -bottom-5 ${isRTL ? 'right-6' : 'left-6'} bg-primary text-white px-6 py-3 rounded-full shadow-lg shadow-primary/30 font-semibold`}
            style={{ animation: 'float 3s ease-in-out infinite' }}
          >
            {isRTL ? 'تسخين ذاتي' : 'Self-Heating'}
          </div>
        </div>

        {/* Stats Grid */}
        <div
          className={`grid grid-cols-3 gap-2 sm:gap-4 lg:gap-8 max-w-3xl mx-auto ${isRTL ? 'direction-rtl' : ''}`}
          style={{ animation: 'fadeInUp 0.8s ease-out 0.5s both' }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="relative bg-white border border-heading/10 rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-5 lg:p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
                {/* Value */}
                <div className="flex items-baseline justify-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                  <span className="font-playfair text-2xl sm:text-3xl lg:text-5xl font-bold text-heading">
                    {stat.value}
                  </span>
                  <span className="text-primary text-sm sm:text-lg lg:text-2xl font-semibold">
                    {stat.unit}
                  </span>
                </div>

                {/* Label */}
                <p className="text-heading-light text-xs sm:text-sm lg:text-base font-medium leading-tight">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div
          className="text-center mt-12"
          style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}
        >
          <p className="text-heading-light/60 text-sm tracking-wide">
            {isRTL
              ? 'تقنية حاصلة على براءة اختراع  •  آمنة وطبيعية  •  لا ماء أو كهرباء مطلوبة'
              : 'Patented Technology  •  Safe & Natural  •  No Water or Electricity Required'
            }
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </section>
  );
}
