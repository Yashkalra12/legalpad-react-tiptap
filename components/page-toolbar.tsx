"use client"

import { type Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Toggle } from "@/components/ui/toggle"
import { Scissors, Ruler, Eye, Palette, ZoomIn, ZoomOut, Maximize, Download, ChevronDown, FileText, FileDown } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { exportToPdf, exportToDocx, exportToHtml } from "@/lib/pdf-export"
import { toast } from "sonner"

interface PageToolbarProps {
  editor: Editor | null
  onDownloadPdf: () => void
  showRulers: boolean
  toggleRulers: () => void
  showHeadersFooters: boolean
  toggleHeadersFooters: () => void
  margins: { top: number; bottom: number; left: number; right: number }
  onMarginChange: (side: 'top' | 'bottom' | 'left' | 'right', value: number) => void
  watermarkText: string
  onWatermarkTextChange: (text: string) => void
  zoomLevel: number
  onZoomChange: (level: number) => void
  characterCount: number
}

export default function PageToolbar({
  editor,
  onDownloadPdf,
  showRulers,
  toggleRulers,
  showHeadersFooters,
  toggleHeadersFooters,
  margins,
  onMarginChange,
  watermarkText,
  onWatermarkTextChange,
  zoomLevel,
  onZoomChange,
  characterCount,
}: PageToolbarProps) {
  if (!editor) {
    return null
  }

  const handleExport = async (format: 'pdf' | 'docx' | 'html') => {
    if (!editor) return

    try {
      const contentHtml = editor.getHTML()
      const headerHtml = showHeadersFooters ? '<div style="text-align: center;">Document Header</div>' : ''
      const footerHtml = showHeadersFooters ? '<div style="text-align: center;">Page</div>' : ''
      
      const filename = `document-${new Date().toISOString().split('T')[0]}.${format}`

      switch (format) {
        case 'pdf':
          await exportToPdf(contentHtml, headerHtml, footerHtml, {
            topMargin: margins.top,
            bottomMargin: margins.bottom,
            leftMargin: margins.left,
            rightMargin: margins.right,
            watermarkText: watermarkText,
            filename,
          })
          toast.success('PDF exported successfully')
          break
        case 'docx':
          await exportToDocx(contentHtml, filename)
          toast.success('DOCX exported successfully')
          break
        case 'html':
          await exportToHtml(contentHtml, filename)
          toast.success('HTML exported successfully')
          break
      }
    } catch (error) {
      console.error(`Error exporting to ${format}:`, error)
      toast.error(`Failed to export to ${format.toUpperCase()}`)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-lg border-b border-vettam-gray bg-vettam-purple-lighter p-2">
      <Toggle
        size="sm"
        pressed={showHeadersFooters}
        onPressedChange={toggleHeadersFooters}
        aria-label="Toggle Header & Footer"
        className="text-gray-700 data-[state=on]:bg-vettam-purple-light"
      >
        <Scissors className="h-4 w-4 mr-1" />
        Header & Footer
      </Toggle>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-gray-700">
            Margin
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="p-2 grid grid-cols-2 gap-2">
          <label className="text-xs">Top:</label>
          <Input type="number" value={margins.top} onChange={(e) => onMarginChange('top', parseFloat(e.target.value))} className="h-7 w-20 text-xs" />
          <label className="text-xs">Bottom:</label>
          <Input type="number" value={margins.bottom} onChange={(e) => onMarginChange('bottom', parseFloat(e.target.value))} className="h-7 w-20 text-xs" />
          <label className="text-xs">Left:</label>
          <Input type="number" value={margins.left} onChange={(e) => onMarginChange('left', parseFloat(e.target.value))} className="h-7 w-20 text-xs" />
          <label className="text-xs">Right:</label>
          <Input type="number" value={margins.right} onChange={(e) => onMarginChange('right', parseFloat(e.target.value))} className="h-7 w-20 text-xs" />
        </DropdownMenuContent>
      </DropdownMenu>
      <Toggle
        size="sm"
        pressed={showRulers}
        onPressedChange={toggleRulers}
        aria-label="Toggle Rulers"
        className="text-gray-700 data-[state=on]:bg-vettam-purple-light"
      >
        <Ruler className="h-4 w-4 mr-1" />
        Rulers
      </Toggle>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-gray-700">
            <Palette className="h-4 w-4 mr-1" />
            Watermark
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="p-2">
          <Input
            placeholder="Watermark text"
            value={watermarkText}
            onChange={(e) => onWatermarkTextChange(e.target.value)}
            className="h-8 w-40 text-sm"
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="mx-2 h-6 w-px bg-vettam-gray" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-gray-700">
            Zoom ({Math.round(zoomLevel * 100)}%)
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => onZoomChange(1)}>
            <ZoomIn className="h-4 w-4 mr-2" />
            100%
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onZoomChange(1.25)}>
            <ZoomIn className="h-4 w-4 mr-2" />
            125%
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onZoomChange(0.75)}>
            <ZoomOut className="h-4 w-4 mr-2" />
            75%
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onZoomChange(0.5)}>
            <ZoomOut className="h-4 w-4 mr-2" />
            50%
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost" size="sm" className="text-gray-700">
        Character count: {characterCount}
      </Button>

      <div className="mx-2 h-6 w-px bg-vettam-gray" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setHardBreak().run()}
        className="flex items-center gap-1 text-sm text-gray-700"
        title="Insert Page Break"
      >
        <span className="hidden sm:inline">Page Break</span>
        <span className="inline-block h-4 w-4 border-t-2 border-dashed border-gray-400"></span>
      </Button>

      <div className="mx-2 h-6 w-px bg-vettam-gray" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-gray-700">
            <Download className="h-4 w-4 mr-1" />
            Export
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleExport('pdf')}>
            <FileDown className="h-4 w-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('docx')}>
            <FileText className="h-4 w-4 mr-2" />
            Export as DOCX
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('html')}>
            <FileText className="h-4 w-4 mr-2" />
            Export as HTML
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
