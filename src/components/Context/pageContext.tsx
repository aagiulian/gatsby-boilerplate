import React, { useState } from 'react'
// import { useCookie } from "../../hooks/useCookie";
// import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useWindowSize } from '../../hooks/useWindowSize'

const PageContext = React.createContext({
  // cookie: [],
  lang: '',
  // lengthCookie: 0,
  originalPath: '',
  // removeCookie: (key: string) => {},
  setLang: (lang: string) => {},
  size: { width: 0, height: 0 },
  // updateCookie: (value: any, options: any) => {},
})

export const PageContextProvider: React.FC<{
  pageContext: any
  children: any
}> = ({ pageContext, children }) => {
  const [lang, setLang] = useState<string>(pageContext.lang)
  // const [cookie, updateCookie, removeCookie, lengthCookie] = useCookie(
  //   "default",
  //   [],
  //   {
  //     maxAge: 1296000000,
  //     path: "/",
  //   }
  // );
  const size = useWindowSize()
  return (
    <PageContext.Provider
      value={{
        ...pageContext,
        lang: lang,
        setLang: setLang,
        // cookie: cookie,
        // updateCookie: updateCookie,
        // removeCookie: removeCookie,
        // lengthCookie: lengthCookie,
        size: size,
      }}
    >
      {children}
    </PageContext.Provider>
  )
}

export const usePageContext = () => React.useContext(PageContext)
