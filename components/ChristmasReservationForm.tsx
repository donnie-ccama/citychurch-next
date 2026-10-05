'use client';

import { useMemo, useState } from 'react';
import {
  type ChristmasBanquet,
  formatBanquetDate,
  formatBanquetTime,
  tablesAvailable,
} from '@/lib/christmas';

interface ChristmasReservationFormProps {
  banquets: ChristmasBanquet[];
  location: string;
  usingPreviewData: boolean;
}

interface Confirmation {
  confirmationCode: string;
  status: 'confirmed' | 'waitlisted';
  contactName: string;
  guestCount: number;
  eventDate: string;
  doorsOpen: string;
  dinnerAt: string;
  endsAt: string;
  location: string;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.875rem 1rem',
  fontSize: '1rem',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  fontFamily: "'Inter', system-ui, sans-serif",
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 650,
  marginBottom: '0.5rem',
  color: 'var(--text-primary)',
};

function availabilityLabel(banquet: ChristmasBanquet): string {
  const available = tablesAvailable(banquet);
  if (available === 0) return 'Full';
  if (available <= 3) return `Only ${available} ${available === 1 ? 'table' : 'tables'} left`;
  return `${available} tables available`;
}

export default function ChristmasReservationForm({
  banquets: initialBanquets,
  location,
  usingPreviewData,
}: ChristmasReservationFormProps) {
  const [banquets, setBanquets] = useState(initialBanquets);
  const firstAvailable = banquets.find((banquet) => tablesAvailable(banquet) > 0);
  const [selectedBanquetId, setSelectedBanquetId] = useState(
    firstAvailable?.id ?? banquets[0]?.id ?? ''
  );
  const [formData, setFormData] = useState({
    contactName: '',
    email: '',
    phone: '',
    guestCount: '1',
    attendsChurchRegularly: '',
    churchName: '',
    dietaryNotes: '',
    accessibilityNotes: '',
    comments: '',
    website: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [previewConfirmation, setPreviewConfirmation] = useState(false);

  const allFull = useMemo(
    () => banquets.length > 0 && banquets.every((banquet) => tablesAvailable(banquet) === 0),
    [banquets]
  );
  const selectedBanquet = banquets.find((banquet) => banquet.id === selectedBanquetId);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const response = await fetch('/api/christmas/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          banquetId: selectedBanquetId,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          guestCount: Number(formData.guestCount),
          attendsChurchRegularly: formData.attendsChurchRegularly === 'yes',
          churchName:
            formData.attendsChurchRegularly === 'yes' ? formData.churchName : '',
          dietaryNotes: formData.dietaryNotes,
          accessibilityNotes: formData.accessibilityNotes,
          comments: formData.comments,
          website: formData.website,
          joinWaitlist: allFull,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.code === 'BANQUET_FULL' && Array.isArray(result.banquets)) {
          setBanquets((current) =>
            current.map((banquet) => {
              const fresh = result.banquets.find((item: { id: string }) => item.id === banquet.id);
              return fresh ? { ...banquet, ...fresh } : banquet;
            })
          );
          const alternative = banquets.find(
            (banquet) => banquet.id !== selectedBanquetId && tablesAvailable(banquet) > 0
          );
          if (alternative) setSelectedBanquetId(alternative.id);
        }
        setError(result.error ?? 'Something went wrong. Please try again.');
        setStatus('idle');
        return;
      }

      if (result.reservation) {
        setConfirmation(result.reservation as Confirmation);
        setPreviewConfirmation(result.preview === true);
        setStatus('success');
      } else {
        setError('Please try again or contact Citychurch for help.');
        setStatus('idle');
      }
    } catch {
      setError('We could not reach the registration service. Please try again.');
      setStatus('idle');
    }
  };

  if (status === 'success' && confirmation) {
    const waitlisted = confirmation.status === 'waitlisted';
    return (
      <div
        role="status"
        style={{
          padding: 'clamp(1.5rem, 5vw, 2.5rem)',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          boxShadow: '0 12px 34px rgba(54, 41, 35, 0.08)',
        }}
      >
        <p
          style={{
            color: 'var(--accent)',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          {waitlisted ? 'Waitlist received' : 'Table reserved'}
        </p>
        <h2
          style={{
            fontSize: 'clamp(1.65rem, 5vw, 2.25rem)',
            lineHeight: 1.15,
            letterSpacing: '-0.035em',
            marginBottom: '0.875rem',
          }}
        >
          {waitlisted
            ? `We’ll contact you if a table opens, ${confirmation.contactName}.`
            : `We’ll see your family on ${formatBanquetDate(confirmation.eventDate, false)}.`}
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.75rem' }}>
          {waitlisted
            ? 'Your selected banquet is currently full. Your place on the waitlist is saved.'
            : `One table is reserved for up to ${confirmation.guestCount} ${confirmation.guestCount === 1 ? 'guest' : 'guests'}.`}
        </p>

        <div
          style={{
            backgroundColor: 'var(--bg-muted)',
            borderRadius: '10px',
            padding: '1.25rem',
            display: 'grid',
            gap: '0.875rem',
          }}
        >
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Confirmation
            </p>
            <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 750 }}>
              {confirmation.confirmationCode}
            </p>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Banquet
            </p>
            <p style={{ color: 'var(--text-primary)', fontWeight: 650 }}>
              {formatBanquetDate(confirmation.eventDate)}
            </p>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Schedule
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Doors open {formatBanquetTime(confirmation.doorsOpen)} · Dinner {formatBanquetTime(confirmation.dinnerAt)} · Ends {formatBanquetTime(confirmation.endsAt)}
            </p>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Location
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{confirmation.location}</p>
          </div>
        </div>

        {previewConfirmation && (
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Local preview: this sample confirmation was not stored or emailed.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {usingPreviewData && process.env.NODE_ENV === 'development' && (
        <div
          style={{
            padding: '0.875rem 1rem',
            marginBottom: '1.5rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(234, 179, 8, 0.12)',
            border: '1px solid rgba(202, 138, 4, 0.35)',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
          }}
        >
          Local preview mode is using the configured banquet dates and sample availability.
        </div>
      )}

      <fieldset style={{ border: 0, padding: 0, margin: '0 0 2.25rem' }}>
        <legend
          style={{
            fontSize: '1.15rem',
            fontWeight: 750,
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
          }}
        >
          Choose your banquet
        </legend>
        <div className="christmas-banquet-grid">
          {banquets.map((banquet) => {
            const available = tablesAvailable(banquet);
            const isFull = available === 0;
            const selected = banquet.id === selectedBanquetId;
            const disabled = isFull && !allFull;

            return (
              <label
                key={banquet.id}
                style={{
                  display: 'block',
                  border: `2px solid ${selected ? 'var(--accent)' : 'var(--border-color)'}`,
                  borderRadius: '12px',
                  padding: '1.25rem',
                  backgroundColor: selected ? 'color-mix(in oklch, var(--accent) 7%, var(--bg-card))' : 'var(--bg-card)',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.58 : 1,
                  transition: 'border-color 0.2s ease, transform 0.2s ease',
                }}
              >
                <input
                  type="radio"
                  name="banquet"
                  value={banquet.id}
                  checked={selected}
                  disabled={disabled}
                  onChange={() => {
                    setSelectedBanquetId(banquet.id);
                    setError('');
                  }}
                  style={{ accentColor: 'var(--accent)', marginRight: '0.625rem' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Banquet {banquet.display_order}
                </span>
                <p style={{ margin: '0.65rem 0 0.5rem', fontSize: '1.2rem', fontWeight: 780, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
                  {formatBanquetDate(banquet.event_date, false)}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.65 }}>
                  Doors {formatBanquetTime(banquet.doors_open)}<br />
                  Dinner {formatBanquetTime(banquet.dinner_at)} · Ends {formatBanquetTime(banquet.ends_at)}
                </p>
                <p
                  style={{
                    marginTop: '0.9rem',
                    color: isFull ? 'var(--text-muted)' : available <= 3 ? '#b45309' : 'var(--accent)',
                    fontSize: '0.8125rem',
                    fontWeight: 750,
                  }}
                >
                  {availabilityLabel(banquet)}
                </p>
              </label>
            );
          })}
        </div>
        {allFull && (
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9rem' }}>
            Both banquets are full. Choose your preferred date and submit the form to join its waitlist.
          </p>
        )}
      </fieldset>

      <div className="christmas-form-grid">
        <div>
          <label htmlFor="christmas-contact-name" style={labelStyle}>Parent or guardian name</label>
          <input
            id="christmas-contact-name"
            name="contactName"
            type="text"
            autoComplete="name"
            required
            value={formData.contactName}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="christmas-guests" style={labelStyle}>Guests at your table</label>
          <select
            id="christmas-guests"
            name="guestCount"
            required
            value={formData.guestCount}
            onChange={handleChange}
            style={inputStyle}
          >
            {Array.from({ length: 8 }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>{count} {count === 1 ? 'guest' : 'guests'}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="christmas-email" style={labelStyle}>Email</label>
          <input
            id="christmas-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="christmas-phone" style={labelStyle}>Mobile phone</label>
          <input
            id="christmas-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="(806) 555-0123"
            style={inputStyle}
          />
        </div>
      </div>

      <div className="christmas-form-grid" style={{ marginTop: '1.5rem' }}>
        <div>
          <label htmlFor="christmas-church-attendance" style={labelStyle}>
            Do you regularly attend a church?
          </label>
          <select
            id="christmas-church-attendance"
            name="attendsChurchRegularly"
            required
            value={formData.attendsChurchRegularly}
            onChange={(event) => {
              const value = event.target.value;
              setFormData((current) => ({
                ...current,
                attendsChurchRegularly: value,
                churchName: value === 'yes' ? current.churchName : '',
              }));
            }}
            style={inputStyle}
          >
            <option value="" disabled>Select yes or no</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {formData.attendsChurchRegularly === 'yes' && (
          <div>
            <label htmlFor="christmas-church-name" style={labelStyle}>
              Church name <span style={{ color: 'var(--text-muted)', fontWeight: 450 }}>(optional)</span>
            </label>
            <input
              id="christmas-church-name"
              name="churchName"
              type="text"
              autoComplete="organization"
              maxLength={160}
              value={formData.churchName}
              onChange={handleChange}
              placeholder="Name of the church you attend"
              style={inputStyle}
            />
          </div>
        )}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <label htmlFor="christmas-dietary" style={labelStyle}>
          Dietary needs <span style={{ color: 'var(--text-muted)', fontWeight: 450 }}>(optional)</span>
        </label>
        <input
          id="christmas-dietary"
          name="dietaryNotes"
          type="text"
          value={formData.dietaryNotes}
          onChange={handleChange}
          placeholder="Food allergies or dietary needs"
          style={inputStyle}
        />
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <label htmlFor="christmas-accessibility" style={labelStyle}>
          Accessibility needs <span style={{ color: 'var(--text-muted)', fontWeight: 450 }}>(optional)</span>
        </label>
        <input
          id="christmas-accessibility"
          name="accessibilityNotes"
          type="text"
          value={formData.accessibilityNotes}
          onChange={handleChange}
          placeholder="Wheelchair access, seating assistance, or other needs"
          style={inputStyle}
        />
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <label htmlFor="christmas-comments" style={labelStyle}>
          Anything else we should know? <span style={{ color: 'var(--text-muted)', fontWeight: 450 }}>(optional)</span>
        </label>
        <textarea
          id="christmas-comments"
          name="comments"
          rows={3}
          value={formData.comments}
          onChange={handleChange}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <label htmlFor="christmas-website">Website</label>
        <input
          id="christmas-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      {error && (
        <div
          role="alert"
          style={{
            marginTop: '1.5rem',
            padding: '0.875rem 1rem',
            border: '1px solid rgba(220, 38, 38, 0.35)',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            color: '#b91c1c',
            fontSize: '0.9rem',
            lineHeight: 1.5,
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading' || !selectedBanquet}
        style={{
          width: '100%',
          marginTop: '1.75rem',
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--accent)',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 700,
          border: 0,
          borderRadius: '8px',
          cursor: status === 'loading' ? 'wait' : 'pointer',
          opacity: status === 'loading' ? 0.72 : 1,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {status === 'loading'
          ? 'Saving your table…'
          : allFull
            ? `Join the ${selectedBanquet ? formatBanquetDate(selectedBanquet.event_date, false) : ''} waitlist`
            : 'Reserve My Family’s Table'}
      </button>

      <p style={{ marginTop: '0.875rem', color: 'var(--text-muted)', fontSize: '0.8125rem', lineHeight: 1.55, textAlign: 'center' }}>
        One reservation holds one table for your family, with seating for up to eight guests.
      </p>
      <p style={{ marginTop: '0.45rem', color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.5, textAlign: 'center' }}>
        {location}
      </p>
    </form>
  );
}
