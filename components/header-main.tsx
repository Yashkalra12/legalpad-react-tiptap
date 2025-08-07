"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, MessageSquare, Download, MoreHorizontal, CheckCircle, Loader2, X } from 'lucide-react'
import { useState, useEffect } from "react"
import { type Editor } from "@tiptap/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface HeaderMainProps {
  isSaved: boolean
  isSaving: boolean
  lastSaved: Date | null
  onSave: () => void
  editor: Editor | null
}

interface Comment {
  id: string
  text: string
  author: string
  timestamp: Date
  selection: { from: number; to: number }
}

export default function HeaderMain({ isSaved, isSaving, lastSaved, onSave, editor }: HeaderMainProps) {
  const [documentTitle, setDocumentTitle] = useState("Olga Tellis v. Bombay Municipal Corporation (1985).docx")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        onSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSave]);

  const handleAddComment = () => {
    if (editor && editor.isEditable) {
      const selection = editor.state.selection;
      if (!selection.empty) {
        setIsCommentDialogOpen(true);
      } else {
        toast.error('Please select some text to add a comment.');
      }
    }
  };

  const handleSubmitComment = () => {
    if (!editor || !commentText.trim()) return;

    const selection = editor.state.selection;
    const commentId = `comment-${Date.now()}`;
    
    // Add comment mark to the editor
    editor.chain().focus().setComment(commentId).run();
    
    // Store comment data
    const newComment: Comment = {
      id: commentId,
      text: commentText,
      author: "Yash Kalra",
      timestamp: new Date(),
      selection: { from: selection.from, to: selection.to }
    };
    
    setComments(prev => [...prev, newComment]);
    setCommentText("");
    setIsCommentDialogOpen(false);
    toast.success("Comment added successfully");
  };

  const handleRemoveComment = (commentId: string) => {
    if (editor) {
      // Remove comment mark from editor
      editor.chain().focus().unsetComment().run();
      
      // Remove from comments list
      setComments(prev => prev.filter(c => c.id !== commentId));
      toast.success("Comment removed");
    }
  };

  const formatLastSaved = (date: Date | null) => {
    if (!date) return null;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b bg-white px-6">
        <div className="flex items-center gap-4">
          {isEditingTitle ? (
            <Input
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                  setIsEditingTitle(false);
                }
              }}
              className="text-lg font-semibold h-auto py-1 px-2 text-gray-900"
              autoFocus
            />
          ) : (
            <h1 className="text-lg font-semibold cursor-pointer text-gray-900" onClick={() => setIsEditingTitle(true)}>
              {documentTitle}
            </h1>
          )}
          
          <div className={`flex items-center gap-1 text-sm ${isSaved ? 'text-gray-500' : 'text-orange-500'}`}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : isSaved ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Saved
                {lastSaved && (
                  <span className="text-gray-500">• {formatLastSaved(lastSaved)}</span>
                )}
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                Unsaved changes
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500"
                onClick={handleAddComment}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Add Comment</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Comment</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea
                    id="comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Enter your comment..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCommentDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitComment} disabled={!commentText.trim()}>
                    Add Comment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500"
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">Export</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onSave}
            disabled={isSaving}
            className="h-8 w-8 text-gray-500"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span className="sr-only">Save</span>
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </div>
      </header>

      {/* Comments Panel */}
      {comments.length > 0 && (
        <div className="border-b border-vettam-gray bg-gray-50 px-6 py-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Comments ({comments.length})</h3>
          </div>
          <div className="mt-2 space-y-2">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2 rounded-lg bg-white p-3 shadow-sm">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                    <span className="text-xs text-gray-500">
                      {comment.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{comment.text}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveComment(comment.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
