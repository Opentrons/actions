import type { SemVer, ReleaseType as Bump } from 'semver'
import type { AncestorTag } from '../github'

export interface ParsedAncestorTag extends AncestorTag {
  semver: SemVer
}

export type { Bump, SemVer }
