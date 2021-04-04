import { Repository, Tag } from './types'
import { getOctokit } from './core'

export interface TagListOptions {
  tagPrefix: string
  repository: Repository
}

interface TagListQueryVariables {
  owner: string
  repo: string
  query: string
}

interface TagListQuery {
  tagList: {
    repository: {
      refs: {
        nodes: Array<{
          name: string
        }>
      }
    }
  }
}

const TAG_LIST_QUERY = `query tagList($owner: String!, $repo: String!, $query: String!) {
  repository(owner: $owner, name: $repo) {
    refs(
      refPrefix: "refs/tags/",
      orderBy: { field: TAG_COMMIT_DATE, direction:DESC },
      first: 20,
      query: $query
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
    query: tagPrefix,
  }

  return getOctokit()
    .graphql<TagListQuery>(TAG_LIST_QUERY, { variables })
    .then(({ tagList }) => {
      return tagList.repository.refs.nodes.map((node) => ({ tag: node.name }))
    })
}
