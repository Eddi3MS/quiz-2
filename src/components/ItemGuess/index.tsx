import { useState } from 'react'
import { Pause, Play } from '../../assets/icons/utils/AudioStatus'
import './style.css'
import {
  Image,
  ImageWrapper,
  Input,
  InputWrapper,
  Item,
  Reveal,
  Title,
  TitleWrapper,
} from './styles'

interface QuizTypes {
  name: string
  imageUrl: string
  variations: string[]
}

interface Props {
  quizItem: QuizTypes
  cardBackground: string
  addCount: () => void
  playing: boolean
  handlePlay: () => void
}

const ItemGuess = ({
  quizItem,
  addCount,
  cardBackground,
  playing,
  handlePlay,
}: Props) => {
  const { name, imageUrl, variations } = quizItem
  const [forfeit, setForfeit] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [correct, setCorrect] = useState(false)

  return (
    <Item correct={correct} current={playing}>
      <TitleWrapper>
        <Title>{name}</Title>
        <Reveal onClick={() => setForfeit(true)}>
          <svg
            style={{ width: 16, height: 16 }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="#fff"
              d="M17,21L14.25,18L15.41,16.84L17,18.43L20.59,14.84L21.75,16.25M12.8,21H5C3.89,21 3,20.11 3,19V5C3,3.89 3.89,3 5,3H19C20.11,3 21,3.89 21,5V12.8C20.39,12.45 19.72,12.2 19,12.08V5H5V19H12.08C12.2,19.72 12.45,20.39 12.8,21M12,17H7V15H12M14.68,13H7V11H17V12.08C16.15,12.22 15.37,12.54 14.68,13M17,9H7V7H17"
            />
          </svg>
        </Reveal>
      </TitleWrapper>
      <ImageWrapper onClick={handlePlay}>
        <Image
          src={correct || forfeit ? imageUrl : cardBackground}
          alt={name}
        />
        <Image
          style={{
            visibility: 'hidden',
            pointerEvents: 'none',
            width: 0,
            height: 0,
          }}
          src={imageUrl}
          alt={name}
        />

        {playing ? (
          <Play className="play-status" />
        ) : (
          <Pause className="play-status" />
        )}
      </ImageWrapper>
      <InputWrapper>
        <Input
          disabled={forfeit || correct}
          value={forfeit ? variations.join(', ') : input}
          style={forfeit ? { backgroundColor: '#f23f3f', color: '#fff' } : {}}
          onChange={({ target: { value } }) => {
            if (
              value &&
              variations?.some((e) => e?.toLowerCase() === value?.toLowerCase())
            ) {
              addCount()
              setCorrect(true)
            }
            setInput(value)
          }}
          type="text"
        />
      </InputWrapper>
    </Item>
  )
}
export default ItemGuess

