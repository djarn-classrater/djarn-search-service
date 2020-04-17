import { Module, HttpModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { SearchController } from './search.controller'
import { SearchService } from './search.service'
import { CourseModule } from '../course/course.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    ElasticsearchModule.register({
      node: 'http://es:9200',
    }),
    HttpModule.register({
      baseURL: process.env.REG_HOST,
      auth: {
        username: process.env.REG_USERNAME,
        password: process.env.REG_PASSWORD,
      },
    }),
    CourseModule,
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
