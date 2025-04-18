
import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useNoteStore, Note } from '../store/note-store'
import { EditorToolbar } from './editor-toolbar'
import { cn } from '../lib/utils'

interface EditorProps {
  note: Note
}

export function Editor({ note }: EditorProps) {
  const { updateNote } = useNoteStore()
  const [title, setTitle] = useState(note.title)
  
  // Update title when note changes
  useEffect(() => {
    setTitle(note.title)
  }, [note.title, note.id])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    content: note.content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose dark:prose-invert focus:outline-none max-w-full',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      updateNote(note.id, { content: html })
    },
  })

  // Update editor content when note changes
  useEffect(() => {
    if (editor && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content)
    }
  }, [editor, note.id, note.content])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    updateNote(note.id, { title: newTitle })
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      editor?.commands.focus()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto">
          <EditorToolbar editor={editor} />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-6 px-8 max-w-4xl">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
            placeholder="Untitled"
            className={cn(
              "w-full text-3xl font-bold tracking-tight outline-none bg-transparent mb-4",
              "placeholder:text-muted-foreground/50"
            )}
          />
          
          <div className="min-h-[calc(100vh-200px)]">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  )
}