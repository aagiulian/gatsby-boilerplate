import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import { Helmet } from 'react-helmet'
import { usePageContext } from './Context/pageContext'

type MetaProps = JSX.IntrinsicElements['meta']

interface Props {
  description?: string
  lang?: string
  meta?: MetaProps[]
  title?: string
  image?: any
}

export const SEO: React.FC<Props> = ({ description = '', meta = [], title, image }) => {
  const { gatsby, settings } = useStaticQuery(QUERY)
  const { lang, originalPath } = usePageContext()

  /*
    Donnees qui proviennent du gatsby-config
   */

  const defaultLanguage = gatsby?.siteMetadata?.defaultLanguage
  const extraLanguages = gatsby?.siteMetadata?.extraLanguages

  /*
     Donnees qui proviennent des props (SEO specifique) ou Fallback (sanity query settings) 
   */

  const metaDescription = description || settings?.siteMetadata?.description[lang] || ''
  const host = settings?.siteMetadata?.url ?? ''
  const websiteTitle = settings?.siteMetadata?.title[lang]
  const metaImage = image || settings?.siteMetadata?.image?.asset?.url
  const metaTitle = title || websiteTitle

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={metaTitle}
      titleTemplate={metaTitle === websiteTitle ? `%s` : `%s | ${websiteTitle || ''}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          /* This is the title of your webpage. Remember that this will be shown whenever someone links your website, so make it quick, snappy and able to draw attention */
          property: `og:title`,
          content: metaTitle,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: metaImage,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:title`,
          content: metaTitle,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `twitter:image`,
          content: metaImage,
        },
        // @ts-ignore
      ].concat(meta)}
      link={[
        /* 
          https://developers.google.com/search/docs/advanced/crawling/localized-versions?hl=en
          Le cannonical link c'est un lien vers soi meme, toutes les pages doivent en avoir un.
          /!\ une page d'une autre langue pointe vers sa propre version pas vers la langue par defaut
  
          Les alternate links ce sont TOUTES les versions de cette page dans d'autres langue MEME la langue actuelle.
          Le x-default est un fallback pour toutes les langues non gerees, la bonne pratique c'est de mettre un lien vers la page ou on peut choisir la langue du site.
          */
        {
          rel: 'canonical',
          href:
            lang === defaultLanguage ? `${host}${originalPath}` : `${host}/${lang}${originalPath}`,
        },
        {
          rel: 'alternate',
          hrefLang: 'x-default',
          href: `${host}${originalPath}`,
        },
        {
          rel: 'alternate',
          hrefLang: defaultLanguage,
          href: `${host}${originalPath}`,
        },
        ...extraLanguages.map((extraLang: string) => ({
          rel: 'alternate',
          hrefLang: extraLang,
          href: `${host}/${extraLang}${originalPath}`,
        })),
      ]}
    />
  )
}

const QUERY = graphql`
  query GatsbyMetaData {
    gatsby: site {
      siteMetadata {
        extraLanguages
        defaultLanguage
      }
    }
  }
`
