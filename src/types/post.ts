export type PostType = 'DOCUMENT' | 'LINK'

export interface Post {
  id: number
  title: string
  content: string
  url: string
  type: PostType
  previewTitle?: string
  previewDescription?: string
  previewImageUrl?: string
  userId?: number
  createdAt?: string
  updatedAt?: string
}
