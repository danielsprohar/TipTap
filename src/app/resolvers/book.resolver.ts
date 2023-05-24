import { HttpParams } from '@angular/common/http'
import { inject } from '@angular/core'
import { ActivatedRouteSnapshot, Params, Router } from '@angular/router'
import { EMPTY, catchError, mergeMap, of, take } from 'rxjs'
import { Book } from 'src/app/models/book'
import { BookService } from 'src/app/services/book.service'

export function bookResolver(route: ActivatedRouteSnapshot) {
  const bookService = inject(BookService)
  const router = inject(Router)

  const title = route.paramMap.get('title')
  const chapter = route.paramMap.get('chapter')
  if (!(title && chapter)) {
    router.navigateByUrl('/lessons')
    return EMPTY
  }

  const params: Params = {
    title,
    chapter: Number(chapter),
  }

  return bookService.get(new HttpParams({ fromObject: params })).pipe(
    take(1),
    mergeMap((book: Book) => {
      if (book) {
        return of(book)
      }

      router.navigateByUrl('/lessons', { skipLocationChange: true })
      return EMPTY
    }),
    catchError((err) => {
      router.navigateByUrl('/lessons')
      return EMPTY
    })
  )
}
