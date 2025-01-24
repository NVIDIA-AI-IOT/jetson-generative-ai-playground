#!/usr/bin/env bash
#
# This script uses the browserify tool to convert nodejs packages to run in browser,
# and export the standalone scripts needed to serve from a static website
#
#  https://www.forbeslindesay.co.uk/post/46324645400/standalone-browserify-builds
#
# Some dependencies used do not require browserify and can be directly imported from
# the browser, either supporting ES6 modules, <script> in HTML, or jQuery.
#
# Others however require this conversion, and are yet still lightweight enough to
# run clientside (in reality more modern solutions like webpack should be used,
# but this also needs to integrate into existing docsites like mkdocs / sphinx)
#
set -ex

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

function bundle() {
  local MODULE=$1
  local MODULE_ALIAS="${2:-$MODULE}"

  local WORKDIR="/tmp/browserify"
  local EXPORTER="$WORKDIR/export.js"

  local EXPORT_SRC="$3"

  if [ -z "$EXPORT_SRC" ]; then
    EXPORT_SRC="const $MODULE_ALIAS = require('$MODULE'); module.exports = $MODULE_ALIAS;"
  fi

  if [[ ! "$MODULE_ALIAS" == *".js"* ]]; then
    OUTPUT_SRC="$MODULE_ALIAS.js"
  else
    OUTPUT_SRC="$MODULE_ALIAS"
  fi

  docker run -it --rm -v $ROOT:/dist -w $WORKDIR \
    node:latest /bin/bash -c "\
      set -ex ; \
      echo \"${EXPORT_SRC}\" > $EXPORTER && \
      cat $EXPORTER && \
      npm install -g browserify && \
      npm install $MODULE && \
      browserify --help && \
      browserify $EXPORTER --standalone $MODULE_ALIAS -o /dist/${MODULE_ALIAS}/${OUTPUT_SRC} && \
      echo \"Done browserify of ${MODULE}\" && \
      ls -ll /dist/$MODULE_ALIAS"
}

if [ "$#" -gt 0 ]; then
    bundle "$@"
    exit 0 
fi

#bundle "composerize"

bundle "file-saver" "FileSaver" "const FileSaver = require('file-saver'); module.exports = FileSaver;"

# these were attempts to browserify code highlighting packages
# ended up just using prism.js with <script> (their normal way) 
#bundle "highlight.js" "highlight" "const hljs = require('highlight.js'); hljs.registerLanguage('yaml', require('highlight.js/lib/languages/yaml')); module.exports = hljs;"
#bundle "prismjs" "prism" "const Prism = require('prismjs'); Prism.highlightAll(); module.exports = Prism;"
#bundle "@speed-highlight/core" "speedHighlight" "const speedHighlight = require('@speed-highlight/core'); console.log('SPEED_HIGHLIGHT', speedHighlight.detectLanguage('<pre><code>ABC 123</code></pre>')); speedHighlight.highlightAll(); module.exports = speedHighlight;"