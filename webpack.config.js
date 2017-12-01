/*eslint-env node */

const fs = require("fs")
const path = require("path")
const MinifyPlugin = require("babel-minify-webpack-plugin")
const webpack = require("webpack")

// Shim for `eslint/lib/load-rules.js`
const ESLINT_LOAD_RULES = `module.exports = () => ({
${
    fs.readdirSync("node_modules/eslint/lib/rules")
        .filter(filename => path.extname(filename) === ".js" && !filename.startsWith("_"))
        .map(filename => {
            const ruleId = path.basename(filename, ".js")
            return `    "${ruleId}": require("eslint/lib/rules/${filename}"),`
        })
        .join("\n")
}
})
`

// Shim for `eslint-plugin-vue/lib/index.js`
const ESLINT_PLUGIN_VUE_INDEX = `module.exports = {
${
    fs.readdirSync("node_modules/eslint-plugin-vue/lib/rules")
        .filter(filename => path.extname(filename) === ".js")
        .map(filename => {
            const ruleId = path.basename(filename, ".js")
            return `    "vue/${ruleId}": require("eslint-plugin-vue/lib/rules/${filename}"),`
        })
        .join("\n")
}
}`

// Shim for `src/versions.js`
const VERSIONS = `export default ${JSON.stringify({
    "vue-eslint-demo": {
        repo: "mysticatea/vue-eslint-demo",
        version: require("./package.json").version,
    },
    "eslint": {
        repo: "eslint/eslint",
        version: require("eslint/package.json").version,
    },
    "eslint-plugin-vue": {
        repo: "vuejs/eslint-plugin-vue",
        version: require("eslint-plugin-vue/package.json").version,
    },
    "vue-eslint-parser": {
        repo: "mysticatea/vue-eslint-parser",
        version: require("vue-eslint-parser/package.json").version,
    },
})}`

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/",
        filename: "index.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "vue-style-loader",
                    "css-loader",
                ],
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {
                    },
                    // other vue-loader options go here
                },
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ijmap|ttf|woff2?)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]",
                    outputPath: "assets/",
                    publicPath: "./",
                },
            },
            // Replace `./src/versions.js` with the current versions.
            {
                test: new RegExp(`src\\${path.sep}versions\\.js$`),
                loader: "string-replace-loader",
                options: {
                    search: "[\\s\\S]+", // whole file.
                    replace: VERSIONS,
                    flags: "g",
                },
            },
            // `eslint/lib/load-rules.js` depends on `fs` module we cannot use in browsers, so needs shimming.
            {
                test: new RegExp(`eslint\\${path.sep}lib\\${path.sep}load-rules\\.js$`),
                loader: "string-replace-loader",
                options: {
                    search: "[\\s\\S]+", // whole file.
                    replace: ESLINT_LOAD_RULES,
                    flags: "g",
                },
            },
            // `eslint-plugin-vue/lib/index.js` depends on `fs` module we cannot use in browsers, so needs shimming.
            {
                test: new RegExp(`eslint-plugin-vue\\${path.sep}lib\\${path.sep}index\\.js$`),
                loader: "string-replace-loader",
                options: {
                    search: "[\\s\\S]+", // whole file.
                    replace: ESLINT_PLUGIN_VUE_INDEX,
                    flags: "g",
                },
            },
            // `eslint` has some dynamic `require(...)`.
            // Delete those.
            {
                test: new RegExp(`eslint\\${path.sep}lib\\${path.sep}(?:linter|rules)\\.js$`),
                loader: "string-replace-loader",
                options: {
                    search: "(?:\\|\\||(\\())\\s*require\\(.+?\\)",
                    replace: "$1",
                    flags: "g",
                },
            },
            // `vue-eslint-parser` has `require(parserOptions.parser || "espree")`.
            // Modify it by a static importing.
            {
                test: /vue-eslint-parser/,
                loader: "string-replace-loader",
                options: {
                    search: "require(parserOptions.parser || \"espree\")",
                    replace: "require(\"espree\")",
                },
            },
        ],
    },
    resolve: {
        alias: {
            vue$: "vue/dist/vue.esm.js",
        },
        extensions: ["*", ".js", ".vue", ".json"],
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        historyApiFallback: true,
        noInfo: true,
        overlay: true,
    },
    performance: {
        hints: false,
    },
    devtool: "#eval-source-map",
}

//eslint-disable-next-line no-process-env
if (process.env.NODE_ENV === "production") {
    module.exports.devtool = false
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            "process.env": { NODE_ENV: "\"production\"" },
        }),
        new MinifyPlugin(),
        new webpack.LoaderOptionsPlugin({ minimize: true }),
    ])
}
