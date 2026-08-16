import { motion } from 'framer-motion';

export default function EventList({ events, onSelectEvent, currentUser }) {
  const isStudent = currentUser.email.toLowerCase().endsWith('@veltech.edu.in');

  return (
    <section id="events-section" style={{ padding: '4rem 0' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)' }}>Upcoming Events</h2>
          <p style={{ color: 'var(--text)', marginTop: '0.5rem', fontSize: '1.1rem', opacity: 0.8 }}>
            Select an event to book your tickets.
          </p>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '2rem' 
        }}>
          {events.map((evt, index) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass"
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(138, 115, 125, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ 
                  fontSize: '0.85rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px', 
                  color: 'var(--accent)',
                  fontWeight: 600,
                  marginBottom: '0.5rem'
                }}>
                  {evt.department}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.25rem', color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)' }}>
                  {evt.name}
                </h3>
                <div style={{ color: 'var(--text)', fontSize: '0.95rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: 0.8 }}>
                  <span><strong>Date:</strong> {evt.date}</span>
                  <span><strong>Time:</strong> {evt.time}</span>
                  <span><strong>Venue:</strong> {evt.venue}</span>
                  <span>
                    <strong>Price:</strong>{' '}
                    {isStudent ? (
                      <span style={{ color: '#5cb85c', fontWeight: 600 }}>Free</span>
                    ) : (
                      <span>₹{evt.price}</span>
                    )}
                  </span>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontWeight: 600, color: evt.availableTickets > 0 ? 'var(--primary-dark)' : '#d9534f' }}>
                  {evt.availableTickets > 0 ? `${evt.availableTickets} tickets left` : 'Sold Out'}
                </div>
                <button 
                  className="btn" 
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.95rem' }}
                  onClick={() => {
                    onSelectEvent(evt);
                    setTimeout(() => {
                      document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  disabled={evt.availableTickets === 0}
                >
                  Select
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
