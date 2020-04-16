import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SearchModule } from './search/search.module'
import { SearchController } from './search/search.controller'
import { CourseModule } from './course/course.module';

@Module({
  imports: [ConfigModule.forRoot(), SearchModule, CourseModule],
  controllers: [AppController, SearchController],
  providers: [AppService],
})
export class AppModule {}
