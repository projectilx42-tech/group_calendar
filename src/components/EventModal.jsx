import React, { useState, useEffect } from 'react';
import { X, Calendar, Trash2, Save, Tag, FileText, User } from 'lucide-react';
import { EVENT_CATEGORIES, USER_COLORS } from '../services/storage';

export const EventModal = ({ isOpen, onClose, eventToEdit, prefilledDate, currentUser, users, onSave, onDelete }) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('vacation');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title || '');
      setStartDate(eventToEdit.startDate || '');
      setEndDate(eventToEdit.endDate || '');
      setCategory(eventToEdit.category || 'vacation');
      setSelectedUserId(eventToEdit.userId || currentUser?.id || '');
      setNotes(eventToEdit.notes || '');
    } else {
      const today = new Date().toISOString().split('T')[0];
      setTitle('');
      setStartDate(prefilledDate || today);
      setEndDate(prefilledDate || today);
      setCategory('vacation');
      setSelectedUserId(currentUser?.id || (users[0]?.id || ''));
      setNotes('');
    }
    setError('');
  }, [eventToEdit, prefilledDate, currentUser, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Zadejte prosím název akce.');
      return;
    }
    if (!startDate || !endDate) {
      setError('Zadejte platné datum začátku a konce.');
      return;
    }
    if (startDate > endDate) {
      setError('Datum konce musí být stejné nebo pozdější než začátek.');
      return;
    }

    const assignedUser = users.find(u => u.id === selectedUserId) || currentUser;

    const newEvent = {
      id: eventToEdit ? eventToEdit.id : `e_${Date.now()}`,
      userId: assignedUser.id,
      userName: assignedUser.username,
      userColor: assignedUser.color || USER_COLORS[0],
      title: title.trim(),
      startDate,
      endDate,
      category,
      notes: notes.trim()
    };

    onSave(newEvent);
    onClose();
  };

  const isOwnerOrAdmin = currentUser?.role === 'admin' || (eventToEdit && eventToEdit.userId === currentUser?.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{eventToEdit ? 'Upravit akci / dovolenou' : 'Přidat novou akci / dovolenou'}</h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label className="input-label">Název dovolené / akce *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Např. Dovolená v Chorvatsku, Festival Mácháč..."
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-row-2">
            <div className="input-group">
              <label className="input-label">Datum od *</label>
              <input 
                type="date" 
                className="input-field" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Datum do *</label>
              <input 
                type="date" 
                className="input-field" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="input-group">
              <label className="input-label">Kategorie *</label>
              <select 
                className="input-field" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                {Object.entries(EVENT_CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Účastník / Kamarád *</label>
              <select 
                className="input-field"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                disabled={currentUser?.role !== 'admin' && eventToEdit}
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Poznámka (volitelné)</label>
            <textarea 
              className="input-field textarea-field"
              rows={3}
              placeholder="Podrobnosti, místo, plán cesty..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            {eventToEdit && isOwnerOrAdmin && (
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={() => {
                  if (window.confirm('Opravdu chcete tuto akci smazat?')) {
                    onDelete(eventToEdit.id);
                    onClose();
                  }
                }}
              >
                <Trash2 size={16} /> Smazat
              </button>
            )}

            <div className="modal-actions-right">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Zrušit
              </button>
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Uložit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
