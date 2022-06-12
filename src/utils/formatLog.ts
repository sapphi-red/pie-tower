import stripAnsi from 'strip-ansi'

const removeTimeStamps = (log: string) => {
  return log
    .split('\n')
    .map((line) => line.replace(/^\d+-\d+-\d+T\d+:\d+:\d+\.\d+Z /, ''))
    .join('\n')
}

export const formatLog = (log: string) =>
  removeTimeStamps(stripAnsi(log))
    .replace(/##\[error\]Process completed with exit code 1\..*$/s, '')
    .replace(/^.*Summary of all failing tests/s, '')
    .replace(/^.*FATAL ERROR: /s, 'FATAL ERROR: ')
