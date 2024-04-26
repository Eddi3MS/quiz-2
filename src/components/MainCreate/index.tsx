// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useContext, useRef, useState } from 'react'
import { Checked, Unchecked } from '../../assets/icons/utils/CheckStatus'
import { CreationContext } from '../context/CreationContext'
import NewInstance from '../NewInstance'
import { ImageSelected } from '../NewInstance/styles'
import imagejs from 'image-js'
import { v4 as uuidv4 } from 'uuid'

import {
  Main,
  PageTitle,
  Form,
  InputField,
  Label,
  Input,
  UploadArea,
  SVGItem,
  Flex,
  Container,
  Submit,
  ProgressBar,
  Error,
} from './styled'
import CropImage from '../CropImage'

interface InputType {
  title: string
  name: string
  onChange: (e: any) => void
}

const TextInput = ({ title, onChange, name }: InputType) => {
  return (
    <InputField>
      <Label>{title}</Label>
      <Input onChange={onChange} name={name} type="text" />
    </InputField>
  )
}

const CheckInput = ({ title, onChange, name }: InputType) => {
  const { input } = useContext(CreationContext)

  return (
    <InputField type="checkbox">
      <Label htmlFor={name}>
        {title}
        {input[name] ? <Checked /> : <Unchecked />}
      </Label>
      <Input onChange={onChange} name={name} id={name} type="checkbox" />
    </InputField>
  )
}

const requiredFields = [
  {
    field: 'quizName',
    minLength: 1,
    type: 'string',
  },
  {
    field: 'author',
    minLength: 1,
    type: 'string',
  },
  {
    field: 'mainImage',
    type: 'object',
  },
]

const requiredQuiz = [
  {
    field: 'cardTitle',
    minLength: 1,
    type: 'string',
  },
  {
    field: 'variations',
    minLength: 1,
    type: 'string',
  },
  {
    field: 'audioBlob',
    type: 'object',
  },
  {
    field: 'imageBlob',
    type: 'object',
  },
]

const MainCreate = () => {
  const [showModal, setShowModal] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const {
    input,
    setInput,
    setMainImage,
    createInstance,
    uploadProgress,
    setLogger,
    logger,
    isSubmitting,
  } = useContext(CreationContext)

  const addInstance = () => {
    const _id = uuidv4()

    setInput((curr) => ({
      ...curr,
      quizItems: [
        ...curr.quizItems,
        {
          _id,
          ytProgress: 0,
          youtubeUrl: '',
          cardTitle: '',
          variations: '',
          audioBlob: null,
          imageBlob: null,
        },
      ],
    }))
  }

  const handleCheck = ({ target: { checked, name } }) =>
    setInput((curr) => ({ ...curr, [name]: checked }))

  const handleTextInput = ({ target: { name, value } }) =>
    setInput((curr) => ({ ...curr, [name]: value }))

  const submitQuiz = (e) => {
    e.preventDefault()

    const validMain = requiredFields.every(
      ({ field, minLength, type }, index) => {
        const currentField = input?.[field]

        if (
          !currentField ||
          (minLength && currentField.length < minLength) ||
          typeof currentField !== type
        ) {
          setLogger(`[${index + 1}] Campo "${field}" não preenchido`)
          return false
        }

        return true
      }
    )

    const validQuiz =
      Array.isArray(input.quizItems) &&
      input.quizItems.length > 0 &&
      input.quizItems.every((item) => {
        if (!item) return false

        const validItem = requiredQuiz.every(
          ({ field, minLength, type }, index) => {
            const currentField = item?.[field]

            if (
              !currentField ||
              (minLength && currentField.length < minLength) ||
              typeof currentField !== type
            ) {
              setLogger(`[${index + 1}] Campo "${field}" não preenchido`)
              return false
            }

            return true
          }
        )

        return validItem
      })

    if (validQuiz && validMain) {
      setLogger('')
      createInstance()
    }
  }

  const handleImageUpload = (e) => {
    e.preventDefault()

    const file = e.target.files[0]
    if (!file) return

    const fileUrl = URL.createObjectURL(file)

    setShowModal(true)
    setImageUrl(fileUrl)
  }

  return (
    <Main>
      {showModal && imageUrl && (
        <CropImage
          imageUrl={imageUrl}
          setCroppedImage={async ({ blobUrl, url }) => {
            const dataFetch = await fetch(blobUrl).then((res) => res.blob())

            setMainImage(dataFetch)
            setShowModal(false)
            setImageUrl(url)
          }}
          handleClose={() => setShowModal(false)}
        />
      )}
      <PageTitle>Crie seu Quiz</PageTitle>
      <Form>
        <TextInput
          onChange={handleTextInput}
          name="quizName"
          title="Nome do Quiz"
        />
        <TextInput
          onChange={handleTextInput}
          name="quizDescription"
          title="Descrição do Quiz (Opcional)"
        />
        <Flex>
          <InputField>
            <Label>Imagem de Capa</Label>
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
                accept="image/png, image/jpeg"
                type="file"
                disabled={isSubmitting}
              />
            </UploadArea>
          </InputField>
          <Container>
            <TextInput
              onChange={handleTextInput}
              name="author"
              title="Nome do Autor"
            />
            <TextInput
              onChange={handleTextInput}
              name="authorHandle"
              title="Twitter do Autor (ex: @username) (Opcional)"
            />
            <CheckInput
              onChange={handleCheck}
              name="dmcaNotice"
              title="Contem musica licenciada (DMCA)"
            />
          </Container>
        </Flex>
        <Label style={{ marginTop: 50 }}>Lista de Musicas</Label>
        {input.quizItems.map((item, index) => {
          return <NewInstance index={index} key={index} id={item._id} />
        })}
        <UploadArea
          onClick={!isSubmitting ? addInstance : undefined}
          large={true}
          ratio="12/2"
          disabled={isSubmitting}
        >
          <SVGItem viewBox="0 0 24 24">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </SVGItem>
        </UploadArea>
      </Form>
      {logger ? <Error>{logger}</Error> : null}
      <Submit onClick={submitQuiz} type="submit" disabled={isSubmitting}>
        Enviar Quiz
        <ProgressBar barWidth={(uploadProgress[0] / uploadProgress[1]) * 100} />
      </Submit>
    </Main>
  )
}

export default MainCreate

