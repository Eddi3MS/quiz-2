import { ref as dbRef, set } from 'firebase/database'
import { ref, uploadBytes } from 'firebase/storage'
import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useCallback,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { database, storage } from '../../config/firebase'
import { QuizType } from '../../types'

interface QuizItemCreationType {
  _id: string
  cardTitle: string
  audioBlob: Blob
  imageBlob: Blob
  variations: string
  youtubeUrl: number
}

interface CreationTypes {
  appendImageBlob: (blob: Blob, id: string) => void
  appendAudioBlob: (blob: Blob, id: string) => void
  input: QuizCreationType
  setInput: Dispatch<React.SetStateAction<QuizCreationType>>
  setQuizInput: (arg1: any, arg2: any) => void
  removeField: (id: string) => void
  musicList: QuizItemCreationType[]
  setMusicList: Dispatch<React.SetStateAction<QuizItemCreationType[]>>
  logger: string | null
  setLogger: Dispatch<React.SetStateAction<string | null>>
  setMainImage: (arg1: Blob) => void
  createInstance: () => void
  uploadProgress: number[]
  isSubmitting: boolean
  toggleSubmitting: VoidFunction
  youtubeUrl: string
  setYTUrl: Dispatch<React.SetStateAction<string>>
}

type QuizCreationType = Omit<
  QuizType,
  'createdAt' | 'id' | 'cardBackground' | 'quizItems'
> & {
  mainImage: Blob | null
  quizItems: QuizItemCreationType[]
}

export const CreationContext = createContext<CreationTypes>({} as CreationTypes)

const CreationProvider = ({ children }: PropsWithChildren) => {
  const [logger, setLogger] = useState<string | null>(null)
  const navigate = useNavigate()
  const [uploadProgress, setUpload] = useState<number[]>([0, 0])
  const [musicList, setMusicList] = useState<QuizItemCreationType[]>([])
  const [youtubeUrl, setYTUrl] = useState<string>('')
  const [input, setInput] = useState<QuizCreationType>({
    quizName: '',
    quizDescription: '',
    author: '',
    authorHandle: '',
    dmcaNotice: false,
    mainImage: null,
    quizItems: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleSubmitting = useCallback(() => {
    setIsSubmitting((curr) => !curr)
  }, [])

  const setMainImage = (blob: Blob) =>
    setInput((curr) => ({ ...curr, mainImage: blob }))

  const appendImageBlob = (blob: Blob, id: string) => {
    setInput((curr) => ({
      ...curr,
      quizItems: curr.quizItems.map((item) =>
        item._id === id ? { ...item, imageBlob: blob } : item
      ),
    }))
  }

  const appendAudioBlob = (blob: Blob, id: string) => {
    setInput((curr) => ({
      ...curr,
      quizItems: curr.quizItems.map((item) =>
        item._id === id ? { ...item, audioBlob: blob } : item
      ),
    }))
  }

  const setQuizInput = <K extends keyof QuizItemCreationType>(
    {
      target: { name, value },
    }: { target: { name: K; value: QuizItemCreationType[K] } },
    id: string
  ) => {
    setInput((curr) => ({
      ...curr,
      quizItems: curr.quizItems.map((item) =>
        item._id === id ? { ...item, [name]: value } : item
      ),
    }))
  }

  const removeField = (id: string) => {
    setInput((curr) => ({
      ...curr,
      quizItems: curr.quizItems.filter((item) => item._id !== id),
    }))
  }

  const addProgress = (prog: number, max: number) => setUpload([prog, max])

  const createInstance = async () => {
    if (!input.mainImage) return
    setIsSubmitting(true)

    const uuid = uuidv4()

    try {
      let prog = 0
      const max = 2 + input.quizItems.length * 2

      const storageRef = ref(storage, `cover/${uuid}_cover`)

      await uploadBytes(storageRef, input.mainImage)
      ++prog
      addProgress(prog, max)

      const mediaStorePromise = input.quizItems.map(
        async ({ imageBlob, audioBlob }, index) => {
          const imageRef = ref(storage, `cards/${uuid}_${index}`)
          const audioRef = ref(storage, `audio/${uuid}_${index}`)

          const storedImage = await uploadBytes(imageRef, imageBlob)
          ++prog
          addProgress(prog, max)
          const storedAudio = await uploadBytes(audioRef, audioBlob)
          ++prog
          addProgress(prog, max)

          return [storedImage, storedAudio]
        }
      )

      await Promise.all(mediaStorePromise).then(() => {
        ++prog
        addProgress(prog, max)
      })

      await set(dbRef(database, `quiz/${uuid}`), {
        id: uuid,
        quizName: input.quizName,
        quizDescription: input.quizDescription,
        author: input.author,
        authorHandle: input.authorHandle,
        dmcaNotice: input.dmcaNotice,
        createdAt: +new Date(),
        quizItems: input.quizItems.map(
          ({ cardTitle, variations, youtubeUrl }, index) => ({
            name: cardTitle,
            youtubeUrl,
            variations: variations.split(',').map((x: string) => x.trim()),
            audioId: `audio/${uuid}_${index}`,
            imageId: `cards/${uuid}_${index}`,
          })
        ),
      })

      setTimeout(() => navigate(`/quiz/${uuid}`), 2000)
    } catch (error) {
      if (error instanceof Error) setLogger(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CreationContext.Provider
      value={{
        appendImageBlob,
        appendAudioBlob,
        isSubmitting,
        toggleSubmitting,
        input,
        setInput,
        setQuizInput,
        removeField,
        musicList,
        setMusicList,
        setMainImage,
        createInstance,
        uploadProgress,
        logger,
        setLogger,
        youtubeUrl,
        setYTUrl,
      }}
    >
      {children}
    </CreationContext.Provider>
  )
}

export default CreationProvider

