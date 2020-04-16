import { Module, HttpModule } from '@nestjs/common'
import { CourseService } from './course.service'
import { CourseController } from './course.controller'

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.MIS_HOST,
    }),
  ],
  providers: [CourseService],
  controllers: [CourseController],
})
export class CourseModule {}
