import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutGrid, Search, Book, Pencil, Bookmark, ChevronUp, ChevronDown, Settings, HelpCircle, MessageSquare, SquarePen, FileText, Plus } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Document templates
const documentTemplates = [
  {
    id: 'contract',
    name: 'Legal Contract',
    description: 'Standard legal contract template with clauses and terms',
    category: 'Legal',
    icon: '📄',
    content: `
<h1>LEGAL CONTRACT</h1>
<p><strong>THIS AGREEMENT</strong> is made on [DATE] between:</p>
<p><strong>[PARTY A NAME]</strong> of [ADDRESS] ("the First Party")</p>
<p>and</p>
<p><strong>[PARTY B NAME]</strong> of [ADDRESS] ("the Second Party")</p>
<h2>1. DEFINITIONS</h2>
<p>In this Agreement, unless the context otherwise requires:</p>
<ul>
<li>"Effective Date" means the date of this Agreement;</li>
<li>"Term" means the period from the Effective Date until termination;</li>
</ul>
<h2>2. SCOPE OF WORK</h2>
<p>The Second Party shall provide the following services:</p>
<ul>
<li>Service 1</li>
<li>Service 2</li>
</ul>
<h2>3. PAYMENT TERMS</h2>
<p>Payment shall be made as follows:</p>
<p>Amount: [AMOUNT]</p>
<p>Due Date: [DATE]</p>
<h2>4. TERMINATION</h2>
<p>Either party may terminate this Agreement with [NOTICE PERIOD] written notice.</p>
<h2>5. GOVERNING LAW</h2>
<p>This Agreement shall be governed by the laws of [JURISDICTION].</p>
<p><strong>SIGNED:</strong></p>
<p>First Party: _________________ Date: ___________</p>
<p>Second Party: _________________ Date: ___________</p>
    `
  },
  {
    id: 'letter',
    name: 'Legal Letter',
    description: 'Professional legal letter template',
    category: 'Legal',
    icon: '📝',
    content: `
<p>[DATE]</p>
<p>[RECIPIENT NAME]<br/>
[RECIPIENT ADDRESS]</p>
<p><strong>Subject: [SUBJECT]</strong></p>
<p>Dear [RECIPIENT NAME],</p>
<p>I am writing to you regarding [SUBJECT MATTER].</p>
<p>[BODY OF LETTER]</p>
<p>Please contact me if you have any questions.</p>
<p>Sincerely,<br/>
[YOUR NAME]<br/>
[YOUR TITLE]<br/>
[YOUR CONTACT INFORMATION]</p>
    `
  },
  {
    id: 'agreement',
    name: 'Service Agreement',
    description: 'Service agreement template for business relationships',
    category: 'Business',
    icon: '🤝',
    content: `
<h1>SERVICE AGREEMENT</h1>
<p><strong>AGREEMENT</strong> made on [DATE] between:</p>
<p><strong>[SERVICE PROVIDER]</strong> ("Provider")</p>
<p>and</p>
<p><strong>[CLIENT]</strong> ("Client")</p>
<h2>1. SERVICES</h2>
<p>The Provider shall provide the following services:</p>
<ul>
<li>Service description 1</li>
<li>Service description 2</li>
</ul>
<h2>2. COMPENSATION</h2>
<p>Client shall pay Provider [AMOUNT] for services rendered.</p>
<h2>3. TERM</h2>
<p>This agreement shall commence on [START DATE] and continue until [END DATE].</p>
<h2>4. CONFIDENTIALITY</h2>
<p>Both parties agree to maintain confidentiality of all information shared.</p>
<p><strong>SIGNED:</strong></p>
<p>Provider: _________________ Date: ___________</p>
<p>Client: _________________ Date: ___________</p>
    `
  },
  {
    id: 'notice',
    name: 'Legal Notice',
    description: 'Legal notice template for formal communications',
    category: 'Legal',
    icon: '⚖️',
    content: `
<h1>LEGAL NOTICE</h1>
<p><strong>TO:</strong> [RECIPIENT NAME]<br/>
<strong>FROM:</strong> [SENDER NAME]<br/>
<strong>DATE:</strong> [DATE]<br/>
<strong>SUBJECT:</strong> [SUBJECT]</p>
<p>This notice is given pursuant to [RELEVANT LAW/REGULATION].</p>
<p><strong>NOTICE:</strong></p>
<p>[DETAILED NOTICE CONTENT]</p>
<p><strong>ACTION REQUIRED:</strong></p>
<p>[SPECIFIC ACTION REQUIRED]</p>
<p><strong>DEADLINE:</strong> [DEADLINE DATE]</p>
<p>If you fail to comply with this notice, legal action may be taken.</p>
<p>Sincerely,<br/>
[SENDER NAME]<br/>
[SENDER CONTACT INFORMATION]</p>
    `
  }
]

