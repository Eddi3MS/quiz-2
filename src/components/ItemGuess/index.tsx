import {
  EyeOpenIcon,
  InfoCircledIcon,
  EyeClosedIcon,
} from '@radix-ui/react-icons'
import { useState } from 'react'
import { Pause, Play } from '../../assets/icons/utils/AudioStatus'
import PopoverComp from '../Popover'
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
  tip?: string
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
  const { name, imageUrl, variations, tip } = quizItem
  const [forfeit, setForfeit] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [correct, setCorrect] = useState(false)

  return (
    <Item correct={correct} current={playing}>
      <TitleWrapper>
        <Title>{name}</Title>
        <div style={{ display: 'flex', gap: 10 }}>
          {tip && (
            <PopoverComp
              content={
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  <p>{tip}</p>
                </div>
              }
            >
              <IconButton>
                <InfoCircledIcon />
              </IconButton>
            </PopoverComp>
          )}
          <IconButton onClick={() => setForfeit(true)}>
            {forfeit ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </IconButton>
        </div>
      </TitleWrapper>
      <ImageWrapper onClick={handlePlay}>
        <Image
          src={correct || forfeit ? imageUrl : cardBackground}
          alt={name}
          height={210}
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

