import styled from 'styled-components'

export const Main = styled.main`
  padding: 0 40px 40px 40px;
  max-width: 1620px;
  margin-inline: auto;
`

export const Grid = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 80px;
  z-index: 5;
  padding-block: 15px;
  background-color: #55556e;

  & > * {
    margin: 10px 0 0 0;
  }
`

export const Count = styled.p`
  font-size: 24px;
  color: #fff;
  text-align: center;
`

export const Title = styled.p`
  font-size: 18px;
  color: #fff;
  text-align: center;
  word-break: break-all;
`

export const Description = styled.p`
  font-size: 16px;
  color: #fff;
  text-align: center;
  word-break: break-all;
`

export const Audio = styled.audio`
  position: sticky;
  top: 80px;
`
