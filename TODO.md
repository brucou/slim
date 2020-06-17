- implement that grammar for multi-lines transitions in yed
```stylus
MAIN -> OneTransitionLabel                             {% d => d[0] %}
| MultipleTransitionLabel                              {% d => d[0] %}
MultipleTransitionLabel -> ("|" OneTransitionLabel):+  {% d => d[0].map(x => x[1]) %}
OneTransitionLabel ->
  EventClause "[" GuardClause "]" _ "/" ActionsClause  {% d => ({event: d[0][0].join(''), guard: d[2][0].join(''), actions: d[6][0].join('')}) %}
| EventClause "[" GuardClause "]" _                    {% d => ({event: d[0][0].join(''), guard: d[2][0].join(''), actions: ""}) %}
| EventClause "/" ActionsClause                        {% d => ({event: d[0][0].join(''), guard: "", actions: d[2][0].join('')}) %}
| EventClause                                          {% d => ({event: d[0][0].join(''), guard: "", actions: ""}) %}
| "[" GuardClause "]" _ "/" ActionsClause              {% d => ({event: "", guard: d[1][0].join(''), actions: d[5][0].join('')}) %}
| "/" ActionsClause                                    {% d => ({event: "", guard: "", actions: d[1][0].join('')}) %}
| "[" GuardClause "]"                                  {% d => ({event: "", guard: d[1][0].join(''), actions: ""}) %}

EventClause -> [^\/\[\]\|]:+
GuardClause -> [^\[\]]:*
ActionsClause -> [^\/\|]:*
StringLiteral -> [\w]:+
_ -> [\s]:*
```

- also NTH save the transition read from graphml into a JS array so it can be tested in the browser in case we are not so sure about the output from the compiler and want to double check.

- clean code (cruft from yed2Kingly there) but that is fairly low priority
- add realworld file as test!!!! Publish version
  - ALSO DO IT FOR yed2kingly, probably same problem, and add a test for it? Maybe that realworld file 

# NTH
- optimize further history updates: 
  - history should be kept only for those compound states with H/H*, with a transition to that, and updated when leaving those states or their descendants
  - that said, for all this complication we only save X - Y lines, where X is the sum of depths in the state tree and Y is the depth of descending tree from the H/H*
  - so in graph with 25 states and 3 history final, we save < 22 lines of code (out of probably 500)
- I would save a lot on large files by not keeping track of the useless history (history of compound state which do not have H* in their up or down? hierarchy)
  - I know which one to remove!
  - those where I have cs = hs["deep"]["n2::n0::n0ღFeeds"]; they are the only one using hs
