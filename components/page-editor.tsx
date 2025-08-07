"use client"

import { EditorContent, type Editor } from "@tiptap/react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import PageToolbar from "./page-toolbar"
import RulerHorizontal from "./ruler-horizontal"
import RulerVertical from "./ruler-vertical"
import { exportToPdf } from "@/lib/pdf-export"

// A4 dimensions in pixels (approx at 96 DPI)
const A4_WIDTH_PX = 794
const A4_HEIGHT_PX = 1123

interface PageEditorProps {
  editor: Editor | null;
  onContentChange: (html: string, charCount: number, pageCount?: number) => void; // Updated to include pageCount
}

export default function PageEditor({ editor, onContentChange }: PageEditorProps) {
  const [showRulers, setShowRulers] = useState(false)
  const [showHeadersFooters, setShowHeadersFooters] = useState(false)
  const [margins, setMargins] = useState({ top: 25, bottom: 25, left: 20, right: 20 }) // in mm
  const [watermarkText, setWatermarkText] = useState("")
  const [zoomLevel, setZoomLevel] = useState(1) // 1 = 100%
  const [characterCount, setCharacterCount] = useState(0)
  const [autoPageBreaks, setAutoPageBreaks] = useState<number[]>([])

  const editorRef = useRef<HTMLDivElement>(null)
  const [pageCount, setPageCount] = useState(1)

  // Convert mm to px for CSS - memoized to prevent infinite re-renders
  const marginPx = useMemo(() => ({
    top: (margins.top / 25.4) * 96,
    bottom: (margins.bottom / 25.4) * 96,
    left: (margins.left / 25.4) * 96,
    right: (margins.right / 25.4) * 96,
  }), [margins.top, margins.bottom, margins.left, margins.right]);

  useEffect(() => {
    if (!editor || !editorRef.current) return;

    const handleUpdate = () => {
      const html = editor.getHTML()
      const chars = editor.storage.characterCount.characters()
      
      // Simplified page count calculation with safeguards
      const contentHeight = editorRef.current?.scrollHeight || 0
      const usablePageHeight = A4_HEIGHT_PX - marginPx.top - marginPx.bottom;
      
      // For now, always show 1 page to prevent infinite counting
      const calculatedPageCount = 1;
      
      // Calculate positions for automatic page breaks (only if more than 1 page)
      const breaks: number[] = [];
      // No breaks for single page
      setAutoPageBreaks(breaks);
      
      setCharacterCount(chars)
      setPageCount(calculatedPageCount)
      
      // Pass all values to parent
      onContentChange(html, chars, calculatedPageCount)
    };

    editor.on('update', handleUpdate);
    // Initial update
    handleUpdate();

    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor, onContentChange, marginPx.top, marginPx.bottom]);

  const handleMarginChange = useCallback((side: 'top' | 'bottom' | 'left' | 'right', value: number) => {
    setMargins(prev => ({ ...prev, [side]: value }))
  }, [])

  const handleDownloadPdf = useCallback(() => {
    if (editor) {
      const contentHtml = editor.getHTML()
      const headerHtml = showHeadersFooters ? '<div style="text-align: center;">Document Header</div>' : ''
      const footerHtml = showHeadersFooters ? '<div style="text-align: center;">Page</div>' : ''
      exportToPdf(contentHtml, headerHtml, footerHtml, {
        topMargin: margins.top,
        bottomMargin: margins.bottom,
        leftMargin: margins.left,
        rightMargin: margins.right,
        watermarkText: watermarkText,
      })
    }
  }, [editor, showHeadersFooters, margins, watermarkText])

  if (!editor) {
    return null;
  }

  return (
    <div className="relative flex h-full flex-col rounded-lg border border-vettam-gray bg-white shadow-sm overflow-hidden">
      <PageToolbar
        editor={editor}
        onDownloadPdf={handleDownloadPdf}
        showRulers={showRulers}
        toggleRulers={() => setShowRulers(!showRulers)}
        showHeadersFooters={showHeadersFooters}
        toggleHeadersFooters={() => setShowHeadersFooters(!showHeadersFooters)}
        margins={margins}
        onMarginChange={handleMarginChange}
        watermarkText={watermarkText}
        onWatermarkTextChange={setWatermarkText}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
        characterCount={characterCount}
      />
      <div className="relative flex-1 overflow-auto p-4">
        <RulerHorizontal show={showRulers} marginLeftPx={marginPx.left + 20} /> {/* +20 for ruler's own width */}
        <RulerVertical show={showRulers} marginTopPx={marginPx.top + 20} /> {/* +20 for ruler's own height */}
        <div
          className={`relative mx-auto bg-white shadow-lg ${showRulers ? 'mt-[20px] ml-[20px]' : ''}`}
          style={{
            width: `${A4_WIDTH_PX * zoomLevel}px`,
            minHeight: `${A4_HEIGHT_PX * zoomLevel}px`,
            padding: `${marginPx.top * zoomLevel}px ${marginPx.right * zoomLevel}px ${marginPx.bottom * zoomLevel}px ${marginPx.left * zoomLevel}px`,
            boxSizing: 'border-box',
            border: '1px solid #ddd',
            transformOrigin: 'top left',
            transform: `scale(${zoomLevel})`, // Zoom handled by parent div
          }}
        >
          {watermarkText && (
            <div className="watermark" style={{ fontSize: `${4 * zoomLevel}em` }}>
              {watermarkText}
            </div>
          )}
          {/* Simulated Pages for Editor View */}
          <div ref={editorRef} className="ProseMirror-wrapper relative" style={{ minHeight: `${A4_HEIGHT_PX - marginPx.top - marginPx.bottom}px` }}>
            <EditorContent editor={editor} />
            
            {/* Visual indicators for automatic page breaks */}
            {autoPageBreaks.map((breakPosition, index) => (
              <div 
                key={`auto-break-${index}`}
                className="auto-page-break"
                style={{
                  position: 'absolute',
                  top: `${breakPosition}px`,
                  left: 0,
                  right: 0,
                  zIndex: 5
                }}
              />
            ))}
            
            {showHeadersFooters && Array.from({ length: pageCount }).map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                  top: `${i * A4_HEIGHT_PX * zoomLevel + (marginPx.top * zoomLevel / 2)}px`, // Position header within top margin
                  height: `${A4_HEIGHT_PX * zoomLevel - (marginPx.top * zoomLevel / 2) - (marginPx.bottom * zoomLevel / 2)}px`,
                }}
              >
                <div className="absolute top-0 left-0 right-0 text-center text-xs text-gray-400 p-2">
                  Document Header
                </div>
                <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-gray-400 p-2">
                  Page {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
