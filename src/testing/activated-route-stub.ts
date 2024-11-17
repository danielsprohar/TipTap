import { convertToParamMap, Data, ParamMap, Params } from "@angular/router";
import { ReplaySubject } from "rxjs";

export class ActivatedRouteStub {
  private paramMapSource = new ReplaySubject<ParamMap>();
  private queryParamMapSource = new ReplaySubject<ParamMap>();
  private dataSource = new ReplaySubject<Data>();

  constructor() {}

  readonly paramMap = this.paramMapSource.asObservable();
  readonly queryParamMap = this.queryParamMapSource.asObservable();
  readonly data = this.dataSource.asObservable();

  setData(data: Data = {}) {
    this.dataSource.next(data);
  }

  setParamMap(params: Params = {}) {
    this.paramMapSource.next(convertToParamMap(params));
  }

  setQueryParamMap(queryParams: Params = {}) {
    this.queryParamMapSource.next(convertToParamMap(queryParams));
  }
}
