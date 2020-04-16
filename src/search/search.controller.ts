import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { SearchService } from './search.service'
import { SearchPayload } from './search.dto'

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @MessagePattern('search.ping')
  async ping() {
    return this.searchService.pingRegAPI()
  }

  @MessagePattern('search.query')
  async search({ query, size } : SearchPayload) {
    return this.searchService.search(query, size)
  }
}
