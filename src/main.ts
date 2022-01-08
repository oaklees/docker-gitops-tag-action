import { getSmartTag } from './smartTag'
import * as core from '@actions/core'
import { GithubRefs } from './types'

async function run(): Promise<void> {
  try {
    const dockerImage: string = core.getInput('docker_image')
    const customRef: string = core.getInput('ref')

    const githubRefs: GithubRefs = {
      baseRef: process.env['GITHUB_BASE_REF'] || '',
      ref: customRef || process.env['GITHUB_REF'] || 'noop',
      sha: process.env['GITHUB_SHA'] || 'undefined',
      eventName: process.env['GITHUB_EVENT_NAME'] || 'undefined',
    }

    core.setOutput('tag', getSmartTag(dockerImage, githubRefs))
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
