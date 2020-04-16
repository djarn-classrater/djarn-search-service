import { HttpModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { CourseService } from './course.service'

describe('CourseService', () => {
  let service: CourseService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        HttpModule.register({
          baseURL: process.env.MIS_HOST,
        }),
      ],
      providers: [CourseService],
    }).compile()

    service = module.get<CourseService>(CourseService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('retrive course', async () => {
    const courseId = '261361'
    const course = await service.getCourse(courseId)
    expect(course).toBeDefined()
    expect(course).toMatchObject({ courseId })
  })
})
