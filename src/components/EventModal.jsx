import React, { useEffect, useState } from 'react';
import { X, Trash2, Check } from 'lucide-react';
import { EVENT_CATEGORIES } from '../services/storage';

export const EventModal = ({ isOpen, onClose, eventToEdit, prefilledDate, currentUser, onSave, onDelete }) => {
  const [title, setTitle] = useState(''); const [startDate, setStartDate] = useState(''); const [endDate, setEndDate] = useState(''); const [category, setCategory] = useState('free'); const [notes, setNotes] = useState(''); const [error, setError] = useState('');
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); const item = eventToEdit;
    setTitle(item?.title || ''); setStartDate(item?.startDate || prefilledDate || today); setEndDate(item?.endDate || prefilledDate || today); setCategory(item?.category || 'free'); setNotes(item?.notes || ''); setError('');
  }, [isOpen, eventToEdit, prefilledDate]);
  if (!isOpen) return null;
  const isOwner = !eventToEdit || eventToEdit.userId === currentUser?.id;
  const submit = async event => {
    event.preventDefault();
    if (!startDate || !endDate || startDate > endDate) return setError('Zkontroluj prosím datum od a do.');
    try { await onSave({ id: eventToEdit?.id || crypto.randomUUID?.() || `event_${Date.now()}`, userId: currentUser.id, userName: currentUser.username, userColor: currentUser.color, title: title.trim() || EVENT_CATEGORIES[category].label, startDate, endDate, category, notes: notes.trim() }); onClose(); } catch (err) { setError(err.message); }
  };
  return <div className="modal-overlay" onClick={onClose}><form className="modal-content event-modal" onClick={e => e.stopPropagation()} onSubmit={submit}>
    <div className="modal-header"><div><p className="eyebrow">DOSTUPNOST</p><h2>{eventToEdit ? 'Upravit záznam' : 'Přidat dostupnost'}</h2></div><button type="button" className="btn-close" onClick={onClose}><X size={19} /></button></div>
    {error && <div className="error-alert">{error}</div>}
    <div className="status-options">{Object.entries(EVENT_CATEGORIES).map(([id, item]) => <button type="button" key={id} onClick={() => setCategory(id)} className={`status-option ${category === id ? 'selected' : ''}`} style={{ '--status': item.color, '--status-bg': item.bg }}><span className="status-dot" />{item.label}</button>)}</div>
    <label className="input-group"><span className="input-label">Krátká poznámka <em>nepovinné</em></span><input className="input-field" value={title} onChange={e => setTitle(e.target.value)} placeholder="Např. večer klidně" /></label>
    <div className="form-row-2"><label className="input-group"><span className="input-label">Od</span><input type="date" className="input-field" value={startDate} onChange={e => setStartDate(e.target.value)} /></label><label className="input-group"><span className="input-label">Do</span><input type="date" className="input-field" value={endDate} onChange={e => setEndDate(e.target.value)} /></label></div>
    <label className="input-group"><span className="input-label">Detail <em>nepovinné</em></span><textarea className="input-field textarea-field" rows="2" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Jen pokud se hodí doplnit…" /></label>
    <div className="modal-actions">{eventToEdit && isOwner && <button type="button" className="btn btn-danger" onClick={async () => { await onDelete(eventToEdit.id); onClose(); }}><Trash2 size={16} /> Smazat</button>}<button className="btn btn-primary" disabled={!isOwner}><Check size={16} /> Uložit</button></div>
  </form></div>;
};
