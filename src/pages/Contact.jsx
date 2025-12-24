import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    inquiryType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const inquiryTypes = [
    'General Inquiry',
    'Partnership Opportunity',
    'Emergency Relief',
    'Product Information',
    'Press & Media',
    'Investment',
    'Other'
  ];

  const offices = [
    {
      name: 'MENA Operations Center',
      location: 'Dubai Technology Park, UAE',
      country: 'United Arab Emirates',
      focus: 'Cultural Cuisine & Regional Partnerships'
    },
    {
      name: 'Jordan Office',
      location: 'Amman, Jordan',
      country: 'Jordan',
      focus: 'Research & Development Hub'
    },
    {
      name: 'KSA Office',
      location: 'Riyadh, Saudi Arabia',
      country: 'Saudi Arabia',
      focus: 'Regional Distribution & Partnerships'
    }
  ];

  const responseTimes = [
    { type: 'General inquiries', time: '24-48 hours' },
    { type: 'Partnership opportunities', time: '2-5 business days' },
    { type: 'Emergency relief', time: 'Priority response' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      organization: '',
      inquiryType: '',
      message: ''
    });

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

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
              Send Us a Message
            </h1>
            <p className="text-lg lg:text-xl text-heading-light max-w-3xl mx-auto leading-relaxed">
              Have questions about ReachFood? Want to partner with us?
              We'd love to hear from you. Reach out and let's start a conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted && (
            <div className="mb-8 p-6 bg-teal/10 border border-teal/20 rounded-2xl text-center">
              <p className="text-teal font-semibold text-lg">Thank you for your message!</p>
              <p className="text-heading-light mt-2">We'll get back to you as soon as possible.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-heading font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Your first name"
                  required
                  className="w-full px-5 py-4 bg-cream border-2 border-transparent rounded-xl text-heading placeholder-heading-light/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-heading font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Your last name"
                  required
                  className="w-full px-5 py-4 bg-cream border-2 border-transparent rounded-xl text-heading placeholder-heading-light/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-heading font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                className="w-full px-5 py-4 bg-cream border-2 border-transparent rounded-xl text-heading placeholder-heading-light/50 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Organization */}
            <div>
              <label htmlFor="organization" className="block text-heading font-medium mb-2">
                Organization <span className="text-heading-light font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Your organization or company"
                className="w-full px-5 py-4 bg-cream border-2 border-transparent rounded-xl text-heading placeholder-heading-light/50 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Inquiry Type */}
            <div>
              <label htmlFor="inquiryType" className="block text-heading font-medium mb-2">
                Inquiry Type
              </label>
              <select
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-cream border-2 border-transparent rounded-xl text-heading focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%230D4A52' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
              >
                <option value="" disabled>Select inquiry type</option>
                {inquiryTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-heading font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your interest in ReachFood..."
                required
                rows={6}
                className="w-full px-5 py-4 bg-cream border-2 border-transparent rounded-xl text-heading placeholder-heading-light/50 focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary text-white font-semibold text-lg rounded-xl hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* Global Presence Section */}
      <section className="py-20 lg:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-4">
              Global Presence
            </h2>
            <p className="text-heading-light text-lg max-w-3xl mx-auto">
              ReachFood operates globally with strategic locations that support our mission of making
              nutrition accessible everywhere. From technology development to cultural cuisine expertise
              and emergency response.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="mb-6">
                  <h3 className="font-playfair text-xl font-semibold text-heading mb-2">
                    {office.name}
                  </h3>
                  <p className="text-heading-light">
                    {office.location}
                  </p>
                </div>

                <div className="pt-4 border-t border-heading/10">
                  <p className="text-primary font-semibold mb-2">
                    {office.country}
                  </p>
                  <p className="text-heading-light text-sm">
                    {office.focus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Response Times Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-playfair text-2xl lg:text-3xl font-bold text-heading mb-8 text-center">
            Response Times
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {responseTimes.map((item, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-cream hover:bg-cream-dark transition-colors"
              >
                <p className="text-heading font-medium mb-2">{item.type}</p>
                <p className="text-primary font-semibold text-lg">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-heading text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Nutrition Access?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Join organizations worldwide who are using ReachFood to provide reliable, hot nutrition
            in any environment, anywhere, anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/30"
            >
              Explore Our Products
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-full hover:bg-white hover:text-heading transition-all duration-300 border-2 border-white"
            >
              Learn About Our Mission
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
