const resolve = require("path").resolve;
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const CONFIG = {
    mode: "development",

    entry: {
        app: resolve("./app.js"),
    },

    output: {
        library: "App",
    },

    module: {
        rules: [
            {
                // Compile ES2015 using buble
                test: /\.js$/,
                loader: "buble-loader",
                include: [resolve(".")],
                exclude: [/node_modules/],
                options: {
                    objectAssign: "Object.assign",
                },
            },
        ],
    },

    // Optional: Enables reading mapbox token from environment variable
    plugins: [
        new HtmlWebpackPlugin({ template: "template.html" }),
        new webpack.EnvironmentPlugin(["MapboxAccessToken"]),
    ],
};
