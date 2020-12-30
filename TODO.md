- !!! investigate refactoring with handlebars. Cf. https://github.com/mattpocock/xstate-codegen/blob/master/packages/sibling-files-with-react-export/src/createMachine.ts
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

- remove optimization for computed = null: I should call update state with empty.updates in that case! Don't short circuit the user provided update function. You don't know what they want to do
- shorten updaetState to uS, and updateHistoryState to uHS
- then gather all if (computed =null) and es =... in u (s, computed)
  - pass u(s, empty) if it was action identity
- all that should save 100 bytes, at the expense of readability (i.e. 3%)
  - var parentMap is moved outside the function
  - var empty = { outputs: [], updates: [] };
```js
function uHS(history, state_from_name) {
  if (state_from_name === 'nok') {
    return history;
  } else {
    var ancestors = getAncestors(parentMap, state_from_name) || [];
    ancestors.reduce((oldAncestor, newAncestor) => {
      // set the exited state in the history of all ancestors
      history['deep'][newAncestor] = state_from_name;
      history['shallow'][newAncestor] = oldAncestor;

      return newAncestor;
    }, state_from_name);

    return history;
  }
}

```

```js
// at top level too
function getAncestors(parentMap, cs) {
  return parentMap[cs] ? [parentMap[cs]].concat(getAncestors(parentMap[cs])) : [];
}

```

```js
  function u(s, computed) {
    if (computed!= null){
      es = uS(s, computed.updates);
      hs = uHS(hs, cs);
    }
  }


```
- change let in var, e.g.
```js
let computed = null;
```

- history is updated IN PLACE and thats ok, it is not shared. So I can remove it from parameters
- also I can detect ahead if shallow or deep are not used and remove the corresponding initializations and update in uHS
- then as I don't return hs anymore (update in place) I can have hsDeep and hsShallow instead of hs['deep']. That is more general when thinking about porting to non-JS imperativee languages. That does not help for functional languages though 


- for BIG optimization, statically includes the action, guards instead of the strings
  - .fsm.actions.*.js, .fsm.guards.*.js + some conventions; or both in the same file
  - compiling read the appropriate files and generate a .fsm.compiled.js which exports a createStateMachine function with only settings, updateState, and initialES as arguments
  - compilation parses the map string->function. That map MUST be string: function xxx(){} i.e. a named function expression! not a variable, or anonymous function. 
    - Then we can copy the function expression into an array, and use that array to replace `actions["xxx"]` with the real function. Same for guards. WE HAVE TO COPY also the imports!! The function may close on it. So we copy everything except the exports. THE FILE SHOULD HAVE NO IMPORTS REFERENCING LOCAL DIRECTORY as we want the freedom to change the location of the compiled file while keeping the code 
      - `chain` will have to change to chain([function xxx, ...])
  - so you can still use the file normally with import {actionF...} from .fsm.actions.js


```js
function xxx {}
function yyy {}

// right values must be a name for a above defined function
// and nothing else (no comments, etc.)
// left value must be with or without comma string per JS spec
const actionFactories = {
  "ddd ddd": xxx,
  "ddd daf": yyy,
}

export actionFactories 
```

- no import: functions must be pure!! use settings to inject dependencies
- get the function list by scouring BEGIN -> const actionFactories
- from const actionFactories -> read the mapping with regexp? or babel?
- don't put any comments inside const actionFactories, put them above the function definition
- DON"T USE BABEL:
  - babylon is the parser
  - but possibly lots of options to add (jsx, etc.) to parse
  - but version changes to handle, maybe breaking changes
  - but possibility of conflicts with .babelrc config etc.
  - babel may fail because of new language features used not parsed correctly (wrong version of babel, wrong config): false negative
  
