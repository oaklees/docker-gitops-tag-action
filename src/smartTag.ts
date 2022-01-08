import * as semver from 'semver'
import { GithubRefs } from './types'

function getSmartTagFromTag(dockerImage: string, githubRef: string): string {
  const version = githubRef.replace('refs/tags/', '').replace(/\//g, '-')
  const semanticVersion = semver.clean(version)
  if (!semanticVersion) {
    return `${dockerImage}:latest,${dockerImage}:${version}`
  }
  const tags = `${dockerImage}:${semanticVersion}`
  const majorVersion = semver.major(semanticVersion)
  const minorVersion = semver.minor(semanticVersion)
  return `${dockerImage}:latest,${dockerImage}:${majorVersion},${dockerImage}:${majorVersion}.${minorVersion},${tags}`
}

function getSmartTagFromPullRequest(dockerImage: string, githubRefs: GithubRefs): string {
  const { ref, baseRef, sha } = githubRefs
  const base = baseRef.replace('refs/heads/', '').replace(/\//g, '-')
  const version = ref.replace('refs/pull/', '').replace('/merge', '')
  return timestamped(`${dockerImage}:${base}-pr-${version}-${sha.substr(0, 8)}`)
}

function getSmartTagFromBranch(dockerImage: string, { ref, sha }: GithubRefs): string {
  const version = ref.replace('refs/heads/', '').replace(/\//g, '-')

  return timestamped(`${dockerImage}:${version}-${sha.substr(0, 8)}`)
}

function getTag(dockerImage: string, githubRefs: GithubRefs): string {
  const { eventName, ref } = githubRefs
  if (eventName === 'schedule') {
    return `${dockerImage}:nightly`
  } else if (ref.match(/refs\/tags\//)) {
    return getSmartTagFromTag(dockerImage, ref)
  } else if (ref.match(/refs\/pull\//)) {
    return getSmartTagFromPullRequest(dockerImage, githubRefs)
  } else if (ref.match(/refs\/heads\//)) {
    return getSmartTagFromBranch(dockerImage, githubRefs)
  }
  return `${dockerImage}:noop`
}

export function getSmartTag(dockerImage: string, githubRefs: GithubRefs): string {
  return getTag(dockerImage, githubRefs)
}

function timestamped(tag: string): string {
  const timestamp = Math.ceil(Date.now() / 1000)
  return `${tag}-${timestamp}`
}
