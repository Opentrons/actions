import { Commit, Repository, Tag, AncestorTag } from './types'
import { log, getOctokit } from './core'

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

  log.debug(`Comparing base ${params.base} to head ${params.head}`)

  return octokit.repos.compareCommits(params).then((response) => {
    const { status, ahead_by: distance } = response.data
    const isAnscestor = status === 'ahead' || status === 'identical'

    log.debug(`Head is ${status}, ahead by ${distance}`)

    return isAnscestor ? { ...tag, distance } : null
  })
}
