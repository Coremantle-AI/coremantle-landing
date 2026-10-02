'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MESSAGES, submitEnquiry, triggerLabel, validateEnquiry } from '@/lib/contact/contact-form';
import { isBackdropClick, onDelegatedClick } from '@/lib/utils/dialog';
import { cn } from '@/lib/utils/cn';

const OPEN_CLASS = 'contact-dialog-open';
const EMPTY_NOTE = { text: '', error: false };

/**
 * Shared "Request access" modal. Any element with `data-contact-form`
 * (rendered by <Button contactForm>) opens it; the trigger's mailto subject
 * becomes the enquiry label. Posts to FormSubmit as JSON.
 */
export default function ContactDialog() {
  const dialogRef = useRef(null);
  const formRef = useRef(null);
  const triggerRef = useRef(null);
  const inquiryRef = useRef('Website enquiry');
  const [note, setNote] = useState(EMPTY_NOTE);
  const [invalidField, setInvalidField] = useState(null);
  const [sending, setSending] = useState(false);

  const open = useCallback(trigger => {
    const dialog = dialogRef.current;
    triggerRef.current = trigger;
    inquiryRef.current = triggerLabel(trigger);
    setInvalidField(null);
    setNote(EMPTY_NOTE);
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add(OPEN_CLASS);
    requestAnimationFrame(() => formRef.current?.elements.name.focus());
  }, []);

  useEffect(() => onDelegatedClick('[data-contact-form]', open), [open]);

  useEffect(
    () => () => {
      // leaving the page with the dialog open must not strand the class
      document.documentElement.classList.remove(OPEN_CLASS);
    },
    [],
  );

  const close = () => dialogRef.current?.close();

  const onClose = () => {
    document.documentElement.classList.remove(OPEN_CLASS);
    if (triggerRef.current?.isConnected) triggerRef.current.focus();
  };

  const onCancel = event => {
    event.preventDefault();
    close();
  };

  const onClick = event => {
    if (event.target.closest('[data-contact-close]') || isBackdropClick(dialogRef.current, event)) close();
  };

  const onSubmit = async event => {
    event.preventDefault();
    const form = formRef.current;
    const value = name => form.elements[name]?.value.trim() ?? '';
    setInvalidField(null);
    setNote(EMPTY_NOTE);

    const fields = { name: value('name'), email: value('email'), phone: value('phone') };
    const problem = validateEnquiry(fields);
    if (problem) {
      setNote({ text: problem.message, error: true });
      setInvalidField(problem.field);
      form.elements[problem.field].focus();
      return;
    }

    // disable synchronously, before React commits, so the browser blurs the
    // button at once (focus behaviour matches the original form)
    form.querySelector('button[type="submit"]').disabled = true;
    setSending(true);
    setNote({ text: MESSAGES.sending, error: false });
    try {
      await submitEnquiry({
        ...fields,
        domain: value('domain'),
        message: value('message'),
        inquiry: inquiryRef.current,
        _honey: value('_honey'),
      });
      form.reset();
      setNote({ text: MESSAGES.sent, error: false });
    } catch {
      setNote({ text: MESSAGES.failed, error: true });
    } finally {
      setSending(false);
    }
  };

  const invalid = field => (invalidField === field ? 'true' : undefined);

  return (
    <dialog
      ref={dialogRef}
      className="contact-dialog"
      aria-labelledby="contact-dialog-title"
      aria-describedby="contact-dialog-description"
      onClick={onClick}
      onClose={onClose}
      onCancel={onCancel}
    >
      <div className="contact-dialog__inner">
        <button className="contact-dialog__close" type="button" data-contact-close aria-label="Close contact form" />
        <p className="contact-dialog__eyebrow">Request access</p>
        <h2 id="contact-dialog-title">Tell us a bit about you.</h2>
        <p className="contact-dialog__lede" id="contact-dialog-description">
          We will route this straight to our team and follow up by email.
        </p>
        <form ref={formRef} className="contact-form" data-contact-submit noValidate onSubmit={onSubmit}>
          <div className="contact-form__split">
            <label>
              Full name
              <input type="text" name="name" autoComplete="name" required placeholder="Your name" aria-invalid={invalid('name')} />
            </label>
            <label>
              Work email
              <input type="email" name="email" autoComplete="email" required placeholder="you@company.com" aria-invalid={invalid('email')} />
            </label>
          </div>
          <div className="contact-form__split">
            <label>
              Phone number
              <input type="tel" name="phone" autoComplete="tel" placeholder="+91 98765 43210" aria-invalid={invalid('phone')} />
            </label>
            <label>
              Domain
              <input type="text" name="domain" autoComplete="off" placeholder="Enterprise, frontier lab, etc." />
            </label>
          </div>
          <label>
            What are you looking to build?
            <textarea name="message" rows={3} placeholder="Tell us about your data or model needs" />
          </label>
          {/* honeypot: bots fill it, people never see it */}
          <input type="text" name="_honey" tabIndex={-1} autoComplete="off" hidden />
          <button className="contact-form__submit" type="submit" disabled={sending}>
            {sending ? 'Sending...' : 'Send request'}
          </button>
          <p className={cn('contact-form__note', note.error && 'is-error')} data-contact-note role="status" aria-live="polite">
            {note.text}
          </p>
        </form>
      </div>
    </dialog>
  );
}
