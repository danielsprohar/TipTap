import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DehyphenatePipe } from './pipes/dehyphenate.pipe'

@NgModule({
    imports: [CommonModule, DehyphenatePipe],
    exports: [DehyphenatePipe],
})
export class SharedModule {}
