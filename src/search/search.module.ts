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
        username: process.env.REG_USERNAME,
        password: process.env.REG_PASSWORD,
      }
    })
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
