import { AsyncPipe, NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { RouterLink } from "@angular/router";
import { ThemeService } from "../services/theme.service";

const FINGER_NAME_TO_COLOR_MAP = [
  { finger: "Little (Pinky)", color: "Yellow-Green", hexColorCode: "#befc75" },
  { finger: "Ring", color: "Lavendar Blue", hexColorCode: "#c0dbfc" },
  { finger: "Middle", color: "Aqua Blue (Water)", hexColorCode: "#ccffff" },
  {
    finger: "Index (Pointy)",
    color: "Yellow (Laser Lemon)",
    hexColorCode: "#ffff66",
  },
  { finger: "Thumb", color: "Brilliant Lavender", hexColorCode: "#e9befc" },
];

@Component({
  selector: "tiptap-home",
  standalone: true,
  imports: [AsyncPipe, MatDividerModule, RouterLink, NgFor],
  templateUrl: "./home.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly tableColumns = ["finger", "color", "hex"];
  readonly dataSource = FINGER_NAME_TO_COLOR_MAP;
  readonly isDarkTheme$ = this.themeService.isDarkTheme$;

  constructor(private readonly themeService: ThemeService) {}
}
