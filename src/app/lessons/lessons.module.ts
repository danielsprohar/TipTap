import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { LessonsRoutingModule } from './lessons-routing.module'
import { LessonsComponent } from './lessons.component'
import { LessonDetailComponent } from './lesson-detail/lesson-detail.component'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatDividerModule } from '@angular/material/divider'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'

@NgModule({
  declarations: [LessonsComponent, LessonDetailComponent],
  imports: [
    CommonModule,
    LessonsRoutingModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatCardModule,
  ],
})
export class LessonsModule {}