export default function SidebarLeft() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  const handleTemplateSelect = (template: typeof documentTemplates[0]) => {
    // In a real app, you'd load this template into the editor
    console.log('Selected template:', template.name)
    setIsTemplatesOpen(false)
    // You could emit an event or use a callback to load the template
  }

  return (
    <>
      <div className="flex h-full w-64 flex-col bg-vettam-purple text-white">
        <div className="flex items-center justify-between p-4">
          <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
            Vettam.AI
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-white/80 hover:bg-vettam-purple-light"
            onMouseEnter={() => setHoveredItem('grid')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
        </div>
        <div className="p-4">
          <Dialog open={isTemplatesOpen} onOpenChange={setIsTemplatesOpen}>
            <DialogTrigger asChild>
              <Button className="w-full justify-start rounded-lg bg-vettam-orange px-4 py-2 text-base font-medium text-white hover:bg-vettam-orange/90">
                <SquarePen className="mr-2 h-5 w-5" />
                New Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Choose a Template</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {documentTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{template.icon}</span>
                        <div>
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                      <Button 
                        className="w-full mt-3" 
                        size="sm"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <nav className="flex-1 space-y-4 p-4 overflow-y-auto">
          <div>
            <h3 className="mb-2 text-sm font-medium text-white/60">Features</h3>
            <div className="space-y-1">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-white/80 transition-all hover:bg-vettam-purple-light hover:text-white"
                onMouseEnter={() => setHoveredItem('workspace')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <LayoutGrid className="h-5 w-5" />
                {hoveredItem === 'workspace' ? 'Under Development' : 'Workspace'}
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-white/80 transition-all hover:bg-vettam-purple-light hover:text-white"
                onMouseEnter={() => setHoveredItem('research')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Search className="h-5 w-5" />
                {hoveredItem === 'research' ? 'Under Development' : 'Research'}
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-white/80 transition-all hover:bg-vettam-purple-light hover:text-white"
                onMouseEnter={() => setHoveredItem('translate')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Book className="h-5 w-5" />
                {hoveredItem === 'translate' ? 'Under Development' : 'Translate'}
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-white/80 transition-all hover:bg-vettam-purple-light hover:text-white"
                onMouseEnter={() => setHoveredItem('write')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Pencil className="h-5 w-5" />
                {hoveredItem === 'write' ? 'Under Development' : 'Write'}
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-white/60">Tools</h3>
            <div className="space-y-1">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg bg-vettam-purple-light px-3 py-2 text-white transition-all hover:bg-vettam-purple-light hover:text-white"
              >
                <Pencil className="h-5 w-5" />
                Editor
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-white/80 transition-all hover:bg-vettam-purple-light hover:text-white"
                onMouseEnter={() => setHoveredItem('bookmarks')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Bookmark className="h-5 w-5" />
                {hoveredItem === 'bookmarks' ? 'Under Development' : 'Bookmarks'}
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-white/80 transition-all hover:bg-vettam-purple-light hover:text-white"
                onMouseEnter={() => setHoveredItem('templates')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <FileText className="h-5 w-5" />
                {hoveredItem === 'templates' ? 'Under Development' : 'Templates'}
              </Link>
            </div>
          </div>
          <div className="flex-1" />
          <div>
            <div className="flex items-center justify-between text-sm font-medium text-white/60">
              Chat History
              <Button variant="ghost" size="icon" className="h-6 w-6 text-white/60 hover:bg-vettam-purple-light">
                <ChevronUp className="h-4 w-4" />
                <span className="sr-only">Collapse chat history</span>
              </Button>
            </div>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center justify-between rounded-lg px-3 py-2 text-white/80 hover:bg-vettam-purple-light">
                Lorem ipsum dolor sit amet consectetur.
                <Button variant="ghost" size="icon" className="h-6 w-6 text-white/60 hover:bg-vettam-purple-light">
                  <MoreHorizontalIcon className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2 text-white/80 hover:bg-vettam-purple-light">
                Lorem ipsum dolor sit amet consectetur.
                <Button variant="ghost" size="icon" className="h-6 w-6 text-white/60 hover:bg-vettam-purple-light">
                  <MoreHorizontalIcon className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </div>
              <Button variant="link" className="h-auto p-0 text-sm text-white/80 hover:text-white">
                View more
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-vettam-purple-light p-3 mt-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Yash Kalra</span>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-white/80 hover:bg-vettam-purple"
                onMouseEnter={() => setHoveredItem('settings')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Settings className="h-4 w-4" />
                <span className="sr-only">{hoveredItem === 'settings' ? 'Under Development' : 'Settings'}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-white/80 hover:bg-vettam-purple"
                onMouseEnter={() => setHoveredItem('help')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">{hoveredItem === 'help' ? 'Under Development' : 'Help'}</span>
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}

function MoreHorizontalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  )
}
