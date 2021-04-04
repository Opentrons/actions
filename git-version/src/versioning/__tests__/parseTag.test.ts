import { SemVer } from 'semver'
import { parseTag } from '../parseTag'

describe('parse tag', () => {
  it('should return null if tag prefix does not match', () => {
    const tagPrefix = 'foobar'
    const tag = { tag: 'v1.2.3' }

    const result = parseTag({ tag, tagPrefix })

    expect(result).toBe(null)
  })

  it('should parse out a SemVer', () => {
    const tagPrefix = 'v'
    const tag = { tag: 'v1.2.3' }

    const result = parseTag({ tag, tagPrefix })

    expect(result).toEqual(new SemVer('v1.2.3', { includePrerelease: true }))
  })
})
