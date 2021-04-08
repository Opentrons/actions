// action entry point
import { log, setOutput, setFailed } from './github'
import { getGitVersion } from './getGitVersion'

getGitVersion()
  .then((version) => {
    log.info(`Generated version: ${version}`)
    setOutput('version', version)
  })
  .catch((error: Error) => setFailed(error))
