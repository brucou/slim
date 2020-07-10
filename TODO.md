- there is a `false;` hanging in compiled files!!!
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
- can also optimize by mapping all state labels to a number, and use arrays for event handlers, parentMaps, history! That should save a lot of repetition, specially parentMap. Add comments with full name on state for debugging in event handlers
  - optimizing history then becomes a minor issue
  - save >10% (3.3KB to 3KB for realworld!)
  - actions could also be attached to an index, all copied from comments?

```js
actions = [
  ["my action", function adadas(){}],
  ["asdadasd", function adadas(){}],
  ...
]
```

and instead of `actions['my action']`, use `actions[indexOf('my action'')][1]`

that may cause some errors though maybe in an iterative process. If nohing is deleted ok, but if a state/transition is rmoved, then readded, that transition could change index, and all other trnsitions may go up one index. As ew do not check that the index correspond to the label (we assume it does). SO DON"T DO IT. Price is the size of all labels, I can live with that
DOC: ADR!
  
- change let computed = ... for var computed = ...
- maintain a graphml.bak:
  - slim *.graphml -> .graphml.decode (.graphml.decode -> .bak), .compiled.js, .compiled.cjs
  - graphml.decode has events, guards, transitions, actions, state list, state hierarchy in an export cjs way
  - then we can do the diff by simple requiring old, computing new and ramda differenceWith
    - na, just do a diff of the array at the moment
    - ~~same from, event, to:~~ 
      - same guard/action but from a single record to one of a multiple record (dearrayize transitions)
      - same guard/!action only change of guard label (same action, index, everything)
      - only change of index (consider it not a change but a shuffle) between guards, or transition index

- make warning if same action several time?

// getAncestors
// cs init 0
// eevent handlers is array
// nextEventMap is array, -1 instead of null
// be careful with controlStateHandlingEvent = 0, make sure find does not reurn -
// replace .find (IE does not have it) by a custom function maybe behind a flag -IE
