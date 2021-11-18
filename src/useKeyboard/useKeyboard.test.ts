import { renderHook } from '@testing-library/react-hooks'
import { useKeyboard } from '.'
import { fireEvent } from '../setupTests'

const letters = 'abcdefghijklmnopqrstuvwxyz'
const characters = letters + '0123456789'

function random(fromString: string): string {
  // NOSONAR random here is fine
  return fromString.charAt(Math.floor(Math.random() * fromString.length))
}
const randomLetter = () => random(letters)
const randomCharacter = () => random(characters)

interface KeyEvent {
  key?: string
  altKey?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
}

function createEvent({
  key = 'a',
  altKey = false,
  ctrlKey = false,
  shiftKey = false,
  metaKey = false,
}) {
  const event = new KeyboardEvent('keydown', {
    key,
    altKey,
    ctrlKey,
    shiftKey,
    metaKey,
  })
  jest.spyOn(event, 'getModifierState').mockImplementation((modifier) => {
    switch (modifier) {
      case 'Meta':
        return metaKey
      case 'Alt':
        return altKey
      case 'Control':
        return ctrlKey
      case 'Shift':
        return shiftKey
      case 'Meta':
        return metaKey
    }
    return false
  })
  return event
}

function expectKeyToCallTimes(
  events: (e: KeyboardEvent) => void,
  event: KeyEvent,
  callback: jest.Mock<any, any>,
  times: number
) {
  events(createEvent(event))
  expect(callback).toHaveBeenCalledTimes(times)
}

test('Should callback when any keydown', () => {
  const callback = jest.fn()
  renderHook(() => useKeyboard('', callback))

  fireEvent.keyDown(window, { key: randomCharacter() })
  expect(callback).toHaveBeenCalledTimes(1)
  fireEvent.keyUp(window, { key: randomCharacter() })
  expect(callback).toHaveBeenCalledTimes(1)
})

test('Should not callback when development set and in production', () => {
  const previousEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  try {
    const callback = jest.fn()
    renderHook(() => useKeyboard('', callback, { development: true }))

    fireEvent.keyDown(window, { key: randomCharacter() })
    expect(callback).toHaveBeenCalledTimes(0)
    fireEvent.keyUp(window, { key: randomCharacter() })
    expect(callback).toHaveBeenCalledTimes(0)
  } finally {
    process.env.NODE_ENV = previousEnv
  }
})

test('Should callback when any keyup', () => {
  const callback = jest.fn()
  renderHook(() => useKeyboard('', callback, { event: 'keyup' }))

  fireEvent.keyDown(window, { key: randomCharacter() })
  expect(callback).toHaveBeenCalledTimes(0)
  fireEvent.keyUp(window, { key: randomCharacter() })
  expect(callback).toHaveBeenCalledTimes(1)
})

test('Should callback when key repeats, by default', () => {
  const callback = jest.fn()
  const character = randomCharacter()
  renderHook(() => useKeyboard(character, callback))

  fireEvent.keyDown(window, { key: character })
  expect(callback).toHaveBeenCalledTimes(1)
  fireEvent.keyDown(window, { key: character, repeat: true })
  expect(callback).toHaveBeenCalledTimes(2)
})

test('Should not callback when key repeats, if specified', () => {
  const callback = jest.fn()
  const character = randomCharacter()
  renderHook(() => useKeyboard(character, callback, { ignoreRepeat: true }))

  fireEvent.keyDown(window, { key: character })
  expect(callback).toHaveBeenCalledTimes(1)
  fireEvent.keyDown(window, { key: character, repeat: true })
  expect(callback).toHaveBeenCalledTimes(1)
})

test('Should callback when character key pressed', () => {
  const callback = jest.fn()
  const character = randomCharacter()
  renderHook(() => useKeyboard(character, callback))

  fireEvent.keyDown(window, { key: 'Alt' })
  expect(callback).toHaveBeenCalledTimes(0)
  fireEvent.keyDown(window, { key: character })
  expect(callback).toHaveBeenCalledTimes(1)
})

test('Tries `KeyA` by default', () => {
  const callback = jest.fn()
  renderHook(() => useKeyboard('a', callback))

  fireEvent.keyDown(window, { code: 'KeyA' })
  expect(callback).toHaveBeenCalledTimes(1)
})

test('Ignore `KeyA` when specified', () => {
  const callback = jest.fn()
  renderHook(() => useKeyboard('a', callback, { ignoreKey: true }))

  fireEvent.keyDown(window, { code: 'KeyA' })
  expect(callback).toHaveBeenCalledTimes(0)
})

