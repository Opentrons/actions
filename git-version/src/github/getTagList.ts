import { Repository, Tag } from './types'
import { getOctokit } from './core'

export interface TagListOptions {
  tagPrefix: string
  repository: Repository
}

interface TagListQueryVariables {
  owner: string
  repo: string
  match: string
}

interface TagListQueryResult {
  repository: {
    refs: {
      nodes: Array<{
        name: string
      }>
    }
  }
}

const TAG_LIST_QUERY = `query tagList($owner: String!, $repo: String!, $match: String!) {
  repository(owner: $owner, name: $repo) {
    refs(
      refPrefix: "refs/tags/",
      orderBy: { field: TAG_COMMIT_DATE, direction:DESC },
      first: 20,
      query: $match
    ) {
      nodes {
        name
      }
    }
  }
}`

export function getTagList(options: TagListOptions): Promise<Tag[]> {
  const { repository, tagPrefix } = options
  const variables: TagListQueryVariables = {
    owner: repository.owner,
    repo: repository.repo,
    match: tagPrefix,
  }

  return getOctokit()
    .graphql<TagListQueryResult>(TAG_LIST_QUERY, { ...variables })
    .then((result) => {
      return result.repository.refs.nodes.map((node) => ({ tag: node.name }))
    })
}
