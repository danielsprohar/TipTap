import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs";
import { environment } from "src/environments/environment";
import { Book } from "../models/book";
import { HttpErrorResponseHandler } from "./http-error-response-handler";

@Injectable({
  providedIn: "root",
})
export class BookService extends HttpErrorResponseHandler {
  private readonly url = environment.services.book.url;

  constructor(private readonly http: HttpClient) {
    super();
  }

  get(params?: HttpParams) {
    return this.http
      .get<Book>(this.url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }
}
