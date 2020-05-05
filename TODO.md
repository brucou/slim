Delete all the files not used in tests (I copied from yed2kingly)
add in README that mocha must be run in tests/... otherwise will not work
if I know taht there is no next events (compound and init), I can avoid that part of the code
IF  know that there is no history node, same thing
if I know action is action identity I can also save some space

the gain that we see by hand is because we use things about the actions/guards that we know but the computer cannot know. For instance, that the action never outputs anything, or never updates state or else.

- i can remove the controlStateHandlingEvent by calculating it ahead of time, and not putting it in the file if it is never used. No, it is always used. That may make the program a tag longer though. Still I think it is worth doing, so we have no find, concat etc. all the time
