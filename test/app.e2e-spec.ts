import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import {
  ClientsModule,
  Transport,
  ClientProxy,
  MicroserviceOptions,
} from '@nestjs/microservices'
import { AppModule } from './../src/app.module'
import { Observable } from 'rxjs'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let client: ClientProxy

  beforeEach(async () => {
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
})
