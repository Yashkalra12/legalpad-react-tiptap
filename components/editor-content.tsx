"use client"

import { useState, useEffect } from "react"
import { type Editor } from "@tiptap/react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Loader2, AlertCircle } from 'lucide-react'
import TiptapEditor from "./tiptap-editor"
import PageEditor from "./page-editor"
import { toast } from "sonner"

interface EditorContentProps {
  editor: Editor | null
  onContentChange: (html: string, chars: number) => void
}

export default function EditorContent({ editor, onContentChange }: EditorContentProps) {
  const [activeTab, setActiveTab] = useState("text")
  const [currentCharacterCount, setCurrentCharacterCount] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleEditorContentChange = (html: string, chars: number, pages?: number) => {
    try {
      onContentChange(html, chars)
      setCurrentCharacterCount(chars)
      if (pages) setPageCount(pages)
    } catch (err) {
      console.error("Error updating content:", err)
      setError("Failed to update content")
      toast.error("Failed to update content")
    }
  }

  useEffect(() => {
    if (editor) {
      setIsLoading(false)
      setError(null)
    }
  }, [editor])

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Something went wrong</h3>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
          <Button 
            onClick={() => {
              setError(null)
              setIsLoading(true)
              // Reload the editor
              window.location.reload()
            }}
            variant="outline"
          >
            Try again
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-vettam-purple" />
          <p className="text-sm text-gray-500">Loading editor...</p>
        </div>
      </div>
    )
  }

  if (!editor) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Editor not available</h3>
            <p className="text-sm text-gray-500 mt-1">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col bg-white overflow-hidden"> 
      <Tabs defaultValue="text" onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden"> 
        <div className="flex items-center border-b border-vettam-gray px-6 py-3">
          <TabsList className="bg-transparent">
            <TabsTrigger 
              value="text" 
              className="data-[state=active]:bg-vettam-purple-lighter data-[state=active]:text-vettam-purple rounded-md px-4 py-2 text-base font-medium text-gray-600 shadow-none"
            >
              Text
            </TabsTrigger>
            <TabsTrigger 
              value="page" 
              className="data-[state=active]:bg-vettam-purple-lighter data-[state=active]:text-vettam-purple rounded-md px-4 py-2 text-base font-medium text-gray-600 shadow-none"
            >
              Page
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="flex-1 p-6 overflow-hidden"> 
          <TabsContent value="text" className="h-full overflow-hidden"> 
            <TiptapEditor editor={editor} />
          </TabsContent>
          <TabsContent value="page" className="h-full overflow-hidden"> 
            <PageEditor editor={editor} onContentChange={(html, chars, pages) => handleEditorContentChange(html, chars, pages)} />
          </TabsContent>
        </div>
      </Tabs>
      <div className="flex items-center justify-between border-t border-vettam-gray p-4">
        <div className="text-sm text-gray-500">{currentCharacterCount} characters</div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">Page</div>
          <Input type="number" defaultValue={1} className="w-16 text-center" />
          <div className="text-sm text-gray-500">of {pageCount}</div>
        </div>
        <div className="flex flex-1 items-center gap-2 pl-8">
          <Input placeholder="Ask Vettam" className="flex-1 rounded-full bg-gray-100 px-4 py-2" />
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-vettam-orange text-white hover:bg-vettam-orange/90">
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
