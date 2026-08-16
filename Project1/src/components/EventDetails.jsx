import { motion } from 'framer-motion';

function DetailItem({ label, value, isHighlight }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <span style={{ fontSize: '0.9rem', color: 'var(--soft-neutral)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>
        {label}
      </span>
      <span style={{ fontSize: '1.1rem', fontWeight: 600, color: isHighlight ? '#5cb85c' : 'var(--text)' }}>
        {value}
      </span>
    </div>
  );
}

export default function EventDetails({ event, currentUser }) {
  const isStudent = currentUser.email.toLowerCase().endsWith('@veltech.edu.in');

  return (
    <section style={{ padding: '5rem 0', position: 'relative' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="glass"
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '3rem',
            background: 'rgba(255, 255, 255, 0.65)'
          }}
        >
          <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem', textAlign: 'center', color: 'var(--primary-dark)' }}>Selected Event Details</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem' }}>
            <DetailItem label="Event Name" value={event.name} />
            <DetailItem label="Department" value={event.department} />
            <DetailItem label="Date" value={event.date} />
            <DetailItem label="Time" value={event.time} />
            <DetailItem label="Venue" value={event.venue} />
            <DetailItem 
              label="Ticket Price" 
              value={isStudent ? 'Free (Student Discount)' : `₹${event.price}`} 
              isHighlight={isStudent}
            />
          </div>
          
          <div style={{ 
            marginTop: '3.5rem', 
            padding: '2rem', 
            backgroundColor: 'rgba(249, 219, 194, 0.5)', 
            borderRadius: '20px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.4)'
          }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
              Tickets Available
            </p>
            <motion.div 
              key={event.availableTickets}
              initial={{ scale: 1.2, color: 'var(--accent)' }}
              animate={{ scale: 1, color: 'var(--text)' }}
              transition={{ duration: 0.4 }}
              style={{ fontSize: '3.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}
            >
              {event.availableTickets}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
