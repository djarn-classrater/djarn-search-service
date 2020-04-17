/* eslint-disable @typescript-eslint/camelcase */
import {
  Injectable,
  HttpService,
  OnApplicationBootstrap,
  Logger,
} from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { ApiResponse } from '@elastic/elasticsearch'
import * as _ from 'lodash'
import * as fs from 'fs'
import { retryAsync } from 'ts-retry'
import { SearchResponse, CourseResponse } from './search.dto'
import { MisCourse } from '../course/course.dto'

@Injectable()
export class SearchService implements OnApplicationBootstrap {
  logger: Logger
  constructor(
    private regClient: HttpService,
    private esClient: ElasticsearchService,
  ) {
    this.logger = new Logger('SearchService')
  }

  async onApplicationBootstrap() {
    this.logger.log('Fetching courses...', 'InitialCoursesInES')
    try {
      await this.esClient.count({ index: 'courses' })
    } catch {
      /**
       *  Fetching course from cmu reg service
       */
      let courses: any[] | _.Dictionary<any>
      try {
        courses = require('../../courses.json').data
      } catch {
        this.logger.log(
          'Downloading courses from reg cmu service...',
          'InitialCoursesInES',
        )
        const { data } = await this.regClient.get('/v2/course').toPromise()
        courses = data
        fs.writeFileSync('courses.json', JSON.stringify({ data: courses }))
      }
      courses = _.groupBy(courses, 'courseno')
      const countCourses = Object.keys(courses).length

      /**
       * Create courses index
       */
      this.logger.log(
        'Create courses index elastic search',
        'InitialCoursesInES',
      )
      this.esClient.indices.create({
        index: 'courses',
        body: {
          settings: {
            index: {
              number_of_shards: 4,
              analysis: {
                analyzer: {
                  analyzer_shingle: {
                    tokenizer: 'icu_tokenizer',
                    filter: ['filter_shingle'],
                  },
                },
                filter: {
                  filter_shingle: {
                    type: 'shingle',
                    max_shingle_size: 3,
                    min_shingle_size: 2,
                    output_unigrams: 'true',
                  },
                },
              },
            },
          },
          mappings: {
            properties: {
              fromMis: {
                properties: {
                  courseDescriptionThai: {
                    analyzer: 'analyzer_shingle',
                    type: 'text',
                  },
                  courseNameThai: {
                    analyzer: 'analyzer_shingle',
                    type: 'text',
                  },
                  facultyName: {
                    analyzer: 'analyzer_shingle',
                    type: 'text',
                  },
                },
              },
            },
          },
        },
      })

      /**
       * Push courses to elastic search
       */
      this.logger.log('Push courses to elastic search', 'InitialCoursesInES')
      for (const courseNo of Object.keys(courses)) {
        await this.esClient.index({
          id: courseNo,
          index: 'courses',
          body: {
            fromReg: courses[courseNo][0],
            fromMis: null,
          },
        })
      }

      /**
       * Try to counting between file and elastic search
       */
      await retryAsync<void>(
        async () => {
          const { body } = await this.esClient.count({ index: 'courses' })
          if (countCourses !== body.count) {
            console.warn('Failed, Try to count...')
            throw new Error('Elastic search has failed to fetched')
          }
        },
        {
          maxTry: 100,
          delay: 500,
        },
      )
    }
    this.logger.log('Initialized courses', 'InitialCoursesInES')
  }

  async pingRegAPI() {
    const { data } = await this.regClient.get('/').toPromise()
    return data
  }

  async search(query: string, size?: number): Promise<CourseResponse[]> {
    const {
      body,
    }: ApiResponse<SearchResponse<CourseResponse>> = await this.esClient.search(
      {
        index: 'courses',
        q: query,
        size,
      },
    )
    return body.hits.hits
  }

  async updateMisCourse(misCourse: MisCourse): Promise<void> {
    await this.esClient.update({
      index: 'courses',
      id: misCourse.courseId,
      body: {
        doc: {
          fromMis: misCourse,
        } as Partial<CourseResponse['_source']>,
      },
    })
  }

  async deleteCourse(courseId: string): Promise<void> {
    await this.esClient.delete({
      index: 'courses',
      id: courseId
    })
  }
}
