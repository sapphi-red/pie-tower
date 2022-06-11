import { Component, createMemo, onMount } from 'solid-js'
import { JobWithLog } from './fetcher'
import stripAnsi from 'strip-ansi'

const removeTimeStamps = (log: string) => {
  return log
    .split('\n')
    .map((line) => line.replace(/^\d+-\d+-\d+T\d+:\d+:\d+\.\d+Z /, ''))
    .join('\n')
}

const Job: Component<{ job: JobWithLog }> = (props) => {
  const formattedLog = createMemo(() =>
    removeTimeStamps(
      stripAnsi(props.job.log).replace(
        /##\[error\]Process completed with exit code 1\..*$/s,
        ''
      )
    )
  )

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
      <pre ref={preRef} class="max-h-80 overflow-y-auto">
        <code>{formattedLog}</code>
      </pre>
    </div>
  )
}

export default Job
