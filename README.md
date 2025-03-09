# [Web] Aircnc
[![CircleCI](https://img.shields.io/circleci/build/github/DiegoVictor/aircnc-web?style=flat-square&logo=circleci)](https://app.circleci.com/pipelines/github/DiegoVictor/aircnc-web?branch=main)
[![reactjs](https://img.shields.io/badge/reactjs-16.14.0-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![styled-components](https://img.shields.io/badge/styled_components-4.4.1-db7b86?style=flat-square&logo=styled-components)](https://styled-components.com/)
[![eslint](https://img.shields.io/badge/eslint-6.8.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-24.9.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/aircnc-web?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/aircnc-web)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/aircnc-web/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

This web version allow users to create spots, approve or reject spots' bookings, see spot details an edit it. All the resources used by this application comes from its [`API`](https://github.com/DiegoVictor/aircnc-api).

## Table of Contents
* [Screenshots](#screenshots)
* [Installing](#installing)
  * [Configuring](#configuring)
    * [.env](#env)
    * [API](#api)
* [Usage](#usage)
* [Running the tests](#running-the-tests)
  * [Coverage Report](#coverage-report)

# Screenshots
Click to expand.<br>
<img src="https://raw.githubusercontent.com/DiegoVictor/aircnc-web/main/screenshots/dashboard.jpg" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/aircnc-web/main/screenshots/dashboard-pending.jpg" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/aircnc-web/main/screenshots/details.jpg" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/aircnc-web/main/screenshots/details-bookings.jpg" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/aircnc-web/main/screenshots/edit.jpg" width="32%" />

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
Configure your environment variables and remember to start the [API](https://github.com/DiegoVictor/aircnc-api) before to start this app.

### .env
In this file you may configure the API's url. Rename the `.env.example` in the root directory to `.env` then just update with your settings.

key|description|default
---|---|---
REACT_APP_API_URL|API's url with version (v1)|`http://localhost:3333/v1`
REACT_APP_SOCKET_URL|API's url|`http://localhost:3333`

### API
Start the [API](https://github.com/DiegoVictor/aircnc-api) (see its README for more information). In case of any change in the API's `port` or `host` remember to update the [`.env`](#env) too.

# Usage
To start the app run:
```
$ yarn start
```
Or:
```
npm run start
```

# Running the tests
[Jest](https://jestjs.io/) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.

