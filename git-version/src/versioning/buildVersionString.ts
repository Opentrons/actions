import incrementSemver from 'semver/functions/inc'
import { Commit } from '../github'
import { ParsedAncestorTag, Bump } from './types'

export interface BuildVersionOptions {
  ancestor: ParsedAncestorTag | null
  commit: Commit
  bump: Bump
  prereleaseId: string
  snapshotId: string
}

export function buildVersionString(options: BuildVersionOptions): string {
  const { ancestor, commit, prereleaseId, snapshotId } = options
  const shortSha = commit.commit.slice(0, 7)

  if (ancestor === null) {
    return `0.0.0-${snapshotId}+${shortSha}`
  }

  if (ancestor.distance === 0) {
    return ancestor.semver.version
  }

  const { semver, distance } = ancestor
  const prevIsPrerelease = semver.prerelease.length > 0
  const bump = prevIsPrerelease ? 'prerelease' : options.bump
  const nextIsPrerelease = bump.startsWith('pre')

  const nextVersion = incrementSemver(semver, bump, prereleaseId) as string
  const dotOrDash = nextIsPrerelease ? '.' : '-'
  const snapshotPostfix = `${snapshotId}.${distance}+${shortSha}`

  return `${nextVersion}${dotOrDash}${snapshotPostfix}`
}
