export interface Confession {
  id: string
  content: string
  created_at: string
  support_count?: number
  relate_count?: number
  user_support?: boolean
  user_relate?: boolean
}

export interface CreateConfessionRequest {
  content: string
}

export interface CreateConfessionResponse {
  confession?: Confession
  error?: string
}

export interface GetConfessionsResponse {
  confessions: Confession[]
  error?: string
}

