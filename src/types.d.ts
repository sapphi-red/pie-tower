import type { AttributifyNames } from 'unocss/preset-attributify'

declare module 'solid-js' {
  namespace JSX {
    interface HTMLAttributes<T>
      extends Partial<Record<AttributifyNames<'w:'>, string>> {}
  }
}
