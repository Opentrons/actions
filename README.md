# GitHub Actions for Opentrons Projects

This repository contains custom [Actions][] for Opentrons project running CI/CD using [GitHub Actions][] workflows.

[actions]: https://docs.github.com/en/actions/creating-actions/about-actions
[github actions]: https://docs.github.com/en/actions

## Actions

| action | description               |
| ------ | ------------------------- |
| TBD    | Something cool, hopefully |

## Contributing

The actions in this repository are written in [TypeScript][] and bundled using [rollup][]. Development requires [Node.js][] v12 and [yarn][] v1.

To get started, clone the repository and run `yarn` to install development dependencies.

```shell
git clone https://github.com/Opentrons/actions.git
cd actions
yarn
```

From there, you will have access to the following development tasks:

```shell
# run tests
yarn test

# run tests in watch mode
yarn test --watch

# run formatter
yarn format

# run lints
yarn lint

# run typechecks
yarn typecheck

# build production bundles
yarn build

# cleanup
yarn clean
```

[typescript]: https://www.typescriptlang.org/
[rollup]: https://rollupjs.org/
[node.js]: https://nodejs.org/
[yarn]: https://classic.yarnpkg.com/
