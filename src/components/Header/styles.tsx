import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const MainHeader = styled.header`
  width: 100%;
  height: 80px;
  padding-inline: 4rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2rem;
  border-bottom: 1px solid #48485e;
  background-color: #55556e;

  @media screen and (max-width: 1040px) {
    justify-content: center;
    padding-inline: 2rem;
  }
`

export const Anchor = styled(Link)`
  font-size: 16px;
  color: #fff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

