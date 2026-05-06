import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { LuX, LuSave, LuStickyNote } from 'react-icons/lu';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useWorkspace } from '../../context/WorkspaceContext';
import toast from 'react-hot-toast';

const COLORS = [
  { name: 'Yellow', bg: '#fef08a', border: '#facc15', text: '#713f12' },
  { name: 'Pink', bg: '#fbcfe8', border: '#f472b6', text: '#831843' },
  { name: 'Green', bg: '#bbf7d0', border: '#4ade80', text: '#14532d' },
  { name: 'Blue', bg: '#bfdbfe', border: '#60a5fa', text: '#1e3a5f' },
  { name: 'Purple', bg: '#e9d5ff', border: '#c084fc', text: '#581c87' },
  { name: 'Orange', bg: '#fed7aa', border: '#fb923c', text: '#7c2d12' },
];

// Small sticky note preview pinned to card
export const StickyNotePin = ({ onClick, note, color }) => {
  const selectedColor = COLORS.find(c => c.name === color) || COLORS[0];

  if (!note) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-yellow-500 transition mt-2"
      >
        <LuStickyNote className="text-sm" />
        Add note
      </button>
    );
  }

  return (
    <div
      onClick={onClick}
      className="mt-2 cursor-pointer"
      style={{ transform: 'rotate(-1deg)', transformOrigin: 'top left' }}
    >
      <div
        className="relative px-3 py-2 rounded shadow-md max-w-full"
        style={{
          backgroundColor: selectedColor.bg,
          borderLeft: `3px solid ${selectedColor.border}`,
          fontFamily: "'Caveat', cursive",
        }}
      >
        {/* Pin dot */}
        <div
          className="absolute -top-2 left-3 w-3 h-3 rounded-full shadow"
          style={{ backgroundColor: selectedColor.border }}
        />
        <p
          className="text-xs line-clamp-2 mt-1"
          style={{ color: selectedColor.text }}
        >
          {note}
        </p>
      </div>
    </div>
  );
};

// Full sticky note editor modal
const StickyNoteModal = ({ isOpen, onClose, userId, userName }) => {
  const { activeWorkspace } = useWorkspace();
  const [note, setNote] = useState('');
  const [selectedColor, setSelectedColor] = useState('Yellow');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isOpen || !activeWorkspace) return;
    const fetchNote = async () => {
      setFetching(true);
      try {
        const res = await axiosInstance.get(
          API_PATHS.WORKSPACES.GET_MEMBER_NOTE(activeWorkspace._id, userId)
        );
        setNote(res.data.note || '');
        setSelectedColor(res.data.color || 'Yellow');
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchNote();
  }, [isOpen, userId, activeWorkspace]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(
        API_PATHS.WORKSPACES.SAVE_MEMBER_NOTE(activeWorkspace._id, userId),
        { note, color: selectedColor }
      );
      toast.success('Note saved!');
      onClose(note, selectedColor);
    } catch (err) {
      toast.error('Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const color = COLORS.find(c => c.name === selectedColor) || COLORS[0];

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div
        className="w-full max-w-sm mx-4 rounded-lg shadow-2xl overflow-hidden"
        style={{
          backgroundColor: color.bg,
          transform: 'rotate(-1deg)',
          fontFamily: "'Caveat', cursive",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: color.border }}
        >
          <div className="flex items-center gap-2">
            <LuStickyNote className="text-white text-lg" />
            <span className="text-white font-semibold text-sm">
              Note on {userName}
            </span>
          </div>
          <button onClick={() => onClose(null, null)} className="text-white hover:opacity-70">
            <LuX className="text-lg" />
          </button>
        </div>

        {/* Color picker */}
        <div className="flex items-center gap-2 px-4 pt-3">
          <span className="text-xs" style={{ color: color.text }}>Color:</span>
          <div className="flex gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c.name)}
                className="w-5 h-5 rounded-full border-2 transition"
                style={{
                  backgroundColor: c.bg,
                  borderColor: selectedColor === c.name ? c.border : 'transparent',
                  outline: selectedColor === c.name ? `2px solid ${c.border}` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="px-4 py-3">
          {fetching ? (
            <div className="text-center py-8 text-sm" style={{ color: color.text }}>
              Loading...
            </div>
          ) : (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={`Write a note about ${userName}...`}
              rows={7}
              className="w-full bg-transparent outline-none resize-none text-base leading-relaxed"
              style={{ color: color.text, fontFamily: "'Caveat', cursive", fontSize: '18px' }}
              autoFocus
            />
          )}
        </div>

        {/* Save */}
        <div className="px-4 pb-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white transition disabled:opacity-50"
            style={{ backgroundColor: color.border }}
          >
            <LuSave className="text-sm" />
            {loading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default StickyNoteModal;