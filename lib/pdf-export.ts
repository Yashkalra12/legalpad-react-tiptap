import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// A4 dimensions in mm
const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297

// A4 dimensions in pixels (approx at 96 DPI)
const A4_WIDTH_PX = 794
const A4_HEIGHT_PX = 1123

export interface ExportOptions {
  topMargin: number
  bottomMargin: number
  leftMargin: number
  rightMargin: number
  watermarkText?: string
  filename?: string
}

export async function exportToPdf(
  contentHtml: string,
  headerHtml: string,
  footerHtml: string,
  options: ExportOptions
) {
  const {
    topMargin,
    bottomMargin,
    leftMargin,
    rightMargin,
    watermarkText = "",
    filename = "document.pdf"
  } = options

  // Convert mm to px for CSS
  const topMarginPx = (topMargin / 25.4) * 96
  const bottomMarginPx = (bottomMargin / 25.4) * 96
  const leftMarginPx = (leftMargin / 25.4) * 96
  const rightMarginPx = (rightMargin / 25.4) * 96

  const doc = new jsPDF('p', 'mm', 'a4')
  let currentPage = 1

  // Create temporary container
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = contentHtml
  tempDiv.style.position = 'absolute'
  tempDiv.style.left = '-9999px'
  tempDiv.style.top = '0'
  tempDiv.style.width = `${A4_WIDTH_PX}px`
  tempDiv.style.backgroundColor = 'white'
  tempDiv.style.color = 'black'
  tempDiv.style.fontFamily = 'sans-serif'
  tempDiv.style.fontSize = '12pt'
  tempDiv.style.lineHeight = '1.4'
  tempDiv.style.padding = '0'
  tempDiv.style.margin = '0'

  // Add styles
  const style = document.createElement('style')
  style.innerHTML = `
    .page-break {
      page-break-after: always;
      break-after: page;
      height: 0;
      overflow: hidden;
    }
    .pdf-page {
      width: ${A4_WIDTH_PX}px;
      min-height: ${A4_HEIGHT_PX}px;
      padding: ${topMarginPx}px ${rightMarginPx}px ${bottomMarginPx}px ${leftMarginPx}px;
      box-sizing: border-box;
      position: relative;
      background-color: white;
      color: black;
      font-family: sans-serif;
      font-size: 12pt;
    }
    .pdf-header, .pdf-footer {
      position: absolute;
      left: ${leftMarginPx}px;
      right: ${rightMarginPx}px;
      font-size: 10pt;
      color: #333;
      width: calc(100% - ${leftMarginPx + rightMarginPx}px);
      text-align: center;
    }
    .pdf-header {
      top: ${topMarginPx / 2}px;
    }
    .pdf-footer {
      bottom: ${bottomMarginPx / 2}px;
    }
    .pdf-page-number {
      float: right;
    }
    .pdf-watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 4em;
      color: rgba(0, 0, 0, 0.1);
      pointer-events: none;
      user-select: none;
      z-index: 10;
      white-space: nowrap;
    }
    .comment-highlight {
      background-color: transparent !important;
      cursor: default !important;
    }
    .comment-highlight::after {
      display: none !important;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 0.5em;
      text-align: left;
    }
    th {
      background-color: #f0f0f0;
    }
  `
  document.head.appendChild(style)
  document.body.appendChild(tempDiv)

  // Split content into pages for rendering
  const pages: HTMLElement[] = []
  let currentPageDiv = document.createElement('div')
  currentPageDiv.className = 'pdf-page'
  pages.push(currentPageDiv)

  Array.from(tempDiv.children).forEach(child => {
    if (child.classList.contains('page-break')) {
      currentPageDiv = document.createElement('div')
      currentPageDiv.className = 'pdf-page'
      pages.push(currentPageDiv)
    } else {
      currentPageDiv.appendChild(child.cloneNode(true))
    }
  })

  // Render each page and add to PDF
  for (const pageDiv of pages) {
    // Add header and footer to each page
    const header = document.createElement('div')
    header.className = 'pdf-header'
    header.innerHTML = headerHtml

    const footer = document.createElement('div')
    footer.className = 'pdf-footer'
    footer.innerHTML = `${footerHtml} <span class="pdf-page-number">${currentPage}</span>`

    const watermark = document.createElement('div');
    watermark.className = 'pdf-watermark';
    watermark.textContent = watermarkText;

    pageDiv.prepend(header)
    pageDiv.appendChild(footer)
    if (watermarkText) {
      pageDiv.appendChild(watermark);
    }

    document.body.appendChild(pageDiv)

    try {
      const canvas = await html2canvas(pageDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: A4_WIDTH_PX,
        windowHeight: A4_HEIGHT_PX,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = A4_WIDTH_MM
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      if (currentPage > 1) {
        doc.addPage()
      }
      doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

      document.body.removeChild(pageDiv)
      currentPage++
    } catch (error) {
      console.error('Error rendering page:', error)
      document.body.removeChild(pageDiv)
    }
  }

  document.body.removeChild(tempDiv)
  document.head.removeChild(style)

  doc.save(filename)
}

export async function exportToDocx(
  contentHtml: string,
  filename: string = "document.docx"
) {
  try {
    // Convert HTML to DOCX format
    // This is a simplified implementation - in production you'd use a proper library like mammoth or docx
    const docxContent = convertHtmlToDocx(contentHtml)
    
    // Create and download the file
    const blob = new Blob([docxContent], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting to DOCX:', error)
    throw new Error('Failed to export to DOCX')
  }
}

function convertHtmlToDocx(html: string): string {
  // This is a placeholder implementation
  // In a real app, you'd use a proper HTML to DOCX converter
  // For now, we'll create a simple text-based DOCX structure
  
  // Remove HTML tags and convert to plain text
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  
  // Extract text content
  const textContent = tempDiv.textContent || tempDiv.innerText || ''
  
  // Create a simple DOCX structure (this is very basic)
  // In production, use a library like docx or mammoth
  const docxContent = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:t>${textContent}</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>
  `
  
  return docxContent
}

export async function exportToHtml(
  contentHtml: string,
  filename: string = "document.html"
) {
  try {
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 0.5em;
            text-align: left;
        }
        th {
            background-color: #f0f0f0;
        }
        .comment-highlight {
            background-color: #fef3c7;
            border-bottom: 2px solid #f59e0b;
        }
    </style>
</head>
<body>
    ${contentHtml}
</body>
</html>
    `
    
    const blob = new Blob([fullHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting to HTML:', error)
    throw new Error('Failed to export to HTML')
  }
}
