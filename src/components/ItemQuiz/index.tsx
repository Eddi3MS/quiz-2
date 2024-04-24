import { useNavigate } from 'react-router-dom'
import { QuizType } from '../../types'
import {
  Author,
  Container,
  CoverImage,
  Description,
  ItemWrapper,
  Title,
  Twitter,
} from './styles'

const ItemQuiz = ({ quiz }: { quiz: QuizType }) => {
  const navigate = useNavigate()
  const {
    author,
    authorHandle,
    cardBackground,
    dmcaNotice,
    id,
    quizDescription,
    quizName,
  } = quiz

  const twUser = authorHandle.startsWith('@')
    ? authorHandle.slice(1)
    : authorHandle

  const handleNavigate = () => {
    navigate(`/quiz/${id}`)
  }

  return (
    <ItemWrapper onClick={handleNavigate}>
      <CoverImage src={cardBackground} />
      <Container>
        <Title>
          {quizName}
          {dmcaNotice ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M 11,4L 13,4L 13,15L 11,15L 11,4 Z M 13,18L 13,20L 11,20L 11,18L 13,18 Z" />
            </svg>
          ) : null}
        </Title>
        <Author onClick={(e) => e.stopPropagation()}>
          Por:{' '}
          <Twitter
            href={`https://twitter.com/${twUser}`}
            target="_blank"
            rel="noopener,noreferrer"
          >
            {authorHandle || author}
          </Twitter>
        </Author>
        <Description>{quizDescription}</Description>
      </Container>
    </ItemWrapper>
  )
}
export default ItemQuiz

