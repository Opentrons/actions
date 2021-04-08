# Get Version From Git Action

This action inspects your repository's git tags and the current commit to generate a version string for the current build.

- If commit matches tag, parse version from tag
- Otherwise, generate a snapshot version based on most recent tag

## Usage

The algorithm the action uses is similar to `git describe`, except it uses the GitHub API rather than querying `git`. This means that **you don't need to clone your repository's full history** in the checkout step.

```yaml
# ...
steps:
  # ...
  - name: 'Calculate version string from git'
    id: version
    uses: Opentrons/actions/git-version@v1
    with:
      github-token: ${{ secrets.GITHUB_TOKEN }}
      tag-prefix: v # default
      bump: minor # default
      snapshot-id: dev # default
      prerelease-id: alpha # default, unused because `bump` not a prerelease

  - name: 'Print version'
    run: echo "Version: ${{ steps.version.outputs.version }}"
# ...
```

### Inputs

| name            | default | required | description                             | example                       |
| --------------- | ------- | -------- | --------------------------------------- | ----------------------------- |
| `github-token`  | N/A     | **yes**  | GitHub access token                     | `${{ secrets.GITHUB_TOKEN }}` |
| `tag-prefix`    | `v`     | no       | Prefix to filter tags                   | `v`, `project-name@`          |
| `bump`          | `minor` | no       | Bump to create snapshot version         | `prerelease`, `patch`         |
| `snapshot-id`   | `dev`   | no       | Label to mark snapshot version          | `dev`, `SNAPSHOT`             |
| `prerelease-id` | `alpha` | no       | If `bump` is a prerelease, label to use | `alpha`, `canary`             |

### Outputs

| name      | description                      | example                       |
| --------- | -------------------------------- | ----------------------------- |
| `version` | Calculated version for the build | `1.3.0-dev.10+abc1234`  |

### Example versions

| bump       | prerelease ID | snapshot ID | closest tag      | commits ahead | current SHA | output                         |
| ---------- | ------------- | ----------- | ---------------- | ------------- | ----------- | ------------------------------ |
| `minor`    | `alpha`       | `dev`       | None found       | N/A           | `abc1234`   | `0.0.0-dev+abc1234`            |
| `minor`    | `alpha`       | `dev`       | `v1.2.3`         | 0             | `abc1234`   | `1.2.3`                        |
| `minor`    | `alpha`       | `dev`       | `v1.2.3`         | 10            | `abc1234`   | `1.3.0-dev.10+abc1234`         |
| `preminor` | `alpha`       | `dev`       | `v1.2.3`         | 10            | `abc1234`   | `1.3.0-alpha.0.dev.10+abc1234` |
| `preminor` | `alpha`       | `dev`       | `v1.2.3`         | 10            | `abc1234`   | `1.3.0-alpha.0.dev.10+abc1234` |
| `preminor` | `alpha`       | `dev`       | `v1.2.3-alpha.3` | 10            | `abc1234`   | `1.2.3-alpha.4.dev.10+abc1234` |
| `minor`    | `alpha`       | `dev`       | `v1.2.3-alpha.3` | 10            | `abc1234`   | `1.2.3-alpha.4.dev.10+abc1234` |
| `preminor` | `beta`        | `dev`       | `v1.2.3-alpha.3` | 10            | `abc1234`   | `1.2.3-beta.0.dev.10+abc1234`  |

### Algorithm

![version from git algorithm][]

[version from git algorithm]: https://user-images.githubusercontent.com/2963448/113524970-31df4380-9580-11eb-8508-c1968cb017f9.png
