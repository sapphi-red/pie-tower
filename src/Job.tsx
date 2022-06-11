import { Component, createMemo, onMount } from 'solid-js'
import { JobWithLog } from './fetcher'
import stripAnsi from 'strip-ansi'

const Job: Component<{ job: JobWithLog }> = (props) => {
  const formattedLog = createMemo(() =>
    stripAnsi(props.job.log).replace(
      /##\[error\]Process completed with exit code 1\..*$/s,
      ''
    )
  )

  let preRef: HTMLPreElement | undefined
  onMount(() => {
    preRef.scrollTop = preRef.scrollHeight
  })

  return (
    <div>
      <a href={props.job.job.html_url} target="_blank" rel="noopener">
        {props.job.job.name}
      </a>
      <pre ref={preRef} class="max-h-80 overflow-y-auto">
        <code>{formattedLog}</code>
      </pre>
    </div>
  )
}

export default Job
