import { useState } from 'react';

export default function Partner() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    partnerType: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const partnerTypes = [
    { value: 'distributor', label: 'Distributor' },
    { value: 'retailer', label: 'Retailer' },
    { value: 'research', label: 'Research Institution' },
    { value: 'ngo', label: 'NGO / Humanitarian Organization' },
    { value: 'government', label: 'Government Agency' },
    { value: 'other', label: 'Other' }
  ];

  const opportunities = [
    {
      title: 'Regional Expansion',
      description: 'Direct presence in local markets plus strong online reach.'
    },
    {
      title: 'Local Flavors, Global Standards',
      description: 'We design products around local crops and traditional tastes, while ensuring international quality.'
    },
    {
      title: 'Shared Values',
      description: 'We are driven by impact, sustainability, and long term collaboration.'
    }
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
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Partnership Opportunities
            </p>
            <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-heading mb-6">
              Grow With Us
            </h1>
            <p className="text-2xl lg:text-3xl text-primary font-medium mb-8">
              Become a Strategic Partner
            </p>
            <p className="text-lg lg:text-xl text-heading-light max-w-3xl mx-auto leading-relaxed">
              We are actively seeking visionary partners to join our mission. By combining your reach
              and expertise with our innovation, we can unlock new markets and deliver sustainable
              food solutions at scale.
            </p>
          </div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-4">
              Why Partner With Us
            </h2>
            <p className="text-heading-light text-lg max-w-2xl mx-auto">
              Together we can create meaningful impact while building sustainable business growth
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {opportunities.map((opportunity, index) => (
              <div
                key={index}
                className="bg-cream rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-primary text-2xl font-bold">{index + 1}</span>
                </div>
                <h3 className="font-playfair text-2xl font-semibold text-heading mb-4">
                  {opportunity.title}
                </h3>
                <p className="text-heading-light text-lg leading-relaxed">
                  {opportunity.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary/5 to-teal/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-4">
              Who We're Looking For
            </h2>
            <p className="text-heading-light text-lg max-w-2xl mx-auto">
              Whether you're a distributor, retailer, or research institution — we welcome partners who share our vision
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Distributors', desc: 'Expand our reach to new regions and markets' },
              { title: 'Retailers', desc: 'Bring innovative food solutions to your customers' },
              { title: 'Research Institutions', desc: 'Collaborate on food science and nutrition research' },
              { title: 'NGOs & Humanitarian Orgs', desc: 'Partner for emergency relief and food security initiatives' },
              { title: 'Government Agencies', desc: 'Work together on public health and nutrition programs' },
              { title: 'Food Service Providers', desc: 'Integrate our solutions into your offerings' }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <h3 className="font-playfair text-xl font-semibold text-heading mb-2">
                  {item.title}
                </h3>
                <p className="text-heading-light">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-4">
              Join as a Partner
            </h2>
            <p className="text-heading-light text-lg max-w-2xl mx-auto">
              Ready to explore partnership opportunities? Fill out the form below and our team will get back to you.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-cream rounded-3xl p-12 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-playfair text-2xl font-semibold text-heading mb-4">
                Thank You for Your Interest!
              </h3>
              <p className="text-heading-light text-lg">
                We've received your partnership inquiry and will be in touch within 2-5 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-cream rounded-3xl p-8 lg:p-12">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-heading/10 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-heading/10 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="your.email@company.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-heading/10 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="Company or organization name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Partner Type *
                  </label>
                  <select
                    name="partnerType"
                    required
                    value={formData.partnerType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-heading/10 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  >
                    <option value="">Select partner type</option>
                    {partnerTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-heading mb-2">
                  Tell Us About Your Interest *
                </label>
                <textarea
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-heading/10 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                  placeholder="Describe your organization and how you'd like to partner with ReachFood..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/30"
              >
                Submit Partnership Inquiry
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-heading text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl lg:text-4xl font-bold mb-6">
            Let's Build the Future of Food Together
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Join us in our mission to make nutritious, sustainable meals accessible to everyone, everywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-heading font-semibold rounded-full hover:bg-cream transition-all duration-300"
            >
              Learn About Our Mission
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-full border-2 border-white hover:bg-white hover:text-heading transition-all duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
