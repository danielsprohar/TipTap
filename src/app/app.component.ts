import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterOutlet } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { HandsetService } from "./services/handset.service";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "tiptap-app-root",
  templateUrl: "./app.component.html",
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    RouterOutlet,
  ],
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
