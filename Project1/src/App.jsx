import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import BookingForm from './components/BookingForm';
import BookingSummary from './components/BookingSummary';
import BookingHistory from './components/BookingHistory';
import Footer from './components/Footer';
import Login from './components/Login';

const initialEvents = [
  {
    id: 1,
    name: 'TechSymposium 2026',
    department: 'Computer Science',
    date: 'October 15, 2026',
    time: '09:00 AM - 05:00 PM',
    venue: 'MG Auditorium',
    price: 199,
    availableTickets: 150
  },
  {
    id: 2,
    name: 'AI Innovations Workshop',
    department: 'Artificial Intelligence',
    date: 'November 02, 2026',
    time: '10:00 AM - 01:00 PM',
    venue: 'Symposium Lab',
    price: 149,
    availableTickets: 50
  },
  {
    id: 3,
    name: 'Annual Hackathon',
    department: 'Information Technology',
    date: 'November 20, 2026',
    time: '08:00 AM - 08:00 PM',
    venue: 'Velmurugam Auditorium',
    price: 99,
    availableTickets: 300
  },
  {
    id: 4,
    name: 'Robotics Seminar',
    department: 'Mechanical Engineering',
    date: 'December 05, 2026',
    time: '02:00 PM - 04:00 PM',
    venue: 'APJ Hall',
    price: 199,
    availableTickets: 80
  },
  {
    id: 5,
    name: 'Startup Pitch Fest',
    department: 'Management',
    date: 'January 12, 2027',
    time: '09:30 AM - 03:30 PM',
    venue: 'Stevejobs Hall',
    price: 149,
    availableTickets: 120
  },
  {
    id: 6,
    name: 'Cybersecurity Masterclass',
    department: 'Cyber Security',
    date: 'February 18, 2027',
    time: '11:00 AM - 02:00 PM',
    venue: 'Seminar Hall',
    price: 199,
    availableTickets: 45
  },
  {
    id: 7,
    name: 'Annual Convocation',
    department: 'University Wide',
    date: 'March 25, 2027',
    time: '09:00 AM - 06:00 PM',
    venue: 'Convocation Hall',
    price: 199,
    availableTickets: 1000
  }
];

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [events, setEvents] = useState(initialEvents);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);

  // Check for saved token on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      setCurrentUser(JSON.parse(savedUser));
      setToken(savedToken);
      fetchBookingHistory(savedToken);
    }
  }, []);

  const fetchBookingHistory = async (authToken) => {
    try {
      const response = await fetch('http://localhost:3000/api/bookings', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBookingHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  const handleLogin = (user, authToken) => {
    setCurrentUser(user);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', authToken);
    fetchBookingHistory(authToken);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    setSelectedEventId(null);
    setBookingData(null);
    setBookingHistory([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const handleSelectEvent = (evt) => {
    setSelectedEventId(evt.id);
    setBookingData(null);
  };

  const handleBook = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          event_id: selectedEventId,
          event_name: selectedEvent.name,
          tickets: data.tickets
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to book');
      }

      const newBooking = await response.json();
      
      // Update local state
      setEvents(prevEvents => prevEvents.map(evt => {
        if (evt.id === selectedEventId) {
          return { ...evt, availableTickets: evt.availableTickets - data.tickets };
        }
        return evt;
      }));
      setBookingData(data);
      setBookingHistory(prev => [newBooking, ...prev]);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      alert(err.message);
    }
  };

  const handleReset = () => {
    setBookingData(null);
    setSelectedEventId(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      
      {!bookingData ? (
        <>
          <Hero />
          
          <BookingHistory bookings={bookingHistory} events={events} />

          <EventList 
            events={events} 
            onSelectEvent={handleSelectEvent} 
            currentUser={currentUser} 
          />
          
          {selectedEvent && (
            <>
              <EventDetails 
                event={selectedEvent} 
                currentUser={currentUser} 
              />
              <BookingForm 
                event={selectedEvent}
                currentUser={currentUser}
                onBook={handleBook} 
              />
            </>
          )}
        </>
      ) : (
        <BookingSummary 
          bookingData={bookingData} 
          event={selectedEvent}
          currentUser={currentUser}
          onReset={handleReset} 
        />
      )}

      <Footer />
    </>
  );
}

export default App;
