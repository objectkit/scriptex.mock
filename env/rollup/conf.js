import multiEntry from "@rollup/plugin-multi-entry"
import includePaths from "rollup-plugin-includepaths"
import { terser } from "rollup-plugin-terser"

/* conditional terser compression */
const MINIFY = !(process.env.npm_config_MINIFIER_OFF)

const multiEntryConf= {
  exports: true
}

const includePathsConf= {
  paths: [ "src/main/js" ]
}

const terserConf= {
  keep_classnames: true
, keep_fnames: true
, compress: {
    unsafe: true
  }
, mangle: {
    safari10: true
  , properties: {
      regex: /^_|_$/
    }
  }
}

const buildConf= {
  input: "src/main/js/**/*.js"
, output: {
    format: "es"
  , file: process.env.npm_package_main
  }
, plugins: [
    multiEntry(multiEntryConf)
  , includePaths(includePathsConf)
  , MINIFY && terser(terserConf)
  ]
, external: [
    `sinon`
  , `@objectkit/scriptex`
  ]
}

export default buildConf
