
import { FileText, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { useNoteStore } from '../store/note-store'

export function EmptyState() {
  const { createNote } = useNoteStore()

  const handleCreateNote = () => {
    createNote({
      title: 'Untitled',
      content: '<p></p>',
      parentId: null
    })
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FileText className="h-10 w-10 text-muted-foreground" />
      </div>
      
      <h2 className="mt-6 text-2xl font-semibold">No note selected</h2>
      <p className="mt-2 text-muted-foreground">
        Select a note from the sidebar or create a new one to get started.
      </p>
      
      <Button 
        onClick={handleCreateNote}
        className="mt-6"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create new note
      </Button>
    </div>
  )
}