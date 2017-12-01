# vue-eslint-demo

The online demo to check [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue#readme).

## ⤴️ Motivation

- Let's make the reproduce code/config of bugs. It would help issue handling.

## 💿 Installation

Open https://mysticatea.github.io/vue-eslint-demo/

- It does not support browsers which don't support ES2015.

## 📖 Usage

- Choose rules in sidebar to enable.
- Input code the center area.
- Right area shows the result of `eslint --fix`.
- Bottom area shows the error list.

## 📰 Changelog

- [GitHub Releases](https://github.com/mysticatea/vue-eslint-demo/releases)

## 🍻 Contributing

Welcome contributing!

Please use GitHub's Issues/PRs.

### Development Tools

- `npm run build` builds the app into `/dist` directory.
- `npm run clean` removes `/dist` directory.
- `npm run deploy` builds the app, then updates `gh-pages` branch, then pushes it to GitHub.
- `npm run update-deps` installs the latest `eslint`, `eslint-plugin-vue`, and `vue-eslint-parser`.
- `npm run watch` runs the app with `webpack-dev-server`.
