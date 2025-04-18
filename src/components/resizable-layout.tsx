
import { useState, useRef, useEffect } from 'react'
import { cn } from '../lib/utils'

interface ResizableLayoutProps {
  children: [React.ReactNode, React.ReactNode]
  defaultSize?: number
  minSize?: number
  maxSize?: number
}

export function ResizableLayout({
  children,
  defaultSize = 250,
  minSize = 180,
  maxSize = 500
}: ResizableLayoutProps) {
  const [size, setSize] = useState(defaultSize)
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)
  const startSizeRef = useRef(0)

  // Load saved size from localStorage
  useEffect(() => {
    const savedSize = localStorage.getItem('sidebar-size')
    if (savedSize) {
      const parsedSize = parseInt(savedSize, 10)
      if (!isNaN(parsedSize) && parsedSize >= minSize && parsedSize <= maxSize) {
        setSize(parsedSize)
      }
    }
  }, [minSize, maxSize])

  // Save size to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebar-size', size.toString())
  }, [size])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    startXRef.current = e.clientX
    startSizeRef.current = size
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const dx = e.clientX - startXRef.current
      const newSize = Math.min(Math.max(startSizeRef.current + dx, minSize), maxSize)
      setSize(newSize)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, minSize, maxSize])

  return (
    <div 
      ref={containerRef}
      className="flex h-full overflow-hidden"
    >
      <div 
        className="h-full overflow-hidden"
        style={{ width: `${size}px`, minWidth: `${size}px` }}
      >
        {children[0]}
      </div>
      
      <div
        className={cn(
          "relative w-1 flex-shrink-0 cursor-col-resize bg-border",
          isResizing && "bg-primary"
        )}
        onMouseDown={handleMouseDown}
      >
        <div 
          className={cn(
            "absolute inset-y-0 -left-2 w-4 cursor-col-resize",
            isResizing && "bg-transparent"
          )} 
        />
      </div>
      
      <div className="flex-1 overflow-hidden">
        {children[1]}
      </div>
    </div>
  )
}