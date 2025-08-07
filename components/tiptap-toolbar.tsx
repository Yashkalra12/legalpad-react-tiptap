"use client"

import { type Editor } from "@tiptap/react"
import { Bold, Italic, Underline, Strikethrough, Code, List, ListOrdered, Heading1, Heading2, Heading3, Link, Unlink, AlignLeft, AlignCenter, AlignRight, AlignJustify, Subscript, Superscript, Eraser, Table, Plus, Minus, Columns, Rows, Merge, Split, Palette, Type, ChevronDown, Search, Replace, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useCallback } from "react"

interface TiptapToolbarProps {
  editor: Editor | null
}

export default function TiptapToolbar({ editor }: TiptapToolbarProps) {
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false)
  const [findText, setFindText] = useState("")
  const [replaceText, setReplaceText] = useState("")
  const [isCaseSensitive, setIsCaseSensitive] = useState(false)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [totalMatches, setTotalMatches] = useState(0)

  const findMatches = useCallback(() => {
    if (!editor || !findText) return 0

    const content = editor.getHTML()
    const regex = new RegExp(findText, isCaseSensitive ? 'g' : 'gi')
    const matches = content.match(regex)
    return matches ? matches.length : 0
  }, [editor, findText, isCaseSensitive])

  const findNext = useCallback(() => {
    if (!editor || !findText) return

    const content = editor.getHTML()
    const regex = new RegExp(findText, isCaseSensitive ? 'g' : 'gi')
    const matches = content.match(regex)
    
    if (matches) {
      setTotalMatches(matches.length)
      setCurrentMatchIndex(prev => (prev + 1) % matches.length)
      
      // Highlight the current match
      const textContent = editor.getText()
      const textMatches = textContent.match(regex)
      if (textMatches) {
        const matchIndex = textMatches.findIndex((_, index) => index === currentMatchIndex)
        if (matchIndex !== -1) {
          // This is a simplified version - in a real implementation you'd need to
          // properly handle the selection and highlighting
          editor.commands.setTextSelection({ from: matchIndex, to: matchIndex + findText.length })
        }
      }
    }
  }, [editor, findText, isCaseSensitive, currentMatchIndex])

  const replaceCurrent = useCallback(() => {
    if (!editor || !findText || !replaceText) return

    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to)
    
    if (isCaseSensitive ? selectedText === findText : selectedText.toLowerCase() === findText.toLowerCase()) {
      editor.chain().focus().insertContent(replaceText).run()
      findNext()
    }
  }, [editor, findText, replaceText, isCaseSensitive, findNext])

  const replaceAll = useCallback(() => {
    if (!editor || !findText || !replaceText) return

    const content = editor.getHTML()
    const regex = new RegExp(findText, isCaseSensitive ? 'g' : 'gi')
    const newContent = content.replace(regex, replaceText)
    
    editor.commands.setContent(newContent)
    setTotalMatches(0)
    setCurrentMatchIndex(0)
  }, [editor, findText, replaceText, isCaseSensitive])

  if (!editor) {
    return null
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 rounded-t-lg border-b border-vettam-gray bg-vettam-purple-lighter p-2">
        {/* Primary formatting tools - always visible */}
        <div className="flex items-center gap-1">
          <Toggle
            size="sm"
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            aria-label="Toggle bold"
            className="text-gray-700 data-[state=on]:bg-vettam-purple-light"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            aria-label="Toggle italic"
            className="text-gray-700 data-[state=on]:bg-vettam-purple-light"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("underline")}
            onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
            aria-label="Toggle underline"
            className="text-gray-700 data-[state=on]:bg-vettam-purple-light"
          >
            <Underline className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("strike")}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            aria-label="Toggle strikethrough"
            className="text-gray-700 data-[state=on]:bg-vettam-purple-light"
          >
            <Strikethrough className="h-4 w-4" />
          </Toggle>
        </div>

        <div className="mx-2 h-6 w-px bg-vettam-gray" />

        {/* Text alignment - always visible */}
        <div className="flex items-center gap-1">
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "left" })}
            onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
            aria-label="Align left"
            className="text-gray-700 data-[state=on]:bg-vettam-purple-light"
          >
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "center" })}
            onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
            aria-label="Align center"
            className="text-gray-700 data-[state=on]:bg-vettam-purple-light"
          >
            <AlignCenter className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "right" })}
            onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
            aria-label="Align right"
            className="text-gray-700 data-[state=on]:bg-vettam-purple-light"
          >
            <AlignRight className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "justify" })}
            onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
            aria-label="Align justify"
            className="text-gray-700 data-[state=on]:bg-vettam-purple-light"
          >
            <AlignJustify className="h-4 w-4" />
          </Toggle>
        </div>

        <div className="mx-2 h-6 w-px bg-vettam-gray" />

        {/* Lists - always visible */}
        <div className="flex items-center gap-1">
          <Toggle
            size="sm"
            pressed={editor.isActive("bulletList")}
            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            aria-label="Toggle bullet list"
            className="text-gray-700 data-[state=on]:bg-vettam-purple-light"
          >
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("orderedList")}
            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            aria-label="Toggle ordered list"
            className="text-gray-700 data-[state=on]:bg-vettam-purple-light"
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>
        </div>

        <div className="mx-2 h-6 w-px bg-vettam-gray" />

        {/* Superscript/Subscript - always visible */}
        <div className="flex items-center gap-1">
          <Toggle
            size="sm"
            pressed={editor.isActive("superscript")}
            onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
            aria-label="Toggle superscript"
            className="text-gray-700 data-[state=on]:bg-vettam-purple-light"
          >
            <Superscript className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("subscript")}
            onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
            aria-label="Toggle subscript"
            className="text-gray-700 data-[state=on]:bg-vettam-purple-light"
          >
            <Subscript className="h-4 w-4" />
          </Toggle>
        </div>

        <div className="mx-2 h-6 w-px bg-vettam-gray" />

        {/* Clear formatting - always visible */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          aria-label="Clear formatting"
          className="text-gray-700"
        >
          <Eraser className="h-4 w-4" />
        </Button>

        <div className="mx-2 h-6 w-px bg-vettam-gray" />

        {/* Find & Replace - always visible */}
        <Dialog open={isFindReplaceOpen} onOpenChange={setIsFindReplaceOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-gray-700">
              <Search className="h-4 w-4" />
              Find & Replace
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Find & Replace</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="find" className="text-right">
                  Find
                </Label>
                <Input
                  id="find"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  className="col-span-3"
                  placeholder="Search text..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="replace" className="text-right">
                  Replace
                </Label>
                <Input
                  id="replace"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="col-span-3"
                  placeholder="Replace with..."
                />
              </div>
              <div className="flex items-center gap-4">
                <Toggle
                  size="sm"
                  pressed={isCaseSensitive}
                  onPressedChange={setIsCaseSensitive}
                  className="text-gray-700 data-[state=on]:bg-vettam-purple-light"
                >
                  Case sensitive
                </Toggle>
                {totalMatches > 0 && (
                  <span className="text-sm text-gray-500">
                    {currentMatchIndex + 1} of {totalMatches} matches
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={findNext} disabled={!findText}>
                  <Search className="h-4 w-4 mr-2" />
                  Find Next
                </Button>
                <Button onClick={replaceCurrent} disabled={!findText || !replaceText}>
                  <Replace className="h-4 w-4 mr-2" />
                  Replace
                </Button>
                <Button onClick={replaceAll} disabled={!findText || !replaceText}>
                  <Replace className="h-4 w-4 mr-2" />
                  Replace All
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="mx-2 h-6 w-px bg-vettam-gray" />

        {/* Table tools - always visible */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-gray-700">
              <Table className="h-4 w-4" />
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
              <Table className="h-4 w-4 mr-2" />
              Insert Table
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Column Before
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Column After
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>
              <Minus className="h-4 w-4 mr-2" />
              Delete Column
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Row Before
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Row After
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>
              <Minus className="h-4 w-4 mr-2" />
              Delete Row
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()}>
              <Table className="h-4 w-4 mr-2" />
              Delete Table
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().mergeCells().run()}>
              <Merge className="h-4 w-4 mr-2" />
              Merge Cells
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().splitCell().run()}>
              <Split className="h-4 w-4 mr-2" />
              Split Cell
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeaderColumn().run()}>
              <Columns className="h-4 w-4 mr-2" />
              Toggle Header Column
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
              <Rows className="h-4 w-4 mr-2" />
              Toggle Header Row
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-2 h-6 w-px bg-vettam-gray" />

        {/* Color tools - always visible */}
        <Button variant="ghost" size="sm" aria-label="Text color" className="text-gray-700">
          <Palette className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" aria-label="Highlight color" className="text-gray-700">
          <Type className="h-4 w-4" />
        </Button>
      </div>
    </>
  )
}
