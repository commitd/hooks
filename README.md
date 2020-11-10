<h1 align="center">Committed Hooks</h1>
<br>
<p align="center">
  <img src="https://committed.software/Logo.svg" width="128px" alt="Project Logo"/>
</p>
<p align="center">
  Committed hooks library
</p>

[![Committed Badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fcommitted.software%2Fbadge)](https://committed.io)
[![Build Status](https://drone.committed.software/api/badges/commitd/hooks/status.svg)](https://drone.committed.software/commitd/hooks)
![Build Status](https://github.com/commitd/hooks/workflows/main/badge.svg?branch=main)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=commitd_hooks&metric=alert_status)](https://sonarcloud.io/dashboard?id=commitd_hooks)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=commitd_hooks&metric=coverage)](https://sonarcloud.io/dashboard?id=commitd_hooks)
![GitHub repo size](https://img.shields.io/github/repo-size/commitd/hooks)

For documentation see <https://committed.software/hooks>

## Install

```bash
yarn add @committed/hooks
```

## Usage

```tsx
import * as React from 'react'
import { useHook } from '@committed/hooks'

const Example = (props) => {
  const { hook } = useHook()
  // ...
  return <Component />
}
```

## Development

The main build is performed using Rollup:

```bash
yarn build
```

We use storybook to develop and document the components, this is run in development using

```bash
yarn storybook
```

There is also an example folder that can be used to test the library in it's built form. The recommended workflow is to run two terminals, in the first run

```bash
yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

Then run either Storybook or the example playground:

### Storybook

Run inside another terminal:

```bash
yarn storybook
```

This loads the stories from `./stories`.

> NOTE: Stories should reference the components as if using the library, similar to the example playground. This means importing from the root project directory. This has been aliased in the tsconfig and the storybook webpack config as a helper.

### Example

Then run the example inside another:

```bash
cd example
yarn # if first time
yarn start
```

The default example imports and live reloads whatever is in `/dist`, so if you are seeing an out of date component, make sure `start` is running in watch mode like we recommend above. **No symlinking required**, we use [Parcel's aliasing](https://parceljs.org/module_resolution.html#aliases).

### Test+

To run tests, use `yarn test` and formatting with `yarn format` and linting with `yarn lint`.

### Bundle analysis

Calculates the real cost of your library using [size-limit](https://github.com/ai/size-limit) with `yarn size` and visualize it with `yarn analyze`.

#### React Testing Library

Import `setupTests.tsx` in your test files to use `react-testing-library`.

## Continuous Integration

### GitHub Actions

Two actions are added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [size-limit](https://github.com/ai/size-limit)

### Drone

Example drone configuration with steps for

- **npm authentication** for later publication with npm
- **build** the main library
- **publish** to npm
- **code-analysis** with sonar
- **announce** with slack

## License

[MIT](/LICENSE) - © Committed Software 2020 https://committed.io
