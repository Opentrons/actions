import github from '@actions/github'
import core from '@actions/core'

import { Commit, Repository, InputName, OutputName } from './types'

export type Octokit = ReturnType<typeof github.getOctokit>

let _octokit: Octokit | null = null

export function getCommit(): Commit {
  return { commit: github.context.sha }
}

export function getRepository(): Repository {
  return github.context.repo
}

export function getInput(name: InputName, required = true): string {
  return core.getInput(name, { required })
}

export function setOutput(name: OutputName, value: string): void {
  core.setOutput(name, value)
}

export function setFailed(message: string | Error): void {
  core.setFailed(message)
}

export function getOctokit(): Octokit {
  if (_octokit === null) {
    const githubToken = getInput('github-token')
    _octokit = github.getOctokit(githubToken)
  }

  return _octokit
}
