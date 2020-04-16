import { Module, HttpModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SearchController } from './search.controller'
import { SearchService } from './search.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      baseURL: process.env.REG_HOST,
      auth: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
      }
    })
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
