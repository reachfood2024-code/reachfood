import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const [activeTeamMember, setActiveTeamMember] = useState(null);
  const { t, language, isRTL } = useLanguage();

  const teamMembers = [
    {
      name: 'Amera Otoum',
      nameAr: 'أميرة عتوم',
      role: t('team.ceoRole'),
      description: language === 'ar'
        ? 'باحثة في الاقتصاد وعلم النفس البيئي. خبيرة في العمل في حالات الطوارئ وتمكين المجتمعات الضعيفة.'
        : 'Researcher in Economics and Environmental Psychology. Expert working in emergencies and empowering vulnerable communities.',
      education: language === 'ar'
        ? 'ماجستير: الموارد الاقتصادية والبيئية، بكالوريوس: الهندسة الزراعية'
        : 'MSc: Economic and Environmental Resources, BS: Agricultural Engineering',
      email: 'Ameraaloto@gmail.com',
      tel: '+962 792977610',
      image: '/aboutus/amera.jpg'
    },
    {
      name: language === 'ar' ? 'د. الجوهرة السبيعي' : 'Dr. Aljawharah Alsubaie',
      role: t('team.foodAdvisor'),
      description: language === 'ar'
        ? 'باحثة في الفعالية العلاجية. قدمت براءة اختراع عام 2014 لحلوى مبتكرة للعناية بالأسنان. تدريب في مستشفيات NHS.'
        : 'Researcher in Therapeutic Effectiveness. Filed Patent in 2014, Patent in innovative candy for dental care. Hospital training in NHS hospitals.',
      education: language === 'ar'
        ? 'دكتوراه في الصيدلة (دكتوراه مهنية)'
        : 'Doctor of Pharmacy (professional doctorate)',
      email: 'jalkhuzem@gmail.com',
      image: '/aboutus/Aljawharah Alsubaie.jpg'
    },
    {
      name: language === 'ar' ? 'د. علي علي رضا' : 'Dr. Ali Ali Redha',
      role: t('team.foodRDAdvisor'),
      description: language === 'ar'
        ? 'باحث في المركبات الغذائية النشطة بيولوجياً'
        : 'Researcher in Food Bioactives',
      education: language === 'ar'
        ? 'دكتوراه: الغذاء والتغذية والصحة، ماجستير: الكيمياء التحليلية، بكالوريوس: الكيمياء'
        : 'PhD: Food, Nutrition & Health, MSc: Analytical Chemistry, BSc: Chemistry',
      email: 'ali96chemx@gmail.com',
      image: '/aboutus/Ali Ali Redha.jpg'
    },
    {
      name: language === 'ar' ? 'د. محمود الخطيب' : 'Dr. Mahmoud Alkhateib',
      role: t('team.emergencyAdvisor'),
      description: language === 'ar'
        ? 'عمل كمستشار تغذية في الهلال الأحمر القطري في الصومال (2011) وقاد جهود التغذية في مخيمات إدارة الكوارث (2012-2018). شارك في اجتماعات ودورات إقليمية في عمان والدوحة، بما في ذلك قيادة مهمة تقييم سوء التغذية في اليمن (2012).'
        : 'Served as QRC Consultant Dietitian in Somalia (2011) and led nutrition efforts in multiple disaster management camps (2012–2018). Participated in key regional meetings and courses in Amman and Doha, including leading the Yemen malnutrition assessment mission (2012) and delivering expert presentations (2016–2018).',
      education: language === 'ar'
        ? 'التغذية الطارئة، إدارة الكوارث، تقييم سوء التغذية'
        : 'Emergency Nutrition, Disaster Management, Malnutrition Assessment',
      email: 'mahmoudalkhateib@hotmail.com',
      image: '/aboutus/Mahmoud Alkhatib.jpg'
    },
    {
      name: 'Enes Hurmuzlu',
      role: t('team.techAdvisor'),
      description: language === 'ar'
        ? 'عالم رياضيات ومبرمج من العراق/تركيا. لديه خبرة في تطوير تطبيقات الموبايل، استشارات الذكاء الاصطناعي، وتعليم الرياضيات. عمل مع شركات ناشئة في أمريكا وفنلندا والأردن، وطور تطبيقات iOS وAndroid، ونشر أكثر من 60 محاضرة رياضيات عبر الإنترنت. ممثل فريق العراق في الأولمبياد الدولي للرياضيات 2025 وخريج برنامج Yale Young Global Scholars.'
        : 'Mathematician and programmer from Iraq/Türkiye with experience in full-stack mobile development, AI advising, and mathematics education. Worked with startups in the US, Finland, and Jordan, developed iOS and Android applications, and published 60+ online math lectures. IMO 2025 Iraq Team Representative and Yale Young Global Scholars alumnus.',
      education: language === 'ar'
        ? 'تطوير تطبيقات الموبايل، الذكاء الاصطناعي، تعليم الرياضيات'
        : 'Full-Stack Mobile Development, AI Advising, Mathematics Education',
      email: 'enesalhurmuzi@gmail.com',
      image: '/aboutus/anes.jpg'
    },
    {
      name: language === 'ar' ? 'عزالدين زلاق' : 'Azeddine Zellag',
      role: t('team.fullStackDev'),
      description: language === 'ar'
        ? 'مطور Full Stack يحمل ماجستير في علم النفس. متخصص في بناء منصات SaaS عالية الإيرادات وتطبيقات الذكاء الاصطناعي التي تعطي الأولوية للسلوك البشري وتجربة المستخدم. خبير في Next.js وهندسة تطبيقات الموبايل، مع التركيز على الترجمة الصوتية ووكلاء الذكاء الاصطناعي المعرفي.'
        : "Full Stack Developer holding a Master's degree in Psychology. Specializes in building high-revenue SaaS platforms and AI-driven applications that prioritize human behavior and user experience. Expert in Next.js and mobile architecture, with a focus on voice translation and cognitive AI agents.",
      education: language === 'ar'
        ? 'هندسة Full-Stack، تكامل الذكاء الاصطناعي والصوت، تجربة المستخدم القائمة على علم النفس'
        : 'Full-Stack Architecture, AI & Voice Integration, Psychology-Driven UX',
      email: 'autonomy.owner@gmail.com',
      image: '/aboutus/azeddinezellag.jpg'
    }
  ];

  const timeline = [
    {
      year: '2023',
      title: t('timeline.researchCollab'),
      description: t('timeline.researchCollabDesc')
    },
    {
      year: '2024',
      title: t('timeline.awardRecognition'),
      description: t('timeline.awardRecognitionDesc')
    },
    {
      year: '2025',
      title: t('timeline.innovationDev'),
      description: t('timeline.innovationDevDesc')
    },
    {
      year: '2025',
      title: t('timeline.researchPub'),
      description: t('timeline.researchPubDesc')
    },
    {
      year: '2026–2027',
      title: t('timeline.globalEvents'),
      description: t('timeline.globalEventsDesc')
    }
  ];

  const values = [
    {
      title: t('about.innovationResearch'),
      description: t('about.innovationResearchDesc')
    },
    {
      title: t('about.futureGoals'),
      description: t('about.futureGoalsDesc')
    },
    {
      title: t('about.sustainability'),
      description: t('about.sustainabilityDesc')
    },
    {
      title: t('about.accessibility'),
      description: t('about.accessibilityDesc')
    }
  ];

  const stats = [
    {
      value: '5',
      label: t('about.minutes'),
      description: t('about.heatingTime')
    },
    {
      value: '100%',
      label: t('about.plantable'),
      description: t('about.plantableDesc')
    },
    {
      value: '15+',
      label: t('about.countries'),
      description: t('about.countriesDesc')
    },
    {
      value: '+1M',
      label: t('about.meals'),
      description: t('about.mealsDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-cream via-white to-primary/5 overflow-hidden">
        <div className={`absolute top-20 ${isRTL ? 'left-20' : 'right-20'} w-64 h-64 border-4 border-primary/10 rounded-full`} />
        <div className={`absolute bottom-20 ${isRTL ? 'right-10' : 'left-10'} w-40 h-40 bg-teal/5 rotate-45`} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`text-center max-w-4xl mx-auto ${isRTL ? 'text-right' : ''}`}>
            <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-heading mb-6">
              {t('about.title')}
            </h1>
            <p className="text-2xl lg:text-3xl text-primary font-medium mb-4">
              {t('about.tagline')}
            </p>
            <p className="text-xl text-teal font-medium mb-8">
              {t('about.teamWork')}
            </p>
            <p className="text-lg lg:text-xl text-heading-light max-w-3xl mx-auto leading-relaxed">
              {t('about.heroDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid lg:grid-cols-2 gap-16 items-center ${isRTL ? 'direction-rtl' : ''}`}>
            <div className={isRTL ? 'text-right' : ''}>
              <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-8">
                {t('about.ourStory')}
              </h2>
              <div className="space-y-6 text-heading-light text-lg leading-relaxed">
                <p>
                  {t('about.storyP1')}
                </p>
                <p>
                  {t('about.storyP2')}
                </p>
                <p className="text-heading font-medium">
                  {t('about.storyP3')}
                </p>
                <p className="text-primary italic">
                  {t('about.storyCredit')}
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 to-teal/10 flex items-center justify-center">
                <img
                  src="/aboutus/founder.jpg"
                  alt="ReachFood founders in emergency relief setting"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center text-heading-light">
                  <span className="text-lg">Founders Image</span>
                </div>
              </div>
              <div className={`absolute -bottom-6 ${isRTL ? '-right-6' : '-left-6'} w-32 h-32 bg-primary/10 rounded-full -z-10`} />
              <div className={`absolute -top-6 ${isRTL ? '-left-6' : '-right-6'} w-24 h-24 bg-teal/10 rounded-full -z-10`} />
            </div>
          </div>
        </div>
      </section>

      {/* Our Founding Values */}
      <section className="py-20 lg:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-4">
              {t('about.foundingValues')}
            </h2>
            <p className="text-heading-light text-lg max-w-2xl mx-auto">
              {t('about.foundingValuesDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${isRTL ? 'text-right' : ''}`}
              >
                <div className={`w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto' : ''}`}>
                  <span className="text-primary text-2xl font-bold">{index + 1}</span>
                </div>
                <h3 className="font-playfair text-xl font-semibold text-heading mb-3">
                  {value.title}
                </h3>
                <p className="text-heading-light leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-4">
              {t('about.meetOurTeam')}
            </h2>
            <p className="text-heading-light text-lg max-w-2xl mx-auto">
              {t('about.meetOurTeamDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`group bg-cream rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500 ${isRTL ? 'text-right' : ''}`}
              >
                {/* Image */}
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-teal/10 relative overflow-hidden">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`${member.image ? 'hidden' : 'flex'} w-full h-full items-center justify-center absolute inset-0 bg-gradient-to-br from-primary/20 to-teal/20`}>
                    <span className="text-5xl font-playfair font-bold text-white/80">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-playfair text-xl font-semibold text-heading mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium text-sm mb-4">
                    {member.role}
                  </p>
                  <p className="text-heading-light text-sm leading-relaxed mb-4 line-clamp-3">
                    {member.description}
                  </p>
                  <p className="text-teal text-xs font-medium mb-4">
                    {member.education}
                  </p>

                  {/* Contact */}
                  <div className="pt-4 border-t border-heading/10 space-y-2">
                    <p className="text-sm text-heading-light">
                      {language === 'ar' ? 'البريد:' : 'Email:'} <a href={`mailto:${member.email}`} className="hover:text-primary transition-colors">{member.email}</a>
                    </p>
                    {member.tel && (
                      <p className="text-sm text-heading-light">
                        {language === 'ar' ? 'هاتف:' : 'Phone:'} <a href={`tel:${member.tel}`} className="hover:text-primary transition-colors">{member.tel}</a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary/5 to-teal/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-4">
              {t('about.ourJourney')}
            </h2>
            <p className="text-heading-light text-lg max-w-2xl mx-auto">
              {t('about.ourJourneyDesc')}
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2" />

            <div className="space-y-12 lg:space-y-0">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative lg:flex lg:items-center ${
                    isRTL
                      ? (index % 2 === 0 ? 'lg:flex-row-reverse' : 'lg:flex-row')
                      : (index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse')
                  }`}
                >
                  {/* Content */}
                  <div className={`lg:w-1/2 ${
                    isRTL
                      ? (index % 2 === 0 ? 'lg:pl-16 lg:text-right' : 'lg:pr-16 lg:text-right')
                      : (index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16')
                  }`}>
                    <div className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 ${isRTL ? 'text-right' : ''}`}>
                      <span className="inline-block px-4 py-1 bg-primary text-white text-sm font-semibold rounded-full mb-4">
                        {item.year}
                      </span>
                      <h3 className="font-playfair text-xl font-semibold text-heading mb-2">
                        {item.title}
                      </h3>
                      <p className="text-heading-light">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>

                  {/* Spacer */}
                  <div className="lg:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Future Goals Stats */}
      <section className="py-20 lg:py-28 bg-heading text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold mb-4">
              {t('about.ourFutureGoals')}
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              {t('about.ourFutureGoalsDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 ${isRTL ? 'text-right' : ''}`}
              >
                <p className="font-playfair text-5xl lg:text-6xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-xl font-semibold mb-3">
                  {stat.label}
                </p>
                <p className="text-white/60 text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-cream">
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${isRTL ? 'text-right' : ''}`}>
          <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-heading mb-6">
            {t('about.joinMission')}
          </h2>
          <p className="text-heading-light text-lg mb-8 max-w-2xl mx-auto">
            {t('about.joinMissionDesc')}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <a
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/30"
            >
              {t('about.exploreProducts')}
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-heading font-semibold rounded-full hover:bg-heading hover:text-white transition-all duration-300 border-2 border-heading"
            >
              {t('about.getInTouch')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
