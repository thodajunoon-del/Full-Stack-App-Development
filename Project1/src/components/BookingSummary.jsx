import { motion } from 'framer-motion';

export default function BookingSummary({ bookingData, event, onReset }) {
  const isFree = bookingData.totalAmount === 0;

  return (
    <section style={{ padding: '4rem 0' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass"
          style={{
            maxWidth: '700px',
            margin: '0 auto',
            padding: '4rem 3rem',
            background: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center'
          }}
        >
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}
          >
            Booking Confirmed
          </motion.h2>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--text)', marginBottom: '3rem', opacity: 0.8 }}>
            Thank you, {bookingData.name}. Your ticket has been securely reserved.
          </p>
          
          <div style={{ 
            textAlign: 'left', 
            background: 'rgba(249, 219, 194, 0.3)', 
            padding: '2rem', 
            borderRadius: '16px',
            marginBottom: '3rem'
          }}>
            <SummaryItem label="Event" value={event.name} />
            <SummaryItem label="Venue" value={event.venue} />
            <SummaryItem label="Department" value={bookingData.department} />
            {bookingData.vtuNumber && <SummaryItem label="VTU Number" value={bookingData.vtuNumber} />}
            <SummaryItem label="Tickets Booked" value={bookingData.tickets} />
            <SummaryItem label="Total Amount" value={isFree ? 'Free' : `₹${bookingData.totalAmount}.00`} />
            <SummaryItem label="Remaining Event Tickets" value={event.availableTickets} />
          </div>
          
          <button onClick={onReset} className="btn" style={{ padding: '1rem 3rem' }}>
            Book Another Event
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <span style={{ color: 'var(--primary-dark)', fontWeight: 500, opacity: 0.8 }}>{label}</span>
      <span style={{ fontWeight: 600, color: 'var(--text)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}
