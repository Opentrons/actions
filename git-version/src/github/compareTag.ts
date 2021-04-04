import { Commit, Repository, Tag, AncestorTag } from './types'
import { getOctokit } from './core'

export interface CompareTagOptions {
  tag: Tag
  commit: Commit
  repository: Repository
}

export function compareTag(
  options: CompareTagOptions
): Promise<AncestorTag | null> {
  const { tag, commit, repository } = options
  const params = { ...repository, base: tag.tag, head: commit.commit }
  const octokit = getOctokit()

  return octokit.repos.compareCommits(params).then((response) => {
    const { status, ahead_by: distance } = response.data
    const isAnscestor = status === 'ahead' || status === 'identical'

    return isAnscestor ? { ...tag, distance } : null
  })
}
