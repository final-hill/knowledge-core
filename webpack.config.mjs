import path from 'path';
import url from 'url';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';

const __filename = url.fileURLToPath(import.meta.url),
    __dirname = path.dirname(__filename);

export default {
    devtool: 'source-map',
    entry: {
        main: './src/index.mts'
    },
    experiments: {
        outputModule: true
    },
    mode: 'production',
    module: {
        rules: [
            { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" }
        ]
    },
    resolve: {
        extensions: ['.mts', '.mjs', '.js', '.ts', '.json'],
        extensionAlias: {
            ".js": [".js", ".ts"],
            ".cjs": [".cjs", ".cts"],
            ".mjs": [".mjs", ".mts"]
        }
    },
    output: {
        clean: true,
        library: {
            type: 'module'
        },
        module: true,
        filename: ({ chunk }) => {
            switch (chunk.name) {
                case 'main': return 'index.mjs';
            }
        },
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new ESLintWebpackPlugin({
            extensions: ['.mts', '.mjs', '.js', '.ts', '.json'],
            exclude: ['node_modules', 'dist', 'coverage'],
            fix: true,
            overrideConfigFile: path.resolve(__dirname, '.eslintrc.json')
        })
    ]
};