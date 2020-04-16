import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { SearchService } from './search.service'

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @MessagePattern('search.ping')
  async ping() {
    return this.searchService.pingRegAPI()
  }
}
