var stealTools = require("steal-tools");

var buildPromise = stealTools.build({
  config: __dirname + "/package.json!npm"
}, {
  bundleAssets: {
    glob: 'assets/*',
    infer: false
  },
  maxBundleRequests: 6
});
