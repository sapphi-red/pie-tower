import {
  fetchJobLog,
  fetchJobs,
  fetchWorkflowList,
  Job,
  WorkflowRun
} from './utils/apis'

const getWorkflowList = async (token: string) => {
  let { workflow_runs: list } = await fetchWorkflowList(
    token,
    'vitejs',
    'vite',
    {
      branch: 'main',
      status: 'failure'
    }
  )
  list = list.filter((workflow) => workflow.name === 'CI')
  return list
}

const getFailedJobs = async (token: string, workflow: WorkflowRun) => {
  const attemptNumbers = Array.from(
    { length: workflow.run_attempt },
    (_, i) => i + 1
  )
  const jobsList = await Promise.all(
    attemptNumbers.map(async (attemptNumber) => {
      const { jobs } = await fetchJobs(
        token,
        'vitejs',
        'vite',
        workflow.id,
        attemptNumber
      )
      return jobs
    })
  )
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
  onProgress: (p: Progress) => void
) => {
  if (token === '') return

  onProgress({
    totalWorkflows: null,
    fetchedWorkflows: 0,
    totalFailedJobs: null,
    fetchedJobLogs: 0
  })
  const list = await getWorkflowList(token)
  onProgress({
    totalWorkflows: list.length,
    fetchedWorkflows: 0,
    totalFailedJobs: null,
    fetchedJobLogs: 0
  })

  const failedJobs: Job[] = []
  for (const [i, workflow] of list.entries()) {
    const result = await getFailedJobs(token, workflow)
    failedJobs.push(...result)

    onProgress({
      totalWorkflows: list.length,
      fetchedWorkflows: i,
      totalFailedJobs: null,
      fetchedJobLogs: 0
    })
  }
  onProgress({
    totalWorkflows: list.length,
    fetchedWorkflows: list.length,
    totalFailedJobs: failedJobs.length,
    fetchedJobLogs: 0
  })

  const data: JobWithLog[] = []
  for (const [i, failedJob] of failedJobs.entries()) {
    const log = await fetchJobLog(token, 'vitejs', 'vite', failedJob.id)
    data.push({ job: failedJob, log })

    onProgress({
      totalWorkflows: list.length,
      fetchedWorkflows: list.length,
      totalFailedJobs: failedJobs.length,
      fetchedJobLogs: i
    })
  }

  return data
}
