function createStateMachine(e,n){var t=e.actionFactories,r=e.guards,a=e.updateState,s=e.initialExtendedState,u="nok",i=s,l={"n4ღidle":{start:function(e,n,r){let s=t["display initial screen"](e,n,r);return u="n3ღweak",e=a(e,s.updates),s}},"n3ღweak":{typed:function(e,n,s){let i=null;return r["!letter and numbers?"](e,n,s)?(i=t["display weak password screen"](e,n,s),u="n3ღweak"):r["letter and numbers?"](e,n,s)&&(i=t["display strong password screen"](e,n,s),u="n2ღstrong"),null!==i&&(e=a(e,i.updates)),i}},"n2ღstrong":{typed:function(e,n,s){let i=null;return r["letter and numbers?"](e,n,s)?(i=t["display strong password screen"](e,n,s),u="n2ღstrong"):r["!letter and numbers?"](e,n,s)&&(i=t["display weak password screen"](e,n,s),u="n3ღweak"),null!==i&&(e=a(e,i.updates)),i},"clicked submit":function(e,n,r){let s=t["display password submitted screen"](e,n,r);return u="n1ღdone",e=a(e,s.updates),s}},nok:{init:function(e,n,t){return u="n4ღidle",{outputs:[],updates:[]}}}};function d(e){var t=Object.keys(e)[0],r=e[t],a=(l[u]||{})[t]&&u;if(a){var s=l[a][t](i,r,n);return null===s?null:s.outputs}return null}return d({init:s}),d}export{createStateMachine};