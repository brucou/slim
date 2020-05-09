- the gain that we see when writing a machine by hand is because when doing so we use things about the actions/guards that we know but the computer cannot know. For instance, that the action never outputs anything, or never updates state or else.

- also NTH save the transition read from graphml into a JS array so it can be tested in the browser in case we are not so sure about the output from the compiler and want to double check.

- clean code (cruft from yed2Kingly there) but that is fairly low priority

- optimize further history updates: 
  - history should be kept only for those compound states with H/H*, with a transition to that, and updated when leaving those states or their descendants
  - that said, for all this complication we only save X - Y lines, where X is the sum of depths in the state tree and Y is the depth of descending tree from the H/H*
  - so in graph with 25 states and 3 history final, we save < 22 lines of code (out of probably 500)     
