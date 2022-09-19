import Link from 'next/link'

import {
  CopyRight,
  FooterQLists,
  FooterWrapper,
  QItem
} from './styles/FooterStyles'

interface IFooterProps {
  isHome: boolean
}

const Footer = ({ isHome }: IFooterProps) => {
  return (
    <FooterWrapper isHome={isHome}>
      <FooterQLists>
        <QItem>
          <a
            href="https://www.notion.so/cafeinofficial/64732875ac664fd9878b72d5c0b05a42"
            target="_blank"
            rel="noreferrer"
          >
            공지사항
          </a>
        </QItem>
        <QItem>
          <a
            href="https://www.notion.so/cafeinofficial/3947d079e88842f0a5bdb08924fdfccc"
            target="_blank"
            rel="noreferrer"
          >
            자주 묻는 질문
          </a>
        </QItem>
        <QItem>
          <a
            href="https://www.notion.so/cafeinofficial/84d615bf6c654196853bbc3644968135"
            target="_blank"
            rel="noreferrer"
          >
            이용약관
          </a>
        </QItem>
      </FooterQLists>
      <FooterQLists>
        <QItem>
          <Link href="mailto:dalbong.cafeing@gmail.com">
            dalbong.cafeing@gmail.com
          </Link>
        </QItem>
        <QItem>
          <a
            href="https://www.instagram.com/cafein.kr"
            target="_blank"
            rel="noreferrer"
          >
            인스타그램
          </a>
        </QItem>
      </FooterQLists>
      <CopyRight>COPYRIGHT © 2022 cafein ALL RIGHTS RESERVED.</CopyRight>
    </FooterWrapper>
  )
}

export default Footer
