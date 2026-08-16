import { motion } from 'framer-motion';

export default function BookingHistory({ bookings, events }) {
  if (!bookings || bookings.length === 0) {
    return (
      <section className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>My Bookings</h3>
        <div className="glass" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text)', opacity: 0.8 }}>You haven't booked any events yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container" style={{ padding: '4rem 1rem' }}>
      <h3 style={{ color: 'var(--primary-dark)', marginBottom: '2rem', textAlign: 'center' }}>My Bookings</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {bookings.map((booking) => {
          // Find the full event details from the events list
          const eventDetails = events.find(e => e.id === booking.event_id) || {};
          
          return (
            <motion.div 
              key={booking.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass"
              style={{ padding: '1.5rem' }}
            >
              <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                {booking.event_name}
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text)', opacity: 0.8, marginBottom: '0.5rem' }}>
                <strong>Tickets:</strong> {booking.tickets}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text)', opacity: 0.8, marginBottom: '0.5rem' }}>
                <strong>Date:</strong> {eventDetails.date || 'N/A'}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text)', opacity: 0.8, marginBottom: '1rem' }}>
                <strong>Venue:</strong> {eventDetails.venue || 'N/A'}
              </p>
              
              <div style={{ fontSize: '0.8rem', color: 'var(--text)', opacity: 0.6, marginTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '0.5rem' }}>
                Booked on: {new Date(booking.booking_date).toLocaleString()}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
