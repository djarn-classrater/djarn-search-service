import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { SearchService } from './search.service'
import { SearchPayload, CourseResponse, RegCourse } from './search.dto'
import { CourseService } from '../course/course.service'
import { MisCourse } from 'src/course/course.dto'

@Controller('search')
export class SearchController {
  constructor(
    private searchService: SearchService,
    private courseService: CourseService,
  ) {}

  @MessagePattern('search.ping')
  async ping() {
    return this.searchService.pingRegAPI()
  }

  @MessagePattern('search.query')
  async search({ query, size }: SearchPayload): Promise<CourseResponse[]> {
    const res = await this.searchService.search(query, size)

    let courses: CourseResponse<RegCourse, MisCourse>[]

    courses = await Promise.all(
      res.map<Promise<CourseResponse>>(async course => {
        if (!course._source.fromMis) {
          const misCourse = await this.courseService.getCourse(course._id)
          this.searchService.updateMisCourse(misCourse)
          course._source.fromMis = misCourse
        }
        return course
      }),
    )

    courses = courses.filter(course => course._source.fromMis !== null)

    return courses
  }
}
