import { BookChapter } from './book-chapter'

export class Book {
  author: string | null = null
  title: string | null = null
  chapter: BookChapter | null = null
  chapters: BookChapter[] = []

  constructor(props?: {
    author?: string
    title?: string
    chapter?: BookChapter
    chapters?: BookChapter[]
  }) {
    if (props) {
      Object.assign(this, props)
    }
  }
}
