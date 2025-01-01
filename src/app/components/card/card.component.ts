import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "tiptap-card",
  templateUrl: "./card.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {}
