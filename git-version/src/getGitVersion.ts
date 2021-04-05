import { log, getInput, getRepository, getCommit, getTagList } from './github'
import { Bump, findAncestorTag, buildVersionString } from './versioning'

export function getGitVersion(): Promise<string> {
  const tagPrefix = getInput('tag-prefix')
  const snapshotId = getInput('snapshot-id')
  const prereleaseId = getInput('prerelease-id')
  const bump = getInput('bump') as Bump
  const repository = getRepository()
  const commit = getCommit()

  log.info(
    `
Calculating version from git:
- Tag prefix: ${tagPrefix}
- Bump: ${bump}
- Repository: ${repository.owner}/${repository.repo}
- Snapshot identifier: ${snapshotId}
- Prerelease identifier: ${prereleaseId}
`.trim()
  )

  return getTagList({ tagPrefix, repository })
    .then((tags) => findAncestorTag({ tags, commit, tagPrefix, repository }))
    .then((ancestor) => {
      const version = buildVersionString({
        ancestor,
        commit,
        bump,
        prereleaseId,
        snapshotId,
      })

      log.info(`Generated version: ${version}`)
      return version
    })
}
