module.exports = {
  entry: "./src",
  output: {
    filename: "dist/bundle.js"
  },
  module: {
         loaders: [
           {
               test: /\.js$/,
               loader: 'babel-loader',
               exclude: /node_modules/,
               query: {
                   presets: ['es2015', 'stage-0']
               }
           }
       ]
   }
}
