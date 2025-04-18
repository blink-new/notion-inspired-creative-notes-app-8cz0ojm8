
import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { useTheme } from './hooks/use-theme'
import { Sidebar } from './components/sidebar'
import { Editor } from './components/editor'
import { useNoteStore } from './store/note-store'
import { ResizableLayout } from './components/resizable-layout'
import { EmptyState } from './components/empty-state'
import { CommandMenu } from './components/command-menu'

function App() {
  const { theme } = useTheme()
  const { activeNoteId, notes, createNote } = useNoteStore()
  const activeNote = notes.find(note => note.id === activeNoteId)

  // Create a welcome note if no notes exist
  useEffect(() => {
    if (notes.length === 0) {
      createNote({
        title: 'Welcome to Notecraft',
        content: `<h1>Welcome to Notecraft! 👋</h1><p>This is your first note. Here are some things you can do:</p><ul><li><p>Create new notes using the + button in the sidebar</p></li><li><p>Organize notes in a hierarchical structure</p></li><li><p>Format text with the toolbar above</p></li><li><p>Use keyboard shortcuts for common actions</p></li></ul><p>Start creating something amazing!</p>`,
        parentId: null
      })
    }
  }, [notes.length, createNote])

  return (
    <div className={`h-screen w-screen overflow-hidden ${theme}`}>
      <Toaster position="top-right" />
      <CommandMenu />
      <ResizableLayout>
        <Sidebar />
        <div className="h-full w-full overflow-auto bg-background">
          {activeNote ? (
            <Editor note={activeNote} />
          ) : (
            <EmptyState />
          )}
        </div>
      </ResizableLayout>
    </div>
  )
}

export default App