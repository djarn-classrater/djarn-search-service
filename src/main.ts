import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { AppModule } from './app.module'

async function bootstrap() {
  const logger = new Logger('SearchService')
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      logger,
    },
  )
  await app.listen(() => logger.log('Search service is listening.'))
}
bootstrap()
