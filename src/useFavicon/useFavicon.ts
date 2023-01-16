import { useLayoutEffect, useRef } from 'react'

const ImageTypes = {
  gif: 'image/gif',
  ico: 'image/x-icon',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
}

type ImageType = keyof typeof ImageTypes
interface FavData {
  type: string | null
  href: string | null
}

function getFavIcon(document: Document): FavData | null {
  const link = document.querySelector("link[rel*='icon']")

  if (link !== null) {
    return {
      type: link.getAttribute('type'),
      href: link.getAttribute('href'),
    }
  } else {
    return null
  }
}

function setFavIcon(document: Document, data: FavData | null) {
  if (data === null || data.href === null || data.type === null) {
    document.querySelector("link[rel*='icon']")?.remove()
  } else {
    const link: HTMLLinkElement =
      document.querySelector("link[rel*='icon']") ??
      document.createElement('link')

    link.type = data.type
    link.href = data.href
    link.rel = 'shortcut icon'

    document.getElementsByTagName('head')[0].appendChild(link)
  }
}

function isImageType(input: string | undefined): input is ImageType {
  return input !== undefined && Object.keys(ImageTypes).includes(input)
}

export interface FaviconOptions {
  /** Set true to keep the favicon even after the component has unmounted */
  retain?: boolean
}

const DEFAULT_OPTIONS = {
  retain: false,
}

/**
 * useFavicon changes (or creates) the favicon for the given href.
 *
 * @param href The url of the favicon
 */
export function useFavicon(href: string, options: FaviconOptions = {}): void {
  const originalRef = useRef(getFavIcon(document))
  const { retain = DEFAULT_OPTIONS.retain } = options

  useLayoutEffect(() => {
    originalRef.current = getFavIcon(document)
    if (!retain) {
      return () => {
        setFavIcon(document, originalRef.current)
      }
    } else {
      return
    }
  }, [retain])

  useLayoutEffect(() => {
    const imageType = href.toLowerCase().split('.').pop()
    if (isImageType(imageType)) {
      const type = ImageTypes[imageType]
      setFavIcon(document, { type, href })
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Unrecognised image type href: ${href}`)
      }
    }
  }, [href])
}
