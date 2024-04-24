export type QuizType = {
  author: string
  authorHandle: string
  createdAt: number
  dmcaNotice: boolean
  id: string
  quizDescription: string
  quizItems: {
    name: string
    variations: string[]
    youtubeUrl: string
    imageUrl: string
    audioUrl: string
  }[]
  quizName: string
  cardBackground: string
}
