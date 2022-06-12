import {
  Component,
  createMemo,
  createResource,
  createSignal,
  For,
  Show
} from 'solid-js'
import TextInput from './components/TextInput'
import { fetchAll, Progress } from './fetcher'
import Job from './components/Job'
import TokenInput from './components/TokenInput'
import createLocalStorageSignal from './createLocalStorageSignal'
import { formatLog } from './utils/formatLog'

const App: Component = () => {
  const [repository, setRepository] = createLocalStorageSignal(
    'pie-tower:repository',
    'vitejs/vite'
  )
  const owner = createMemo(() => repository().split('/')[0] ?? '')
  const repo = createMemo(() => repository().split('/')[1] ?? '')
  const [branch, setBranch] = createLocalStorageSignal('pie-tower:branch', 'main')

  const [token, setToken] = createLocalStorageSignal('pie-tower:github-token', '')

  const [progress, setProgress] = createSignal<Progress>()
  const [dataOrError, { refetch }] = createResource(async () => {
    try {
      const retentionDays = 90 // retention default is 90 days

      return {
        value: await fetchAll(
          token(),
          owner(),
          repo(),
          branch(),
          retentionDays,
          setProgress
        )
      } as const
    } catch (e) {
      return { error: e } as const
    } finally {
      setProgress(undefined)
    }
  })

  const [exclude, setExclude] = createSignal('')

  const formattedData = createMemo(() => {
    const data = dataOrError()?.value ?? []
    return data.map((job) => ({ ...job, log: formatLog(job.log) }))
  })

  const filteredData = createMemo(() => {
    const data = formattedData()
    if (exclude() === '') return data
    const regex = new RegExp(exclude())
    return data.filter((job) => !regex.test(job.log))
  })

  return (
    <>
      <section w:m="y-4">
        <TextInput
          label="Repository: "
          type="text"
          value={repository()}
          onChange={(e) => {
            const value = e.currentTarget.value
            if (/^[\w-]+\/[\w-]+$/.test(value)) {
              setRepository(value)
            }
          }}
        />
        <TextInput
          label="Branch: "
          type="text"
          value={branch()}
          onChange={(e) => setBranch(e.currentTarget.value)}
        />
        <TokenInput
          token={token()}
          onTokenChange={setToken}
          readOnly={dataOrError.loading}
        />
        <button
          w:bg="bg-secondary"
          w:p="1"
          w:m="r-1"
          w:border="rounded"
          onClick={refetch}
        >
          fetch
        </button>
      </section>
      <section w:m="y-4">
        <TextInput
          label="Exclude: "
          type="text"
          value={exclude()}
          onChange={(e) => setExclude(e.currentTarget.value)}
        />
      </section>
      <section w:m="y-4">
        <Show when={dataOrError.loading}>
          Loading... ({JSON.stringify(progress())})
        </Show>
        <Show
          when={dataOrError() && dataOrError().error === undefined}
          fallback={dataOrError()?.error}
        >
          <For each={filteredData()}>{(job) => <Job job={job} />}</For>
        </Show>
      </section>
    </>
  )
}

export default App
