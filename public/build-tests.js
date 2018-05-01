var stealTools = require("steal-tools");

var buildPromise = stealTools.build({
  config: __dirname + "/package.json!npm",
  main: "lbh3/test"
}, {
  bundleAssets: {
    glob: 'assets/*',
    infer: false
  }
});
