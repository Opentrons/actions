import { SemVer } from 'semver'
import { buildVersionString } from '../buildVersionString'

describe('build version string', () => {
  it('should default to an obvious version if no ancestor', () => {
    const ancestor = null
    const commit = { commit: 'abc1234' }
    const bump = 'preminor'
    const prereleaseId = 'alpha'
    const snapshotId = 'dev'

    const result = buildVersionString({
      ancestor,
      commit,
      bump,
      prereleaseId,
      snapshotId,
    })

    expect(result).toEqual('0.0.0-dev+abc1234')
  })

  it('should return the tag exactly if distance to commit is 0', () => {
    const ancestor = {
      tag: 'v1.2.3',
      distance: 0,
      semver: new SemVer('v1.2.3'),
    }
    const commit = { commit: 'abc1234' }
    const bump = 'preminor'
    const prereleaseId = 'alpha'
    const snapshotId = 'dev'

    const result = buildVersionString({
      ancestor,
      commit,
      bump,
      prereleaseId,
      snapshotId,
    })

    expect(result).toEqual('1.2.3')
  })

  it('should increment to prerelease and add build number and commit hash', () => {
    const ancestor = {
      tag: 'v1.2.3',
      distance: 2,
      semver: new SemVer('v1.2.3'),
    }
    const commit = { commit: 'abc1234' }
    const bump = 'preminor'
    const prereleaseId = 'alpha'
    const snapshotId = 'dev'

    const result = buildVersionString({
      ancestor,
      commit,
      bump,
      prereleaseId,
      snapshotId,
    })

    expect(result).toEqual('1.3.0-alpha.0.dev.2+abc1234')
  })

  it('should preserve an existing prerelease for "pre*" bumps', () => {
    const ancestor = {
      tag: 'v1.2.3-alpha.42',
      distance: 2,
      semver: new SemVer('v1.2.3-alpha.42', { includePrerelease: true }),
    }
    const commit = { commit: 'abc1234' }
    const bump = 'preminor'
    const prereleaseId = 'alpha'
    const snapshotId = 'dev'

    const result = buildVersionString({
      ancestor,
      commit,
      bump,
      prereleaseId,
      snapshotId,
    })

    expect(result).toEqual('1.2.3-alpha.43.dev.2+abc1234')
  })

  it('should swap out the prerelease identifier for "pre*" bumps', () => {
    const ancestor = {
      tag: 'v1.2.3-alpha.42',
      distance: 2,
      semver: new SemVer('v1.2.3-alpha.42', { includePrerelease: true }),
    }
    const commit = { commit: 'abc1234' }
    const bump = 'preminor'
    const prereleaseId = 'beta'
    const snapshotId = 'dev'

    const result = buildVersionString({
      ancestor,
      commit,
      bump,
      prereleaseId,
      snapshotId,
    })

    expect(result).toEqual('1.2.3-beta.0.dev.2+abc1234')
  })

  it('should increment to a regular release', () => {
    const ancestor = {
      tag: 'v1.2.3',
      distance: 2,
      semver: new SemVer('v1.2.3'),
    }
    const commit = { commit: 'abc1234' }
    const bump = 'minor'
    const prereleaseId = 'alpha'
    const snapshotId = 'dev'

    const result = buildVersionString({
      ancestor,
      commit,
      bump,
      prereleaseId,
      snapshotId,
    })

    expect(result).toEqual('1.3.0-dev.2+abc1234')
  })

  it('should preserve an existing prerelease for regular releases', () => {
    const ancestor = {
      tag: 'v1.2.3-alpha.42',
      distance: 2,
      semver: new SemVer('v1.2.3-alpha.42', { includePrerelease: true }),
    }
    const commit = { commit: 'abc1234' }
    const bump = 'minor'
    const prereleaseId = 'alpha'
    const snapshotId = 'dev'

    const result = buildVersionString({
      ancestor,
      commit,
      bump,
      prereleaseId,
      snapshotId,
    })

    expect(result).toEqual('1.2.3-alpha.43.dev.2+abc1234')
  })
})
