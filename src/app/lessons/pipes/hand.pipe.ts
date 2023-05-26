import { Pipe, PipeTransform } from '@angular/core'
import { Hand } from '../../enums'

@Pipe({
  name: 'hand',
  standalone: true,
})
export class HandPipe implements PipeTransform {
  transform(value: Hand, ...args: unknown[]): string {
    switch (value) {
      case Hand.LEFT:
        return 'Left Hand'
      case Hand.RIGHT:
        return 'Right Hand'
      case Hand.BOTH:
        return 'Both Hands'
      default:
        return ''
    }
  }
}
