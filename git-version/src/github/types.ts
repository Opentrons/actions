export type InputName =
  | 'github-token'
  | 'tag-prefix'
  | 'bump'
  | 'prerelease-id'
  | 'snapshot-id'

export type OutputName = 'version'

export interface Commit {
  commit: string
}

export interface Repository {
  owner: string
  repo: string
}

export interface Tag {
  tag: string
}

export interface AncestorTag extends Tag {
  distance: number
}
