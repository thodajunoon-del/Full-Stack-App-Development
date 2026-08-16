import { motion } from 'framer-motion';


export default function Navbar({ currentUser, onLogout }) {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '1rem 0',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img 
            src="/Vel_Logo.webp"
            alt="Veltech Logo" 
            style={{ height: '40px' }} 
          />
          <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)' }}>
            Veltech University
          </div>
        </div>

        {currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text)' }}>
              Hi, {currentUser.name.split(' ')[0]}
            </div>
            <button 
              onClick={onLogout}
              style={{
                background: 'transparent',
                border: '1px solid var(--primary-dark)',
                color: 'var(--primary-dark)',
                padding: '0.4rem 1rem',
                borderRadius: '16px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary-dark)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--primary-dark)';
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
