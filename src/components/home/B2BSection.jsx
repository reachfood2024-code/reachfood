import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useLanguage } from '../../context/LanguageContext';

export default function B2BSection() {
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const submitB2BLead = useMutation(api.b2bLeads.submit);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError(t('b2b.emailRequired'));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('b2b.emailInvalid'));
      return;
    }

    setIsSubmitting(true);

    try {
      await submitB2BLead({
        email,
        businessName: businessName || undefined,
        source: 'homepage_b2b_section',
      });
      setSubmitted(true);
      setEmail('');
      setBusinessName('');
    } catch (err) {
      setError(t('b2b.errorMessage'));
      console.error('B2B submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-heading to-teal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center ${isRTL ? 'direction-rtl' : ''}`}>
          {/* Heading */}
          <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-white mb-4">
            {t('b2b.title')}
          </h2>

          <p className="text-white/90 text-lg lg:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('b2b.description')}
          </p>

          <p className="text-white/80 mb-10 max-w-xl mx-auto">
            {t('b2b.subtitle')}
          </p>

          {/* Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="space-y-4">
                {/* Business Name (optional) */}
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder={t('b2b.businessNamePlaceholder')}
                  className={`w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                />

                {/* Email */}
                <div className={`flex flex-col sm:flex-row gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('b2b.emailPlaceholder')}
                    required
                    className={`flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isSubmitting ? t('b2b.joining') : t('b2b.joinWaitingList')}
                  </button>
                </div>
              </div>

              {error && (
                <p className="mt-4 text-red-300 text-sm">{error}</p>
              )}

              <p className="mt-4 text-white/60 text-sm">
                {t('b2b.privacyNote')}
              </p>
            </form>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto border border-white/20">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-400 text-3xl">&#10003;</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('b2b.successTitle')}
              </h3>
              <p className="text-white/80">
                {t('b2b.successMessage')}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
