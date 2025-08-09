import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { type Event } from "../types";
import "./create.css";

export default function Create() {
  const navigate = useNavigate();
  const location = useLocation();
  const eventToEdit = location.state as Event | undefined;
  const isEditMode = Boolean(eventToEdit);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    maxAttendees: '',
    time: ''
  });

  // Pre-fill form if editing
  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        name: eventToEdit.name,
        description: eventToEdit.description,
        imageUrl: eventToEdit.imageUrl,
        maxAttendees: eventToEdit.maxAttendees.toString(),
        time: eventToEdit.time.substring(0, 16) // Convert to datetime-local format
      });
    }
  }, [eventToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const eventData = {
        ...formData,
        maxAttendees: parseInt(formData.maxAttendees),
        time: new Date(formData.time).toISOString()
      };

      if (isEditMode && eventToEdit) {
        // Update existing event
        await axios.patch(`/api/events/${eventToEdit.id}`, eventData);
      } else {
        // Create new event
        await axios.post("/api/events", eventData);
      }

      // Return to events page which will automatically refresh
      navigate("/evento");
    } catch (error) {
      console.error("Operation failed", error);
      alert(`Failed to ${isEditMode ? "update" : "create"} event`);
    }
  };

  const handleCancel = () => {
    navigate("/evento");
  };

  return (
    <div className="create-event-container">
      <div className="create-event-wrapper">
        <div className="header">
          <h1>{isEditMode ? "Edit Event" : "Create New Event"}</h1>
          <p>Fill in the details below to {isEditMode ? "update" : "create"} your event</p>
        </div>

        <div className="form-card">
          <div className="card-header">
            <h2>📅 Event Details</h2>
            <p>Provide the basic information about your event</p>
          </div>
          
          <form onSubmit={handleSubmit} className="form">
            {/* Form fields remain the same as before */}
            <div className="form-group">
              <label htmlFor="name">📝 Event Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter event name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your event..."
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">📅 Event Date & Time</label>
              <input
                id="time"
                name="time"
                type="datetime-local"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
              <small>Select the date and time when your event will start</small>
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl">🔗 Image URL</label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={handleInputChange}
              />
              <small>Provide a URL to an image that represents your event</small>
            </div>

            <div className="form-group">
              <label htmlFor="maxAttendees">👥 Attendee Limit</label>
              <input
                id="maxAttendees"
                name="maxAttendees"
                type="number"
                placeholder="100"
                value={formData.maxAttendees}
                onChange={handleInputChange}
                required
                min="1"
              />
              <small>Maximum number of people who can attend this event</small>
            </div>

            {/* Preview and image preview sections remain the same */}
            {formData.imageUrl && (
              <div className="form-group">
                <label>Image Preview</label>
                <div className="image-preview">
                  <img
                    src={formData.imageUrl || "/placeholder.svg"}
                    alt="Event preview"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {isEditMode ? "Update Event" : "Create Event"}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Event Preview */}
        {(formData.name || formData.description) && (
          <div className="preview-card">
            <div className="card-header">
              <h2>Event Preview</h2>
              <p>This is how your event will appear to others</p>
            </div>
            
            <div className="preview-content">
              {formData.imageUrl && (
                <div className="preview-image">
                  <img
                    src={formData.imageUrl || "/placeholder.svg"}
                    alt={formData.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
              )}
              
              <div className="preview-details">
                <h3>{formData.name || 'Event Name'}</h3>
                {formData.time && (
                  <div className="preview-date">
                    📅 {new Date(formData.time).toLocaleString()}
                  </div>
                )}
                <p>{formData.description || 'Event description will appear here...'}</p>
                {formData.maxAttendees && (
                  <div className="preview-attendees">
                    👥 Limited to {formData.maxAttendees} attendees
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}