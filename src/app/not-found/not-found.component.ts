import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "page-not-found",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>404 Not Found</h1>
    <p>Uh oh. It seems that we could not find what you were looking for ...</p>
  `,
})
export class NotFoundComponent {}
