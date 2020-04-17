import { Test, TestingModule } from '@nestjs/testing'
import { HttpModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { SearchService } from './search.service'
import { CourseResponse } from './search.dto'
import { ResourceType } from '@nestjs/microservices/external/kafka-options.interface'

describe('SearchService', () => {
  let service: SearchService

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
      ],
      providers: [SearchService],
    }).compile()
    service = module.get<SearchService>(SearchService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('ping reg cmu service', async () => {
    const res = await service.pingRegAPI()
    expect(res).toBeDefined()
  })

  it('try to search in elastic search', async () => {
    const query = 'cal'
    const size = 5
    let result: CourseResponse[]

    result = await service.search(query)
    expect(result).toBeDefined()

    result = await service.search(query, size)
    expect(result.length).toBeLessThanOrEqual(size)
  })
})
