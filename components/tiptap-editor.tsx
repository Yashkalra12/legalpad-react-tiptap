"use client"

import { EditorContent, type Editor } from "@tiptap/react"
import TiptapToolbar from "./tiptap-toolbar"

interface TiptapEditorProps {
  editor: Editor | null
  showToolbar?: boolean
}

export default function TiptapEditor({
  editor,
  showToolbar = true,
}: TiptapEditorProps) {
  if (!editor) {
    return null
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-vettam-gray bg-white shadow-sm overflow-hidden"> {/* Added overflow-hidden */}
      {showToolbar && <TiptapToolbar editor={editor} />}
      <div className="flex-1 overflow-y-auto p-4"> {/* This already has overflow-y-auto which is good */}
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
