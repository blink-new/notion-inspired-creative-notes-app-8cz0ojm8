
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Note {
  id: string
  title: string
  content: string
  parentId: string | null
  createdAt: number
  updatedAt: number
}

interface NoteStore {
  notes: Note[]
  activeNoteId: string | null
  setActiveNote: (id: string | null) => void
  createNote: (data: { title: string, content: string, parentId: string | null }) => Note
  updateNote: (id: string, data: Partial<Omit<Note, 'id' | 'createdAt'>>) => void
  deleteNote: (id: string) => void
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],
      activeNoteId: null,
      
      setActiveNote: (id) => set({ activeNoteId: id }),
      
      createNote: (data) => {
        const newNote: Note = {
          id: crypto.randomUUID(),
          title: data.title,
          content: data.content,
          parentId: data.parentId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        
        set(state => ({
          notes: [...state.notes, newNote],
          activeNoteId: newNote.id
        }))
        
        return newNote
      },
      
      updateNote: (id, data) => {
        set(state => ({
          notes: state.notes.map(note => 
            note.id === id 
              ? { ...note, ...data, updatedAt: Date.now() } 
              : note
          )
        }))
      },
      
      deleteNote: (id) => {
        const { notes, activeNoteId } = get()
        
        // Get all descendant notes to delete
        const getDescendantIds = (noteId: string): string[] => {
          const children = notes.filter(n => n.parentId === noteId)
          return [
            noteId,
            ...children.flatMap(child => getDescendantIds(child.id))
          ]
        }
        
        const idsToDelete = getDescendantIds(id)
        const remainingNotes = notes.filter(note => !idsToDelete.includes(note.id))
        
        // Update active note if it was deleted
        const newActiveNoteId = idsToDelete.includes(activeNoteId || '') 
          ? (remainingNotes.length > 0 ? remainingNotes[0].id : null)
          : activeNoteId
        
        set({
          notes: remainingNotes,
          activeNoteId: newActiveNoteId
        })
      }
    }),
    {
      name: 'notecraft-storage'
    }
  )
)