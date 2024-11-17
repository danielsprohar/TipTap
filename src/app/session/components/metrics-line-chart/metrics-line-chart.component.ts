import { CommonModule } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core'
import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Subject, takeUntil } from 'rxjs'
import { ThemeService } from '../../../services/theme.service'
import { SessionSample } from '../../models/time-series-sample'

@Component({
  selector: 'tiptap-metrics-line-chart',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full">
      <canvas #canvas></canvas>
    </div>
  `,
})
export class MetricsLineChartComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  private readonly destroy$ = new Subject<void>()
  private readonly themeService = inject(ThemeService)
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly lightGrey = '#e0e0e0'
  private readonly darkGrey = '#303030'
  private readonly red = '#ff0000'
  private readonly blue = '#0000ff'
  private readonly green = '#00ff00'

  private chart?: Chart

  readonly samples = input.required<SessionSample[]>()
  readonly canvas = viewChild<ElementRef>('canvas')

  ngOnDestroy(): void {
    Chart.unregister(
      // Required for Line chart
      LineController,
      LineElement,
      PointElement,
      // Extras
      LinearScale,
      CategoryScale,
      Title,
      Tooltip,
      Legend
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
      Title,
      Tooltip,
      Legend
    )

    Chart.defaults.font.family = 'Roboto Mono, "Helvetica Neue", sans-serif'
    Chart.defaults.font.size = 16
    Chart.defaults.font.weight = 'normal'

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
    if (this.canvas() === undefined) {
      throw new Error('Canvas is undefined')
    }
    this.render()
  }

  render() {
    if (this.chart !== undefined) {
      this.chart.destroy()
    }

    const canvasElement = this.canvas()!.nativeElement as HTMLCanvasElement
    this.chart = new Chart(canvasElement, {
      type: 'line',
      data: {
        labels: this.samples().map((samples) => samples.timeSeconds),
        datasets: [
          {
            label: 'Net WPM',
            data: this.samples().map((samples) => samples.netWPM),
            borderColor: this.blue,
            yAxisID: 'y',
          },
          {
            label: 'Errors',
            data: this.samples().map((samples) => samples.errors),
            borderColor: this.red,
            yAxisID: 'y1',
            showLine: false,
          },
          {
            label: 'Raw WPM',
            data: this.samples().map((samples) => samples.rawWPM),
            borderColor: this.green,
            yAxisID: 'y2',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Typing Session',
          },
          tooltip: {
            enabled: true,
            usePointStyle: true,
            callbacks: {
              title(tooltipItems) {
                return `t = ${tooltipItems[0].label}`
              },
            },
          },
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time (seconds)',
            },
          },
          y: {
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Words per minute',
            },
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            min: 0,
            title: {
              display: true,
              text: 'Errors',
            },
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
          y2: {
            type: 'linear',
            display: false,
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
        },
      },
    })

    this.cdr.detectChanges()
  }
}
