import { motion } from 'framer-motion';

export default function Hero() {
  const handleScroll = () => {
    const el = document.getElementById('booking-section');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', textAlign: 'center', paddingTop: '2rem' }}>
      <div className="container">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ 
            color: 'var(--accent)', 
            fontWeight: 600, 
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}
        >
          Annual Flagship Event
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ 
            fontSize: 'clamp(3rem, 6vw, 5.5rem)', 
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            color: 'var(--primary-dark)'
          }}
        >
          TechSymposium<br/>2026
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ 
            fontSize: '1.125rem', 
            color: 'var(--text)',
            maxWidth: '600px',
            margin: '0 auto 3rem auto',
            opacity: 0.8
          }}
        >
          Join us for a day of innovation, networking, and cutting-edge technology showcases. Reserve your spot today for the most anticipated departmental event of the year.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <button className="btn" onClick={handleScroll}>
            Reserve Your Ticket
          </button>
        </motion.div>
      </div>
    </section>
  );
}
