import { atom } from 'jotai'

export interface ImageListInterface {
  imageId: number
  imageUrl: string
}
export interface CafeInfoInterface {
  storeId: number
  storeName: string
  nicknameOfModMember: string
  memberImageDto: {
    imageId: number
    imageUrl: string
  }
  address: {
    siNm: string
    sggNm: string
    detail: string
    fullAddress: string
    rnum: string
    rnm: string
  }
  wifiPassword: string
  heartCnt: number
  isHeart: boolean
  businessHoursInfoDto: {
    isOpen: boolean | null
    closed: string | null
    tmrOpen: string | null
    open: string | null
  }
  totalBusinessHoursResDto: {
    onMon: null | {
      open: string
      closed: string
    }
    onTue: null | {
      open: string
      closed: string
    }
    onWed: null | {
      open: string
      closed: string
    }
    onThu: null | {
      open: string
      closed: string
    }
    onFri: null | {
      open: string
      closed: string
    }
    onSat: null | {
      open: string
      closed: string
    }
    onSun: null | { open: string; closed: string }
    etcTime: string
    [key: string]: any
  }
  lngX: number
  latY: number
  reviewImageList: ImageListInterface[]
  storeImageList: ImageListInterface[]
  marker: naver.maps.Marker | null
  website: string
  phone: string
}

export interface CafeRewviewPointInterface {
  reviewCnt: number
  recommendPercent: number
  socket: string
  socketCnt: number
  wifi: string
  wifiCnt: number
  restroom: string
  restroomCnt: number
  tableSize: string
  tableCnt: number
}

export interface CafeRecommendInterface {
  recommendPercentOfStore: null | number
  recommendation: null | number
}

// type isRunningInterface = [boolean, null | string]

export interface IStore {
  businessHoursInfoDto: {
    isOpen: boolean | null
    closed: string | null
    tmrOpen: string | null
    open: string | null
  }
  fullAddress: string
  latY: number
  lngX: number
  recommendPercent: null | number
  storeId: number
  storeImageDto: null | ImageListInterface[]
  storeName: string
  marker: naver.maps.Marker | null
}

export interface INearCafe {
  businessHoursInfoDto: {
    isOpen: boolean | null
    closed: string | null
    tmrOpen: string | null
    open: string | null
  }
  congestionScoreAvg: null | number
  distance: number
  heartCnt: number
  latY: number
  lngX: number
  recommendPercent: null | number
  storeId: number
  storeImageDtoList: ImageListInterface[]
  storeName: string
}

export interface IDimmed {
  title: string
  body: string
  type: 'confirm' | 'alert'
  callback?: () => void
}

export const cafeInfoAtom = atom<CafeInfoInterface | null>(null)

// export const isRunningAtom = atom<isRunningInterface>((get) => {
//   const businessHoursInfoDto = get(cafeInfoAtom)?.businessHoursInfoDto
//   if (businessHoursInfoDto) {
//     const { isOpen, closed, tmrOpen } = businessHoursInfoDto
//     let hour: string | number
//     if (isOpen) {
//       if (closed) {
//         hour = getHours(closed)
//         return [isOpen, hour]
//       }
//     } else {
//       if (tmrOpen) {
//         hour = getHours(tmrOpen)
//         return [isOpen, hour]
//       }
//     }
//   }
//   return [false, null]
// })

// export const getRunningTimesAtom = atom((get) => {
//   const totalBusinessHoursResDto = get(cafeInfoAtom)?.totalBusinessHoursResDto
//   if (totalBusinessHoursResDto?.onMon) {
//     const day_keys = Object.keys(totalBusinessHoursResDto as object).slice(
//       0,
//       -1
//     )
//     const days = <string[]>[
//       '?????????',
//       '?????????',
//       '?????????',
//       '?????????',
//       '?????????',
//       '?????????',
//       '?????????'
//     ]
//     const obj = <{ [key: string]: string }>{}
//     day_keys.map((d, idx) => {
//       if (totalBusinessHoursResDto[d]) {
//         const times =
//           getHours(totalBusinessHoursResDto[d].open) +
//           ' ~ ' +
//           getHours(totalBusinessHoursResDto[d].closed)
//         obj[days[idx]] = times
//       }
//     })
//     return obj
//   }
//   return null
// })

export const cafeReviewPonitAtom = atom<CafeRewviewPointInterface | null>(null)

export const cafeReviewPercentAtom = atom<number>(0)

export const searchInputAtom = atom<string>('')

export const split_searchInputAtom = atom<string[] | undefined>((get) => {
  if (!get(searchInputAtom)) return
  const split_inputs = get(searchInputAtom).split('')
  return split_inputs
})

export const searchListsAtom = atom<IStore[]>([])
export const searchedAtom = atom<IStore[] | null>(null)

export const mapAtom = atom<naver.maps.Map | null>(null)
export const mapMarkerList = atom<naver.maps.Marker[]>([])

export const isDimmedAtom = atom<IDimmed | null>(null)
export const moreAtom = atom<boolean>(false)
export const toastAtom = atom<boolean>(false)
export const sortModeAtom = atom<0 | 1 | 2 | 3>(0)

export const userLocationAtom = atom<{ latY: number; lngX: number } | null>(
  null
)
