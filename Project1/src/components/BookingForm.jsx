import { useState } from 'react';
import { motion } from 'framer-motion';

export default function BookingForm({ event, currentUser, onBook }) {
  const isStudent = currentUser.email.toLowerCase().endsWith('@veltech.edu.in');
  const actualPrice = isStudent ? 0 : event.price;

  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    department: '',
    vtuNumber: '',
    tickets: 1
  });

  const [touched, setTouched] = useState({});

  const isDeptValid = formData.department.trim().length > 0;
  const isTicketsValid = formData.tickets > 0 && formData.tickets <= event.availableTickets;
  const isVtuValid = isStudent ? formData.vtuNumber.trim().length > 0 : true;

  const isValid = isDeptValid && isTicketsValid && isVtuValid;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tickets' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ department: true, tickets: true, vtuNumber: true });
    if (isValid) {
      onBook({
        ...formData,
        totalAmount: formData.tickets * actualPrice
      });
    }
  };

  return (
    <section id="booking-section" style={{ padding: '4rem 0' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass"
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '3rem',
            background: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: 'var(--primary-dark)' }}>Book Your Spot</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name *</label>
              <input 
                type="text" 
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address *</label>
              <input 
                type="email" 
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>
            
            {isStudent && (
              <div className="form-group">
                <label className="form-label" htmlFor="vtuNumber">VTU Number *</label>
                <input 
                  type="text" 
                  id="vtuNumber"
                  name="vtuNumber"
                  className="form-control"
                  placeholder="e.g. VTU12345"
                  value={formData.vtuNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.vtuNumber && !isVtuValid && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 500 }}>
                    VTU Number is mandatory for Veltech students.
                  </motion.span>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="department">Your Department *</label>
              <input 
                type="text" 
                id="department"
                name="department"
                className="form-control"
                placeholder="e.g. Information Technology"
                value={formData.department}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.department && !isDeptValid && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 500 }}>
                  Department is a mandatory field.
                </motion.span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tickets">Number of Tickets *</label>
              <input 
                type="number" 
                id="tickets"
                name="tickets"
                className="form-control"
                min="1"
                max={event.availableTickets}
                value={formData.tickets}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.tickets && (formData.tickets <= 0 || formData.tickets === '') && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 500 }}>
                  Number of tickets must be a positive number.
                </motion.span>
              )}
              {touched.tickets && formData.tickets > event.availableTickets && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 500 }}>
                  Cannot book more tickets than available ({event.availableTickets}).
                </motion.span>
              )}
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1.5rem 0',
              borderTop: '1px solid rgba(0,0,0,0.1)',
              marginTop: '1.5rem'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Total Amount:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: isStudent ? '#5cb85c' : 'var(--primary-dark)' }}>
                {isStudent ? 'Free' : `₹${(formData.tickets && formData.tickets > 0 ? formData.tickets : 0) * actualPrice}.00`}
              </span>
            </div>

            <button 
              type="submit" 
              className="btn" 
              style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
            >
              Confirm Booking
            </button>
            
            {(!isValid && Object.values(touched).some(t => t)) && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '1rem', textAlign: 'center', color: '#d9534f', fontSize: '0.9rem', fontWeight: 500 }}>
                 Please fix the validation errors above to proceed.
               </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
