import { Test, TestingModule } from '@nestjs/testing'
import { HttpModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { SearchService } from './search.service'

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
})
