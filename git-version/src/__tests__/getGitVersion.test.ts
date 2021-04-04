import { SemVer } from 'semver'
import { when } from 'jest-when'

import {
  Commit,
  Repository,
  Tag,
  getInput,
  getRepository,
  getCommit,
  getTagList,
} from '../github'

import {
  ParsedAncestorTag,
  findAncestorTag,
  buildVersionString,
} from '../versioning'

import { getGitVersion } from '../getGitVersion'

jest.mock('../github')
jest.mock('../versioning')

const REPOSITORY: Repository = {
  owner: 'owner-name',
  repo: 'repo-name',
}

const COMMIT: Commit = {
  commit: 'abc123',
}

const TAG_LIST: Tag[] = [
  { tag: 'v1.2.3' },
  { tag: 'v4.5.6' },
  { tag: 'v7.8.9' },
]

const ANCESTOR_TAG: ParsedAncestorTag = {
  tag: 'v4.5.6',
  distance: 42,
  semver: new SemVer('v4.5.6'),
}

describe('get git version', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should get the list of tags, find the closest ancestor, and increment it', async () => {
    when(getInput).calledWith('tag-prefix').mockReturnValue('v')
    when(getInput).calledWith('bump').mockReturnValue('preminor')
    when(getInput).calledWith('prerelease-id').mockReturnValue('alpha')
    when(getInput).calledWith('snapshot-id').mockReturnValue('dev')
    when(getCommit).calledWith().mockReturnValue(COMMIT)
    when(getRepository).calledWith().mockReturnValue(REPOSITORY)

    when(getTagList)
      .calledWith({ tagPrefix: 'v', repository: REPOSITORY })
      .mockResolvedValue(TAG_LIST)

    when(findAncestorTag)
      .calledWith({
        tagPrefix: 'v',
        tags: TAG_LIST,
        commit: COMMIT,
        repository: REPOSITORY,
      })
      .mockResolvedValue(ANCESTOR_TAG)

    when(buildVersionString)
      .calledWith({
        ancestor: ANCESTOR_TAG,
        commit: COMMIT,
        bump: 'preminor',
        prereleaseId: 'alpha',
        snapshotId: 'dev',
      })
      .mockReturnValue('v0.0.0')

    const version = await getGitVersion()

    expect(version).toBe('v0.0.0')
  })
})
