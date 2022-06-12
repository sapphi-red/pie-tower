import { Component, JSX } from 'solid-js'

const TextInput: Component<
  {
    label: string
  } & JSX.InputHTMLAttributes<HTMLInputElement>
> = (props) => {
  return (
    <label>
      <span>{props.label}</span>
      <input w:bg="bg-tertiary" w:p="x-2 y-1" w:border="rounded" {...props} />
    </label>
  )
}

export default TextInput
