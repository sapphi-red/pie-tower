import { AttributifyNames } from 'windicss/types/jsx'

declare module 'solid-js' {
  namespace JSX {
    interface HTMLAttributes<T>
      extends Partial<Record<AttributifyNames<'w:'>, string>> {}
  }
}
