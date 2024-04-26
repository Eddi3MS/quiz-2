import styled from 'styled-components'

export const ItemWrapper = styled.div`
  display: flex;
  height: 224px;
  border-radius: 6px;
  overflow: hidden;
  text-decoration: none;
  cursor: pointer;
  background-color: #d2d9df;
`
export const CoverImage = styled.img`
  object-fit: cover;
  object-position: center;
  aspect-ratio: 2/3;
`

export const Container = styled.div`
  padding: 16px;
  width: 240px;
`

export const Title = styled.h2`
  font-size: 20px;
  color: #212121;
  font-weight: 500;
  margin: 0px 0px 8px;
  position: relative;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  svg {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 0;

    path {
      fill: red;
    }
  }
`

export const Author = styled.p`
  margin: 0px;
  font-size: 16px;
  color: #212121;
`

export const Twitter = styled.a<{ href: string | undefined }>`
  margin: 0px;
  font-size: 18px;
  color: ${({ href }) => (href ? '#657bcc' : '#212121')};
`

export const Description = styled.p`
  margin: 8px 0;
  font-size: 16px;
  color: #212121;

  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

