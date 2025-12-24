import { useState } from 'react';

export default function About() {
  const [activeTeamMember, setActiveTeamMember] = useState(null);

  const teamMembers = [
    {
      name: 'Amera Otoum',
      role: 'CEO & Packaging CPO',
      description: 'Researcher in Economics and Environmental Psychology. Expert working in emergencies and empowering vulnerable communities.',
      education: 'MSc: Economic and Environmental Resources, BS: Agricultural Engineering',
      email: 'Ameraaloto@gmail.com',
      tel: '+962 792977610',
      image: '/aboutus/amera.jpg'
    },
    {
      name: 'Dr. Aljawharah Alsubaie',
      role: 'Food Advisor',
      description: 'Researcher in Therapeutic Effectiveness. Filed Patent in 2014, Patent in innovative candy for dental care. Hospital training in NHS hospitals.',
      education: 'Doctor of Pharmacy (professional doctorate)',
      email: 'jalkhuzem@gmail.com',
      image: '/aboutus/Aljawharah Alsubaie.jpg'
    },
    {
      name: 'Dr. Ali Ali Redha',
      role: 'Food R&D Advisor',
      description: 'Researcher in Food Bioactives',
      education: 'PhD: Food, Nutrition & Health, MSc: Analytical Chemistry, BSc: Chemistry',
      email: 'ali96chemx@gmail.com',
      image: '/aboutus/Ali Ali Redha.jpg'
    },
    {
      name: 'Dr. Mahmoud Alkhateib',
      role: 'Food For Emergency Advisor',
      description: 'Served as QRC Consultant Dietitian in Somalia (2011) and led nutrition efforts in multiple disaster management camps (2012–2018). Participated in key regional meetings and courses in Amman and Doha, including leading the Yemen malnutrition assessment mission (2012) and delivering expert presentations (2016–2018).',
      education: 'Emergency Nutrition, Disaster Management, Malnutrition Assessment',
      email: 'mahmoudalkhateib@hotmail.com',
      image: '/aboutus/Mahmoud Alkhatib.jpg'
    },
    {
      name: 'Enes Hurmuzlu',
      role: 'Developer & Tech Advisor',
      description: 'Mathematician and programmer from Iraq/Türkiye with experience in full-stack mobile development, AI advising, and mathematics education. Worked with startups in the US, Finland, and Jordan, developed iOS and Android applications, and published 60+ online math lectures. IMO 2025 Iraq Team Representative and Yale Young Global Scholars alumnus.',
      education: 'Full-Stack Mobile Development, AI Advising, Mathematics Education',
      email: 'enesalhurmuzi@gmail.com',
      image: '/aboutus/anes.jpg'
    },
    {
      name: 'Azeddine Zellag',
      role: 'Full Stack Developer',
      description: "Full Stack Developer holding a Master's degree in Psychology. Specializes in building high-revenue SaaS platforms and AI-driven applications that prioritize human behavior and user experience. Expert in Next.js and mobile architecture, with a focus on voice translation and cognitive AI agents.",
      education: 'Full-Stack Architecture, AI & Voice Integration, Psychology-Driven UX',
      email: 'autonomy.owner@gmail.com',
      image: '/aboutus/azeddinezellag.jpg'
    }
  ];

  const timeline = [
    {
      year: '2023',
      title: 'Research Collaboration',
      description: "Launched collaboration with Women's Research Group and ReachSci"
    },
    {
      year: '2024',
      title: 'Award Recognition',
      description: 'Won Best Research Poster Award (Food Security & Health Recovery) with ReachSci'
    },
    {
      year: '2025',
      title: 'Innovation Development',
      description: 'Developed eco-friendly packaging and 12+ health recovery food recipes'
    },
    {
      year: '2025',
      title: 'Research Publication',
      description: 'Published research on unique recipes & sustainable agriculture for harsh environments'
    },
    {
      year: '2026–2027',
      title: 'Global Events',
      description: 'Served at major global events including Hajj, Umrah, and the World Cup, providing sustainable and culturally authentic meals'
    }
  ];

  const values = [
    {
      title: 'Innovation Based Research',
      description: 'Pioneering breakthrough food technology that transforms how nutrition is accessed worldwide'
    },
    {
      title: 'Our Future Goals',
      description: 'Creating solutions for emergency relief, adventure, professional life, and family wellness'
    },
    {
      title: 'Sustainability',
      description: 'Building a circular economy where packaging becomes part of the natural ecosystem'
    },
    {
      title: 'Accessibility',
      description: 'Ensuring nutrition is accessible to all communities regardless of circumstances or abilities'
    }
  ];

  const stats = [
    { value: '5', label: 'Minutes', description: 'Heating time from ambient to 65°C' },
    { value: '100%', label: 'Plantable and Biodegradable', description: 'Packaging transforms into wildflowers and using as hypotonic Agriculture system' },
    { value: '15+', label: 'Countries', description: 'Emergency relief deployments' },
    { value: '+1M', label: 'Meals', description: 'Serving professionals and families with busy lifestyles' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-cream via-white to-primary/5 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 border-4 border-primary/10 rounded-full" />
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-teal/5 rotate-45" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-heading mb-6">
              REACHFOOD
            </h1>
            <p className="text-2xl lg:text-3xl text-primary font-medium mb-4">
              Flavors of Innovation
            </p>
            <p className="text-xl text-teal font-medium mb-8">
              Team Work
            </p>
            <p className="text-lg lg:text-xl text-heading-light max-w-3xl mx-auto leading-relaxed">
              Founded on the belief that nutrition should never be limited by circumstance,
              ReachFood combines cutting-edge food science with sustainable innovation to
              deliver hot, nutritious meals anywhere in the world.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-8">
                Our Story
              </h2>
              <div className="space-y-6 text-heading-light text-lg leading-relaxed">
                <p>
                  Our journey began at ReachSci — the place where it all started. There, we launched
                  an intervention in Madagascar, a country struggling with famine, food insecurity,
                  and widespread vitamin A deficiency. ReachSci brought our team together to take on
                  this urgent challenge.
                </p>
                <p>
                  It was there we learned how to transform research into real innovation and that
                  experience inspired us to go even further. We developed complete, nutritious meals
                  using local crops, designed to nourish communities while supporting local agriculture.
                </p>
                <p className="text-heading font-medium">
                  That's how ReachFood was born: food that not only feeds, but heals, sustains, and grows again.
                </p>
                <p className="text-primary italic">
                  A heartfelt thanks to ReachSci, and special credit to Dr. Mohammed alawami, the
                  President of ReachSci and our supervisor, for his guidance and support on this journey.
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
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-teal/10 rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Founding Values */}
      <section className="py-20 lg:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-4">
              Our Founding Values
            </h2>
            <p className="text-heading-light text-lg max-w-2xl mx-auto">
              These core principles guide every decision we make and every innovation we pursue
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
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
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-4">
              Meet Our Team
            </h2>
            <p className="text-heading-light text-lg max-w-2xl mx-auto">
              Experts united by a shared vision of making nutrition accessible to everyone, everywhere
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group bg-cream rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500"
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
                    <a
                      href={`mailto:${member.email}`}
                      className="block text-sm text-heading-light hover:text-primary transition-colors truncate"
                    >
                      {member.email}
                    </a>
                    {member.tel && (
                      <a
                        href={`tel:${member.tel}`}
                        className="block text-sm text-heading-light hover:text-primary transition-colors"
                      >
                        {member.tel}
                      </a>
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
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-4">
              Our Journey
            </h2>
            <p className="text-heading-light text-lg max-w-2xl mx-auto">
              From concept to global impact - the milestones that shaped ReachFood
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
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16'}`}>
                    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
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
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold mb-4">
              Our Future Goals
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Our vision and ambitions for transforming the future of nutrition globally
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-heading mb-6">
            Join Our Mission
          </h2>
          <p className="text-heading-light text-lg mb-8 max-w-2xl mx-auto">
            Be part of the food revolution. Together, we can ensure nutritious meals
            reach every corner of the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/30"
            >
              Explore Our Products
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-heading font-semibold rounded-full hover:bg-heading hover:text-white transition-all duration-300 border-2 border-heading"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
