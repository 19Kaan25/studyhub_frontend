export interface Comment {
  id: number
  postId: number
  userId: number
  authorUsername: string
  content: string
  createdAt?: string
}
