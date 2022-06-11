import { get, set, createStore } from 'idb-keyval'

const BASE = 'https://api.github.com'

const fetchApi = async (
  token: string,
  path: string,
  queries?: Record<string, string>
) => {
  const url = new URL(path, BASE)
  url.search = new URLSearchParams(queries).toString()
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`
    }
  })
  if (!res.ok) throw new Error('Response was not 200')
  return res
}

const fetchApiJson = async <T = unknown>(
  token: string,
  path: string,
  queries?: Record<string, string>
): Promise<T> => {
  const res = await fetchApi(token, path, queries)
  return await res.json()
}

export interface WorkflowRun {
  id: number
  name: string
  run_attempt: number
}

export const fetchWorkflowList = async (
  token: string,
  owner: string,
  repo: string,
  { branch, status }: { branch?: string; status?: string } = {}
) => {
  const created = new Date()
  created.setDate(created.getDate() - 90) // retention default is 90 days

  return await fetchApiJson<{
    total_count: number
    workflow_runs: WorkflowRun[]
  }>(token, `/repos/${owner}/${repo}/actions/runs`, {
    branch,
    status,
    event: 'push',
    created: `>${created.toISOString()}`,
    per_page: '100'
  })
}

export interface Job {
  id: number
  name: string
  html_url: string
  status: string
  conclusion: string
}

const attemptJobsStore = createStore('pie-tower:attempt-jobs', 'store')

type FetchJobsResponse = { total_count: number; jobs: Job[] }

export const fetchJobs = async (
  token: string,
  owner: string,
  repo: string,
  runId: number,
  attemptNumber: number
) => {
  const key = `${owner}/${repo}:${runId}:${attemptNumber}`
  const cached = await get<FetchJobsResponse>(key, attemptJobsStore)
  if (cached !== undefined) {
    return cached
  }

  const data = await fetchApiJson<FetchJobsResponse>(
    token,
    `/repos/${owner}/${repo}/actions/runs/${runId}/attempts/${attemptNumber}/jobs`,
    {
      per_page: '100'
    }
  )

  await set(key, data, attemptJobsStore)
  return data
}

const jobLogsStore = createStore('pie-tower:job-logs', 'store')

export const fetchJobLog = async (
  token: string,
  owner: string,
  repo: string,
  jobId: number
) => {
  const key = `${owner}/${repo}:${jobId}`
  const cached = await get<string>(key, jobLogsStore)
  if (cached !== undefined) {
    return cached
  }

  let res: Response
  try {
    res = await fetchApi(
      token,
      `/repos/${owner}/${repo}/actions/jobs/${jobId}/logs`
    )
  } catch {
    return ''
  }

  const log = await res.text()

  await set(key, log, jobLogsStore)
  return log
}
