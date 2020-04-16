import { Injectable, HttpService } from '@nestjs/common'

@Injectable()
export class SearchService {
  constructor(private regClient: HttpService) {}

  async pingRegAPI() {
    const { data } = await this.regClient.get('/').toPromise()
    return data
  }
}
