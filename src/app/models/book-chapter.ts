export class BookChapter {
  title: string = ''
  text: string = ''

  constructor(title: string, text: string) {
    this.title = title
    this.text = text
  }

  static builder(): Builder {
    return new Builder()
  }
}

class Builder {
  private title?: string
  private text?: string

  constructor() {}

  setTitle(title: string): Builder {
    this.title = title
    return this
  }

  setText(text: string): Builder {
    this.text = text
    return this
  }

  build(): BookChapter {
    return new BookChapter(this.title!, this.text!)
  }
}
