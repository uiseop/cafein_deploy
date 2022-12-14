import { useRouter } from 'next/router'
import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import { useAtom, useAtomValue } from 'jotai'
import { searchInputAtom, searchListsAtom, split_searchInputAtom } from 'store'

import Ic_Location from '@public/location.svg'

import {
  onClickHandler,
  onEnterPress,
  onHandleClearEvent,
  onHandleInputs
} from '@utils/onSearchHandler'

import {
  HomeSearchLists,
  SearchList,
  SearchListDescs,
  SearchListPosition,
  SearchListStrong,
  SearchListTitle
} from '../Maps/styles/FormStyles'
import {
  ClearButton,
  InputWrapper,
  SearchFormWrapper,
  SearchInput
} from './styles/FormStyles'

const Search = () => {
  const [inputs, setInputs] = useAtom(searchInputAtom)
  const [searchLists, setSearchLists] = useAtom(searchListsAtom)
  const split_inputs = useAtomValue(split_searchInputAtom)
  const router = useRouter()

  let searchIdx = -1
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  const [isClicked, setIsClicked] = useState(false)
  const autoRef = useRef<HTMLUListElement>(null)
  const [nodeLists, setNodeLists] = useState<HTMLCollection>()
  const inputRef = useRef<HTMLInputElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickOutside = useCallback(
    (event: MouseEvent | any): void => {
      if (
        inputRef.current &&
        autoRef.current &&
        !autoRef.current.contains(event.target as Node) &&
        event.target !== inputRef.current
      ) {
        setIsClicked(false)
        if (nodeLists && nodeLists.length > 0) {
          for (let i = 0; i < nodeLists.length; i++)
            nodeLists[i].classList.remove('active')
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [nodeLists]
  )
  useEffect(() => {
    setNodeLists(autoRef.current?.children as HTMLCollection)
    window.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleKeyArrow = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        return
      }
      if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
        inputRef.current?.blur()
        if (!inputs) return router.push('/maps')
        if (searchIdx !== -1 && nodeLists) {
          nodeLists[searchIdx].classList.toggle('active')
          return onEnterPress(
            searchLists[searchIdx].storeName,
            router,
            setIsClicked,
            searchLists[searchIdx].storeId
          )
        } else {
          return onEnterPress(inputs, router, setIsClicked)
        }
      }
      if (searchLists && nodeLists && nodeLists.length > 0) {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            if (searchIdx === -1) {
              searchIdx += 1
              nodeLists[searchIdx].classList.toggle('active')
            } else {
              nodeLists[searchIdx].classList.toggle('active')
              searchIdx += 1
              if (searchIdx === autoRef.current?.childElementCount) {
                searchIdx = 0
              }
              nodeLists[searchIdx].classList.toggle('active')
            }
            autoRef.current?.scrollTo({ top: searchIdx * 70.19 })
            break
          case 'ArrowUp':
            e.preventDefault()
            if (searchIdx === -1) return
            nodeLists[searchIdx].classList.toggle('active')
            searchIdx -= 1
            if (searchIdx === -1) {
              searchIdx = (autoRef.current?.childElementCount as number) - 1
            }
            autoRef.current?.scrollTo({ top: searchIdx * 70.19 })
            nodeLists[searchIdx].classList.toggle('active')
            break
          default:
            autoRef.current?.scrollTo({ top: 0 })
            if (searchIdx !== -1) {
              nodeLists[searchIdx].classList.remove('active')
            }
            searchIdx = -1
            break
        }
        return
      }
    },
    [nodeLists, searchLists]
  )

  const onFocusHandler = useCallback(() => setIsClicked(true), [])
  const onClearHandler = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      inputRef.current?.focus()
      onHandleClearEvent({ e, setInputs, setSearchLists })
    },
    [inputRef]
  )

  const isMap = router.pathname.includes('maps')

  return (
    <SearchFormWrapper isMap={isMap}>
      <InputWrapper>
        <SearchInput
          ref={inputRef}
          isMap={isMap}
          placeholder="?????? ???????????? ??????????????? ??????????????????"
          value={inputs}
          onChange={onHandleInputs({
            setInputs,
            timer,
            setTimer,
            setSearchLists
          })}
          onFocus={onFocusHandler}
          onKeyDown={handleKeyArrow}
        />
        <ClearButton
          isInput={inputs === '' ? false : true}
          onClick={onClearHandler}
        />
      </InputWrapper>
      <HomeSearchLists
        isMap={isMap}
        isDisplay={searchLists.length !== 0 && isClicked ? true : false}
        ref={autoRef}
      >
        {searchLists.slice(0, 10).map((searchList) => {
          return (
            <SearchList
              key={searchList.storeId}
              data-storeid={searchList.storeId}
              onClick={onClickHandler(
                searchList.storeName,
                router,
                setIsClicked
              )}
            >
              <Ic_Location />
              <SearchListDescs>
                <SearchListTitle>
                  {searchList.storeName
                    .split('')
                    .map((text, idx) =>
                      split_inputs?.includes(text) ? (
                        <SearchListStrong key={idx + searchList.storeId}>
                          {text}
                        </SearchListStrong>
                      ) : (
                        text
                      )
                    )}
                </SearchListTitle>
                <SearchListPosition>
                  {searchList.fullAddress}
                </SearchListPosition>
              </SearchListDescs>
            </SearchList>
          )
        })}
      </HomeSearchLists>
    </SearchFormWrapper>
  )
}

export default Search
