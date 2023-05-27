import { CommonModule } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import {
  CategoryScale,
  Chart,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Title,
} from 'chart.js'
import { Subject, takeUntil } from 'rxjs'
import { ThemeService } from '../../../services/theme.service'
import { TimeSeriesSample } from '../../models/time-series-sample'

@Component({
  selector: 'tiptap-metrics-line-chart',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="full-width">
      <canvas #canvas></canvas>
    </div>
  `,
})
export class MetricsLineChartComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  private readonly destroy$ = new Subject<void>()
  private chart?: Chart
  private readonly cyan = '#00bcd4'
  private readonly lightGrey = '#e0e0e0'
  private readonly darkGrey = '#303030'

  @Input({ required: true }) timeSeries!: TimeSeriesSample[]
  @ViewChild('canvas', { static: true }) canvas?: ElementRef

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly themeService: ThemeService
  ) {}

  ngOnDestroy(): void {
    Chart.unregister(
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      CategoryScale,
      Title
    )

    this.destroy$.next()
    this.destroy$.complete()
  }

  ngOnInit(): void {
    // https://www.chartjs.org/docs/latest/getting-started/integration.html#bundle-optimization
    Chart.register(
      // Required for Line chart
      LineController,
      LineElement,
      PointElement,
      // Extras
      LinearScale,
      CategoryScale,
      Title
    )

    this.themeService.isDarkTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDarkTheme) => {
        Chart.defaults.color = isDarkTheme ? this.lightGrey : this.darkGrey
        Chart.defaults.backgroundColor = isDarkTheme ? this.darkGrey : '#ffffff'
        Chart.defaults.borderColor = isDarkTheme
          ? this.lightGrey
          : this.darkGrey

        this.render()
      })
  }

  ngAfterViewInit(): void {
    if (this.canvas === undefined) {
      throw new Error('Canvas is undefined')
    }
    this.render()
    this.changeDetector.detectChanges()
  }

  render() {
    if (this.chart !== undefined) {
      this.chart.destroy()
    }

    const canvasElement = this.canvas!.nativeElement as HTMLCanvasElement
    this.chart = new Chart(canvasElement, {
      type: 'line',
      data: {
        labels: this.timeSeries.map((samples) => samples.deltaSeconds),
        datasets: [
          {
            label: 'WPM by second',
            data: this.timeSeries.map((samples) => samples.wpm),
            borderColor: this.cyan,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Seconds',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Words per minute',
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Typing Session',
          },
          tooltip: {
            enabled: true,
            usePointStyle: true,
          },
        },
      },
    })
  }
}
