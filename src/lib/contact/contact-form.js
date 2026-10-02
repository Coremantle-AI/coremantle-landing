// Contact form rules and transport. Kept framework-free so the validation is
// unit-testable and shared by any UI that collects an enquiry.

export const FORM_ENDPOINT = 'https://formsubmit.co/ajax/contact@coremantle.ai';

const FREE_MAIL =
  /@(gmail|googlemail|yahoo|ymail|rocketmail|hotmail|outlook|live|msn|icloud|me|aol|proton|protonmail|pm|mail|gmx|yandex|rediffmail|zohomail)\./i;

const SUBMIT_TIMEOUT_MS = 15000;

export const MESSAGES = {
  name: 'Please add your name.',
  email: 'Please add a valid work email.',
  personalEmail: 'That looks like a personal address. Please use your work email.',
  phone: 'That phone number does not look right. Please include your country code.',
  sending: 'Sending your request...',
  sent: 'Thanks. We will be in touch within two business days.',
  failed: 'Something went wrong. Please email contact@coremantle.ai directly.',
};

export function validPhone(value) {
  const digits = value.replace(/[\s().-]/g, '');
  return /^\+\d{7,15}$/.test(digits) || /^[6-9]\d{9}$/.test(digits);
}

/**
 * @returns {{ field: string, message: string } | null} the first problem, if any
 */
export function validateEnquiry({ name, email, phone }) {
  if (!name) return { field: 'name', message: MESSAGES.name };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { field: 'email', message: MESSAGES.email };
  if (FREE_MAIL.test(email)) return { field: 'email', message: MESSAGES.personalEmail };
  if (phone && !validPhone(phone)) return { field: 'phone', message: MESSAGES.phone };
  return null;
}

/**
 * The enquiry label shown in the email subject: an explicit
 * data-contact-subject, else the trigger's mailto subject, else its text.
 */
export function triggerLabel(trigger) {
  let label = trigger.getAttribute('data-contact-subject');
  const href = trigger.getAttribute('href') || '';

  if (!label && /^mailto:/i.test(href)) {
    try {
      label = new URL(href).searchParams.get('subject');
    } catch {
      label = '';
    }
  }

  label = label || trigger.textContent.trim() || 'Website enquiry';
  return label.replace(/[\r\n]+/g, ' ').slice(0, 120);
}

export async function submitEnquiry(fields) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);
  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ...fields,
        page: window.location.href,
        _subject: 'New contact request - coremantle.ai',
        _template: 'table',
        _captcha: 'false',
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(String(response.status));
  } finally {
    window.clearTimeout(timeout);
  }
}
