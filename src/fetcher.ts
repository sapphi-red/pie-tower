import {
  fetchJobLog,
  fetchJobs,
  fetchWorkflowList,
  Job,
  WorkflowRun
} from './utils/apis'
import pMap from 'p-map'

const getWorkflowList = async (
  token: string,
  owner: string,
  repo: string,
  branch: string,
  retentionDays: number
) => {
  const created = new Date()
  created.setDate(created.getDate() - retentionDays)

  let { workflow_runs: list } = await fetchWorkflowList(token, owner, repo, {
    branch: branch,
    status: 'failure',
    event: 'push',
    created: `>${created.toISOString()}`
  })
  list = list.filter((workflow) => workflow.name === 'CI')
  return list
}

const getFailedJobs = async (
  token: string,
  owner: string,
  repo: string,
  workflow: WorkflowRun
) => {
  const attemptNumbers = Array.from(
    { length: workflow.run_attempt },
    (_, i) => i + 1
  )
  const jobsList = await pMap(attemptNumbers, async (attemptNumber) => {
    const { jobs } = await fetchJobs(
      token,
      owner,
      repo,
      workflow.id,
      attemptNumber
    )
    return jobs
  })
  const failedJobs = jobsList
    .flatMap((jobs) => jobs)
    .filter((job) => job.conclusion === 'failure')
  return failedJobs
}

export type JobWithLog = {
  job: Job
  log: string
}

export type Progress = {
  totalWorkflows: number | null
  fetchedWorkflows: number
  totalFailedJobs: number | null
  fetchedJobLogs: number
}

export const fetchAll = async (
  token: string,
  owner: string,
  repo: string,
  branch: string,
  retentionDays: number,
  onProgress: (p: Progress) => void
) => {
  if (token === '') return

  onProgress({
    totalWorkflows: null,
    fetchedWorkflows: 0,
    totalFailedJobs: null,
    fetchedJobLogs: 0
  })
  const list = await getWorkflowList(token, owner, repo, branch, retentionDays)
  onProgress({
    totalWorkflows: list.length,
    fetchedWorkflows: 0,
    totalFailedJobs: null,
    fetchedJobLogs: 0
  })

  let fetchedWorkflows = 0
  const failedJobs = (
    await pMap(list, async (workflow) => {
      const result = await getFailedJobs(token, owner, repo, workflow)
      fetchedWorkflows++
      onProgress({
        totalWorkflows: list.length,
        fetchedWorkflows,
        totalFailedJobs: null,
        fetchedJobLogs: 0
      })
      return result
    })
  ).flat()
  onProgress({
    totalWorkflows: list.length,
    fetchedWorkflows: list.length,
    totalFailedJobs: failedJobs.length,
    fetchedJobLogs: 0
  })

  let fetchedJobLogs = 0
  const data = await pMap(failedJobs, async (failedJob) => {
    const log = await fetchJobLog(token, owner, repo, failedJob.id)
    fetchedJobLogs++
    onProgress({
      totalWorkflows: list.length,
      fetchedWorkflows: list.length,
      totalFailedJobs: failedJobs.length,
      fetchedJobLogs
    })
    return { job: failedJob, log }
  })

  return data
}
