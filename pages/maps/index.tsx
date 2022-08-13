import { useAtom } from 'jotai'
import { ReactElement, useEffect, useState } from 'react'
import MapLayout from '../../components/Maps/MapLayout'
import { IStore, searchInputAtom, searchListsAtom } from '../../store'
import { NextPageWithLayout } from '../_app'
import styled from 'styled-components'
import Link from 'next/link'
import {
  CurrentPopularItem,
  CurrentPopularItemLocation,
  CurrentPopularItemTitle,
  DdabongWrap,
  OnAirBadge,
  OnAirWrapper,
  OpeningTime
} from '../../components/Maps/styles/CurrentPopularStyles'
import { Ddabong, Logo } from '../../components/common/Common'
import { GetServerSideProps } from 'next'
import axios from 'axios'
import getHours from '../../utils/getHours'
import { useRouter } from 'next/router'
import Search from '../../components/Home/Search'
import Image from 'next/image'

const Maps: NextPageWithLayout<{
  search?: string
  cafeDatas?: IStore[]
}> = ({ search, cafeDatas }) => {
  const [inputs, setInputs] = useAtom(searchInputAtom)
  const router = useRouter()
  const { storeId } = router.query
  const [isOpenDetail, setIsOpenDetail] = useState(false)
  useEffect(() => {
    if (search && search !== inputs) {
      setInputs(search)
    }
  }, [router])
  return (
    <>
      <Wrapper>
        <Link href="/">
          <Logo>
            <Image
              src="/images/logo_black.svg"
              width={103}
              height={22}
              alt="로고"
            />
          </Logo>
        </Link>
        <Search />
        <FilterWrapper>
          <FilterItem>영업중</FilterItem>
          <FilterItem>가까운순</FilterItem>
          <FilterItem>추천순</FilterItem>
        </FilterWrapper>
      </Wrapper>
      <CafeList>
        {cafeDatas
          ? cafeDatas.map((cafe) => (
              <CurrentPopularItem
                key={cafe.storeId}
                onClick={() => setIsOpenDetail(true)}
                isClicked={storeId && storeId as string === String(cafe.storeId) ? true : false}
              >
                <Link
                  href={{
                    pathname: 'maps',
                    query: {
                      search,
                      storeId: cafe.storeId,
                      storeName: cafe.storeName
                    }
                  }}
                  as={`maps?search=${search}&storeId=${cafe.storeId}`}
                >
                  <a>
                    <CurrentPopularItemTitle>
                      {cafe.storeName}
                    </CurrentPopularItemTitle>
                    <CurrentPopularItemLocation>
                      {cafe.fullAddress}
                    </CurrentPopularItemLocation>
                    <OnAirWrapper>
                      <OnAirBadge>
                        {cafe.businessHoursInfoDto.isOpen
                          ? '영업중'
                          : '영업종료'}
                      </OnAirBadge>
                      <OpeningTime>
                        {cafe.businessHoursInfoDto.closed
                          ? getHours(cafe.businessHoursInfoDto.closed) +
                            '에 영업 종료'
                          : '정보 없음'}
                      </OpeningTime>
                    </OnAirWrapper>
                    {cafe.recommendPercent ? (
                      <DdabongWrap>
                        {Ddabong} {Math.floor(cafe.recommendPercent) + '%'}
                      </DdabongWrap>
                    ) : (
                      ''
                    )}
                  </a>
                </Link>
              </CurrentPopularItem>
            ))
          : ''}
      </CafeList>
    </>
  )
}

const Wrapper = styled.header`
  display: flex;
  flex-direction: column;
`

const FilterWrapper = styled.ul`
  display: flex;
  gap: 6px;
  padding: 10px 24px;
  margin-top: 6px;
`

const FilterItem = styled.li`
  border: 1px solid ${(props) => props.theme.colors.grey200};
  border-radius: 20px;
  font-size: ${(props) => props.theme.fontsizes.font14}rem;
  font-weight: 400;
  color: ${(props) => props.theme.colors.grey800};
  padding: 8px 12px;
  cursor: pointer;
`

const CafeList = styled.ul`
  border-top: 1px solid ${(props) => props.theme.colors.grey100};
  display: flex;
  flex-direction: column;
  height: calc(100vh - 179.09px);
  overflow-y: auto;

  & li:not(:first-child)::after {
    content: '';
    position: absolute;
    left: 24px;
    right: 24px;
    top: 0;
    border-top: 1px solid ${(props) => props.theme.colors.grey100};
  }
  & li {
    padding: 20px 24px;
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.colors.grey300};
    border-radius: 4px;
  }
`

Maps.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  console.log(query, '내가 바로 진짜 쿼리')
  if (query.search) {
    const { search } = query
    try {
      const res = await axios(
        `${process.env.API_DOMAIN}/web/stores?keyword=${encodeURI(
          search as string
        )}`
      )
      const data: IStore[] = res.data.data
      return {
        props: {
          search,
          cafeDatas: data
        }
      }
    } catch (error) {
      console.error('또 실패다!', error)
      return {
        props: { search }
      }
    }
  }
  return {
    props: {}
  }
}

export default Maps
