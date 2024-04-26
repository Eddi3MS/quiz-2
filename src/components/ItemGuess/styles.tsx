import styled, { css } from 'styled-components'

export const Item = styled.div<{ correct: boolean; current: boolean }>`
  box-sizing: border-box;
  width: 140px;
  background-color: ${({ correct }) => (correct ? '#559b54' : '#5a0595')};
  ${({ current }) =>
    css`
      outline: ${current ? '#2db42b solid 2px ' : 'none'};
    `}
`

export const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 5px 10px;
`

export const Title = styled.p`
  font-size: 14px;
  color: #fff;

  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const ImageWrapper = styled.div`
  display: flex;
  position: relative;
  cursor: pointer;
`

export const Image = styled.img`
  aspect-ratio: 2/3;
  object-fit: cover;
  object-position: center;
`

export const InputWrapper = styled.div`
  padding: 6px;
`

export const Input = styled.input`
  width: 100%;
  padding: 6px;
  border-radius: 2px;
  border: none;
  outline: none;

  &:disabled {
    color: white;
  }
`

export const ProgressBar = styled.div`
  height: 2px;
  background-color: red;
  position: absolute;
  left: 0px;
  bottom: 0px;
`

export const IconButton = styled.button`
  padding: 0px;
  margin: 0px;
  background: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;
`

