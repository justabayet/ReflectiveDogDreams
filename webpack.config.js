const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/public',
        filename: 'main.js'
    },
    resolve: {
        alias: {
            three: path.resolve('./node_modules/three')
        },
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      port: 9000,
      hot: true,
    }
};
