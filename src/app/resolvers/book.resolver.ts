import { HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Params, Router, RouterStateSnapshot } from '@angular/router'
import { catchError, EMPTY, mergeMap, Observable, of, take } from 'rxjs'
import { Book } from 'src/app/models/book'
import { BookService } from 'src/app/services/book.service'

@Injectable({
  providedIn: 'root',
})
export class BookResolver  {
  constructor(private bs: BookService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Book> {
    const title = route.paramMap.get('title')
    const chapter = route.paramMap.get('chapter')
    if (!(title && chapter)) {
      this.router.navigateByUrl('/lessons')
      return EMPTY
    }

    const params: Params = {
      title,
      chapter: Number(chapter),
    }

    return this.bs.get(new HttpParams({ fromObject: params })).pipe(
      take(1),
      mergeMap((book: Book) => {
        if (book) {
          return of(book)
        }

        this.router.navigateByUrl('/lessons', { skipLocationChange: true })
        return EMPTY
      }),
      catchError((err) => {
        this.router.navigateByUrl('/lessons')
        return EMPTY
      })
    )
  }
}
