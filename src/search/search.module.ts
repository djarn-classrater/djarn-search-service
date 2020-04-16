import { Module, HttpModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { SearchController } from './search.controller'
import { SearchService } from './search.service'

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
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
