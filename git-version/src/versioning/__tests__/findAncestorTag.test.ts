import { SemVer } from 'semver'
import { when } from 'jest-when'

import { Commit, Repository, Tag, AncestorTag, compareTag } from '../../github'
import { parseTag } from '../parseTag'
import { findAncestorTag } from '../findAncestorTag'

jest.mock('../../github')
jest.mock('../parseTag')

const REPOSITORY: Repository = {
  owner: 'owner-name',
  repo: 'repo-name',
}

const COMMIT: Commit = {
  commit: 'abc123',
}

const TAG_LIST: Tag[] = [
  { tag: 'v7.8.9' },
  { tag: 'v4.5.6' },
  { tag: 'v1.2.3' },
]

const ANCESTOR_123: AncestorTag = {
  tag: 'v1.2.3',
  distance: 2,
}

const ANCESTOR_456: AncestorTag = {
  tag: 'v4.5.6',
  distance: 4,
}

describe('find ancestor tag', () => {
  beforeEach(() => {
    when(parseTag)
      .calledWith({ tagPrefix: 'v', tag: TAG_LIST[0] })
      .mockReturnValue(new SemVer('v1.2.3'))

    when(parseTag)
      .calledWith({ tagPrefix: 'v', tag: TAG_LIST[1] })
      .mockReturnValue(new SemVer('v4.5.6'))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should compare tags until it finds a match', async () => {
    when(compareTag)
      .calledWith({ tag: TAG_LIST[0], repository: REPOSITORY, commit: COMMIT })
      .mockResolvedValue(null)

    when(compareTag)
      .calledWith({ tag: TAG_LIST[1], repository: REPOSITORY, commit: COMMIT })
      .mockResolvedValue(ANCESTOR_456)

    const ancestor = await findAncestorTag({
      tagPrefix: 'v',
      tags: TAG_LIST,
      repository: REPOSITORY,
      commit: COMMIT,
    })

    expect(ancestor).toEqual({ ...ANCESTOR_456, semver: new SemVer('v4.5.6') })
  })

  it('should return the first match that parses', async () => {
    when(compareTag)
      .calledWith({ tag: TAG_LIST[0], repository: REPOSITORY, commit: COMMIT })
      .mockResolvedValue(ANCESTOR_123)

    when(compareTag)
      .calledWith({ tag: TAG_LIST[1], repository: REPOSITORY, commit: COMMIT })
      .mockResolvedValue(ANCESTOR_456)

    when(parseTag)
      .calledWith({ tagPrefix: 'v', tag: TAG_LIST[0] })
      .mockReturnValue(null)

    const ancestor = await findAncestorTag({
      tagPrefix: 'v',
      tags: TAG_LIST,
      repository: REPOSITORY,
      commit: COMMIT,
    })

    expect(ancestor).toEqual({ ...ANCESTOR_456, semver: new SemVer('v4.5.6') })
  })

  it('should return null if it does not find a match', async () => {
    when(compareTag)
      .calledWith(expect.objectContaining({}))
      .mockResolvedValue(null)

    const ancestor = await findAncestorTag({
      tagPrefix: 'v',
      tags: TAG_LIST,
      repository: REPOSITORY,
      commit: COMMIT,
    })

    expect(ancestor).toEqual(null)
  })
})
