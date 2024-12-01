const path = require('path')
const entries = require('./auto-entry')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackObfuscator = require('webpack-obfuscator')

module.exports = (_, {mode}) => {
    const isDevelopment = mode === 'development'

    return {
        target: 'web',
        entry: entries.load({ type: 'entry' }),
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'scripts/[name].js',
            clean: true,
        },
        plugins: [
            ...entries.load({ type: 'view' }),
            new MiniCssExtractPlugin({
                filename : 'styles/[name].css'
            }),
            !isDevelopment && new WebpackObfuscator({
                rotateStringArray: true
            })
        ].filter(Boolean),
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    // For *.component.scss
                    test: /\.component\.s[ac]ss$/,
                    use: [
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: { api: 'modern' }
                        }
                    ],
                },
                // For *.scss
                {
                    test: /\.s[ac]ss$/,
                    exclude: /\.component\.s[ac]ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: { api: 'modern' }
                        }
                    ],
                },
            ]
        },
        resolve: {
            extensions: ['.ts', '.js', '.scss'],
            alias: {
                '@': path.resolve(__dirname, 'scripts'),
                '@styles': path.resolve(__dirname, 'styles'),
            }
        },
        devServer: {
            static: {
                directory: path.join(__dirname, 'build'),
            },
            compress: true,
            port: 3090,
        },
        devtool: isDevelopment ? 'inline-source-map' : false
    }
}