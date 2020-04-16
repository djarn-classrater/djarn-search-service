import { Injectable, HttpService } from '@nestjs/common'
import { Course } from './course.dto'

@Injectable()
export class CourseService {
  constructor(private courseClient: HttpService) {}

  async getCourse(courseId: string): Promise<Course> {
    const { data } = await this.courseClient
      .get<Course>(`/course/${courseId}`)
      .toPromise()

    return {
      courseId, 
      ...data,
    }
  }
}
