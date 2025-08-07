import { Node } from '@tiptap/core'

export const PageBreak = Node.create({
  name: 'pageBreak',
  group: 'block',
  selectable: false,
  atom: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="page-break"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'page-break', class: 'page-break' }, '']
  },

  addCommands() {
    return {
      insertPageBreak: () => ({ commands }) => {
        return commands.insertContent('<div data-type="page-break"></div>')
      },
    }
  },
})
