"use client"

import SidebarLeft from "@/components/sidebar-left"
import HeaderMain from "@/components/header-main"
import EditorContent from "@/components/editor-content"
import SidebarRight from "@/components/sidebar-right"
import { useState, useEffect, useCallback, useRef } from "react"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import { Table } from "@tiptap/extension-table"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"
import { TableRow } from "@tiptap/extension-table-row"
import CharacterCount from "@tiptap/extension-character-count"
import { PageBreak } from "@/extensions/page-break"
import { Comment } from "@/extensions/comment"
import { toast } from "sonner"

const initialEditorContent = `
<p>1. <strong>Androids and Humans:</strong> The novel explores the uneasy coexistence of humans and androids. Androids, manufactured on Mars, rebel, kill their owners, and escape to Earth, where they hope to remain undetected.<sup>[1]</sup></p>
<p>2. <strong>Empathy and Identity:</strong> To distinguish androids from humans, the Voigt-Kampff Test measures emotional responses. Androids lack empathy, making them vulnerable to detection. <em>Criminal [2005]</em><sup>[2]</sup></p>
<p>Do Androids Dream of Electric Sheep? is a 1968 dystopian science fiction novel by American writer Philip K. Dick. Set in a post-apocalyptic San Francisco, the story unfolds after a devastating global war.</p>
<p>1. <strong>Androids and Humans:</strong> The novel explores the uneasy coexistence of humans and androids. Androids, manufactured on Mars, rebel, kill their owners, and escape to Earth, where they hope to remain undetected.<sup>[1]</sup></p>
<p>2. <strong>Empathy and Identity:</strong> To distinguish androids from humans, the Voigt-Kampff Test measures emotional responses. Androids lack empathy, making them vulnerable to detection. <em>Criminal [2005]</em><sup>[2]</sup></p>
<p>Do Androids Dream of Electric Sheep? is a 1968 dystopian science fiction novel by American writer Philip K. Dick. Set in a post-apocalyptic San Francisco, the story unfolds after a devastating global war.</p>
<p>1. <strong>Androids and Humans:</strong> The novel explores the uneasy coexistence of humans and androids. Androids, manufactured on Mars, rebel, kill their owners, and escape to Earth, where they hope to remain undetected.<sup>[1]</sup></p>
`

// Auto-save configuration
const AUTO_SAVE_DELAY = 3000 // 3 seconds
const STORAGE_KEY = 'legalpad-document'

export default function Home() {
  const [editorContentHtml, setEditorContentHtml] = useState(initialEditorContent)
  const [characterCount, setCharacterCount] = useState(0)
  const [isSaved, setIsSaved] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load saved content from localStorage on mount
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem(STORAGE_KEY)
      if (savedContent) {
        setEditorContentHtml(savedContent)
        setLastSaved(new Date())
        toast.success("Document restored from auto-save")
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error)
    }
  }, [])

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!editorContentHtml) return

    setIsSaving(true)
    try {
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, editorContentHtml)
      
      // In a real app, you'd also save to backend here
      // await saveToBackend(editorContentHtml)
      
      setIsSaved(true)
      setLastSaved(new Date())
      toast.success("Document auto-saved")
    } catch (error) {
      console.error("Auto-save failed:", error)
      toast.error("Auto-save failed")
      setIsSaved(false)
    } finally {
      setIsSaving(false)
    }
  }, [editorContentHtml])

  // Debounced auto-save
  const debouncedAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave()
    }, AUTO_SAVE_DELAY)
  }, [autoSave])

  // Trigger auto-save when content changes
  useEffect(() => {
    if (editorContentHtml) {
      setIsSaved(false)
      debouncedAutoSave()
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [editorContentHtml, debouncedAutoSave])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Superscript,
      Subscript,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      CharacterCount,
      PageBreak,
      Comment,
    ],
    content: initialEditorContent,
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setEditorContentHtml(editor.getHTML())
      setCharacterCount(editor.storage.characterCount.characters())
    },
    immediatelyRender: false,
  })

  const handleContentChange = useCallback((html: string, chars: number) => {
    setEditorContentHtml(html)
    setCharacterCount(chars)
  }, [])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, editorContentHtml)
      
      // In a real app, you'd also save to backend here
      // await saveToBackend(editorContentHtml)
      
      setIsSaved(true)
      setLastSaved(new Date())
      toast.success("Document saved successfully")
    } catch (error) {
      console.error("Save failed:", error)
      toast.error("Failed to save document")
      setIsSaved(false)
    } finally {
      setIsSaving(false)
    }
  }, [editorContentHtml])

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SidebarLeft />
      <div className="flex flex-1 flex-col">
        <HeaderMain 
          isSaved={isSaved} 
          isSaving={isSaving}
          lastSaved={lastSaved}
          onSave={handleSave} 
          editor={editor} 
        />
        <EditorContent editor={editor} onContentChange={handleContentChange} />
      </div>
      <SidebarRight editorContentHtml={editorContentHtml} />
    </div>
  )
}
