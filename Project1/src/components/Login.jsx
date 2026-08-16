import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password || (isRegistering && !formData.name)) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Pass the user and token up to App.jsx
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass"
        style={{
          width: '100%',
          maxWidth: '450px',
          padding: '3rem',
          background: 'rgba(255, 255, 255, 0.75)',
          textAlign: 'center'
        }}
      >
        <img 
          src="/Vel_Logo.webp"
          alt="Veltech Logo" 
          style={{ height: '80px', marginBottom: '2rem' }} 
        />
        
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>
          {isRegistering ? 'Create an Account' : 'Event Booking Portal'}
        </h2>
        <p style={{ color: 'var(--text)', marginBottom: '2rem', fontSize: '0.95rem', opacity: 0.8 }}>
          {isRegistering ? 'Register to get your tickets for free!' : 'Login to access your dashboard'}
        </p>
        
        {error && (
          <div style={{ background: '#f8d7da', color: '#721c24', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          {isRegistering && (
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name"
                name="name"
                className="form-control"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email"
              name="email"
              className="form-control"
              placeholder="e.g. student@veltech.edu.in"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%', marginTop: '1rem', padding: '0.875rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text)' }}>
          {isRegistering ? 'Already have an account? ' : 'Need an account? '}
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--primary-dark)', 
              fontWeight: 600, 
              cursor: 'pointer',
              padding: 0,
              fontSize: '0.9rem',
              textDecoration: 'underline'
            }}
          >
            {isRegistering ? 'Login here' : 'Register here'}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
