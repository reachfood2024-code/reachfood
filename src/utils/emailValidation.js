// Known email providers
const KNOWN_PROVIDERS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'yahoo.co.uk',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'live.com',
  'msn.com',
  'protonmail.com',
  'proton.me',
  'mail.com',
  'zoho.com',
  'yandex.com',
  'gmx.com',
  'gmx.net',
];

// Common typos and their corrections
const TYPO_CORRECTIONS = {
  // Gmail typos
  'gmial.com': 'gmail.com',
  'gmile.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmali.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gemail.com': 'gmail.com',
  'gimail.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.cpm': 'gmail.com',
  'gmsil.com': 'gmail.com',
  'gmaikl.com': 'gmail.com',

  // Hotmail typos
  'hotmal.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmaill.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'hotmail.cm': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'hotnail.com': 'hotmail.com',
  'hitmail.com': 'hotmail.com',

  // Outlook typos
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outlool.com': 'outlook.com',
  'outloook.com': 'outlook.com',
  'outlook.co': 'outlook.com',
  'outlook.cm': 'outlook.com',
  'outlook.con': 'outlook.com',
  'outlock.com': 'outlook.com',

  // Yahoo typos
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahho.com': 'yahoo.com',
  'yaoo.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'yahoo.cm': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'yhaoo.com': 'yahoo.com',

  // iCloud typos
  'iclould.com': 'icloud.com',
  'icoud.com': 'icloud.com',
  'icloud.co': 'icloud.com',
  'icloud.cm': 'icloud.com',
};

/**
 * Validates email and checks for known providers and typos
 * @param {string} email - Email to validate
 * @returns {{ valid: boolean, error?: string, suggestion?: string }}
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { valid: false, error: 'required' };
  }

  const trimmedEmail = email.trim().toLowerCase();

  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'invalid_format' };
  }

  // Extract domain
  const domain = trimmedEmail.split('@')[1];

  // Check for typos
  if (TYPO_CORRECTIONS[domain]) {
    const correctedEmail = trimmedEmail.replace(domain, TYPO_CORRECTIONS[domain]);
    return {
      valid: false,
      error: 'typo',
      suggestion: correctedEmail,
      originalDomain: domain,
      correctedDomain: TYPO_CORRECTIONS[domain]
    };
  }

  // Check if provider is known
  const isKnownProvider = KNOWN_PROVIDERS.includes(domain) ||
    // Allow business/custom domains (has at least one dot before TLD)
    domain.split('.').length >= 2;

  if (!isKnownProvider) {
    return { valid: false, error: 'unknown_provider' };
  }

  return { valid: true };
}

/**
 * Get error message based on validation result
 * @param {object} result - Validation result
 * @param {function} t - Translation function
 * @returns {string} Error message
 */
export function getEmailErrorMessage(result, t) {
  switch (result.error) {
    case 'required':
      return t('validation.emailRequired');
    case 'invalid_format':
      return t('validation.emailInvalid');
    case 'typo':
      return t('validation.emailTypo').replace('{suggestion}', result.suggestion);
    case 'unknown_provider':
      return t('validation.emailUnknownProvider');
    default:
      return t('validation.emailInvalid');
  }
}
