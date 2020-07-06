// Generated automatically by Kingly, version 0.7
// http://github.com/brucou/Kingly
// Copy-paste help
// For debugging purposes, guards and actions functions should all have a name
// Using natural language sentences for labels in the graph is valid
// guard and action functions name still follow JavaScript rules though
// -----Guards------
// const guards = {
//   "'/#' route": function (){},
//   "'/#register' route": function (){},
//   "'#/login' route": function (){},
//   "'#/@:username' route": function (){},
//   "'#/article/:slug' route": function (){},
//   "!isAuthenticated": function (){},
//   "authenticated &amp; liked": function (){},
//   "authenticated &amp; !liked": function (){},
//   "isAuthenticated": function (){},
//   "new route?": function (){},
//   "authenticated &amp; followed": function (){},
//   "authenticated &amp; !followed": function (){},
//   "!authenticateed": function (){},
//   "authenticated": function (){},
//   "!liked": function (){},
//   "liked": function (){},
//   "followed": function (){},
//   "!followed": function (){},
//   "!own profile": function (){},
//   "'#/username' exact route": function (){},
//   "'#/username/favorite' route": function (){},
//   "otherwise": function (){},
//   "url = '#/editor/slug'": function (){},
//   "new tag": function (){},
//   "articles fetched": function (){},
//   "tags already fetched": function (){},
//   "tags not fetched": function (){},
// };
// -----Actions------
// const actions = {
//   "update url": function (){},
//   "update url, redirect to signup route": function (){},
//   "request unlike article, update liked, render": function (){},
//   "request like article, update liked, render": function (){},
//   "update url redirect to home": function (){},
//   "sign up": function (){},
//   "render sign in form": function (){},
//   "save user, update url redirect to home": function (){},
//   "render sign up form": function (){},
//   "editor' route": function (){},
//   "update url redirect home": function (){},
//   "publish article": function (){},
//   "update url redirect to article": function (){},
//   "sign in": function (){},
//   "render editor form": function (){},
//   "request unfollow profile, render": function (){},
//   "request follow profile, render": function (){},
//   "update url redireect to signup route": function (){},
//   "redirect to home": function (){},
//   "render articles errors": function (){},
//   "render articles": function (){},
//   "render comments": function (){},
//   "render follow button": function (){},
//   "update liked, render": function (){},
//   "fetch sesion data": function (){},
//   "fetch session data": function (){},
//   "update comments render": function (){},
//   "do nothing": function (){},
//   "fetch article fetch comments render article loading screen": function (){},
//   "request post comment, update auth render": function (){},
//   "request delete comment, update auth render": function (){},
//   "request delete article, update auth render": function (){},
//   "request like article, update pending, render": function (){},
//   "request unlike article, update pending, render": function (){},
//   "update pagination, fetch session data": function (){},
//   "render profile": function (){},
//   "fetch articles by username fetch profile render route loading screen update tab type": function (){},
//   "fetch favorite articles by username fetch profile render route loading screen update tab type": function (){},
//   "fetch session data reset editor route state": function (){},
//   "fetch article": function (){},
//   "render in-progress status update form data fetch session data": function (){},
//   "render tagList, reset tag field": function (){},
//   "render tag list": function (){},
//   "render tag field": function (){},
//   "render editor form errors fetch session data": function (){},
//   "fetch session data update editor route state": function (){},
//   "reset pagination": function (){},
//   "update pagination": function (){},
//   "update user": function (){},
//   "update user update (reset) pagination": function (){},
//   "reset sign in route state fetch session data": function (){},
//   "render sign in form fetch session data": function (){},
//   "reset sign up route state fetch session data": function (){},
//   "render sign up form fetch session data": function (){},
//   "render filtered articles": function (){},
//   "render fetched failure": function (){},
//   "fetch filtered articles render loading": function (){},
//   "fetch articles render loading": function (){},
//   "fetch tags fetch articles render loading": function (){},
//   "render tags update tags fetched": function (){},
//   "render tag errors": function (){},
// };
// ----------------
var nextEventMap = {
  n1ღrouting: "",
  "n2ღApplication core": "init",
  "n2::n0ღHome route": "init",
  "n2::n0::n0ღFeeds": "init",
  "n2::n0::n0::n0ღFetching global feed": "init",
  "n2::n0::n0::n1ღFetching filtered articles": "init",
  "n2::n0::n0::n3ღFetching user feed": "init",
  "n2::n1ღSign up route": "init",
  "n2::n2ღSign in route": "init",
  "n2::n3ღEditor route": "init",
  "n2::n4ღProfile route": "init",
  "n2::n5ღArticle route": "init",
  "n2::n5::n3ღChecking user": "init",
  "n2::n5::n4ღcan (un)like": "",
  "n2::n5::n5ღcan (un)follow": "",
};

function updateHistoryState(history, getAncestors, state_from_name) {
  if (state_from_name === "nok") {
    return history;
  } else {
    var ancestors = getAncestors(state_from_name) || [];
    ancestors.reduce((oldAncestor, newAncestor) => {
      // set the exited state in the history of all ancestors
      history["deep"][newAncestor] = state_from_name;
      history["shallow"][newAncestor] = oldAncestor;

      return newAncestor;
    }, state_from_name);

    return history;
  }
}

