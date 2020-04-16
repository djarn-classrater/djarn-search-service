import { MisCourse } from '../course/course.dto'

export interface SearchResponse<T> {
  hits: {
    total: {
      value: number
      relation: string
    }
    hits: Array<T>
  }
}

export interface RegCourse {
  id: string
  year: string
  courseno: string
  title: string
}

export interface CourseResponse<T = RegCourse, C = MisCourse> {
  _index: string
  _id: string
  _source: {
    fromReg: T
    fromMis?: C
  }
}

export interface SearchPayload {
  query: string
  size: number
}
