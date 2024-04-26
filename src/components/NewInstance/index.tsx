// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import audioBufferSlice from 'audiobuffer-slice'
import toWav from 'audiobuffer-to-wav'
import imagejs from 'image-js'
import { useContext, useRef, useState } from 'react'
import InputRange from 'react-input-range'
import Svg from '../../assets/dots.svg'

import {
  Container,
  Flex,
  Input,
  InputField,
  Label,
  SVGItem,
  UploadArea,
} from '../MainCreate/styled'
import { Button, ImageSelected, InstanceContainer } from './styles'

import axios from 'axios'
import { Pause, Play } from '../../assets/icons/utils/AudioStatus'
import { CreationContext } from '../context/CreationContext'
import './range.css'
import CropImage from '../CropImage'

interface InputType {
  title: string
  name: string
  onChange: (e: any) => void
}

interface RangeType {
  min: number
  max: number
}

interface InstanceType {
  index: number
  id: string
}

const TextInput = ({ value, title, onChange, name }: InputType) => {
  return (
    <InputField>
      <Label>{title}</Label>
      <Input value={value} onChange={onChange} name={name} type="text" />
    </InputField>
  )
}

const timeLimit = import.meta.env.VITE_UPLOAD_MAX || 45

const NewInstance = ({ index, id }: InstanceType) => {
  const [showModal, setShowModal] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const {
    appendAudioBlob,
    appendImageBlob,
    setQuizInput,
    input,
    setLogger,
    toggleSubmitting,
    isSubmitting,
    removeField,
  } = useContext(CreationContext)

  const audioRef = useRef(null)
  const fileRef = useRef(null)
  const [playing, setPlaying] = useState<boolean>(false)
  const [duration, setDuration] = useState<number>(0)
  const [range, setRange] = useState<RangeType>({ min: 0, max: 30 })
  const [errorLog, setError] = useState('')

  const handleImageUpload = (e) => {
    e.preventDefault()

    const file = e.target.files[0]
    if (!file) return

    const fileUrl = URL.createObjectURL(file)

    setShowModal(true)
    setImageUrl(fileUrl)
  }

  const playInProgress = async (e) => {
    e.preventDefault()
    audioRef.current.play()
  }

  const pauseInProgress = (e) => {
    e.preventDefault()
    audioRef.current.pause()
  }

  const handleTextInput = (e) => setQuizInput(e, id)

  const storeBlob = async ({ min, max }: { min: number; max: number }) => {
    if (max - min > timeLimit) return

    const audioContext = new AudioContext()
    const arrayBuffer = await fileRef?.current.files[0].arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

    audioBufferSlice(
      audioBuffer,
      min * 1000,
      max * 1000,
      function (error, slicedAudioBuffer) {
        if (error) {
          console.error(error)
        } else {
          try {
            const wav = toWav(slicedAudioBuffer)

            const blob = new Blob([new DataView(wav)], {
              type: 'audio/mpeg',
            })

            const url = URL.createObjectURL(blob)

            audioRef.current.src = url

            return appendAudioBlob(blob, id)
          } catch (error) {
            setLogger(JSON.stringify(error))
          }
        }
      }
    )
  }

  const handleAudioUpload = async (e) => {
    e?.preventDefault()
    const audioContext = new AudioContext()
    const file = e ? e.target.files[0] : fileRef?.current.files[0]
    const arrayBuffer = await file.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

    setDuration(audioBuffer.duration)

    const maxTime =
      audioBuffer.duration > timeLimit ? timeLimit : audioBuffer.duration

    setRange({
      min: 0,
      max: maxTime,
    })

    audioBufferSlice(
      audioBuffer,
      range.min * 1000,
      audioBuffer.duration * 1000,
      function (error, slicedAudioBuffer) {
        if (error) {
          console.error(error)
        } else {
          try {
            const wav = toWav(slicedAudioBuffer)

            const blob = new Blob([new DataView(wav)], {
              type: 'audio/mpeg',
            })

            const url = URL.createObjectURL(blob)
            audioRef.current.src = url

            fileRef.current = {
              files: [blob],
            }

            storeBlob({
              min: 0,
              max: maxTime,
            })
          } catch (error) {
            console.error(error)
            setLogger(JSON.stringify(error))
          }
        }
      }
    )
  }

  const handleYTSubmit = (e) => {
    e.preventDefault()
    toggleSubmitting()
    setError('')

    axios
      .post(
        import.meta.env.VITE_API,
        { url: input.quizItems[index].youtubeUrl },
        {
          responseType: 'blob',
        }
      )
      .catch((err) => {
        console.error(err)
      })
      .then(async (response) => {
        if (response?.headers?.['content-type'] === 'application/json') {
          const textData = JSON.parse(await data.text())

          if (textData?.status === 400) {
            setError(textData?.error)

            throw new Error('Erro ao fazer conversão do video')
          }
        }

        const data = new Blob([response?.data])

        fileRef.current = {
          files: [data],
        }
      })

      .then(handleAudioUpload)
      .finally(() => {
        toggleSubmitting()
      })
  }

  const removeContent = async (e) => {
    e.preventDefault()

    audioRef.current.pause()

    setTimeout(() => {
      if (fileRef?.files?.length) {
        const fileListArr = Array.from(fileRef.files)
        fileListArr.splice(1, 1)
      }

      audioRef.current.src = ''
      setDuration(0)
      setRange({ min: 0, max: timeLimit })
    }, 500)
  }

  const timeFormat = (duration) => {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600)
    const mins = ~~((duration % 3600) / 60)
    const secs = ~~duration % 60

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = ''

    if (hrs > 0) {
      ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
    }

    ret += '' + mins + ':' + (secs < 10 ? '0' : '')
    ret += '' + secs

    return ret
  }

  return (
    <>
      {showModal && imageUrl && (
        <CropImage
          imageUrl={imageUrl}
          setCroppedImage={async ({ blobUrl, url }) => {
            const dataFetch = await fetch(blobUrl).then((res) => res.blob())

            appendImageBlob(dataFetch, id)
            setShowModal(false)
            setImageUrl(url)
          }}
          handleClose={() => setShowModal(false)}
        />
      )}
      <Flex style={{ gap: 32, marginBottom: 40, alignItems: 'flex-start' }}>
        <InstanceContainer>
          <UploadArea ratio="2/3" width={140}>
            <ImageSelected
              style={{ display: imageUrl && !showModal ? 'block' : 'none' }}
              src={imageUrl}
            />
            <SVGItem viewBox="0 0 24 24">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </SVGItem>
            <Input
              onChange={handleImageUpload}
              accept="image/png, image/jpeg,image/webp"
              type="file"
              disabled={isSubmitting}
            />
          </UploadArea>
        </InstanceContainer>
        <Container>
          <TextInput
            value={input.quizItems[index].cardTitle}
            onChange={handleTextInput}
            name="cardTitle"
            title="Titulo do Card"
          />
          <TextInput
            value={input.quizItems[index].variations}
            onChange={handleTextInput}
            name="variations"
            title="Respostas (Separe por virgulas)"
          />
          <Label>Seleção de Musica</Label>

          <Flex
            style={{
              gap: 14,
              alignItems: 'center',
              marginTop: 24,
              position: 'relative',
            }}
          >
            {!duration && (
              <UploadArea width={55} radius={7} htmlFor={`file-ref-${id}`}>
                <SVGItem width={20} height={20} viewBox="0 0 24 24">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
                  </svg>
                </SVGItem>
              </UploadArea>
            )}

            {/* file upload */}
            <Input
              ref={fileRef}
              onChange={handleAudioUpload}
              accept=".mp3,.wav,.mpeg"
              type="file"
              disabled={isSubmitting}
              id={`file-ref-${id}`}
            />

            {/* audio play */}
            <audio
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              style={{ position: 'absolute' }}
              ref={audioRef}
            />

            {!duration ? (
              <Flex
                style={{
                  gap: 14,
                  alignItems: 'center',
                  marginLeft: 16,
                  width: '100%',
                }}
              >
                <TextInput
                  value={input.quizItems[index].youtubeUrl || ''}
                  onChange={handleTextInput}
                  name="youtubeUrl"
                  title="Link do YouTube"
                />

                <UploadArea width={55} radius={7}>
                  {isSubmitting ? (
                    <span class="loader"></span>
                  ) : (
                    <Button
                      onClick={!isSubmitting ? handleYTSubmit : undefined}
                      disabled={isSubmitting}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                      >
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                      </svg>
                    </Button>
                  )}
                </UploadArea>
                {!!errorLog && (
                  <Label style={{ color: '#f00', fontSize: 12, width: 200 }}>
                    {errorLog}
                  </Label>
                )}
              </Flex>
            ) : (
              <>
                <Button
                  style={{ marginRight: 10 }}
                  width={55}
                  height={55}
                  radius={7}
                  onClick={(e) =>
                    !playing ? playInProgress(e) : pauseInProgress(e)
                  }
                >
                  {playing ? <Pause /> : <Play />}
                </Button>
                <InputRange
                  value={range}
                  minValue={0}
                  formatLabel={(value) => `${timeFormat(value)}`}
                  maxValue={Math.floor(duration)}
                  onChangeComplete={(value) => storeBlob(value)}
                  onChange={(value) => {
                    if (value.max - value.min > timeLimit) return
                    audioRef.current.pause()
                    setRange(value)
                  }}
                />
                <Button
                  style={{ marginLeft: 10 }}
                  width={55}
                  height={55}
                  radius={7}
                  onClick={removeContent}
                  disabled={isSubmitting}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    fill="#000000"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </Button>
              </>
            )}
          </Flex>
        </Container>
        <Button
          svgSize={20}
          width={48}
          height={48}
          onClick={(e) => {
            e.preventDefault()
            removeField(id)
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
          </svg>
        </Button>
      </Flex>
    </>
  )
}
export default NewInstance