function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state,
  var parentMap = {
    "n2::n0ღHome route": "n2ღApplication core",
    "n2::n0::n0ღFeeds": "n2::n0ღHome route",
    "n2::n0::n0::n0ღFetching global feed": "n2::n0::n0ღFeeds",
    "n2::n0::n0::n0::n0ღInit": "n2::n0::n0::n0ღFetching global feed",
    "n2::n0::n0::n0::n1ღPending global feed": "n2::n0::n0::n0ღFetching global feed",
    "n2::n0::n0::n0::n2ღPending global feed articles": "n2::n0::n0::n0ღFetching global feed",
    "n2::n0::n0::n1ღFetching filtered articles": "n2::n0::n0ღFeeds",
    "n2::n0::n0::n1::n0ღPending filtered articles": "n2::n0::n0::n1ღFetching filtered articles",
    "n2::n0::n0::n1::n1ღFetched filtered articles": "n2::n0::n0::n1ღFetching filtered articles",
    "n2::n0::n0::n1::n2ღFailed fetch filtered articles": "n2::n0::n0::n1ღFetching filtered articles",
    "n2::n0::n0::n1::n3ღInit": "n2::n0::n0::n1ღFetching filtered articles",
    "n2::n0::n0::n2ღInit": "n2::n0::n0ღFeeds",
    "n2::n0::n0::n3ღFetching user feed": "n2::n0::n0ღFeeds",
    "n2::n0::n0::n3::n0ღInit": "n2::n0::n0::n3ღFetching user feed",
    "n2::n0::n0::n3::n1ღPending user feed": "n2::n0::n0::n3ღFetching user feed",
    "n2::n0::n0::n3::n2ღPending user feed articles": "n2::n0::n0::n3ღFetching user feed",
    "n2::n0::n0::n4ღFetching authentication": "n2::n0::n0ღFeeds",
    "n2::n0::n1ღFetching authentication": "n2::n0ღHome route",
    "n2::n0::n2ღInit": "n2::n0ღHome route",
    "n2::n1ღSign up route": "n2ღApplication core",
    "n2::n1::n0ღInit": "n2::n1ღSign up route",
    "n2::n1::n1ღForm entry": "n2::n1ღSign up route",
    "n2::n1::n2ღSigning up": "n2::n1ღSign up route",
    "n2::n1::n3ღFetching authentication": "n2::n1ღSign up route",
    "n2::n1::n4ღFetching authentication": "n2::n1ღSign up route",
    "n2::n2ღSign in route": "n2ღApplication core",
    "n2::n2::n0ღInit": "n2::n2ღSign in route",
    "n2::n2::n1ღForm entry": "n2::n2ღSign in route",
    "n2::n2::n2ღSigning in": "n2::n2ღSign in route",
    "n2::n2::n3ღFetching authentication": "n2::n2ღSign in route",
    "n2::n2::n4ღFetching authentication": "n2::n2ღSign in route",
    "n2::n3ღEditor route": "n2ღApplication core",
    "n2::n3::n0ღInit": "n2::n3ღEditor route",
    "n2::n3::n1ღEditing new article": "n2::n3ღEditor route",
    "n2::n3::n2ღPublishing article": "n2::n3ღEditor route",
    "n2::n3::n3ღFetching authentication": "n2::n3ღEditor route",
    "n2::n3::n4ღFetching authentication": "n2::n3ღEditor route",
    "n2::n3::n5ღFetching article": "n2::n3ღEditor route",
    "n2::n4ღProfile route": "n2ღApplication core",
    "n2::n4::n0ღUser profile": "n2::n4ღProfile route",
    "n2::n4::n1ღFetching authentication": "n2::n4ღProfile route",
    "n2::n4::n2ღFetching authentication": "n2::n4ღProfile route",
    "n2::n4::n3ღInit": "n2::n4ღProfile route",
    "n2::n4::n4ღFetching authentication": "n2::n4ღProfile route",
    "n2::n5ღArticle route": "n2ღApplication core",
    "n2::n5::n0ღArticle rendering": "n2::n5ღArticle route",
    "n2::n5::n1ღFetching authentication": "n2::n5ღArticle route",
    "n2::n5::n2ღInit": "n2::n5ღArticle route",
    "n2::n5::n3ღChecking user": "n2::n5ღArticle route",
    "n2::n5::n3::n0ღFetching like authentication": "n2::n5::n3ღChecking user",
    "n2::n5::n3::n1ღFetching follow authentication": "n2::n5::n3ღChecking user",
    "n2::n5::n3::n2ღFetching post authentication": "n2::n5::n3ღChecking user",
    "n2::n5::n3::n3ღFetching comment authentication": "n2::n5::n3ღChecking user",
    "n2::n5::n3::n4ღFetching delete authentication": "n2::n5::n3ღChecking user",
    "n2::n5::n4ღcan (un)like": "n2::n5ღArticle route",
    "n2::n5::n5ღcan (un)follow": "n2::n5ღArticle route",
  };
  var cs = "nok";
  var es = initialExtendedState;
  var hs = {
    deep: {
      n0ღInit: "",
      n1ღrouting: "",
      "n2ღApplication core": "",
      "n2::n0ღHome route": "",
      "n2::n0::n0ღFeeds": "",
      "n2::n0::n0::n0ღFetching global feed": "",
      "n2::n0::n0::n0::n0ღInit": "",
      "n2::n0::n0::n0::n1ღPending global feed": "",
      "n2::n0::n0::n0::n2ღPending global feed articles": "",
      "n2::n0::n0::n1ღFetching filtered articles": "",
      "n2::n0::n0::n1::n0ღPending filtered articles": "",
      "n2::n0::n0::n1::n1ღFetched filtered articles": "",
      "n2::n0::n0::n1::n2ღFailed fetch filtered articles": "",
      "n2::n0::n0::n1::n3ღInit": "",
      "n2::n0::n0::n2ღInit": "",
      "n2::n0::n0::n3ღFetching user feed": "",
      "n2::n0::n0::n3::n0ღInit": "",
      "n2::n0::n0::n3::n1ღPending user feed": "",
      "n2::n0::n0::n3::n2ღPending user feed articles": "",
      "n2::n0::n0::n4ღFetching authentication": "",
      "n2::n0::n1ღFetching authentication": "",
      "n2::n0::n2ღInit": "",
      "n2::n1ღSign up route": "",
      "n2::n1::n0ღInit": "",
      "n2::n1::n1ღForm entry": "",
      "n2::n1::n2ღSigning up": "",
      "n2::n1::n3ღFetching authentication": "",
      "n2::n1::n4ღFetching authentication": "",
      "n2::n2ღSign in route": "",
      "n2::n2::n0ღInit": "",
      "n2::n2::n1ღForm entry": "",
      "n2::n2::n2ღSigning in": "",
      "n2::n2::n3ღFetching authentication": "",
      "n2::n2::n4ღFetching authentication": "",
      "n2::n3ღEditor route": "",
      "n2::n3::n0ღInit": "",
      "n2::n3::n1ღEditing new article": "",
      "n2::n3::n2ღPublishing article": "",
      "n2::n3::n3ღFetching authentication": "",
      "n2::n3::n4ღFetching authentication": "",
      "n2::n3::n5ღFetching article": "",
      "n2::n4ღProfile route": "",
      "n2::n4::n0ღUser profile": "",
      "n2::n4::n1ღFetching authentication": "",
      "n2::n4::n2ღFetching authentication": "",
      "n2::n4::n3ღInit": "",
      "n2::n4::n4ღFetching authentication": "",
      "n2::n5ღArticle route": "",
      "n2::n5::n0ღArticle rendering": "",
      "n2::n5::n1ღFetching authentication": "",
      "n2::n5::n2ღInit": "",
      "n2::n5::n3ღChecking user": "",
      "n2::n5::n3::n0ღFetching like authentication": "",
      "n2::n5::n3::n1ღFetching follow authentication": "",
      "n2::n5::n3::n2ღFetching post authentication": "",
      "n2::n5::n3::n3ღFetching comment authentication": "",
      "n2::n5::n3::n4ღFetching delete authentication": "",
      "n2::n5::n4ღcan (un)like": "",
      "n2::n5::n5ღcan (un)follow": "",
    },
    shallow: {
      n0ღInit: "",
      n1ღrouting: "",
      "n2ღApplication core": "",
      "n2::n0ღHome route": "",
      "n2::n0::n0ღFeeds": "",
      "n2::n0::n0::n0ღFetching global feed": "",
      "n2::n0::n0::n0::n0ღInit": "",
      "n2::n0::n0::n0::n1ღPending global feed": "",
      "n2::n0::n0::n0::n2ღPending global feed articles": "",
      "n2::n0::n0::n1ღFetching filtered articles": "",
      "n2::n0::n0::n1::n0ღPending filtered articles": "",
      "n2::n0::n0::n1::n1ღFetched filtered articles": "",
      "n2::n0::n0::n1::n2ღFailed fetch filtered articles": "",
      "n2::n0::n0::n1::n3ღInit": "",
      "n2::n0::n0::n2ღInit": "",
      "n2::n0::n0::n3ღFetching user feed": "",
      "n2::n0::n0::n3::n0ღInit": "",
      "n2::n0::n0::n3::n1ღPending user feed": "",
      "n2::n0::n0::n3::n2ღPending user feed articles": "",
      "n2::n0::n0::n4ღFetching authentication": "",
      "n2::n0::n1ღFetching authentication": "",
      "n2::n0::n2ღInit": "",
      "n2::n1ღSign up route": "",
      "n2::n1::n0ღInit": "",
      "n2::n1::n1ღForm entry": "",
      "n2::n1::n2ღSigning up": "",
      "n2::n1::n3ღFetching authentication": "",
      "n2::n1::n4ღFetching authentication": "",
      "n2::n2ღSign in route": "",
      "n2::n2::n0ღInit": "",
      "n2::n2::n1ღForm entry": "",
      "n2::n2::n2ღSigning in": "",
      "n2::n2::n3ღFetching authentication": "",
      "n2::n2::n4ღFetching authentication": "",
      "n2::n3ღEditor route": "",
      "n2::n3::n0ღInit": "",
      "n2::n3::n1ღEditing new article": "",
      "n2::n3::n2ღPublishing article": "",
      "n2::n3::n3ღFetching authentication": "",
      "n2::n3::n4ღFetching authentication": "",
      "n2::n3::n5ღFetching article": "",
      "n2::n4ღProfile route": "",
      "n2::n4::n0ღUser profile": "",
      "n2::n4::n1ღFetching authentication": "",
      "n2::n4::n2ღFetching authentication": "",
      "n2::n4::n3ღInit": "",
      "n2::n4::n4ღFetching authentication": "",
      "n2::n5ღArticle route": "",
      "n2::n5::n0ღArticle rendering": "",
      "n2::n5::n1ღFetching authentication": "",
      "n2::n5::n2ღInit": "",
      "n2::n5::n3ღChecking user": "",
      "n2::n5::n3::n0ღFetching like authentication": "",
      "n2::n5::n3::n1ღFetching follow authentication": "",
      "n2::n5::n3::n2ღFetching post authentication": "",
      "n2::n5::n3::n3ღFetching comment authentication": "",
      "n2::n5::n3::n4ღFetching delete authentication": "",
      "n2::n5::n4ღcan (un)like": "",
      "n2::n5::n5ღcan (un)follow": "",
    },
  };

  function getAncestors(cs) {
    return parentMap[cs] ? [parentMap[cs]].concat(getAncestors(parentMap[cs])) : [];
  }

  var eventHandlers = {
    nok: {
      init: function (s, ed, stg) {
        let computed = actions["update url"](s, ed, stg);
        cs = "n1ღrouting";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    n1ღrouting: {
      "": function (s, ed, stg) {
        let computed = null;
        if (guards["'/#' route"](s, ed, stg)) {
          computed = { outputs: [], updates: [] };
          cs = "n2::n0ღHome route";
        } else if (guards["'/#register' route"](s, ed, stg)) {
          computed = { outputs: [], updates: [] };
          cs = "n2::n1ღSign up route";
        } else if (guards["'#/login' route"](s, ed, stg)) {
          computed = { outputs: [], updates: [] };
          cs = "n2::n2ღSign in route";
        } else if (guards["'#/@:username' route"](s, ed, stg)) {
          computed = { outputs: [], updates: [] };
          cs = "n2::n4ღProfile route";
        } else if (guards["'#/article/:slug' route"](s, ed, stg)) {
          computed = { outputs: [], updates: [] };
          cs = "n2::n5ღArticle route";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
      "'#": function (s, ed, stg) {
        let computed = actions["editor' route"](s, ed, stg);
        cs = "n2::n3ღEditor route";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n0::n1ღFetching authentication": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = null;
        if (guards["!isAuthenticated"](s, ed, stg)) {
          computed = actions["update url, redirect to signup route"](s, ed, stg);
          cs = "n1ღrouting";
        } else if (guards["authenticated &amp; liked"](s, ed, stg)) {
          computed = actions["request unlike article, update liked, render"](s, ed, stg);
          cs = hs["deep"]["n2::n0::n0ღFeeds"];
        } else if (guards["authenticated &amp; !liked"](s, ed, stg)) {
          computed = actions["request like article, update liked, render"](s, ed, stg);
          cs = hs["deep"]["n2::n0::n0ღFeeds"];
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n1::n4ღFetching authentication": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = null;
        if (guards["isAuthenticated"](s, ed, stg)) {
          computed = actions["update url redirect to home"](s, ed, stg);
          cs = "n1ღrouting";
        } else if (guards["!isAuthenticated"](s, ed, stg)) {
          computed = actions["sign up"](s, ed, stg);
          cs = "n2::n1::n2ღSigning up";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n2::n3ღFetching authentication": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = null;
        if (guards["isAuthenticated"](s, ed, stg)) {
          computed = actions["update url redirect to home"](s, ed, stg);
          cs = "n1ღrouting";
        } else if (guards["!isAuthenticated"](s, ed, stg)) {
          computed = actions["render sign in form"](s, ed, stg);
          cs = "n2::n2::n1ღForm entry";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n2::n2ღSigning in": {
      SUCCEEDED_SIGN_IN: function (s, ed, stg) {
        let computed = actions["save user, update url redirect to home"](s, ed, stg);
        cs = "n1ღrouting";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      FAILED_SIGN_IN: function (s, ed, stg) {
        let computed = actions["render sign in form fetch session data"](s, ed, stg);
        cs = "n2::n2::n3ღFetching authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n1::n3ღFetching authentication": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = null;
        if (guards["isAuthenticated"](s, ed, stg)) {
          computed = actions["update url redirect to home"](s, ed, stg);
          cs = "n1ღrouting";
        } else if (guards["!isAuthenticated"](s, ed, stg)) {
          computed = actions["render sign up form"](s, ed, stg);
          cs = "n2::n1::n1ღForm entry";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n1::n2ღSigning up": {
      SUCCEEDED_SIGN_UP: function (s, ed, stg) {
        let computed = actions["save user, update url redirect to home"](s, ed, stg);
        cs = "n1ღrouting";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      FAILED_SIGN_UP: function (s, ed, stg) {
        let computed = actions["render sign up form fetch session data"](s, ed, stg);
        cs = "n2::n1::n3ღFetching authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2ღApplication core": {
      ROUTE_CHANGED: function (s, ed, stg) {
        let computed = null;
        if (guards["new route?"](s, ed, stg)) {
          computed = actions["update url"](s, ed, stg);
          cs = "n1ღrouting";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n3::n5ღFetching article": {
      FAILED_FETCH_ARTICLE: function (s, ed, stg) {
        let computed = actions["update url redirect home"](s, ed, stg);
        cs = "n1ღrouting";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      FETCHED_ARTICLE: function (s, ed, stg) {
        let computed = actions["fetch session data update editor route state"](s, ed, stg);
        cs = "n2::n3::n3ღFetching authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n3::n4ღFetching authentication": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = null;
        if (guards["!isAuthenticated"](s, ed, stg)) {
          computed = actions["update url redirect to home"](s, ed, stg);
          cs = "n1ღrouting";
        } else if (guards["isAuthenticated"](s, ed, stg)) {
          computed = actions["publish article"](s, ed, stg);
          cs = "n2::n3::n2ღPublishing article";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n3::n2ღPublishing article": {
      SUCCEEDED_PUBLISHING: function (s, ed, stg) {
        let computed = actions["update url redirect to article"](s, ed, stg);
        cs = "n1ღrouting";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      FAILED_PUBLISHING: function (s, ed, stg) {
        let computed = actions["render editor form errors fetch session data"](s, ed, stg);
        cs = "n2::n3::n3ღFetching authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n2::n4ღFetching authentication": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = null;
        if (guards["isAuthenticated"](s, ed, stg)) {
          computed = actions["update url redirect to home"](s, ed, stg);
          cs = "n1ღrouting";
        } else if (guards["!isAuthenticated"](s, ed, stg)) {
          computed = actions["sign in"](s, ed, stg);
          cs = "n2::n2::n2ღSigning in";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n3::n3ღFetching authentication": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = null;
        if (guards["!isAuthenticated"](s, ed, stg)) {
          computed = actions["update url redirect to home"](s, ed, stg);
          cs = "n1ღrouting";
        } else if (guards["isAuthenticated"](s, ed, stg)) {
          computed = actions["render editor form"](s, ed, stg);
          cs = "n2::n3::n1ღEditing new article";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n4::n4ღFetching authentication": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = null;
        if (guards["!isAuthenticated"](s, ed, stg)) {
          computed = actions["update url, redirect to signup route"](s, ed, stg);
          cs = "n1ღrouting";
        } else if (guards["authenticated &amp; followed"](s, ed, stg)) {
          computed = actions["request unfollow profile, render"](s, ed, stg);
          cs = "n2::n4::n0ღUser profile";
        } else if (guards["authenticated &amp; !followed"](s, ed, stg)) {
          computed = actions["request follow profile, render"](s, ed, stg);
          cs = "n2::n4::n0ღUser profile";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n4::n2ღFetching authentication": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = null;
        if (guards["!isAuthenticated"](s, ed, stg)) {
          computed = actions["update url, redirect to signup route"](s, ed, stg);
          cs = "n1ღrouting";
        } else if (guards["authenticated &amp; !liked"](s, ed, stg)) {
          computed = actions["request like article, update liked, render"](s, ed, stg);
          cs = "n2::n4::n0ღUser profile";
        } else if (guards["authenticated &amp; liked"](s, ed, stg)) {
          computed = actions["request unlike article, update liked, render"](s, ed, stg);
          cs = "n2::n4::n0ღUser profile";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n5::n3ღChecking user": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = null;
        if (guards["!authenticateed"](s, ed, stg)) {
          computed = actions["update url redireect to signup route"](s, ed, stg);
          cs = "n1ღrouting";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n5::n0ღArticle rendering": {
      "delete article OK": function (s, ed, stg) {
        let computed = actions["redirect to home"](s, ed, stg);
        cs = "n1ღrouting";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "fetch article failed": function (s, ed, stg) {
        let computed = actions["render articles errors"](s, ed, stg);
        cs = "n2::n5::n0ღArticle rendering";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "fetched article": function (s, ed, stg) {
        let computed = actions["render articles"](s, ed, stg);
        cs = "n2::n5::n0ღArticle rendering";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "fetched comments": function (s, ed, stg) {
        let computed = actions["render comments"](s, ed, stg);
        cs = "n2::n5::n0ღArticle rendering";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      TOGGLE_FOLLOW_OK: function (s, ed, stg) {
        let computed = actions["render follow button"](s, ed, stg);
        cs = "n2::n5::n0ღArticle rendering";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      TOGGLE_FOLLOW_NOK: function (s, ed, stg) {
        let computed = actions["render follow button"](s, ed, stg);
        cs = "n2::n5::n0ღArticle rendering";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "like succeeded": function (s, ed, stg) {
        let computed = actions["update liked, render"](s, ed, stg);
        cs = "n2::n5::n0ღArticle rendering";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "unlike succeeded": function (s, ed, stg) {
        let computed = actions["update liked, render"](s, ed, stg);
        cs = "n2::n5::n0ღArticle rendering";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "unlike failed": function (s, ed, stg) {
        let computed = actions["update liked, render"](s, ed, stg);
        cs = "n2::n5::n0ღArticle rendering";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "like failed": function (s, ed, stg) {
        let computed = actions["update liked, render"](s, ed, stg);
        cs = "n2::n5::n0ღArticle rendering";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "toggled like": function (s, ed, stg) {
        let computed = actions["fetch sesion data"](s, ed, stg);
        cs = "n2::n5::n3::n0ღFetching like authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      TOGGLED_FOLLOW: function (s, ed, stg) {
        let computed = actions["fetch session data"](s, ed, stg);
        cs = "n2::n5::n3::n1ღFetching follow authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "post comment": function (s, ed, stg) {
        let computed = actions["fetch sesion data"](s, ed, stg);
        cs = "n2::n5::n3::n2ღFetching post authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "delete comment": function (s, ed, stg) {
        let computed = actions["fetch sesion data"](s, ed, stg);
        cs = "n2::n5::n3::n3ღFetching comment authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "delete article": function (s, ed, stg) {
        let computed = actions["fetch sesion data"](s, ed, stg);
        cs = "n2::n5::n3::n4ღFetching delete authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "post comment OK": function (s, ed, stg) {
        let computed = actions["update comments render"](s, ed, stg);
        cs = "n2::n5::n0ღArticle rendering";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "delete comment OK": function (s, ed, stg) {
        let computed = actions["update comments render"](s, ed, stg);
        cs = "n2::n5::n0ღArticle rendering";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "API request failed": function (s, ed, stg) {
        let computed = actions["do nothing"](s, ed, stg);
        cs = "n2::n5::n0ღArticle rendering";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n5::n1ღFetching authentication": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = actions["fetch article fetch comments render article loading screen"](s, ed, stg);
        cs = "n2::n5::n0ღArticle rendering";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n5ღArticle route": {
      init: function (s, ed, stg) {
        let computed = actions["fetch session data"](s, ed, stg);
        cs = "n2::n5::n1ღFetching authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n5::n3::n0ღFetching like authentication": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = null;
        if (guards["authenticated"](s, ed, stg)) {
          computed = { outputs: [], updates: [] };
          cs = "n2::n5::n4ღcan (un)like";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n5::n3::n1ღFetching follow authentication": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = null;
        if (guards["authenticated"](s, ed, stg)) {
          computed = { outputs: [], updates: [] };
          cs = "n2::n5::n5ღcan (un)follow";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n5::n3::n2ღFetching post authentication": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = null;
        if (guards["authenticated"](s, ed, stg)) {
          computed = actions["request post comment, update auth render"](s, ed, stg);
          cs = "n2::n5::n0ღArticle rendering";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n5::n3::n3ღFetching comment authentication": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = null;
        if (guards["authenticated"](s, ed, stg)) {
          computed = actions["request delete comment, update auth render"](s, ed, stg);
          cs = "n2::n5::n0ღArticle rendering";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n5::n3::n4ღFetching delete authentication": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = null;
        if (guards["authenticated"](s, ed, stg)) {
          computed = actions["request delete article, update auth render"](s, ed, stg);
          cs = "n2::n5::n0ღArticle rendering";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n5::n4ღcan (un)like": {
      "": function (s, ed, stg) {
        let computed = null;
        if (guards["!liked"](s, ed, stg)) {
          computed = actions["request like article, update pending, render"](s, ed, stg);
          cs = "n2::n5::n0ღArticle rendering";
        } else if (guards["liked"](s, ed, stg)) {
          computed = actions["request unlike article, update pending, render"](s, ed, stg);
          cs = "n2::n5::n0ღArticle rendering";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n5::n5ღcan (un)follow": {
      "": function (s, ed, stg) {
        let computed = null;
        if (guards["followed"](s, ed, stg)) {
          computed = actions["request unfollow profile, render"](s, ed, stg);
          cs = "n2::n5::n0ღArticle rendering";
        } else if (guards["!followed"](s, ed, stg)) {
          computed = actions["request follow profile, render"](s, ed, stg);
          cs = "n2::n5::n0ღArticle rendering";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n4::n0ღUser profile": {
      "clicked page": function (s, ed, stg) {
        let computed = actions["update pagination, fetch session data"](s, ed, stg);
        cs = "n2::n4::n1ღFetching authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "fetched articles failed": function (s, ed, stg) {
        let computed = actions["render articles errors"](s, ed, stg);
        cs = "n2::n4::n0ღUser profile";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "fetched profile failed": function (s, ed, stg) {
        let computed = actions["render articles errors"](s, ed, stg);
        cs = "n2::n4::n0ღUser profile";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "fetched articles": function (s, ed, stg) {
        let computed = actions["render articles"](s, ed, stg);
        cs = "n2::n4::n0ღUser profile";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "fetched profile": function (s, ed, stg) {
        let computed = actions["render profile"](s, ed, stg);
        cs = "n2::n4::n0ღUser profile";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      TOGGLE_FOLLOW_OK: function (s, ed, stg) {
        let computed = actions["render follow button"](s, ed, stg);
        cs = "n2::n4::n0ღUser profile";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      TOGGLE_FOLLOW_NOK: function (s, ed, stg) {
        let computed = actions["render follow button"](s, ed, stg);
        cs = "n2::n4::n0ღUser profile";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "like succeeded": function (s, ed, stg) {
        let computed = actions["update liked, render"](s, ed, stg);
        cs = "n2::n4::n0ღUser profile";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "unlike succeeded": function (s, ed, stg) {
        let computed = actions["update liked, render"](s, ed, stg);
        cs = "n2::n4::n0ღUser profile";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "unlike failed": function (s, ed, stg) {
        let computed = actions["update liked, render"](s, ed, stg);
        cs = "n2::n4::n0ღUser profile";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "like failed": function (s, ed, stg) {
        let computed = actions["update liked, render"](s, ed, stg);
        cs = "n2::n4::n0ღUser profile";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "toggled like": function (s, ed, stg) {
        let computed = actions["fetch sesion data"](s, ed, stg);
        cs = "n2::n4::n2ღFetching authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      TOGGLED_FOLLOW: function (s, ed, stg) {
        let computed = null;
        if (guards["!own profile"](s, ed, stg)) {
          computed = actions["fetch session data"](s, ed, stg);
          cs = "n2::n4::n4ღFetching authentication";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n4::n1ღFetching authentication": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = null;
        if (guards["'#/username' exact route"](s, ed, stg)) {
          computed = actions["fetch articles by username fetch profile render route loading screen update tab type"](
            s,
            ed,
            stg
          );
          cs = "n2::n4::n0ღUser profile";
        } else if (guards["'#/username/favorite' route"](s, ed, stg)) {
          computed = actions[
            "fetch favorite articles by username fetch profile render route loading screen update tab type"
          ](s, ed, stg);
          cs = "n2::n4::n0ღUser profile";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n4ღProfile route": {
      init: function (s, ed, stg) {
        let computed = actions["fetch session data"](s, ed, stg);
        cs = "n2::n4::n1ღFetching authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n3ღEditor route": {
      init: function (s, ed, stg) {
        let computed = null;
        if (guards["otherwise"](s, ed, stg)) {
          computed = actions["fetch session data reset editor route state"](s, ed, stg);
          cs = "n2::n3::n3ღFetching authentication";
        } else if (guards["url = '#/editor/slug'"](s, ed, stg)) {
          computed = actions["fetch article"](s, ed, stg);
          cs = "n2::n3::n5ღFetching article";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n3::n1ღEditing new article": {
      CLCKED_PUBLISH: function (s, ed, stg) {
        let computed = actions["render in-progress status update form data fetch session data"](s, ed, stg);
        cs = "n2::n3::n4ღFetching authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      ADDED_TAG: function (s, ed, stg) {
        let computed = null;
        if (guards["new tag"](s, ed, stg)) {
          computed = actions["render tagList, reset tag field"](s, ed, stg);
          cs = "n2::n3::n1ღEditing new article";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
      REMOVED_TAG: function (s, ed, stg) {
        let computed = actions["render tag list"](s, ed, stg);
        cs = "n2::n3::n1ღEditing new article";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      EDITED_TAG: function (s, ed, stg) {
        let computed = actions["render tag field"](s, ed, stg);
        cs = "n2::n3::n1ღEditing new article";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n0::n0ღFeeds": {
      "clicked user feed": function (s, ed, stg) {
        let computed = actions["reset pagination"](s, ed, stg);
        cs = "n2::n0::n0ღFeeds";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "clicked tag": function (s, ed, stg) {
        let computed = actions["reset pagination"](s, ed, stg);
        cs = "n2::n0::n0::n1ღFetching filtered articles";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "clicked global feed": function (s, ed, stg) {
        let computed = actions["reset pagination"](s, ed, stg);
        cs = "n2::n0::n0::n0ღFetching global feed";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "like succeeded": function (s, ed, stg) {
        let computed = actions["update liked, render"](s, ed, stg);
        cs = hs["deep"]["n2::n0::n0ღFeeds"];
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "like failed": function (s, ed, stg) {
        let computed = actions["update liked, render"](s, ed, stg);
        cs = hs["deep"]["n2::n0::n0ღFeeds"];
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "unlike succeeded": function (s, ed, stg) {
        let computed = actions["update liked, render"](s, ed, stg);
        cs = hs["deep"]["n2::n0::n0ღFeeds"];
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "unlike failed": function (s, ed, stg) {
        let computed = actions["update liked, render"](s, ed, stg);
        cs = hs["deep"]["n2::n0::n0ღFeeds"];
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "clicked like": function (s, ed, stg) {
        let computed = null;
        if (guards["articles fetched"](s, ed, stg)) {
          computed = { outputs: [], updates: [] };
          cs = "n2::n0::n1ღFetching authentication";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
      init: function (s, ed, stg) {
        let computed = actions["fetch session data"](s, ed, stg);
        cs = "n2::n0::n0::n4ღFetching authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n0::n0::n0ღFetching global feed": {
      "clicked page": function (s, ed, stg) {
        let computed = actions["update pagination"](s, ed, stg);
        cs = "n2::n0::n0::n0ღFetching global feed";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "fetched articles": function (s, ed, stg) {
        let computed = actions["render articles"](s, ed, stg);
        cs = hs["deep"]["n2::n0::n0::n0ღFetching global feed"];
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "fetched articles failed": function (s, ed, stg) {
        let computed = actions["render articles errors"](s, ed, stg);
        cs = hs["deep"]["n2::n0::n0::n0ღFetching global feed"];
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      init: function (s, ed, stg) {
        let computed = null;
        if (guards["tags already fetched"](s, ed, stg)) {
          computed = actions["fetch articles render loading"](s, ed, stg);
          cs = "n2::n0::n0::n0::n2ღPending global feed articles";
        } else if (guards["tags not fetched"](s, ed, stg)) {
          computed = actions["fetch tags fetch articles render loading"](s, ed, stg);
          cs = "n2::n0::n0::n0::n1ღPending global feed";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n0::n0::n1ღFetching filtered articles": {
      "clicked page": function (s, ed, stg) {
        let computed = actions["update pagination"](s, ed, stg);
        cs = "n2::n0::n0::n1ღFetching filtered articles";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      init: function (s, ed, stg) {
        let computed = actions["fetch filtered articles render loading"](s, ed, stg);
        cs = "n2::n0::n0::n1::n0ღPending filtered articles";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n0::n0::n3ღFetching user feed": {
      "clicked page": function (s, ed, stg) {
        let computed = actions["update pagination, fetch session data"](s, ed, stg);
        cs = "n2::n0::n0::n4ღFetching authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "fetched articles failed": function (s, ed, stg) {
        let computed = actions["render articles errors"](s, ed, stg);
        cs = hs["deep"]["n2::n0::n0::n3ღFetching user feed"];
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "fetched articles": function (s, ed, stg) {
        let computed = actions["render articles"](s, ed, stg);
        cs = hs["deep"]["n2::n0::n0::n3ღFetching user feed"];
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      init: function (s, ed, stg) {
        let computed = null;
        if (guards["tags already fetched"](s, ed, stg)) {
          computed = actions["fetch articles render loading"](s, ed, stg);
          cs = "n2::n0::n0::n3::n2ღPending user feed articles";
        } else if (guards["tags not fetched"](s, ed, stg)) {
          computed = actions["fetch tags fetch articles render loading"](s, ed, stg);
          cs = "n2::n0::n0::n3::n1ღPending user feed";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n0::n0::n4ღFetching authentication": {
      AUTH_CHECKED: function (s, ed, stg) {
        let computed = null;
        if (guards["isAuthenticated"](s, ed, stg)) {
          computed = actions["update user"](s, ed, stg);
          cs = "n2::n0::n0::n3ღFetching user feed";
        } else if (guards["!isAuthenticated"](s, ed, stg)) {
          computed = actions["update user update (reset) pagination"](s, ed, stg);
          cs = "n2::n0::n0::n0ღFetching global feed";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
          hs = updateHistoryState(hs, getAncestors, cs);
        }

        return computed;
      },
    },
    "n2::n0ღHome route": {
      init: function (s, ed, stg) {
        cs = "n2::n0::n0ღFeeds"; // No action, only cs changes!
        hs = updateHistoryState(hs, getAncestors, cs);

        return { outputs: [], updates: [] };
      },
    },
    "n2::n2ღSign in route": {
      init: function (s, ed, stg) {
        let computed = actions["reset sign in route state fetch session data"](s, ed, stg);
        cs = "n2::n2::n3ღFetching authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n2::n1ღForm entry": {
      CLCKED_SIGN_IN: function (s, ed, stg) {
        let computed = actions["render in-progress status update form data fetch session data"](s, ed, stg);
        cs = "n2::n2::n4ღFetching authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n1ღSign up route": {
      init: function (s, ed, stg) {
        let computed = actions["reset sign up route state fetch session data"](s, ed, stg);
        cs = "n2::n1::n3ღFetching authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n1::n1ღForm entry": {
      CLCKED_SIGN_UP: function (s, ed, stg) {
        let computed = actions["render in-progress status update form data fetch session data"](s, ed, stg);
        cs = "n2::n1::n4ღFetching authentication";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n0::n0::n1::n0ღPending filtered articles": {
      "fetched filtered articles": function (s, ed, stg) {
        let computed = actions["render filtered articles"](s, ed, stg);
        cs = "n2::n0::n0::n1::n1ღFetched filtered articles";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "fetched filtered articles failed": function (s, ed, stg) {
        let computed = actions["render fetched failure"](s, ed, stg);
        cs = "n2::n0::n0::n1::n2ღFailed fetch filtered articles";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n0::n0::n3::n1ღPending user feed": {
      "fetched tags": function (s, ed, stg) {
        let computed = actions["render tags update tags fetched"](s, ed, stg);
        cs = "n2::n0::n0::n3::n1ღPending user feed";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "fetched tags failed": function (s, ed, stg) {
        let computed = actions["render tag errors"](s, ed, stg);
        cs = "n2::n0::n0::n3::n1ღPending user feed";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n0::n0::n0::n1ღPending global feed": {
      "fetched tags": function (s, ed, stg) {
        let computed = actions["render tags update tags fetched"](s, ed, stg);
        cs = "n2::n0::n0::n0::n1ღPending global feed";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
      "fetched tags failed": function (s, ed, stg) {
        let computed = actions["render tag errors"](s, ed, stg);
        cs = "n2::n0::n0::n0::n1ღPending global feed";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
  };
  function process(event) {
    var eventLabel = Object.keys(event)[0];
    var eventData = event[eventLabel];
    var controlStateHandlingEvent = [cs].concat(getAncestors(cs) || []).find(function (controlState) {
      return Boolean(eventHandlers[controlState] && eventHandlers[controlState][eventLabel]);
    });

    if (controlStateHandlingEvent) {
      // Run the handler
      var computed = eventHandlers[controlStateHandlingEvent][eventLabel](es, eventData, stg);

      // cs, es, hs have been updated in place by the handler
      return computed === null
        ? // If transition, but no guards fulfilled => null, else
          null
        : nextEventMap[cs] == null
        ? computed.outputs
        : // Run automatic transition if any
          computed.outputs.concat(process({ [nextEventMap[cs]]: eventData }));
    }
    // Event is not accepted by the machine
    else return null;
  }

  // Start the machine
  process({ ["init"]: initialExtendedState });

  return process;
}

export { createStateMachine };
