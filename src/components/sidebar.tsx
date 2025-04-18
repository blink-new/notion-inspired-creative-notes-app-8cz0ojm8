
import { useState } from 'react'
import { useNoteStore } from '../store/note-store'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { useTheme } from '../hooks/use-theme'
import { 
  ChevronDown, 
  ChevronRight, 
  File, 
  FilePlus, 
  Folder, 
  Moon, 
  MoreVertical, 
  Search, 
  Sun, 
  Trash 
} from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu'
import { cn } from '../lib/utils'

export function Sidebar() {
  const { notes, activeNoteId, setActiveNote, createNote, deleteNote } = useNoteStore()
  const { theme, toggleTheme } = useTheme()
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleCreateNote = (parentId: string | null = null) => {
    createNote({
      title: 'Untitled',
      content: '<p></p>',
      parentId
    })
  }

  // Build tree structure
  const rootNotes = notes.filter(note => note.parentId === null)
  
  const renderNoteItem = (note: typeof notes[0], depth = 0) => {
    const childNotes = notes.filter(n => n.parentId === note.id)
    const hasChildren = childNotes.length > 0
    const isExpanded = expandedFolders[note.id] ?? false
    const isActive = activeNoteId === note.id

    return (
      <div key={note.id}>
        <div 
          className={cn(
            "group flex items-center py-1 px-2 text-sm rounded-md cursor-pointer",
            isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary/80"
          )}
          style={{ paddingLeft: `${(depth * 12) + 8}px` }}
        >
          <button 
            className="mr-1 h-4 w-4 flex items-center justify-center"
            onClick={() => hasChildren && toggleFolder(note.id)}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )
            ) : (
              <File className="h-3.5 w-3.5" />
            )}
          </button>
          
          <div 
            className="flex-1 truncate"
            onClick={() => setActiveNote(note.id)}
          >
            {note.title || "Untitled"}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleCreateNote(note.id)}>
                Add subpage
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => deleteNote(note.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {childNotes.map(childNote => renderNoteItem(childNote, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col border-r bg-sidebar-background text-sidebar-foreground">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold">Notecraft</h1>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      <div className="px-3">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>
      
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pages
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5"
          onClick={() => handleCreateNote()}
        >
          <FilePlus className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-1">
        {rootNotes.length > 0 ? (
          <div className="space-y-1">
            {rootNotes.map(note => renderNoteItem(note))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-20 text-muted-foreground">
            <p className="text-sm">No pages yet</p>
            <Button 
              variant="link" 
              size="sm" 
              className="mt-1"
              onClick={() => handleCreateNote()}
            >
              Create your first page
            </Button>
          </div>
        )}
      </ScrollArea>
      
      <Separator />
      
      <div className="p-3">
        <Button 
          variant="secondary" 
          className="w-full justify-start gap-2"
        >
          <Trash className="h-4 w-4" />
          <span>Trash</span>
        </Button>
      </div>
    </div>
  )
}