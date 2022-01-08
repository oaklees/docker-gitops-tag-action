
![build-test](https://github.com/oaklees/docker-smart-tag-action/workflows/build-test/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

#  Generate GitOps friendly Docker tags

Generate GitOps friendly Docker tags

## Example (smart) tag

* Pull request: `<base-ref>-pr-<pull request number>-<sha>-<timestamp>`
* Publish with tags: `v1.0.0` => `1.0.0`, `1.0`, `1` and `latest`
* Branch: `topic/my_branch` => `topic-my_branch-<sha>-<timestamp>`
    * Default branch => `<default branch>-<sha>-<timestamp>`
    * Scheduled build => `nightly`

# Usage

```yaml
jobs:
  main:
    runs-on: ubuntu-latest
  steps:
    - name: Get smart tag
      id: prepare
      uses: oaklees/docker-smart-tag-action@v1
      with:
        docker_image: repo/app
    - name: Build and push
      uses: docker/build-push-action@v2
      with:
        push: true
        tags: ${{ steps.prepare.outputs.tag }}
```

## Customizing

### inputs

Following inputs can be used as `step.with` keys

| Name              | Type      | Description                       |
|-------------------|-----------|-----------------------------------|
| `docker_image`    | String    | Docker image name e.g. `name/app` |

[See example config](.github/workflows/test.yml)

### outputs

Following outputs are available

* `tag`: Smart tag

## Development

### Build
```
npm run build
```

### Test

```
npm run build
npm t
```
