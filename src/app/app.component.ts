import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { Navigation } from "./components/navigation.component";
import { HandsetService } from "./services/handset.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "tiptap-app-root",
  templateUrl: "./app.component.html",
  imports: [CommonModule, RouterOutlet, Navigation],
})
export class AppComponent implements OnDestroy, OnInit {
  private readonly destroyed$ = new Subject<void>();
  private readonly handsetService = inject(HandsetService);

  readonly isHandset = signal(true);

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.handsetService.isHandset$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => {
        this.isHandset.set(value);
      });
  }
}
