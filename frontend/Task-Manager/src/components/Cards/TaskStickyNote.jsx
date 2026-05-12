import React, { useState } from 'react';
import { LuStickyNote } from 'react-icons/lu';

const COLORS = [
  { name: 'Yellow', bg: '#fef08a', border: '#facc15', text: '#713f12' },
  { name: 'Pink', bg: '#fbcfe8', border: '#f472b6', text: '#831843' },
  { name: 'Green', bg: '#bbf7d0', border: '#4ade80', text: '#14532d' },
  { name: 'Blue', bg: '#bfdbfe', border: '#60a5fa', text: '#1e3a5f' },
  { name: 'Purple', bg: '#e9d5ff', border: '#c084fc', text: '#581c87' },
  { name: 'Orange', bg: '#fed7aa', border: '#fb923c', text: '#7c2d12' },
];

const EMOJIS = ['👍', '👎', '❤️', '😮', '😂', '🔥'];

// Admin sticky note editor (used in CreateTask)
export const TaskNoteEditor = ({ note, color, onChange, onColorChange }) => {
  const selectedColor = COLORS.find(c => c.name === color) || COLORS[0];

  return (
    <div
      className="rounded-lg overflow-hidden shadow-md mt-3"
      style={{
        backgroundColor: selectedColor.bg,
        fontFamily: "'Caveat', cursive",
        transform: 'rotate(-0.5deg)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ backgroundColor: selectedColor.border }}
      >
        <div className="flex items-center gap-2">
          <LuStickyNote className="text-white text-sm" />
          <span className="text-white text-sm font-semibold">Admin Note</span>
        </div>
        {/* Color picker */}
        <div className="flex gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => onColorChange(c.name)}
              className="w-4 h-4 rounded-full border-2 transition"
              style={{
                backgroundColor: c.bg,
                borderColor: color === c.name ? 'white' : 'transparent',
              }}
            />
          ))}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={note}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a note for the assignees..."
        rows={4}
        className="w-full bg-transparent outline-none resize-none px-4 py-3 text-lg leading-relaxed"
        style={{ color: selectedColor.text, fontFamily: "'Caveat', cursive" }}
      />
    </div>
  );
};

// Member view — shows note + reactions
export const TaskNoteViewer = ({ note, color, reactions, onReact, currentUserId }) => {
  if (!note) return null;

  const selectedColor = COLORS.find(c => c.name === color) || COLORS[0];

  // Group reactions by emoji
  const groupedReactions = EMOJIS.reduce((acc, emoji) => {
    const count = reactions?.filter(r => r.emoji === emoji).length || 0;
const reacted = reactions?.some(
  r => r.emoji === emoji && r.userId?.toString() === currentUserId?.toString()
);
    if (count > 0 || true) acc[emoji] = { count, reacted };
    return acc;
  }, {});

  return (
    <div
      className="rounded-lg overflow-hidden shadow-md mt-4"
      style={{
        backgroundColor: selectedColor.bg,
        fontFamily: "'Caveat', cursive",
        transform: 'rotate(-0.5deg)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2"
        style={{ backgroundColor: selectedColor.border }}
      >
        <LuStickyNote className="text-white text-sm" />
        <span className="text-white text-sm font-semibold">Note from Admin</span>
      </div>

      {/* Note text */}
      <div className="px-4 py-3">
        <p
          className="text-lg leading-relaxed whitespace-pre-wrap"
          style={{ color: selectedColor.text }}
        >
          {note}
        </p>
      </div>

      {/* Reactions */}
      <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
        {EMOJIS.map((emoji) => {
          const { count, reacted } = groupedReactions[emoji];
          return (
            <button
              key={emoji}
              onClick={() => onReact(emoji)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-sm transition border"
              style={{
                backgroundColor: reacted ? selectedColor.border + '40' : 'transparent',
                borderColor: reacted ? selectedColor.border : selectedColor.border + '60',
                color: selectedColor.text,
              }}
            >
              {emoji} {count > 0 && <span className="text-xs">{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};