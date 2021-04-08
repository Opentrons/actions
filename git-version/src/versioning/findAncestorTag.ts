import { Commit, Repository, Tag, compareTag, log } from '../github'
import { parseTag } from './parseTag'
import { ParsedAncestorTag } from './types'

export interface FindAncestorOptions {
  tagPrefix: string
  tags: Tag[]
  commit: Commit
  repository: Repository
}

export function findAncestorTag(
  options: FindAncestorOptions
): Promise<ParsedAncestorTag | null> {
  const { tagPrefix, tags, commit, repository } = options
  const tagQueue = [...tags]
  const tag = tagQueue.shift()

  if (tag == null) {
    return Promise.resolve(null)
  }

  const semver = parseTag({ tagPrefix, tag })

  if (semver === null) {
    log.warning(
      `Tag ${tag.tag} did not match ${tagPrefix} or could not be parsed. Continuing search.`
    )
    return findAncestorTag({ ...options, tags: tagQueue })
  }

  return compareTag({ tag, commit, repository }).then((result) => {
    if (result == null) {
      return findAncestorTag({ ...options, tags: tagQueue })
    }

    return { ...result, semver }
  })
}
