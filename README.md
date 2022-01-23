
![build-test](https://github.com/oaklees/docker-gitops-tag-action/workflows/build-test/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

#  Generate GitOps friendly Docker tags

An action to generate GitOps friendly Docker tags, heavily inspired by the team at [FluxCD](https://fluxcd.io/docs/guides/sortable-image-tags/#other-things-to-include-in-the-image-tag), that utilises branch names, commit SHA, and timestamps to create unique tags.

## What will it generate?

| Trigger event  | Ref                            | Generated tags                                |
|----------------|--------------------------------|-----------------------------------------------|
| `pull_request` | `refs/heads/my-target-branch`  | `my-target-branch-pr-<pr#>-<sha>-<timestamp>` |
| `tag`          | `refs/tags/v1.2.3`             | `1.0.0`, `1.0`, `1` and `latest`              |
| `push`         | `refs/heads/feature/my-branch` | `feature-my-branch-<sha>-<timestamp>`         |
| `push`         | `refs/heads/main`              | `main-<sha>-<timestamp>`                      |
| `schedule`     | `refs/heads/main`              | `nightly`                                     |

# Usage

```yaml
jobs:
  main:
    runs-on: ubuntu-latest
  steps:
    - name: Generate image tags
      id: prepare
      uses: oaklees/docker-gitops-tag-action@v0.0.2
      with:
        docker_image: repo/app
    - name: Build and push
      uses: docker/build-push-action@v2
      with:
        push: true
        tags: ${{ steps.prepare.outputs.tag }}
```

## Customizing

The following inputs can be used as `step.with` keys:

| Name           | Type      | Description                                                                                                                                        |
|----------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| `docker_image` | String    | Docker image name to append tags to e.g. `my-repository/my-app`                                                                                    |
| `tag_prefix`   | String    | Optional tag prefix to prepend to generated tag e.g. providing `my-prefix-` would generate `my-repository/my-app:my-prefix-main-<sha>-<timestamp>` |

[See example config](.github/workflows/test.yml)

## Outputs

The following outputs are available

* `tag`: The fully qualified image with tags appended.

## Development

### Build
```
npm run build
```

### Test

```
npm run build
npm run test
```
