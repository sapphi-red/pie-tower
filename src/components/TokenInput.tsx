import { Component, JSX } from 'solid-js'
import TextInput from './TextInput'

const TokenInput: Component<
  {
    token: string
    onTokenChange: (val: string) => void
  } & Omit<
    JSX.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'autocomplete' | 'value' | 'onChange'
  >
> = (props) => {
  return (
    <TextInput
      label="GitHub Token: "
      type="password"
      autocomplete="off"
      value={props.token}
      onChange={(e) => props.onTokenChange(e.currentTarget.value)}
    />
  )
}

export default TokenInput
