import { Component, JSX } from 'solid-js'

const TokenInput: Component<
  {
    token: string
    onTokenChange: (val: string) => void
  } & Omit<
    JSX.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'autocomplete' | 'placeholder' | 'value' | 'onChange'
  >
> = (props) => {
  return (
    <input
      w:bg="bg-tertiary"
      w:p="x-2 y-1"
      w:border="rounded"
      {...props}
      type="password"
      autocomplete="off"
      placeholder="GitHub Token"
      value={props.token}
      onChange={(e) => props.onTokenChange(e.currentTarget.value)}
    ></input>
  )
}

export default TokenInput
