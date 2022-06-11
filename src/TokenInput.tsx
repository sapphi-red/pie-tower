import { Component } from 'solid-js'

const TokenInput: Component<{ token: string; onTokenChange }> = (props) => {
  return (
    <input
      type="password"
      autocomplete="off"
      value={props.token}
      onChange={(e) => props.onTokenChange(e.currentTarget.value)}
    ></input>
  )
}

export default TokenInput
