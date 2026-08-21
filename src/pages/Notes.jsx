import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { FileText, Plus, Trash2, Edit2, Search, Filter } from 'lucide-react';

export default function Notes() {
  const { subjects, notes, addNote, updateNote, deleteNote } = useStudy();
  const [isOpen, setIsOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  
  // View states
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [selectedNote, setSelectedNote] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [content, setContent] = useState('');

  const openAddModal = () => {
    setEditingNote(null);
    setTitle('');
    if (subjects.length > 0) setSubjectId(subjects[0].id);
    setContent('');
    setIsOpen(true);
  };

  const openEditModal = (note, e) => {
    e.stopPropagation(); // Avoid selecting the note card
    setEditingNote(note);
    setTitle(note.title);
    setSubjectId(note.subjectId);
    setContent(note.content);
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) return;

    const payload = {
      title,
      subjectId,
      content
    };

    if (editingNote) {
      updateNote(editingNote.id, payload);
      // Update selected view if currently looking at it
      if (selectedNote && selectedNote.id === editingNote.id) {
        setSelectedNote({ ...selectedNote, ...payload });
      }
    } else {
      addNote(payload);
    }
    setIsOpen(false);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteNote(id);
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
    }
  };

  // Filter Logic
  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'All' || n.subjectId === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 ">Lecture Notes</h1>
          <p className="text-sm text-slate-500 ">Keep and categorize course sheets, summary guides, or study notes.</p>
        </div>

        <button
          onClick={openAddModal}
          disabled={subjects.length === 0}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-xs"
        >
          <Plus className="h-4.5 w-4.5" />
          Create Note
        </button>
      </div>

      {subjects.length === 0 && (
        <div className="rounded-xl border border-amber-250 bg-amber-50/50 p-4 text-sm text-amber-855 ">
          ⚠️ You need to add at least one <strong>Subject</strong> before you can write notes. Go to the Subjects tab first.
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Search */}
        <div className="relative sm:col-span-2">
          <Search className="absolute top-1/2 left-3 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4.5 w-4.5 text-slate-400 shrink-0" />
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:outline-none "
          >
            <option value="All">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Workspace Display Grid */}
      {notes.length === 0 ? (
        <EmptyState 
          icon={FileText} 
          title="No notes written yet" 
          description="Synthesize lecture information by keeping key concepts here."
          actionText={subjects.length > 0 ? "Write First Note" : null}
          onAction={openAddModal}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-3 items-start">
          
          {/* Notes Sidebar Listing (Col-span 1) */}
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const subject = subjects.find(s => s.id === note.subjectId);
              const subName = subject ? subject.name : 'Unknown';
              const isCurrent = selectedNote && selectedNote.id === note.id;

              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`cursor-pointer rounded-xl border p-4 transition text-left flex flex-col justify-between hover:border-indigo-550 
                    ${isCurrent 
                      ? 'border-indigo-600 bg-indigo-50/20 ' 
                      : 'border-slate-200 bg-white '
                    }
                  `}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{note.title}</h3>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">{subName}</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 whitespace-pre-wrap">{note.content}</p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[10px] text-slate-400">
                    <span>Updated: {note.updatedAt}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => openEditModal(note, e)}
                        className="rounded p-1 hover:bg-slate-100 text-slate-500 transition"
                        title="Edit Note"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(note.id, e)}
                        className="rounded p-1 hover:bg-red-50 hover:text-red-650 text-slate-550 transition"
                        title="Delete Note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Note Workspace display panel (Col-span 2) */}
          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-6 min-h-[50vh] flex flex-col justify-between">
            {selectedNote ? (
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 ">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950 ">{selectedNote.title}</h2>
                    <span className="inline-block mt-1 text-xs font-semibold text-indigo-600 ">
                      Category: {subjects.find(s => s.id === selectedNote.subjectId)?.name || 'Unknown'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Modified: {selectedNote.updatedAt}</span>
                </div>
                
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedNote.content || <em className="text-slate-400">No content. Click edit to add text details.</em>}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 py-16">
                <FileText className="h-10 w-10 stroke-1 mb-3" />
                <span className="text-sm font-medium">Select a note from the listing to read and manage details.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editingNote ? 'Edit Note' : 'Create Note'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Note Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master equations, Lecture 1 Summary"
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
            <select
              required
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Content Details</label>
            <textarea
              rows="6"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type lecture concepts, definitions, formulas, or homework cues..."
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none "
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 ">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              {editingNote ? 'Save Changes' : 'Save Note'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
