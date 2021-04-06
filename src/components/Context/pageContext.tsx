import React, { FunctionComponent } from "react";

const PageContext = React.createContext({ lang: "", originalPath: "" });

export const PageContextProvider: FunctionComponent<{
  pageContext: any;
  children: any;
}> = ({ pageContext, children }) => {
  return (
    <PageContext.Provider value={pageContext}>{children}</PageContext.Provider>
  );
};

export const usePageContext = () => React.useContext(PageContext);