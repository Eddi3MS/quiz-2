import { onValue, ref } from 'firebase/database'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { database } from '../../config/firebase'
import { assetsUrl } from '../../utils/assetsUrl'
import ItemGuess from '../ItemGuess'
import Loader from '../Loader'
import {
  Audio,
  Container,
  Count,
  Description,
  Grid,
  Main as MainWrapper,
  Title,
} from './styles'
import { QuizType } from '../../types'

const Main = () => {
  const { id } = useParams()
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [quiz, setQuiz] = useState<QuizType | null>(null)
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const addCount = () => setCount(count + 1)

  const handlePlay = (index: number) => {
    const audioUrl = quiz?.quizItems?.[index]?.audioUrl
    if (!audioRef?.current || !audioUrl) return

    if (playingIndex === index) {
      if (audioRef.current.paused) {
        audioRef.current?.play()
      } else {
        audioRef.current?.pause()
      }
    } else {
      audioRef?.current?.pause()
      audioRef.current.currentTime = 0

      audioRef.current.src = audioUrl
      audioRef?.current?.play()
    }
    setPlayingIndex(index)
  }

  useEffect(() => {
    if (!id) return
    const starCountRef = ref(database, `quiz/${id}`)

    onValue(starCountRef, async (snapshot) => {
      try {
        const data = snapshot.val()

        if (!data) {
          throw new Error('Quiz não encontrado.')
        }

        const { quizItems, id } = data

        const cardUrl = assetsUrl(`cover/${id}_cover`)

        const formatted = quizItems?.map(
          ({
            audioId,
            imageId,
            ...rest
          }: QuizType['quizItems'] & { audioId: string; imageId: string }) => ({
            ...rest,
            imageUrl: assetsUrl(`${imageId}`),
            audioUrl: assetsUrl(`${audioId}`),
          })
        )

        setQuiz({
          ...data,
          cardBackground: cardUrl,
          quizItems: formatted,
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    })
  }, [id])

  if (loading) {
    return (
      <MainWrapper>
        <Grid>
          <Loader />
        </Grid>
      </MainWrapper>
    )
  }

  if (!quiz || !quiz?.quizItems) {
    return (
      <MainWrapper>
        <Grid>
          <p>Nenhum quiz encontrado.</p>
        </Grid>
      </MainWrapper>
    )
  }

  return (
    <MainWrapper>
      <Grid>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Container>
              <Count>
                {count}/{quiz.quizItems.length}
              </Count>
              <Title>{quiz.quizName}</Title>
              <Description>
                {quiz.quizDescription} por: {quiz.author}
              </Description>
              <CountComp count={count} quizLength={quiz?.quizItems?.length} />

              <Audio
                id="audio"
                src={''}
                preload="none"
                ref={audioRef}
                controls
              ></Audio>
            </Container>
            {quiz?.quizItems.map((item, i) => {
              return (
                <ItemGuess
                  addCount={addCount}
                  cardBackground={quiz.cardBackground}
                  quizItem={item}
                  key={i}
                  playing={playingIndex === i}
                  handlePlay={() => handlePlay(i)}
                />
              )
            })}
          </>
        )}
      </Grid>
    </MainWrapper>
  )
}

export default Main

const CountComp = ({
  count,
  quizLength,
}: {
  count: number
  quizLength: number
}) => {
  const [time, setTime] = useState(0)

  useEffect(() => {
    if (count === quizLength) return

    setTimeout(() => {
      setTime(time + 100)
    }, 1000)
  }, [time, count, quizLength])

  const minutes = Math.floor((time % 360000) / 6000)
  const seconds = Math.floor((time % 6000) / 100)
  return (
    <Count>
      {minutes.toString().padStart(2, '0')}:
      {seconds.toString().padStart(2, '0')}
    </Count>
  )
}

