import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react'

import axios from 'axios'

import { CafeInfoInterface } from 'store'
import Ic_badOn from '@public/bad_on.svg'
import Ic_bad from '@public/bad.svg'
import Ic_sosoOn from '@public/soso_on.svg'
import Ic_soso from '@public/soso.svg'
import Ic_goodOn from '@public/good_on.svg'
import Ic_good from '@public/good.svg'

import {
  ButtonDesc,
  ButtonInnerWrapper,
  ButtonOutterWrapper,
  ButtonWrapper,
  CafeInfoWrapper,
  PercentBadge,
  PointTitleWrapper,
  StrongWrapperTitle,
  WordsWrapper,
  WordsWrapperText,
  WrapperTitle
} from './styles/styles'
import { useRouter } from 'next/router'
import { useSWRConfig } from 'swr'
import useSyncState from 'hooks/useSyncState'

const RecommendSection = ({
  store,
  setCafeReviewPercent,
  cafeReviewPercent
}: {
  store: CafeInfoInterface
  setCafeReviewPercent: Dispatch<SetStateAction<number | null>>
  cafeReviewPercent: number | null
}) => {
  const [isOnButton, setIsOnButton] = useState<
    'BAD' | 'NORMAL' | 'GOOD' | undefined
  >()
  const [isHover, setIsHover] = useSyncState<1 | 2 | 3 | null>(null)
  const [countOfTypes, setCountOfTypes] = useState([0, 0, 0])
  const router = useRouter()
  const { search, sggNm, type } = router.query
  const { mutate } = useSWRConfig()
  const url = `sggNm=${encodeURI(sggNm as string)}&type=${encodeURI(
    type as string
  )}`
  const wrapper = useRef<HTMLDivElement>(null)

  const mouseLeaveHandler = (
    e: CustomEvent<MouseEvent<HTMLDivElement>>
  ): void => {
    if (e.type === 'mouseleave') {
      return setIsHover(null)
    }
  }

  const mouseEnterHandler = (e: MouseEvent<HTMLDivElement>): void => {
    setIsHover(Number(e.currentTarget.dataset.hoverid) as 1 | 2 | 3)
  }

  useEffect(() => {
    getRecommendation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store])

  useEffect(() => {
    const el = wrapper.current
    if (el) {
      el.addEventListener('mouseleave', mouseLeaveHandler as EventListener)
      return () => {
        el.removeEventListener('mouseleave', mouseLeaveHandler as EventListener)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapper])

  const getRecommendation = async () => {
    try {
      const response = await axios.get(
        `/api/web/stores/${store.storeId}/recommendations`
      )
      const { data } = response.data
      const {
        countByRecommendTypeResDto,
        recommendPercentOfStore,
        regRecommendation
      } = data
      setCafeReviewPercent(recommendPercentOfStore)
      setCountOfTypes([
        countByRecommendTypeResDto['bad'],
        countByRecommendTypeResDto['normal'],
        countByRecommendTypeResDto['good']
      ])
      mutate(search)
      sggNm ? mutate(url) : ''
      setIsOnButton(regRecommendation)
    } catch (error) {
      console.error(`Cafe Recommend data Get error : ${error}`)
    }
  }

  const recommendOnClickHandler = async (
    recommendation: 'BAD' | 'NORMAL' | 'GOOD',
    storeId: number
  ) => {
    isOnButton === recommendation
      ? deleteRecommend()
      : isOnButton
      ? updateRecommend()
      : postRecommend()
    // const dimmed_obj: IDimmed =
    //   isOnButton === recommendation
    //     ? {
    //         title: `???????????? ?????????????????????????`,
    //         body: `${store.storeName}??? ????????? ????????????\n????????? ?????????????????????????`,
    //         type: 'confirm',
    //         callback: deleteRecommend
    //       }
    //     : isOnButton
    //     ? {
    //         title: `???????????? ?????????????????????????`,
    //         body: `${store.storeName}??? ????????? ????????????\n???????????????.`,
    //         type: 'confirm',
    //         callback: updateRecommend
    //       }
    //     : {
    //         title: `???????????? ?????????????????????????`,
    //         body: `${store.storeName}??? ?????? ????????????\n????????? ??? ?????? ????????? ??? ????????????.`,
    //         type: 'confirm',
    //         callback: postRecommend
    //       }
    // setIsDimmed(dimmed_obj)

    function postRecommend() {
      try {
        axios
          .post(`/api/web/recommendations`, {
            recommendation,
            storeId
          })
          .then(() => getRecommendation())
      } catch (error) {
        console.error(
          `?????? ?????? ????????? ?????? ?????? : ${error} of "${recommendation}"`
        )
      }
    }

    function deleteRecommend() {
      try {
        axios
          .delete(`/api/web/stores/${store.storeId}/recommendations`)
          .then(() => getRecommendation())
      } catch (error) {
        console.error(
          `?????? ?????? ????????? ?????? ?????? : ${error} of ${recommendation} cancel`
        )
      }
    }

    function updateRecommend() {
      try {
        axios
          .delete(`/api/web/stores/${store.storeId}/recommendations`)
          .then(() =>
            axios.post(`/api/web/recommendations`, {
              recommendation,
              storeId
            })
          )
          .then(() => getRecommendation())
      } catch (error) {
        console.error(
          `?????? ?????? ????????? ?????? ??????: ${error} of ${recommendation} update`
        )
      }
    }
  }

  return (
    <CafeInfoWrapper>
      <PointTitleWrapper>
        <WrapperTitle>?????? ?????????</WrapperTitle>
        {cafeReviewPercent ? (
          cafeReviewPercent < 37.5 ? (
            <PercentBadge color="#515151" backgroundColor="#EFEFEF">
              ????????????
            </PercentBadge>
          ) : cafeReviewPercent < 75.1 ? (
            <PercentBadge color="#FF9800" backgroundColor="#FFF3E0">
              ????????????
            </PercentBadge>
          ) : (
            <PercentBadge color="#26ba6a" backgroundColor="#dff5e8">
              ????????????
            </PercentBadge>
          )
        ) : (
          ''
        )}
      </PointTitleWrapper>
      <WordsWrapper>
        <StrongWrapperTitle>{store.storeName}</StrongWrapperTitle>
        <WordsWrapperText>?????? ????????? ?????????????</WordsWrapperText>
      </WordsWrapper>
      <ButtonOutterWrapper>
        <ButtonInnerWrapper ref={wrapper}>
          <ButtonWrapper
            data-hoverid={1}
            onMouseEnter={mouseEnterHandler}
            onClick={() => recommendOnClickHandler('BAD', store.storeId)}
          >
            {isHover() === 1 || isOnButton === 'BAD' ? (
              <Ic_badOn style={{ 'pointer-events': 'none' }} />
            ) : (
              <Ic_bad style={{ 'pointer-events': 'none' }} />
            )}
            <ButtonDesc isOnButton={isOnButton === 'BAD'}>
              ????????????{countOfTypes[0] ? <span>{countOfTypes[0]}</span> : ''}
            </ButtonDesc>
          </ButtonWrapper>
          <ButtonWrapper
            data-hoverid={2}
            onMouseEnter={mouseEnterHandler}
            onClick={() => recommendOnClickHandler('NORMAL', store.storeId)}
          >
            {isHover() === 2 || isOnButton === 'NORMAL' ? (
              <Ic_sosoOn style={{ 'pointer-events': 'none' }} />
            ) : (
              <Ic_soso style={{ 'pointer-events': 'none' }} />
            )}
            <ButtonDesc isOnButton={isOnButton === 'NORMAL'}>
              ????????????{countOfTypes[1] ? <span>{countOfTypes[1]}</span> : ''}
            </ButtonDesc>
          </ButtonWrapper>
          <ButtonWrapper
            data-hoverid={3}
            onMouseEnter={mouseEnterHandler}
            onClick={() => recommendOnClickHandler('GOOD', store.storeId)}
          >
            {isHover() === 3 || isOnButton === 'GOOD' ? (
              <Ic_goodOn style={{ 'pointer-events': 'none' }} />
            ) : (
              <Ic_good style={{ 'pointer-events': 'none' }} />
            )}
            <ButtonDesc isOnButton={isOnButton === 'GOOD'}>
              ????????????{countOfTypes[2] ? <span>{countOfTypes[2]}</span> : ''}
            </ButtonDesc>
          </ButtonWrapper>
        </ButtonInnerWrapper>
      </ButtonOutterWrapper>
    </CafeInfoWrapper>
  )
}

export default RecommendSection
