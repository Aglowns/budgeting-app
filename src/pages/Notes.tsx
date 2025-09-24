import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Pin, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  pinned?: boolean;
}

export function Notes() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Grocery Budget',
      content: 'Need to stick to $50/week for groceries. Found good deals at Food Lion.',
      tags: ['budget', 'groceries'],
      createdAt: '2024-01-15T10:30:00Z',
      pinned: true,
    },
    {
      id: '2',
      title: 'Textbook Expenses',
      content: 'Spring semester books cost $320. Check for used copies next time.',
      tags: ['school', 'books'],
      createdAt: '2024-01-14T15:45:00Z',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: '',
  });

  const filteredNotes = notes.filter(
    note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter(note => note.pinned);
  const regularNotes = filteredNotes.filter(note => !note.pinned);

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: '', content: '', tags: '' });
    setShowAddForm(false);
  };

  const togglePin = (id: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-xl p-6 border border-primary/10"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Financial Notes</h1>
            <p className="text-gray-600 mt-1">
              Keep track of important financial reminders and insights
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="text-sm">
                <span className="text-gray-500">Total Notes: </span>
                <span className="font-semibold text-primary">{notes.length}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Pinned: </span>
                <span className="font-semibold text-primary">{notes.filter(n => n.pinned).length}</span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Add Note Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border shadow-sm"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newNote.title}
                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Note title..."
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <textarea
                id="content"
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your note here..."
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#990000] focus:border-transparent"
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={newNote.tags}
                onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="budget, groceries, school..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddNote} className="bg-[#990000] hover:bg-[#800000]">
                Save Note
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Pin className="h-5 w-5 mr-2 text-[#990000]" />
            Pinned Notes
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onTogglePin={togglePin}
                onDelete={deleteNote}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Notes */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Notes</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {regularNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onTogglePin={togglePin}
              onDelete={deleteNote}
            />
          ))}
        </div>
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No notes found.</p>
        </div>
      )}
    </div>
  );
}

function NoteCard({
  note,
  onTogglePin,
  onDelete,
}: {
  note: Note;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-4 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{note.title}</h3>
          <div className="flex gap-1 ml-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onTogglePin(note.id)}
              className={`h-8 w-8 p-0 ${note.pinned ? 'text-[#990000]' : 'text-gray-400'}`}
            >
              <Pin className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(note.id)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-gray-600 text-sm flex-1 line-clamp-3 mb-3">
          {note.content}
        </p>

        <div className="space-y-2">
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[#FFCC00] text-black"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-400">
            {new Date(note.createdAt).toLocaleDateString()}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}