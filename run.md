# Tests
cd tests
mocha end-to-end.specs.js 2> logError.txt > log.txt

# Generating parser
nearleyc yedEdgeLabelGrammar.ne -o yedEdgeLabelGrammar.js
