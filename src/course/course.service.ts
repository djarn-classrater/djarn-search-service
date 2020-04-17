import { Injectable, HttpService, NotFoundException } from '@nestjs/common'
import { MisCourse } from './course.dto'

@Injectable()
export class CourseService {
  constructor(private courseClient: HttpService) {}

  async getCourse(courseId: string): Promise<MisCourse> {
    const { data } = await this.courseClient
      .get<MisCourse>(`/course/${courseId}`)
      .toPromise()

    if (data.courseName === "") {
      throw new NotFoundException()
    }

    return {
      courseId,
      ...data,
    }
  }
}
