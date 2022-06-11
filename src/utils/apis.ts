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
  return await fetchApiJson<{
    total_count: number
    workflow_runs: WorkflowRun[]
  }>(token, `/repos/${owner}/${repo}/actions/runs`, {
    branch,
    status,
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

export const fetchJobs = async (
  token: string,
  owner: string,
  repo: string,
  runId: number,
  attemptNumber: number
) => {
  return await fetchApiJson<{ total_count: number; jobs: Job[] }>(
    token,
    `/repos/${owner}/${repo}/actions/runs/${runId}/attempts/${attemptNumber}/jobs`,
    {
      per_page: '100'
    }
  )
}

export const fetchJobLog = async (
  token: string,
  owner: string,
  repo: string,
  jobId: number
) => {
  const res = await fetchApi(
    token,
    `/repos/${owner}/${repo}/actions/jobs/${jobId}/logs`
  )
  const log = await res.text()
  return log
}
