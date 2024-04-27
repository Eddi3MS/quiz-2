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
  padding-block: 2.5rem 0;
  background-color: #55556e;
`

export const Count = styled.p`
  font-size: 24px;
  color: #fff;
  text-align: center;
  margin-block: 1rem;
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
  margin-top: 0;
`

export const Audio = styled.audio`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  visibility: hidden;
`

export const InputRange = styled.input`
  width: 200px;
  position: fixed;
  transform: rotate(-90deg);
  right: -70px;
  bottom: 150px;
  color: rgb(90, 5, 149);
`

