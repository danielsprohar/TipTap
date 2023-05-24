import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'dehyphenate',
    standalone: true,
})
export class DehyphenatePipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.replace(/-/g, ' ') : ''
  }
}
