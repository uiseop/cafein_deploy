import MapLayout from '@components/Maps/MapLayout'
import { fetchIStores } from 'apis/apis'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import useSWR from 'swr'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useEffect } from 'react'
import { IStore, mapAtom, mapMarkerList } from 'store'
import { CafeList } from '@components/Maps/styles/styles'
import ShortCafeItem from '@components/Maps/ShortCafeItem'
import { getMapItems } from '@utils/MapUtils'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { NextPageWithLayout } from 'pages/_app'

const SearchMap: NextPageWithLayout = ({
  search
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const map = useAtomValue(mapAtom)
  const { storeId } = router.query
  const setMarkers = useSetAtom(mapMarkerList)

  const { data: cafes } = useSWR<IStore[]>(search as string, fetchIStores)

  useEffect(() => {
    if (cafes && map) {
      setMarkers(
        getMapItems(
          map,
          cafes?.slice(0, 15) as IStore[],
          Number(storeId) as number,
          router
        )
      )
    }
  }, [cafes])

  return (
    <>
      <Head>
        <title>카페인 | 지도</title>
      </Head>
      {!cafes ? (
        <h1>Loading... </h1>
      ) : (
        <CafeList>
          {cafes.slice(0, 15).map((cafe: IStore) => (
            <ShortCafeItem
              cafe={cafe}
              storeId={storeId as string}
              router={router}
              key={cafe.storeId}
            />
          ))}
        </CafeList>
      )}
    </>
  )
}

SearchMap.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { search } = query
  return {
    props: {
      search
    }
  }
}

export default SearchMap