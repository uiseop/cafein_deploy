import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import {
  ChangeEvent,
  FormEventHandler,
  MouseEventHandler,
  useState
} from 'react'
import styled from 'styled-components'
import {
  ClearButton,
  HomeTitle,
  HomeWrapper,
  InputWrapper,
  NavWrapper,
  SearchButton,
  SearchFormWrapper,
  SearchInput,
  WhiteLink,
  Wrapper
} from '../components/Home/styles/styles'
import {
  HomeSearchLists,
  SearchList,
  SearchListDescs,
  SearchListPosition,
  SearchListStrong,
  SearchListTitle
} from '../components/Maps/styles/FormStyles'

interface IStore {
  address_name: string
  category_group_code: string
  category_group_name: string
  category_name: string
  distance: string
  id: string
  phone: string
  place_name: string
  place_url: string
  road_address_name: string
  x: string
  y: string
}

const Home: NextPage = () => {
  const [inputs, setInputs] = useState('')
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  const [isClicked, setIsClicked] = useState(false)
  const [searchLists, setSearchLists] = useState<string[]>([])
  const handleInputs = async (e: ChangeEvent<HTMLInputElement>) => {
    setInputs(e.target.value)
    if (timer) {
      clearTimeout(timer)
    }
    const newTimer = setTimeout(async () => {
      try {
        const response = await axios({
          method: 'get',
          url: 'https://dapi.kakao.com/v2/local/search/keyword.json',
          headers: {
            Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_KEY}`
          },
          params: {
            query: `${e.target.value}`,
            category_group_code: 'CE7'
          }
        })
        console.log(response)
        const {
          data: { documents }
        } = response
        const n_searchLists = documents.map((store: IStore) => store.place_name)
        console.log(n_searchLists)
        setSearchLists(n_searchLists)
      } catch (error) {
        console.error(`Debouncing Error while fetching Seach Lists : ${error}`)
      }
    }, 500)
    setTimer(newTimer)
  }

  const handleClearEvent: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setInputs('')
    setSearchLists([])
  }

  return (
    <Wrapper>
      <Head>
        <title>카공인을 위한 커페 추천 서비스 카페인</title>
      </Head>
      <NavWrapper main={true}>
        <Link href="/">
          <a>
            <Image
              src={'/images/logo_black.svg'}
              alt="카페인 로고"
              width={103}
              height={22}
            />
          </a>
        </Link>
        <Link href="/">
          <WhiteLink>의견 보내기</WhiteLink>
        </Link>
      </NavWrapper>
      <HomeWrapper>
        <HomeTitle>
          카공인을 위한
          <br />
          카페 추천 서비스 카페인
        </HomeTitle>
        <SearchFormWrapper onSubmit={handleClearEvent}>
          <InputWrapper>
            <SearchInput
              placeholder="카페 이름이나 지하철역을 검색해보세요"
              value={inputs}
              onChange={handleInputs}
              onFocus={() => setIsClicked(true)}
              onBlur={() => setIsClicked(false)}
            />
            <ClearButton isInput={inputs === '' ? false : true} />
          </InputWrapper>
          <HomeSearchLists
            isDisplay={searchLists.length !== 0 && isClicked ? true : false}
          >
            {searchLists.map((searchList) => {
              const rest_name = searchList.replace(inputs, '')
              return (
                <>
                  <SearchList>
                    <Image
                      src={'/images/location.svg'}
                      width={24}
                      height={24}
                      alt="location IMG"
                    />
                    <SearchListDescs>
                      <SearchListTitle>
                        <SearchListStrong>{inputs}</SearchListStrong>
                        {rest_name}
                      </SearchListTitle>
                      <SearchListPosition>
                        서울특별서 마포구 양학로 45
                      </SearchListPosition>
                    </SearchListDescs>
                  </SearchList>
                </>
              )
            })}
          </HomeSearchLists>
          <SearchButton>지도에서 카페 찾기</SearchButton>
        </SearchFormWrapper>
        <RecommendWrapper>
          <RecommendTitle>지역별 카페 추천</RecommendTitle>
          <RecommendLists>
            <RecommendList>서대문구</RecommendList>
            <RecommendList>서대문구</RecommendList>
            <RecommendList>서대문구</RecommendList>
          </RecommendLists>
          <RecommendItemsWrapper>
            <RecommendItem>1</RecommendItem>
            <RecommendItem>2</RecommendItem>
          </RecommendItemsWrapper>
        </RecommendWrapper>
        <AddWrapper>
          <Link href="/">
            <AddLink>
              <AddLinkText>추천하고 싶은 카페가 있다면 알려주세요</AddLinkText>
              <AddButton>카페 등록하기</AddButton>
            </AddLink>
          </Link>
        </AddWrapper>
      </HomeWrapper>
    </Wrapper>
  )
}

const RecommendWrapper = styled.div`
  margin-top: 102px;
`

const RecommendTitle = styled.p`
  font-size: ${(props) => props.theme.fontsizes.font24}rem;
  font-weight: 700;
`

const RecommendLists = styled.ul`
  margin-top: 24px;
  display: flex;
  gap: 8px;
`

const RecommendList = styled.li`
  padding: 9px 12px;
  background-color: ${(props) => props.theme.colors.grey200};
  border-radius: 28px;
  font-weight: 600;
  font-size: ${(props) => props.theme.fontsizes.font15}rem;
`

const RecommendItemsWrapper = styled.ul`
  display: grid;
  row-gap: 20px;
  column-gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(364px, 1fr));
`

const RecommendItem = styled.div`
  width: 364px;
  height: 240px;
`

const AddWrapper = styled.div`
  display: flex;
  height: 240px;
  padding: 84px 140px;
  background-image: url('/images/Cafein.svg');
  background-repeat: no-repeat;
  background-blend-mode: multiply;
  background-color: ${(props) => props.theme.colors.grey100};
  background-position: right 132px top 20px;
  border-radius: 20px;
`

const AddLink = styled.a`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
`

const AddLinkText = styled.p`
  font-size: ${(props) => props.theme.fontsizes.font23}rem;
  font-weight: 600;
`

const AddButton = styled.button`
  border-radius: 14px;
  background-color: ${(props) => props.theme.colors.grey600};
  padding: 12px 16px;
  font-weight: 500;
  font-size: ${(props) => props.theme.fontsizes.font16}rem;
  color: ${(props) => props.theme.colors.white};
`

export default Home
