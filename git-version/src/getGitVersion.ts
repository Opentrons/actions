import { log, getInput, getRepository, getCommit, getTagList } from './github'
import { Bump, findAncestorTag, buildVersionString } from './versioning'

export function getGitVersion(): Promise<string> {
  const tagPrefix = getInput('tag-prefix')
  const snapshotId = getInput('snapshot-id')
  const prereleaseId = getInput('prerelease-id')
  const bump = getInput('bump') as Bump
  const repository = getRepository()
  const commit = getCommit()

  return getTagList({ tagPrefix, repository })
    .then((tags) => {
      log.debug(`Found tags ${JSON.stringify(tags, null, 2)}`)

      return findAncestorTag({ tags, commit, tagPrefix, repository })
    })
    .then((ancestor) => {
      log.debug(`Found ancestor tag ${JSON.stringify(ancestor)}`)

      return buildVersionString({
        ancestor,
        commit,
        bump,
        prereleaseId,
        snapshotId,
      })
    })
}
