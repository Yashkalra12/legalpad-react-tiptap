"use client"

import Image from "next/image"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'
import { useState, useEffect } from "react"

// A4 dimensions in pixels (approx at 96 DPI) for preview
const A4_PREVIEW_WIDTH_PX = 150
const A4_PREVIEW_HEIGHT_PX = (A4_PREVIEW_WIDTH_PX / 210) * 297 // Maintain aspect ratio

export default function SidebarRight({ editorContentHtml }: { editorContentHtml?: string }) {
  const [previewPages, setPreviewPages] = useState<string[]>([])

  useEffect(() => {
    if (editorContentHtml) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editorContentHtml;
      tempDiv.style.width = `${A4_PREVIEW_WIDTH_PX}px`;
      tempDiv.style.padding = '10px'; // Smaller padding for preview
      tempDiv.style.boxSizing = 'border-box';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.border = '1px solid #eee';
      tempDiv.style.overflow = 'hidden';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px'; // Hide it off-screen
      document.body.appendChild(tempDiv);

      const pages: string[] = [];
      let currentPageContent = '';
      let currentHeight = 0;

      // A more robust way to simulate page breaks for preview
      // This still won't be perfect without a full layout engine
      Array.from(tempDiv.children).forEach(child => {
        const childClone = child.cloneNode(true) as HTMLElement;
        // Apply minimal styles to clone to get a height estimate
        childClone.style.width = `${A4_PREVIEW_WIDTH_PX - 20}px`; // Account for padding
        childClone.style.position = 'absolute';
        childClone.style.visibility = 'hidden';
        document.body.appendChild(childClone);
        const childHeight = childClone.offsetHeight;
        document.body.removeChild(childClone);


        if (child.classList.contains('page-break') || (currentHeight + childHeight > A4_PREVIEW_HEIGHT_PX && currentHeight > 0)) {
          pages.push(currentPageContent);
          currentPageContent = '';
          currentHeight = 0;
        }
        currentPageContent += child.outerHTML;
        currentHeight += childHeight;
      });
      if (currentPageContent) {
        pages.push(currentPageContent);
      }

      setPreviewPages(pages);
      document.body.removeChild(tempDiv);
    }
  }, [editorContentHtml]);

  return (
    <div className="flex h-full w-72 flex-col border-l bg-white">
      <Tabs defaultValue="thumbnail" className="flex flex-col flex-1">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <TabsList className="bg-transparent">
            <TabsTrigger value="thumbnail" className="data-[state=active]:bg-vettam-purple-lighter data-[state=active]:text-vettam-purple rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 shadow-none">
              Thumbnail
            </TabsTrigger>
            <TabsTrigger value="index" className="data-[state=active]:bg-vettam-purple-lighter data-[state=active]:text-vettam-purple rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 shadow-none">
              Index
            </TabsTrigger>
            <TabsTrigger value="search" className="data-[state=active]:bg-vettam-purple-lighter data-[state=active]:text-vettam-purple rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 shadow-none">
              Search
            </TabsTrigger>
          </TabsList>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Collapse sidebar</span>
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="thumbnail" className="space-y-4">
            {previewPages.length > 0 ? (
              previewPages.map((pageHtml, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-2 shadow-sm">
                  <div
                    className="bg-white overflow-hidden mx-auto"
                    style={{
                      width: `${A4_PREVIEW_WIDTH_PX}px`,
                      height: `${A4_PREVIEW_HEIGHT_PX}px`,
                      border: '1px solid #eee',
                      transform: 'scale(0.9)', // Slightly shrink to fit
                      transformOrigin: 'top left',
                      boxSizing: 'border-box',
                      padding: '5px', // Smaller padding for preview
                      color: 'black', // Set text color to black
                    }}
                    dangerouslySetInnerHTML={{ __html: pageHtml }}
                  />
                  <div className="mt-2 text-center text-xs text-gray-500">Page {index + 1}</div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No content to preview.</div>
            )}
          </TabsContent>
          <TabsContent value="index" className="text-gray-500">
            Index content goes here.
          </TabsContent>
          <TabsContent value="search" className="text-gray-500">
            Search content goes here.
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
