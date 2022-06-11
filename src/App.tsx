import { Component, createResource, For } from 'solid-js'
import { fetchAll } from './fetcher'
import Job from './Job'
import TokenInput from './TokenInput'
import useLocalStorage from './useLocalStorage'

const App: Component = () => {
  const [token, setToken] = useLocalStorage('pie-tower:github-token', '')
  const [data, { refetch }] = createResource(token, fetchAll)

  return (
    <>
      <button onClick={refetch}>fetch</button>
      <TokenInput token={token()} onTokenChange={setToken} />
      <For each={data()}>{(job) => <Job job={job} />}</For>
    </>
  )
}

export default App
