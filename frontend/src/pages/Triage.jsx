import React, { useState } from 'react';
import API from '../api/axiosConfig';

const urgencyColors = {
  Emergency: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
  Urgent:    { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
  Routine:   { bg: '#dcfce7', text: '#166534', border: '#86efac' },
};

const Triage = () => {
  const [symptoms, setSymptoms]   = useState('');
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      // ✅ THIS IS WHERE YOUR CODE GOES
      const response = await API.post('/ai/triage', { symptoms });
      setResult(response.data.triage);
    } catch (err) {
      setError(err.response?.data?.message || 'Triage AI is offline. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const colors = result ? urgencyColors[result.urgency] : null;

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', padding: '60px 24px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#3b82f6' }}>
            AI-Powered
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: '8px 0' }}>
            Symptom Triage
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
            Describe how you're feeling and our AI will direct you to the right department.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: '28px', marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748b', display: 'block', marginBottom: 10 }}>
              Describe Your Symptoms
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={5}
              placeholder="e.g. I have had a severe headache for 2 days, my vision is blurry and I feel nauseous..."
              style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '14px 16px', fontSize: 14, color: '#0f172a', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>Minimum 10 characters</span>
              <span style={{ fontSize: 11, color: symptoms.length > 900 ? '#ef4444' : '#94a3b8' }}>
                {symptoms.length} / 1000
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 14, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#991b1b' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || symptoms.trim().length < 10}
            style={{ width: '100%', padding: '16px', background: loading || symptoms.trim().length < 10 ? '#cbd5e1' : '#1d4ed8', color: '#fff', border: 'none', borderRadius: 16, fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.18em', cursor: loading || symptoms.trim().length < 10 ? 'not-allowed' : 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {loading ? (
              <>
                <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Analyzing Symptoms...
              </>
            ) : (
              'Analyze My Symptoms'
            )}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div style={{ marginTop: 28, background: '#fff', border: `1.5px solid ${colors.border}`, borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

            {/* Urgency banner */}
            <div style={{ background: colors.bg, padding: '20px 28px', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: colors.text, margin: 0 }}>Urgency Level</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: colors.text, margin: '4px 0 0', letterSpacing: '-0.02em' }}>{result.urgency}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: colors.text, margin: 0 }}>Recommended Department</p>
                <p style={{ fontSize: 16, fontWeight: 800, color: colors.text, margin: '4px 0 0' }}>{result.department}</p>
              </div>
            </div>

            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Advice */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748b', marginBottom: 6 }}>What To Do Now</p>
                <p style={{ fontSize: 15, color: '#1e293b', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>{result.advice}</p>
              </div>

              {/* Red flags */}
              {result.redFlags?.length > 0 && (
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748b', marginBottom: 8 }}>Warning Signs — Go to ER if you experience:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {result.redFlags.map((flag, i) => (
                      <span key={i} style={{ padding: '5px 12px', background: '#fee2e2', color: '#991b1b', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div style={{ background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '12px 16px' }}>
                <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{result.disclaimer}</p>
              </div>

              {/* Reset */}
              <button
                onClick={() => { setResult(null); setSymptoms(''); }}
                style={{ width: '100%', padding: '14px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 14, fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer' }}
              >
                Start Over
              </button>
            </div>
          </div>
        )}

        {/* Disclaimer footer */}
        <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 24, lineHeight: 1.6 }}>
          This tool does not replace a real doctor. In a life-threatening emergency call <strong style={{ color: '#1d4ed8' }}>911</strong> immediately.
        </p>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};

export default Triage;