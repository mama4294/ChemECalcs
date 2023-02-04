import Head from 'next/head'

type MetadataProps = {
  title: string
  description: string
  keywords?: string
  image?: string
}

export const Metadata = ({ title, description, keywords, image }: MetadataProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="title" />
        <meta name="description" content={description}></meta>
        <link rel="icon" href="/favicon.ico" />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow"></meta>
        <meta name="author" content="Matthew Malone" />
        <meta name="language" content="English"></meta>
        <meta property="og:image" content={image || '/homeImage.png'} />
        <meta property="twitter:image" content={image || '/homeImage.png'} />
      </Head>
    </>
  )
}