test('Should callback when key `a` or `s` pressed', () => {
  const callback = jest.fn()
  renderHook(() => useKeyboard(['a', 's'], callback))

  fireEvent.keyDown(window, { key: 'b' })
  expect(callback).toHaveBeenCalledTimes(0)
  fireEvent.keyDown(window, { key: 'a' })
  expect(callback).toHaveBeenCalledTimes(1)
  fireEvent.keyDown(window, { key: 's' })
  expect(callback).toHaveBeenCalledTimes(2)
})

test('Should still work if callback `null`', () => {
  renderHook(() => useKeyboard('a', null))
  fireEvent.keyDown(window, { key: 'b' })
  fireEvent.keyDown(window, { key: 'a' })
  fireEvent.keyDown(window, { key: 's' })
})

test('Should be able to provide your own filter', () => {
  const callback = jest.fn()
  renderHook(() => useKeyboard((e) => e.key === 'UpArrow', callback))

  fireEvent.keyDown(window, { key: 'b' })
  expect(callback).toHaveBeenCalledTimes(0)
  fireEvent.keyDown(window, { key: 'UpArrow' })
  expect(callback).toHaveBeenCalledTimes(1)
  fireEvent.keyDown(window, { key: 's' })
  expect(callback).toHaveBeenCalledTimes(1)
})

test('Should be case sensitive', () => {
  const callback = jest.fn()
  const letter = randomLetter()
  renderHook(() => useKeyboard(letter, callback))

  fireEvent.keyDown(window, { key: letter.toLowerCase() })
  fireEvent.keyDown(window, { key: letter.toUpperCase() })
  expect(callback).toHaveBeenCalledTimes(1)
})

test('Should alias `space` to ` `', () => {
  const callback = jest.fn()
  renderHook(() => useKeyboard(' ', callback))

  fireEvent.keyDown(window, { key: ' ' })
  expect(callback).toHaveBeenCalledTimes(1)
})

test('Should work with none aliased lowercase check e.g. `delete`', () => {
  const callback = jest.fn()
  renderHook(() => useKeyboard('delete', callback))

  fireEvent.keyDown(window, { key: 'Delete' })
  expect(callback).toHaveBeenCalledTimes(1)
})

// modifiers don't work with fireEvent so mocking
describe('Requires modifier', () => {
  let events: (e: KeyboardEvent) => void = () => {}
  beforeEach(() => {
    jest.spyOn(window, 'addEventListener').mockImplementation((__event, cb) => {
      events = cb as EventListener
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('Should alias `plus` to `+`', () => {
    const callback = jest.fn()
    renderHook(() => useKeyboard('shift+plus', callback))

    expectKeyToCallTimes(events, { key: '+', shiftKey: true }, callback, 1)
  })

  test('Uppercase matched with `shift`', () => {
    const callback = jest.fn()
    const letter = randomLetter()
    renderHook(() => useKeyboard('shift+' + letter, callback))

    expectKeyToCallTimes(events, { key: letter, shiftKey: true }, callback, 1)

    // not matched just with lowercase letter
    expectKeyToCallTimes(events, { key: letter }, callback, 1)
  })

  test('Check cases for filter `meta` ', () => {
    const callback = jest.fn()
    renderHook(() => useKeyboard('meta', callback))
    expectKeyToCallTimes(events, { key: 'a' }, callback, 0)
    expectKeyToCallTimes(events, { key: 'a', metaKey: true }, callback, 0)
    expectKeyToCallTimes(
      events,
      { key: 'a', metaKey: true, altKey: true },
      callback,
      0
    )
    expectKeyToCallTimes(events, { key: 'Meta', metaKey: true }, callback, 1)
  })

  test('Check cases for filter `key`', () => {
    const callback = jest.fn()
    renderHook(() => useKeyboard('a', callback))
    expectKeyToCallTimes(events, { key: 'a' }, callback, 1)
    expectKeyToCallTimes(events, { key: 'a', metaKey: true }, callback, 1)
    expectKeyToCallTimes(
      events,
      { key: 'a', metaKey: true, altKey: true },
      callback,
      1
    )
  })

  test('Check cases for filter `key+meta`', () => {
    const callback = jest.fn()
    renderHook(() => useKeyboard('meta+a', callback))
    expectKeyToCallTimes(events, { key: 'a' }, callback, 0)
    expectKeyToCallTimes(events, { key: 'a', metaKey: true }, callback, 1)
    expectKeyToCallTimes(
      events,
      { key: 'a', metaKey: true, altKey: true },
      callback,
      1
    )
  })

  test('Check cases for filter `alt+meta+k`', () => {
    const callback = jest.fn()
    renderHook(() => useKeyboard('alt+meta+a', callback))
    expectKeyToCallTimes(events, { key: 'a' }, callback, 0)
    expectKeyToCallTimes(events, { key: 'a', metaKey: true }, callback, 0)
    expectKeyToCallTimes(
      events,
      { key: 'a', metaKey: true, altKey: true },
      callback,
      1
    )
  })
})
