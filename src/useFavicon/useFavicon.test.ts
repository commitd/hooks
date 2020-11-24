import { renderHook } from '@testing-library/react-hooks'
import { useFavicon } from '.'

const getLink = () =>
  document.head.querySelector("link[rel*='icon']") as HTMLLinkElement

function expectLink(href: string, type: string) {
  const link = getLink()
  expect(link?.getAttribute('href')).toEqual(href)
  expect(link?.getAttribute('type')).toEqual(type)
  expect(link?.getAttribute('rel')).toContain('icon')
}

function setupWithLink() {
  const link = getLink() ?? document.createElement('link')
  link.type = 'image/type'
  link.href = 'before'
  link.rel = 'icon'
  document.getElementsByTagName('head')[0].appendChild(link)
  expectLink('before', 'image/type')
}
function setupWithoutLink() {
  document
    .querySelectorAll("link[rel*='icon']")
    .forEach((link) => link.remove())
  expect(getLink()).toBeNull()
}

test('Should Set the favicon when mounted', () => {
  renderHook(() => useFavicon('test.gif'))
  expectLink('test.gif', 'image/gif')
})

test('Should map icon type', () => {
  renderHook(() => useFavicon('http://test.ico'))
  expectLink('http://test.ico', 'image/x-icon')
})

test('Should restore the favicon when unmounted', () => {
  setupWithLink()

  const { unmount } = renderHook(() => useFavicon('http://test.jpeg'))
  expectLink('http://test.jpeg', 'image/jpeg')

  unmount()

  expectLink('before', 'image/type')
})

test('Should restore to null if changed independently', () => {
  setupWithoutLink()
  const { unmount } = renderHook(() => useFavicon('http://test.jpeg'))
  expectLink('http://test.jpeg', 'image/jpeg')
  document.querySelector("link[rel*='icon']")?.remove()

  unmount()

  expect(getLink()).toBeNull()
})

test('Should restore to null when unmounted if none was present', () => {
  setupWithoutLink()

  const { unmount } = renderHook(() => useFavicon('https://test.jpg'))
  expectLink('https://test.jpg', 'image/jpeg')

  unmount()

  expect(getLink()).toBeNull()
})

test('Should not restore the favicon when unmounted if retain `true`', () => {
  setupWithoutLink()

  const { unmount } = renderHook(() =>
    useFavicon('https://test.test.jpg', { retain: true })
  )
  expectLink('https://test.test.jpg', 'image/jpeg')

  unmount()

  expectLink('https://test.test.jpg', 'image/jpeg')
})

test('Should not restore the favicon when retain `true` even if was set', () => {
  setupWithLink()

  const { unmount } = renderHook(() =>
    useFavicon('/test.SVG', { retain: true })
  )
  expectLink('/test.SVG', 'image/svg+xml')

  unmount()

  expectLink('/test.SVG', 'image/svg+xml')
})

describe('with log spy', () => {
  let spy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>

  beforeEach(() => {
    spy = jest.spyOn(console, 'warn').mockImplementation()
  })

  afterEach(() => {
    spy.mockRestore()
  })

  test('Should log if unrecognized image type', () => {
    setupWithLink()
    renderHook(() => useFavicon('/test.123'))
    expectLink('before', 'image/type')
    expect(console.warn).toHaveBeenCalledTimes(1)
  })

  test('Should not log unrecognized image type in production', () => {
    const previousEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    try {
      setupWithLink()
      renderHook(() => useFavicon('/test'))
      expectLink('before', 'image/type')
      expect(console.warn).toHaveBeenCalledTimes(0)
    } finally {
      process.env.NODE_ENV = previousEnv
    }
  })

  test('Should not throw with incorrect inputs', () => {
    renderHook(() => useFavicon(''))
    renderHook(() => useFavicon('/test'))
    renderHook(() => useFavicon('/test.'))
    renderHook(() => useFavicon('/test.test.test.test'))
  })
})
