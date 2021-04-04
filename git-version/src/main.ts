// action entry point
import { setOutput, setFailed } from './github'
import { getGitVersion } from './getGitVersion'

getGitVersion()
  .then((version) => setOutput('version', version))
  .catch((error: Error) => setFailed(error))
