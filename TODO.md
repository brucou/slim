- the gain that we see when writing a machine by hand is because when doing so we use things about the actions/guards that we know but the computer cannot know. For instance, that the action never outputs anything, or never updates state or else.

- also NTH save the transition read from graphml into a JS array so it can be tested in the browser in case we are not so sure about the output from the compiler and want to double check.

- clean code (cruft from yed2Kingly there) but that is fairly low priority

- optimize further history updates: 
  - history should be kept only for those compound states with H/H*, with a transition to that, and updated when leaving those states or their descendants
  - that said, for all this complication we only save X - Y lines, where X is the sum of depths in the state tree and Y is the depth of descending tree from the H/H*
  - so in graph with 25 states and 3 history final, we save < 22 lines of code (out of probably 500)

- I could replace action identity directly by the outputs!!! 
- replace initialControlState directly *(only used once...) et initialExtendedState
- can also replace INIT_STATE, INIT_EVENT by their value
- {return null} can be expressed in one line


- the regexp reached its limit : use a real parser... to avoid the rues that you cannot have a /. That means I can't have routes inside ''


string* [string*] / string*
'[\'#/article/:slug\' route]' should be parsed as a [x] 

adas[asdas ada[ x] should be: adas[asdas ada; x OR adas;asdas ada[ x
HOW TO DISAMBIGUATE? 

x I need to deal with non-printable characters too in action/guards name... events too, anywhere in the edge label... 
- add realworld file as test!!!! Publish version
  - ALSO DO IT FOR yed2kingly, probably same problem, and add a test for it? Maybe that realworld file 
x I can reduce the size of the compiled file by removing the nulls in nextEventMap and replcaing the test by undefined, so I have undefined, '', or some string
- I would save a lot on large files by not keeping track of the useless history (history of compound state which do not have H* in their up or down? hierarchy)
  - I know which one to remove!
  - those where I have cs = hs["deep"]["n2::n0::n0ღFeeds"]; they are the only one using hs
x reduce size of stateAncestors: replace by parents map
  - var parentMap = {[child]: parent}
  - getting the ancestors will simply be going up till reaching {[child]]: null or root or ''} 
  - size will be O(n) with n number of nodes
  - right now it is o (nd) with d longest path in the tree
  - could also memoize the computation of ancestors 
    - the simplest and shortest memoization possible
    - or no memoization, just go for shortest size, even if performance suffers a little
    - common hierarchy should not pass 5 levels so it will always be fast
- apparently realworld right now has 100 transitions, and is 3.5KB min.gzipped. The idea is to bring that to 2KB.(!) not possible, 3KB is max
