import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SearchModule } from './search/search.module'
import { SearchController } from './search/search.controller'

@Module({
  imports: [ConfigModule.forRoot(), SearchModule],
  controllers: [AppController, SearchController],
  providers: [AppService],
})
export class AppModule {}
