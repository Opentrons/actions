import { getInput, getRepository, getCommit, getTagList } from './github'
import { Bump, findAncestorTag, buildVersionString } from './versioning'

export function getGitVersion(): Promise<string> {
  const tagPrefix = getInput('tag-prefix')
  const prereleaseId = getInput('prerelease-id')
  const snapshotId = getInput('snapshot-id')
  const bump = getInput('bump') as Bump
  const repository = getRepository()
  const commit = getCommit()

  return getTagList({ tagPrefix, repository })
    .then((tags) => findAncestorTag({ tags, commit, tagPrefix, repository }))
    .then((ancestor) => {
      return buildVersionString({
        ancestor,
        commit,
        bump,
        prereleaseId,
        snapshotId,
      })
    })
}
