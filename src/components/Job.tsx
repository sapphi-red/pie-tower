import { Component, onMount } from 'solid-js'
import { JobWithLog } from '../fetcher'

const Job: Component<{ job: JobWithLog }> = (props) => {
  let preRef: HTMLPreElement | undefined
  onMount(() => {
    preRef.scrollTop = preRef.scrollHeight
  })

  return (
    <div w:bg="bg-tertiary" w:p="4" w:m="y-4" w:border="rounded">
      <a
        class="block"
        w:m="b-2"
        href={props.job.job.html_url}
        target="_blank"
        rel="noopener"
      >
        <h2 w:text="lg" w:font="bold">
          {props.job.job.name}
        </h2>
      </a>
      <pre ref={preRef} class="max-h-120 overflow-y-auto">
        <code>{props.job.log}</code>
      </pre>
    </div>
  )
}

export default Job
