import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, X } from 'lucide-react';
import { toast } from 'react-toastify';
import API_URL from '../config';
import './VoiceInput.css';

const VoiceInput = ({ onClose, onTaskCreated }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [parsed, setParsed] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: ''
  });
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    setTranscript('');
    
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const parseTask = async () => {
    if (!transcript.trim() || transcript.trim().length < 10) {
      setValidationError('Transcript must be at least 10 characters');
      return;
    }
    
    setValidationError('');
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/tasks/parse-voice-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to parse task');
      }
      
      const result = await response.json();
      const data = result.data;
      
      // Convert DD-MM-YYYY to YYYY-MM-DD for input field
      let dateValue = '';
      if (data.dueDate && data.dueDate !== 'null') {
        const parts = data.dueDate.split('-');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          dateValue = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }
      
      setFormData({
        title: data.title || transcript.substring(0, 100),
        description: data.description || transcript,
        status: 'To Do',
        priority: data.priority || 'Medium',
        dueDate: dateValue
      });
      setParsed(true);
      toast.success('Task parsed successfully!');
    } catch (error) {
      console.error('Error parsing task:', error);
      toast.error(error.message || 'Failed to parse task. Please try again.');
      setError(error.message || 'Failed to parse task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    setLoading(true);
    try {
      // Convert date to DD-MM-YYYY format for backend
      let formattedDate = null;
      if (formData.dueDate) {
        const date = new Date(formData.dueDate);
        formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
      }
      
      const response = await fetch(`${API_URL}/api/tasks/create-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          dueDate: formattedDate,
          transcript
        })
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to create task');
      }
      
      toast.success('Task created successfully!');
      onTaskCreated();
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(error.message || 'Failed to create task.');
    } finally {
      setLoading(false);
    }
  };



  if (parsed) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h3>Task Details</h3>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); createTask(); }}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-control"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  className="form-control"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Voice Transcript</label>
              <textarea
                className="form-control"
                rows="2"
                value={transcript}
                disabled
                style={{ backgroundColor: '#f3f4f6' }}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal voice-modal">
        <div className="modal-header">
          <h3>Voice Task Input</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="voice-content">
          <div className="recording-section">
            <div className="recording-controls">
              <button
                className={`record-btn ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
            </div>

            <div className="transcript-section">
              <h4>Speak or Type Your Task <span className="required">*</span></h4>
              <textarea
                className={`form-control transcript-input ${validationError ? 'error' : ''}`}
                placeholder="Example: Create a high priority task to review code by tomorrow"
                value={transcript}
                onChange={(e) => {
                  setTranscript(e.target.value);
                  if (validationError) setValidationError('');
                }}
                rows={4}
              />
              {validationError && <span className="error-message">{validationError}</span>}
              <p className="hint-text">Tip: Include priority (high/low/critical) and date in your description</p>
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={parseTask}
                  disabled={loading || !transcript.trim() || transcript.trim().length < 10}
                >
                  {loading ? 'Parsing...' : 'Parse Task'}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;