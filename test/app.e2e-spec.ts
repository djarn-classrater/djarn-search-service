import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import {
  ClientsModule,
  Transport,
  ClientProxy,
  MicroserviceOptions,
} from '@nestjs/microservices'
import { AppModule } from '../src/app.module'
import { Observable } from 'rxjs'
import { CourseResponse } from '../src/search/search.dto'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let client: ClientProxy

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([
          { name: 'SearchService', transport: Transport.TCP },
        ]),
      ],
    }).compile()

    app = moduleFixture.createNestApplication()

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.TCP,
    })

    await app.startAllMicroservicesAsync()
    await app.init()

    client = app.get('SearchService')
    await client.connect()
  })

  afterAll(async () => {
    await app.close()
    client.close()
  })

  it('Ping application', done => {
    const response: Observable<string> = client.send('ping', {})

    response.subscribe(data => {
      expect(data).toBe('Hello World!')
      done()
    })
  })

  it('Ping search service', done => {
    const response: Observable<object> = client.send('search.ping', {})

    response.subscribe(data => {
      expect(data).toBeDefined()
      done()
    })
  })

  it('Try to search', done => {
    const response: Observable<CourseResponse[]> = client.send('search.query', { query: 'cal', size: 5 })

    response.subscribe(data => {
      expect(data.length).toBeLessThanOrEqual(5)
      done()
    })
  })
})
