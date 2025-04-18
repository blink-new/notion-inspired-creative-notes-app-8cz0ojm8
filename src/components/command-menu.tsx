
import { useEffect, useState } from 'react'
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from './ui/command'
import { useNoteStore } from '../store/note-store'
import { File, FilePlus, Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/use-theme'

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const { notes, setActiveNote, createNote } = useNoteStore()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }
    
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleCreateNote = () => {
    createNote({
      title: 'Untitled',
      content: '<p></p>',
      parentId: null
    })
    setOpen(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Notes">
          {notes.slice(0, 10).map(note => (
            <CommandItem
              key={note.id}
              onSelect={() => {
                setActiveNote(note.id)
                setOpen(false)
              }}
            >
              <File className="mr-2 h-4 w-4" />
              {note.title || 'Untitled'}
            </CommandItem>
          ))}
          <CommandItem onSelect={handleCreateNote}>
            <FilePlus className="mr-2 h-4 w-4" />
            Create new note
          </CommandItem>
        </CommandGroup>
        
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => {
            toggleTheme()
            setOpen(false)
          }}>
            {theme === 'dark' ? (
              <>
                <Sun className="mr-2 h-4 w-4" />
                Switch to light mode
              </>
            ) : (
              <>
                <Moon className="mr-2 h-4 w-4" />
                Switch to dark mode
              </>
            )}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}