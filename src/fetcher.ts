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

export const fetchAll = async (token: string) => {
  if (token === '') return

  const list = await getWorkflowList(token)
  const failedJobs: Job[] = []
  for (const workflow of list) {
    const result = await getFailedJobs(token, workflow)
    failedJobs.push(...result)
  }

  const data: JobWithLog[] = []
  for (const failedJob of failedJobs) {
    const log = await fetchJobLog(token, 'vitejs', 'vite', failedJob.id)
    data.push({ job: failedJob, log })
  }

  return data
}
