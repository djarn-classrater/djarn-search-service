import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/common'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { SearchController } from './search.controller'
import { SearchService } from './search.service'
import { CourseModule } from '../course/course.module'

describe('Search Controller', () => {
  let controller: SearchController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        HttpModule.register({
          baseURL: process.env.REG_HOST,
          auth: {
            username: process.env.REG_USERNAME,
            password: process.env.REG_PASSWORD,
          },
        }),
        ElasticsearchModule.register({ node: 'http://es:9200' }),
        CourseModule,
      ],
      controllers: [SearchController],
      providers: [SearchService],
    }).compile()

    controller = module.get<SearchController>(SearchController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('ping reg cmu service', async () => {
    const res = await controller.ping()
    expect(res).toBeDefined()
  })

  it('try to search', async () => {
    const res = await controller.search({ query: '261361', size: 5 })
    res.forEach(course => {
      expect(course._source.fromMis).toBeDefined()
    })
  })
})
