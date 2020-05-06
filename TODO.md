# Optimizations
- if I know taht there is no next events (compound and init), I can avoid that part of the code
- IF  know that there is no history node, same thing
- ~~if I know action is action identity I can also save some space~~

- the gain that we see when writing a machine by hand is because when doing so we use things about the actions/guards that we know but the computer cannot know. For instance, that the action never outputs anything, or never updates state or else.

- I can remove the controlStateHandlingEvent by calculating it ahead of time, and not putting it in the file if it is never used. No, it is always used. That may make the program a tad longer though. Still I think it is worth doing, so we don't have to find, concat etc. all the time

- also NTH save the transition read from graphml into a JS array so it can be tested in the browser in case we are not so sure about the output from the compiler and want to double check.
