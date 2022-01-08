import { getSmartTag } from '../src/smartTag'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

const sha = 'ffac537e6cbbf934b08745a378932722df287a53'

Date.now = jest.fn(() => 1641647436028)

describe.each([
  [
    // Scheduled run
    'refs/heads/main',
    '',
    'schedule',
    'repo/app:nightly',
  ],
  [
    // Pull request
    'refs/pull/123/merge',
    'refs/heads/topic/some/my_branch',
    'pull_request',
    'repo/app:topic-some-my_branch-pr-123-ffac537e-1641647437',
  ],
  [
    // Push branch
    'refs/heads/topic/some/my_branch',
    '',
    'push',
    'repo/app:topic-some-my_branch-ffac537e-1641647437',
  ],
  [
    // Push branch with uppercase
    'refs/heads/topic/SOME/my_branch',
    '',
    'push',
    'repo/app:topic-some-my_branch-ffac537e-1641647437',
  ],
  [
    // Default branch
    'refs/heads/default',
    '',
    'push',
    'repo/app:default-ffac537e-1641647437',
  ],
  [
    // Publish tags (SemVer)
    'refs/tags/v1.0.0',
    '',
    'release',
    'repo/app:latest,repo/app:1,repo/app:1.0,repo/app:1.0.0',
  ],
  [
    // Publish tags (Not SemVer)
    'refs/tags/v1',
    '',
    'release',
    'repo/app:latest,repo/app:v1',
  ],
])(
  'Convert: %s, %s, %s, %s => %s',
  (ref: string, baseRef: string, eventName: string, expected: string) => {
    test(`getSmartTag ${ref} on ${eventName}`, () => {
      expect(
        getSmartTag('repo/app', {
          ref,
          baseRef,
          sha,
          eventName,
        })
      ).toEqual(expected)
    })
  }
)

test('test runs', () => {
  process.env['INPUT_DOCKER_IMAGE'] = 'repo/app'
  process.env['INPUT_DEFAULT_BRANCH'] = 'main'
  process.env['GITHUB_REF'] = 'refs/heads/topic/some/my_branch'
  process.env['GITHUB_SHA'] = sha
  process.env['GITHUB_EVENT_NAME'] = 'push'
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {
    env: process.env,
  }
  console.log(cp.execSync(`node ${ip}`, options).toString())
})
