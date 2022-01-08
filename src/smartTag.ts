import * as semver from 'semver'
import { GithubRefs } from './types'

function getTagsFromTaggedRef(githubRefs: GithubRefs): string[] {
  const version = githubRefs.ref.replace('refs/tags/', '').replace(/\//g, '-').toLowerCase()
  const semanticVersion = semver.clean(version)
  if (!semanticVersion) {
    return ['latest', version]
  }
  const taggedVersion = `${semanticVersion}`
  const majorVersion = semver.major(semanticVersion)
  const minorVersion = semver.minor(semanticVersion)
  return ['latest', `${majorVersion}`, `${majorVersion}.${minorVersion}`, taggedVersion]
}

function getTagsFromPullRequestRef(githubRefs: GithubRefs): string[] {
  const { ref, baseRef, sha } = githubRefs
  const base = baseRef.replace('refs/heads/', '').replace(/\//g, '-').toLowerCase()
  const version = ref.replace('refs/pull/', '').replace('/merge', '')
  return [timestamped(`${base}-pr-${version}-${sha.substr(0, 8)}`)]
}

function getTagsFromBranchRef({ ref, sha }: GithubRefs): string[] {
  const version = ref.replace('refs/heads/', '').replace(/\//g, '-').toLowerCase()
  return [timestamped(`${version}-${sha.substr(0, 8)}`)]
}

function getTags(githubRefs: GithubRefs): string[] {
  const { eventName, ref } = githubRefs

  if (eventName === 'schedule') {
    return [`nightly`]
  }

  if (ref.match(/refs\/tags\//)) {
    return getTagsFromTaggedRef(githubRefs)
  }

  if (ref.match(/refs\/pull\//)) {
    return getTagsFromPullRequestRef(githubRefs)
  }

  if (ref.match(/refs\/heads\//)) {
    return getTagsFromBranchRef(githubRefs)
  }

  return [`:noop`]
}

export function getSmartTag(dockerImage: string, githubRefs: GithubRefs): string {
  return getTags(githubRefs)
    .map(tag => `${dockerImage}:${tag}`)
    .join(',')
}

function timestamped(tag: string): string {
  const timestamp = Math.ceil(Date.now() / 1000)
  return `${tag}-${timestamp}`
}
