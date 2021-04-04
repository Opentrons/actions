import parseSemver from 'semver/functions/parse'

import { Tag } from '../github'
import { SemVer } from './types'

export interface ParseTagOptions {
  tag: Tag
  tagPrefix: string
}

export function parseTag(options: ParseTagOptions): SemVer | null {
  const { tag, tagPrefix } = options
  const semver = parseSemver(tag.tag, { includePrerelease: true })

  if (!tag.tag.startsWith(tagPrefix) || semver === null) {
    return null
  }

  return semver
}
