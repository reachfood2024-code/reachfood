import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Partner() {
  const { t, isRTL } = useLanguage();
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
    { value: 'distributor', label: t('partner.distributor') },
    { value: 'retailer', label: t('partner.retailer') },
    { value: 'research', label: t('partner.research') },
    { value: 'ngo', label: t('partner.ngo') },
    { value: 'government', label: t('partner.government') },
    { value: 'other', label: t('partner.other') }
  ];

  const opportunities = [
    {
      title: t('partner.regionalExpansion'),
      description: t('partner.regionalExpansionDesc')
    },
    {
      title: t('partner.localFlavors'),
      description: t('partner.localFlavorsDesc')
    },
    {
      title: t('partner.sharedValues'),
      description: t('partner.sharedValuesDesc')
    }
  ];

  const partnerCategories = [
    { title: t('partner.distributors'), desc: t('partner.distributorsDesc') },
    { title: t('partner.retailers'), desc: t('partner.retailersDesc') },
    { title: t('partner.researchInstitutions'), desc: t('partner.researchInstitutionsDesc') },
    { title: t('partner.ngos'), desc: t('partner.ngosDesc') },
    { title: t('partner.governmentAgencies'), desc: t('partner.governmentAgenciesDesc') },
    { title: t('partner.foodServiceProviders'), desc: t('partner.foodServiceProvidersDesc') }
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
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              {t('partner.tagline')}
            </p>
            <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-heading mb-6">
              {t('partner.title')}
            </h1>
            <p className="text-2xl lg:text-3xl text-primary font-medium mb-8">
              {t('partner.subtitle')}
            </p>
            <p className="text-lg lg:text-xl text-heading-light max-w-3xl mx-auto leading-relaxed">
              {t('partner.heroDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-4">
              {t('partner.whyPartner')}
            </h2>
            <p className="text-heading-light text-lg max-w-2xl mx-auto">
              {t('partner.whyPartnerDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {opportunities.map((opportunity, index) => (
              <div
                key={index}
                className={`bg-cream rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${isRTL ? 'text-right' : ''}`}
              >
                <div className={`w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto' : ''}`}>
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
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-4">
              {t('partner.whoLookingFor')}
            </h2>
            <p className="text-heading-light text-lg max-w-2xl mx-auto">
              {t('partner.whoLookingForDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerCategories.map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 ${isRTL ? 'text-right' : ''}`}
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
          <div className={`text-center mb-12 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-4">
              {t('partner.joinAsPartner')}
            </h2>
            <p className="text-heading-light text-lg max-w-2xl mx-auto">
              {t('partner.joinAsPartnerDesc')}
            </p>
          </div>

          {isSubmitted ? (
            <div className={`bg-cream rounded-3xl p-12 text-center ${isRTL ? 'text-right' : ''}`}>
              <div className={`w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ${isRTL ? 'mr-auto ml-auto' : ''}`}>
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-playfair text-2xl font-semibold text-heading mb-4">
                {t('partner.thankYouTitle')}
              </h3>
              <p className="text-heading-light text-lg">
                {t('partner.thankYouDesc')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-cream rounded-3xl p-8 lg:p-12">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={`block text-sm font-medium text-heading mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {t('partner.yourName')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white rounded-xl border border-heading/10 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${isRTL ? 'text-right' : ''}`}
                    placeholder={t('partner.namePlaceholder')}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-heading mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {t('partner.emailAddress')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white rounded-xl border border-heading/10 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${isRTL ? 'text-right' : ''}`}
                    placeholder={t('partner.emailPlaceholder')}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={`block text-sm font-medium text-heading mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {t('partner.organization')}
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white rounded-xl border border-heading/10 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${isRTL ? 'text-right' : ''}`}
                    placeholder={t('partner.organizationPlaceholder')}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-heading mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {t('partner.partnerType')} *
                  </label>
                  <select
                    name="partnerType"
                    required
                    value={formData.partnerType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white rounded-xl border border-heading/10 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${isRTL ? 'text-right' : ''}`}
                  >
                    <option value="">{t('partner.selectPartnerType')}</option>
                    {partnerTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-8">
                <label className={`block text-sm font-medium text-heading mb-2 ${isRTL ? 'text-right' : ''}`}>
                  {t('partner.tellUsInterest')} *
                </label>
                <textarea
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white rounded-xl border border-heading/10 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none ${isRTL ? 'text-right' : ''}`}
                  placeholder={t('partner.interestPlaceholder')}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/30"
              >
                {t('partner.submitInquiry')}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-heading text-white">
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${isRTL ? 'text-right' : ''}`}>
          <h2 className="font-playfair text-3xl lg:text-4xl font-bold mb-6">
            {t('partner.ctaTitle')}
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            {t('partner.ctaDesc')}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <a
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-heading font-semibold rounded-full hover:bg-cream transition-all duration-300"
            >
              {t('partner.learnMission')}
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-full border-2 border-white hover:bg-white hover:text-heading transition-all duration-300"
            >
              {t('partner.contactUs')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
