import { createEffect, createSignal } from 'solid-js'

const useLocalStorage = (key: string, defaultValue: string) => {
  const [value, setValue] = createSignal(
    localStorage.getItem(key) ?? defaultValue
  )

  createEffect((prev) => {
    const now = value()
    if (prev !== now) {
      localStorage.setItem(key, now)
    }
  })
  return [value, setValue] as const
}

export default useLocalStorage
