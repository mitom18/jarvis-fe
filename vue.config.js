module.exports = {
    // Change build paths to make them Maven compatible
    // see https://cli.vuejs.org/config/
    outputDir: 'target/dist',
    assetsDir: 'static',

    publicPath: process.env.NODE_ENV === 'production'
        ? '/'
        : '/jarvis/'
};