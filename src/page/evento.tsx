/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react'
import { Navigate, useNavigate } from "react-router-dom";
import axios from 'axios'
import {type Event, type User} from "../types";
import dayjs from 'dayjs'
import './evento.css';

function Evento() {
  const [events, setEvents] = useState<Event[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    fetchEvents()
    fetchUser()
  }, [])

  async function fetchEvents() {
    try {
      setLoading(true)
      // Try to fetch from API, fallback to mock data
      const response = await axios.get('/api/events')
      setEvents(response.data)
    } catch (error) {
      console.warn('API not available, using mock data')
    } finally {
      setLoading(false)
    }
  }

  async function fetchUser() {
    try {
      const response = await axios.get('/api/user/profile')
      setUser(response.data)
    } catch (error) {
      console.warn('User API not available, using mock data')
    }
  }

  async function handleApply(eventId: number) {
    if (!user || user.role === 'admin') return

    try {
      await axios.post(`/api/events/${eventId}/apply`)
      setEvents(events.map(event => 
        event.id === eventId && event.currentAttendees < event.maxAttendees
          ? { ...event, currentAttendees: event.currentAttendees + 1 }
          : event
      ))
    } catch (error) {
      console.warn('Apply API not available, updating locally')
      setEvents(events.map(event => 
        event.id === eventId && event.currentAttendees < event.maxAttendees
          ? { ...event, currentAttendees: event.currentAttendees + 1 }
          : event
      ))
    }
  }

  async function handleDelete(eventId: number) {
    if (!user || user.role !== 'admin') return

    try {
      await axios.delete(`/api/events/${eventId}`)
      setEvents(events.filter(event => event.id !== eventId))
    } catch (error) {
      console.warn('Delete API not available, updating locally')
      setEvents(events.filter(event => event.id !== eventId))
    }
  }

  function handleEdit(eventId: number) {
    if (!user || user.role !== 'admin') return
    console.log(`Edit event ${eventId}`)
  }

  const navigate = useNavigate();

  const navigateToCreate = () => {
    if (!user ||user.role !== 'admin') return;
    navigate('/create');
  };

  function formatEventTime(dateStr: string) {
    if (!dayjs(dateStr).isValid()) {
      return "Invalid Date"
    }
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm A")
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading events...</div>
      </div>
    )
  }

  return (
    <div className="evento-page">
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <h1 className="logo">Evento</h1>
            {user?.role === 'admin' && (
              <button onClick={navigateToCreate} className="create-btn">
                Create New Post
              </button>
            )}
          </div>

          {user && (
            <div className="user-profile">
              <button 
                className="profile-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <img 
                  src={user.avatar || "https://via.placeholder.com/40"} 
                  alt={user.name}
                  className="avatar"
                />
                <span className="user-name">{user.name}</span>
                <span className={`role-badge ${user.role}`}>
                  {user.role}
                </span>
              </button>
              
              {showUserMenu && (
                <div className="user-menu">
                  <div className="menu-item">Profile</div>
                  <div className="menu-item">Settings</div>
                  <div className="menu-item">Logout</div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        <div className="content-header">
          <h2>Upcoming Events</h2>
          <p>Discover and join amazing events in your area</p>
          {user && (
            <p className="user-info">
              Welcome, {user.name}! | Role: {user.role} | Email: {user.email}
            </p>
          )}
        </div>

        <div className="events-grid">
          {events.map((event) => {
            const isFull = event.currentAttendees >= event.maxAttendees
            const canApply = user?.role === 'user' && !isFull
            const canManage = user?.role === 'admin'

            return (
              <div key={event.id} className="event-card">
                <div 
                  className="event-image"
                  style={{ backgroundImage: `url(${event.imageUrl})` }}
                >
                  <div className="image-overlay"></div>
                  {canManage && (
                    <div className="admin-controls">
                      <button
                        onClick={() => handleEdit(event.id)}
                        className="edit-btn"
                        title="Edit Event"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="delete-btn"
                        title="Delete Event"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>

                <div className="card-content">
                  <div className="card-header">
                    <h3 className="event-title">{event.name}</h3>
                    <p className="event-description">{event.description}</p>
                  </div>

                  <div className="event-details">
                    <div className="event-time">
                      📅 {formatEventTime(event.time)}
                    </div>
                    
                    <div className="attendees-info">
                      <div className="attendees-count">
                        👥 <span className={isFull ? 'full' : ''}>
                          {event.currentAttendees} / {event.maxAttendees} attendees
                        </span>
                      </div>
                      
                      {isFull && (
                        <span className="full-badge">Full</span>
                      )}
                    </div>
                  </div>

                  <div className="card-footer">
                    {canApply ? (
                      <button 
                        onClick={() => handleApply(event.id)}
                        className="apply-btn"
                      >
                        Apply Now
                      </button>
                    ) : isFull ? (
                      <button disabled className="full-btn">
                        Full
                      </button>
                    ) : (
                      <button disabled className="disabled-btn">
                        {user?.role === 'admin' ? 'Admin cannot apply' : 'Cannot apply'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {events.length === 0 && (
          <div className="no-events">
            <p>No events available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Evento

