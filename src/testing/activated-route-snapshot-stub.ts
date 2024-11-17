import { ParamMap, Params } from "@angular/router";

export class ActivatedRouteSnapshotStub {
  params: Params = {};
  paramMap: ParamMap = {
    keys: Object.keys(this.params),
    has: (key: string) => {
      return Object.keys(this.params).includes(key);
    },
    get: (key: string) => {
      const prop = Object.keys(this.params).find((k) => k === key) || null;
      if (!prop) return null;

      return this.params[prop as keyof Params];
    },
    getAll: (key: string) => {
      return [];
    },
  };
}
