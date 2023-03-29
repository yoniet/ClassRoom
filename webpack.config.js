const path = require('path')
const nodeExternals = require("webpack-node-externals")
const CURRENT_WORKING_DIR = process.cwd()


const clientConfig = {
    name: "browser",
    mode: "development",
    devtool: 'eval-source-map',
    entry: [
        path.join(CURRENT_WORKING_DIR, 'src/index.js')
    ],
    output: {
        path: path.resolve(CURRENT_WORKING_DIR, 'public'),
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            }
        ]
    }
}

const serverConfig = {
    entry: "./server.js",
    output: {
        path: __dirname,
        filename: "server-compiled.js"
    },
    externals: [nodeExternals()],
    target: "node",
    mode: "production",
}

module.exports = [clientConfig, serverConfig]