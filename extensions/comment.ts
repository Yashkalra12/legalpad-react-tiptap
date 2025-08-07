import { Mark, mergeAttributes } from '@tiptap/core'

export interface CommentOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    comment: {
      /**
       * Set a comment mark
       */
      setComment: (commentId: string) => ReturnType
      /**
       * Unset a comment mark
       */
      unsetComment: () => ReturnType
      /**
       * Toggle a comment mark
       */
      toggleComment: (commentId: string) => ReturnType
    }
  }
}

export const Comment = Mark.create<CommentOptions>({
  name: 'comment',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      commentId: {
        default: null,
        parseHTML: element => element.getAttribute('data-comment-id'),
        renderHTML: attributes => {
          if (!attributes.commentId) {
            return {}
          }

          return {
            'data-comment-id': attributes.commentId,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-comment-id]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      class: 'comment-highlight',
      style: 'background-color: #fef3c7; border-bottom: 2px solid #f59e0b; cursor: pointer; position: relative;',
    }), 0]
  },

  addCommands() {
    return {
      setComment: (commentId: string) => ({ commands }) => {
        return commands.setMark(this.name, { commentId })
      },
      unsetComment: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
      toggleComment: (commentId: string) => ({ commands }) => {
        return commands.toggleMark(this.name, { commentId })
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => this.editor.commands.toggleComment(`comment-${Date.now()}`),
    }
  },
})
