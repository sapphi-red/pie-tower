import { Component, createResource, createSignal, For, Show } from 'solid-js'
import { fetchAll, Progress } from './fetcher'
import Job from './Job'
import TokenInput from './TokenInput'
import useLocalStorage from './useLocalStorage'

const App: Component = () => {
  const [token, setToken] = useLocalStorage('pie-tower:github-token', '')

  const [progress, setProgress] = createSignal<Progress>()
  const [dataOrError, { refetch }] = createResource(async () => {
    try {
      return { value: await fetchAll(token(), setProgress) } as const
    } catch (e) {
      return { error: e } as const
    } finally {
      setProgress(undefined)
    }
  })

  return (
    <>
      <section w:m="y-4">
        <button
          w:bg="bg-secondary"
          w:p="1"
          w:m="r-1"
          w:border="rounded"
          onClick={refetch}
        >
          fetch
        </button>
        <TokenInput
          token={token()}
          onTokenChange={setToken}
          readOnly={dataOrError.loading}
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
          <For each={dataOrError().value}>{(job) => <Job job={job} />}</For>
        </Show>
      </section>
    </>
  )
}

export default App
