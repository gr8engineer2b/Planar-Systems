const rules = require("./webpack.rules");
const crypto = require("crypto");

nonce = crypto.randomBytes(16).toString("base64");

rules.push({
  test: /\.css$/,
  use: [
    { loader: "style-loader", options: { attributes: { nonce: nonce } } },
    { loader: "css-loader" },
  ],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
