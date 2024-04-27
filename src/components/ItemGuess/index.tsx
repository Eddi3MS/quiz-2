import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { Pause, Play } from '../../assets/icons/utils/AudioStatus'
import './style.css'
import {
  IconButton,
  Image,
  ImageWrapper,
  Input,
  InputWrapper,
  Item,
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
    <Item correct={correct} forfeit={forfeit} current={playing}>
      <TitleWrapper>
        <Title>{name}</Title>

        <IconButton onClick={() => setForfeit(true)} disabled={correct}>
          {forfeit || correct ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </IconButton>
      </TitleWrapper>
      <ImageWrapper onClick={handlePlay}>
        <Image
          src={correct || forfeit ? imageUrl : cardBackground}
          alt={name}
          width={160}
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

