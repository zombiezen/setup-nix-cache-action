var Ce=Object.create;var $=Object.defineProperty,Ne=Object.defineProperties,Ie=Object.getOwnPropertyDescriptor,Me=Object.getOwnPropertyDescriptors,Be=Object.getOwnPropertyNames,Z=Object.getOwnPropertySymbols,je=Object.getPrototypeOf,ee=Object.prototype.hasOwnProperty,Le=Object.prototype.propertyIsEnumerable;var H=(e,t,r)=>t in e?$(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,te=(e,t)=>{for(var r in t||(t={}))ee.call(t,r)&&H(e,r,t[r]);if(Z)for(var r of Z(t))Le.call(t,r)&&H(e,r,t[r]);return e},re=(e,t)=>Ne(e,Me(t));var y=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var $e=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of Be(t))!ee.call(e,s)&&s!==r&&$(e,s,{get:()=>t[s],enumerable:!(n=Ie(t,s))||n.enumerable});return e};var Ge=(e,t,r)=>(r=e!=null?Ce(je(e)):{},$e(t||!e||!e.__esModule?$(r,"default",{value:e,enumerable:!0}):r,e));var N=y(b=>{"use strict";Object.defineProperty(b,"__esModule",{value:!0});b.toCommandProperties=b.toCommandValue=void 0;function Fe(e){return e==null?"":typeof e=="string"||e instanceof String?e:JSON.stringify(e)}b.toCommandValue=Fe;function Je(e){return Object.keys(e).length?{title:e.title,file:e.file,line:e.startLine,endLine:e.endLine,col:e.startColumn,endColumn:e.endColumn}:{}}b.toCommandProperties=Je});var ie=y(g=>{"use strict";var Ve=g&&g.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),ze=g&&g.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),Ke=g&&g.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var r in e)r!=="default"&&Object.hasOwnProperty.call(e,r)&&Ve(t,e,r);return ze(t,e),t};Object.defineProperty(g,"__esModule",{value:!0});g.issue=g.issueCommand=void 0;var Ye=Ke(require("os")),se=N();function oe(e,t,r){let n=new G(e,t,r);process.stdout.write(n.toString()+Ye.EOL)}g.issueCommand=oe;function Qe(e,t=""){oe(e,{},t)}g.issue=Qe;var ne="::",G=class{constructor(t,r,n){t||(t="missing.command"),this.command=t,this.properties=r,this.message=n}toString(){let t=ne+this.command;if(this.properties&&Object.keys(this.properties).length>0){t+=" ";let r=!0;for(let n in this.properties)if(this.properties.hasOwnProperty(n)){let s=this.properties[n];s&&(r?r=!1:t+=",",t+=`${n}=${Xe(s)}`)}}return t+=`${ne}${We(this.message)}`,t}};function We(e){return se.toCommandValue(e).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A")}function Xe(e){return se.toCommandValue(e).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A").replace(/:/g,"%3A").replace(/,/g,"%2C")}});var ce=y(w=>{"use strict";var Ze=w&&w.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),He=w&&w.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),ue=w&&w.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var r in e)r!=="default"&&Object.hasOwnProperty.call(e,r)&&Ze(t,e,r);return He(t,e),t};Object.defineProperty(w,"__esModule",{value:!0});w.issueCommand=void 0;var ae=ue(require("fs")),et=ue(require("os")),tt=N();function rt(e,t){let r=process.env[`GITHUB_${e}`];if(!r)throw new Error(`Unable to find environment variable for file command ${e}`);if(!ae.existsSync(r))throw new Error(`Missing file at path: ${r}`);ae.appendFileSync(r,`${tt.toCommandValue(t)}${et.EOL}`,{encoding:"utf8"})}w.issueCommand=rt});var fe=y(I=>{"use strict";Object.defineProperty(I,"__esModule",{value:!0});function nt(e){let t=e.protocol==="https:",r;if(le(e))return r;let n;return t?n=process.env.https_proxy||process.env.HTTPS_PROXY:n=process.env.http_proxy||process.env.HTTP_PROXY,n&&(r=new URL(n)),r}I.getProxyUrl=nt;function le(e){if(!e.hostname)return!1;let t=process.env.no_proxy||process.env.NO_PROXY||"";if(!t)return!1;let r;e.port?r=Number(e.port):e.protocol==="http:"?r=80:e.protocol==="https:"&&(r=443);let n=[e.hostname.toUpperCase()];typeof r=="number"&&n.push(`${n[0]}:${r}`);for(let s of t.split(",").map(o=>o.trim().toUpperCase()).filter(o=>o))if(n.some(o=>o===s))return!0;return!1}I.checkBypass=le});var me=y(q=>{"use strict";var zt=require("net"),st=require("tls"),F=require("http"),pe=require("https"),ot=require("events"),Kt=require("assert"),it=require("util");q.httpOverHttp=at;q.httpsOverHttp=ut;q.httpOverHttps=ct;q.httpsOverHttps=lt;function at(e){var t=new S(e);return t.request=F.request,t}function ut(e){var t=new S(e);return t.request=F.request,t.createSocket=he,t.defaultPort=443,t}function ct(e){var t=new S(e);return t.request=pe.request,t}function lt(e){var t=new S(e);return t.request=pe.request,t.createSocket=he,t.defaultPort=443,t}function S(e){var t=this;t.options=e||{},t.proxyOptions=t.options.proxy||{},t.maxSockets=t.options.maxSockets||F.Agent.defaultMaxSockets,t.requests=[],t.sockets=[],t.on("free",function(n,s,o,i){for(var u=de(s,o,i),l=0,c=t.requests.length;l<c;++l){var f=t.requests[l];if(f.host===u.host&&f.port===u.port){t.requests.splice(l,1),f.request.onSocket(n);return}}n.destroy(),t.removeSocket(n)})}it.inherits(S,ot.EventEmitter);S.prototype.addRequest=function(t,r,n,s){var o=this,i=J({request:t},o.options,de(r,n,s));if(o.sockets.length>=this.maxSockets){o.requests.push(i);return}o.createSocket(i,function(u){u.on("free",l),u.on("close",c),u.on("agentRemove",c),t.onSocket(u);function l(){o.emit("free",u,i)}function c(f){o.removeSocket(u),u.removeListener("free",l),u.removeListener("close",c),u.removeListener("agentRemove",c)}})};S.prototype.createSocket=function(t,r){var n=this,s={};n.sockets.push(s);var o=J({},n.proxyOptions,{method:"CONNECT",path:t.host+":"+t.port,agent:!1,headers:{host:t.host+":"+t.port}});t.localAddress&&(o.localAddress=t.localAddress),o.proxyAuth&&(o.headers=o.headers||{},o.headers["Proxy-Authorization"]="Basic "+new Buffer(o.proxyAuth).toString("base64")),O("making CONNECT request");var i=n.request(o);i.useChunkedEncodingByDefault=!1,i.once("response",u),i.once("upgrade",l),i.once("connect",c),i.once("error",f),i.end();function u(p){p.upgrade=!0}function l(p,h,A){process.nextTick(function(){c(p,h,A)})}function c(p,h,A){if(i.removeAllListeners(),h.removeAllListeners(),p.statusCode!==200){O("tunneling socket could not be established, statusCode=%d",p.statusCode),h.destroy();var U=new Error("tunneling socket could not be established, statusCode="+p.statusCode);U.code="ECONNRESET",t.request.emit("error",U),n.removeSocket(s);return}if(A.length>0){O("got illegal response body from proxy"),h.destroy();var U=new Error("got illegal response body from proxy");U.code="ECONNRESET",t.request.emit("error",U),n.removeSocket(s);return}return O("tunneling connection has established"),n.sockets[n.sockets.indexOf(s)]=h,r(h)}function f(p){i.removeAllListeners(),O(`tunneling socket could not be established, cause=%s
`,p.message,p.stack);var h=new Error("tunneling socket could not be established, cause="+p.message);h.code="ECONNRESET",t.request.emit("error",h),n.removeSocket(s)}};S.prototype.removeSocket=function(t){var r=this.sockets.indexOf(t);if(r!==-1){this.sockets.splice(r,1);var n=this.requests.shift();n&&this.createSocket(n,function(s){n.request.onSocket(s)})}};function he(e,t){var r=this;S.prototype.createSocket.call(r,e,function(n){var s=e.request.getHeader("host"),o=J({},r.options,{socket:n,servername:s?s.replace(/:.*$/,""):e.host}),i=st.connect(0,o);r.sockets[r.sockets.indexOf(n)]=i,t(i)})}function de(e,t,r){return typeof e=="string"?{host:e,port:t,localAddress:r}:e}function J(e){for(var t=1,r=arguments.length;t<r;++t){var n=arguments[t];if(typeof n=="object")for(var s=Object.keys(n),o=0,i=s.length;o<i;++o){var u=s[o];n[u]!==void 0&&(e[u]=n[u])}}return e}var O;process.env.NODE_DEBUG&&/\btunnel\b/.test(process.env.NODE_DEBUG)?O=function(){var e=Array.prototype.slice.call(arguments);typeof e[0]=="string"?e[0]="TUNNEL: "+e[0]:e.unshift("TUNNEL:"),console.error.apply(console,e)}:O=function(){};q.debug=O});var _e=y((Qt,ge)=>{ge.exports=me()});var ye=y(m=>{"use strict";Object.defineProperty(m,"__esModule",{value:!0});var M=require("http"),V=require("https"),ve=fe(),P,v;(function(e){e[e.OK=200]="OK",e[e.MultipleChoices=300]="MultipleChoices",e[e.MovedPermanently=301]="MovedPermanently",e[e.ResourceMoved=302]="ResourceMoved",e[e.SeeOther=303]="SeeOther",e[e.NotModified=304]="NotModified",e[e.UseProxy=305]="UseProxy",e[e.SwitchProxy=306]="SwitchProxy",e[e.TemporaryRedirect=307]="TemporaryRedirect",e[e.PermanentRedirect=308]="PermanentRedirect",e[e.BadRequest=400]="BadRequest",e[e.Unauthorized=401]="Unauthorized",e[e.PaymentRequired=402]="PaymentRequired",e[e.Forbidden=403]="Forbidden",e[e.NotFound=404]="NotFound",e[e.MethodNotAllowed=405]="MethodNotAllowed",e[e.NotAcceptable=406]="NotAcceptable",e[e.ProxyAuthenticationRequired=407]="ProxyAuthenticationRequired",e[e.RequestTimeout=408]="RequestTimeout",e[e.Conflict=409]="Conflict",e[e.Gone=410]="Gone",e[e.TooManyRequests=429]="TooManyRequests",e[e.InternalServerError=500]="InternalServerError",e[e.NotImplemented=501]="NotImplemented",e[e.BadGateway=502]="BadGateway",e[e.ServiceUnavailable=503]="ServiceUnavailable",e[e.GatewayTimeout=504]="GatewayTimeout"})(v=m.HttpCodes||(m.HttpCodes={}));var d;(function(e){e.Accept="accept",e.ContentType="content-type"})(d=m.Headers||(m.Headers={}));var E;(function(e){e.ApplicationJson="application/json"})(E=m.MediaTypes||(m.MediaTypes={}));function ft(e){let t=ve.getProxyUrl(new URL(e));return t?t.href:""}m.getProxyUrl=ft;var pt=[v.MovedPermanently,v.ResourceMoved,v.SeeOther,v.TemporaryRedirect,v.PermanentRedirect],ht=[v.BadGateway,v.ServiceUnavailable,v.GatewayTimeout],dt=["OPTIONS","GET","DELETE","HEAD"],mt=10,gt=5,x=class extends Error{constructor(t,r){super(t),this.name="HttpClientError",this.statusCode=r,Object.setPrototypeOf(this,x.prototype)}};m.HttpClientError=x;var B=class{constructor(t){this.message=t}readBody(){return new Promise(async(t,r)=>{let n=Buffer.alloc(0);this.message.on("data",s=>{n=Buffer.concat([n,s])}),this.message.on("end",()=>{t(n.toString())})})}};m.HttpClientResponse=B;function _t(e){return new URL(e).protocol==="https:"}m.isHttps=_t;var k=class{constructor(t,r,n){this._ignoreSslError=!1,this._allowRedirects=!0,this._allowRedirectDowngrade=!1,this._maxRedirects=50,this._allowRetries=!1,this._maxRetries=1,this._keepAlive=!1,this._disposed=!1,this.userAgent=t,this.handlers=r||[],this.requestOptions=n,n&&(n.ignoreSslError!=null&&(this._ignoreSslError=n.ignoreSslError),this._socketTimeout=n.socketTimeout,n.allowRedirects!=null&&(this._allowRedirects=n.allowRedirects),n.allowRedirectDowngrade!=null&&(this._allowRedirectDowngrade=n.allowRedirectDowngrade),n.maxRedirects!=null&&(this._maxRedirects=Math.max(n.maxRedirects,0)),n.keepAlive!=null&&(this._keepAlive=n.keepAlive),n.allowRetries!=null&&(this._allowRetries=n.allowRetries),n.maxRetries!=null&&(this._maxRetries=n.maxRetries))}options(t,r){return this.request("OPTIONS",t,null,r||{})}get(t,r){return this.request("GET",t,null,r||{})}del(t,r){return this.request("DELETE",t,null,r||{})}post(t,r,n){return this.request("POST",t,r,n||{})}patch(t,r,n){return this.request("PATCH",t,r,n||{})}put(t,r,n){return this.request("PUT",t,r,n||{})}head(t,r){return this.request("HEAD",t,null,r||{})}sendStream(t,r,n,s){return this.request(t,r,n,s)}async getJson(t,r={}){r[d.Accept]=this._getExistingOrDefaultHeader(r,d.Accept,E.ApplicationJson);let n=await this.get(t,r);return this._processResponse(n,this.requestOptions)}async postJson(t,r,n={}){let s=JSON.stringify(r,null,2);n[d.Accept]=this._getExistingOrDefaultHeader(n,d.Accept,E.ApplicationJson),n[d.ContentType]=this._getExistingOrDefaultHeader(n,d.ContentType,E.ApplicationJson);let o=await this.post(t,s,n);return this._processResponse(o,this.requestOptions)}async putJson(t,r,n={}){let s=JSON.stringify(r,null,2);n[d.Accept]=this._getExistingOrDefaultHeader(n,d.Accept,E.ApplicationJson),n[d.ContentType]=this._getExistingOrDefaultHeader(n,d.ContentType,E.ApplicationJson);let o=await this.put(t,s,n);return this._processResponse(o,this.requestOptions)}async patchJson(t,r,n={}){let s=JSON.stringify(r,null,2);n[d.Accept]=this._getExistingOrDefaultHeader(n,d.Accept,E.ApplicationJson),n[d.ContentType]=this._getExistingOrDefaultHeader(n,d.ContentType,E.ApplicationJson);let o=await this.patch(t,s,n);return this._processResponse(o,this.requestOptions)}async request(t,r,n,s){if(this._disposed)throw new Error("Client has already been disposed.");let o=new URL(r),i=this._prepareRequest(t,o,s),u=this._allowRetries&&dt.indexOf(t)!=-1?this._maxRetries+1:1,l=0,c;for(;l<u;){if(c=await this.requestRaw(i,n),c&&c.message&&c.message.statusCode===v.Unauthorized){let p;for(let h=0;h<this.handlers.length;h++)if(this.handlers[h].canHandleAuthentication(c)){p=this.handlers[h];break}return p?p.handleAuthentication(this,i,n):c}let f=this._maxRedirects;for(;pt.indexOf(c.message.statusCode)!=-1&&this._allowRedirects&&f>0;){let p=c.message.headers.location;if(!p)break;let h=new URL(p);if(o.protocol=="https:"&&o.protocol!=h.protocol&&!this._allowRedirectDowngrade)throw new Error("Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.");if(await c.readBody(),h.hostname!==o.hostname)for(let A in s)A.toLowerCase()==="authorization"&&delete s[A];i=this._prepareRequest(t,h,s),c=await this.requestRaw(i,n),f--}if(ht.indexOf(c.message.statusCode)==-1)return c;l+=1,l<u&&(await c.readBody(),await this._performExponentialBackoff(l))}return c}dispose(){this._agent&&this._agent.destroy(),this._disposed=!0}requestRaw(t,r){return new Promise((n,s)=>{let o=function(i,u){i&&s(i),n(u)};this.requestRawWithCallback(t,r,o)})}requestRawWithCallback(t,r,n){let s;typeof r=="string"&&(t.options.headers["Content-Length"]=Buffer.byteLength(r,"utf8"));let o=!1,i=(l,c)=>{o||(o=!0,n(l,c))},u=t.httpModule.request(t.options,l=>{let c=new B(l);i(null,c)});u.on("socket",l=>{s=l}),u.setTimeout(this._socketTimeout||3*6e4,()=>{s&&s.end(),i(new Error("Request timeout: "+t.options.path),null)}),u.on("error",function(l){i(l,null)}),r&&typeof r=="string"&&u.write(r,"utf8"),r&&typeof r!="string"?(r.on("close",function(){u.end()}),r.pipe(u)):u.end()}getAgent(t){let r=new URL(t);return this._getAgent(r)}_prepareRequest(t,r,n){let s={};s.parsedUrl=r;let o=s.parsedUrl.protocol==="https:";s.httpModule=o?V:M;let i=o?443:80;return s.options={},s.options.host=s.parsedUrl.hostname,s.options.port=s.parsedUrl.port?parseInt(s.parsedUrl.port):i,s.options.path=(s.parsedUrl.pathname||"")+(s.parsedUrl.search||""),s.options.method=t,s.options.headers=this._mergeHeaders(n),this.userAgent!=null&&(s.options.headers["user-agent"]=this.userAgent),s.options.agent=this._getAgent(s.parsedUrl),this.handlers&&this.handlers.forEach(u=>{u.prepareRequest(s.options)}),s}_mergeHeaders(t){let r=n=>Object.keys(n).reduce((s,o)=>(s[o.toLowerCase()]=n[o],s),{});return this.requestOptions&&this.requestOptions.headers?Object.assign({},r(this.requestOptions.headers),r(t)):r(t||{})}_getExistingOrDefaultHeader(t,r,n){let s=i=>Object.keys(i).reduce((u,l)=>(u[l.toLowerCase()]=i[l],u),{}),o;return this.requestOptions&&this.requestOptions.headers&&(o=s(this.requestOptions.headers)[r]),t[r]||o||n}_getAgent(t){let r,n=ve.getProxyUrl(t),s=n&&n.hostname;if(this._keepAlive&&s&&(r=this._proxyAgent),this._keepAlive&&!s&&(r=this._agent),r)return r;let o=t.protocol==="https:",i=100;if(this.requestOptions&&(i=this.requestOptions.maxSockets||M.globalAgent.maxSockets),s){P||(P=_e());let u={maxSockets:i,keepAlive:this._keepAlive,proxy:re(te({},(n.username||n.password)&&{proxyAuth:`${n.username}:${n.password}`}),{host:n.hostname,port:n.port})},l,c=n.protocol==="https:";o?l=c?P.httpsOverHttps:P.httpsOverHttp:l=c?P.httpOverHttps:P.httpOverHttp,r=l(u),this._proxyAgent=r}if(this._keepAlive&&!r){let u={keepAlive:this._keepAlive,maxSockets:i};r=o?new V.Agent(u):new M.Agent(u),this._agent=r}return r||(r=o?V.globalAgent:M.globalAgent),o&&this._ignoreSslError&&(r.options=Object.assign(r.options||{},{rejectUnauthorized:!1})),r}_performExponentialBackoff(t){t=Math.min(mt,t);let r=gt*Math.pow(2,t);return new Promise(n=>setTimeout(()=>n(),r))}static dateTimeDeserializer(t,r){if(typeof r=="string"){let n=new Date(r);if(!isNaN(n.valueOf()))return n}return r}async _processResponse(t,r){return new Promise(async(n,s)=>{let o=t.message.statusCode,i={statusCode:o,result:null,headers:{}};o==v.NotFound&&n(i);let u,l;try{l=await t.readBody(),l&&l.length>0&&(r&&r.deserializeDates?u=JSON.parse(l,k.dateTimeDeserializer):u=JSON.parse(l),i.result=u),i.headers=t.message.headers}catch{}if(o>299){let c;u&&u.message?c=u.message:l&&l.length>0?c=l:c="Failed request: ("+o+")";let f=new x(c,o);f.result=i.result,s(f)}else n(i)})}};m.HttpClient=k});var we=y(C=>{"use strict";Object.defineProperty(C,"__esModule",{value:!0});var z=class{constructor(t,r){this.username=t,this.password=r}prepareRequest(t){t.headers.Authorization="Basic "+Buffer.from(this.username+":"+this.password).toString("base64")}canHandleAuthentication(t){return!1}handleAuthentication(t,r,n){return null}};C.BasicCredentialHandler=z;var K=class{constructor(t){this.token=t}prepareRequest(t){t.headers.Authorization="Bearer "+this.token}canHandleAuthentication(t){return!1}handleAuthentication(t,r,n){return null}};C.BearerCredentialHandler=K;var Y=class{constructor(t){this.token=t}prepareRequest(t){t.headers.Authorization="Basic "+Buffer.from("PAT:"+this.token).toString("base64")}canHandleAuthentication(t){return!1}handleAuthentication(t,r,n){return null}};C.PersonalAccessTokenCredentialHandler=Y});var Oe=y(D=>{"use strict";var Se=D&&D.__awaiter||function(e,t,r,n){function s(o){return o instanceof r?o:new r(function(i){i(o)})}return new(r||(r=Promise))(function(o,i){function u(f){try{c(n.next(f))}catch(p){i(p)}}function l(f){try{c(n.throw(f))}catch(p){i(p)}}function c(f){f.done?o(f.value):s(f.value).then(u,l)}c((n=n.apply(e,t||[])).next())})};Object.defineProperty(D,"__esModule",{value:!0});D.OidcClient=void 0;var vt=ye(),yt=we(),Re=Q(),T=class{static createHttpClient(t=!0,r=10){let n={allowRetries:t,maxRetries:r};return new vt.HttpClient("actions/oidc-client",[new yt.BearerCredentialHandler(T.getRequestToken())],n)}static getRequestToken(){let t=process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;if(!t)throw new Error("Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable");return t}static getIDTokenUrl(){let t=process.env.ACTIONS_ID_TOKEN_REQUEST_URL;if(!t)throw new Error("Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable");return t}static getCall(t){var r;return Se(this,void 0,void 0,function*(){let o=(r=(yield T.createHttpClient().getJson(t).catch(i=>{throw new Error(`Failed to get ID Token. 
 
        Error Code : ${i.statusCode}
 
        Error Message: ${i.result.message}`)})).result)===null||r===void 0?void 0:r.value;if(!o)throw new Error("Response json body do not have ID Token field");return o})}static getIDToken(t){return Se(this,void 0,void 0,function*(){try{let r=T.getIDTokenUrl();if(t){let s=encodeURIComponent(t);r=`${r}&audience=${s}`}Re.debug(`ID token url is ${r}`);let n=yield T.getCall(r);return Re.setSecret(n),n}catch(r){throw new Error(`Error message: ${r.message}`)}})}};D.OidcClient=T});var Q=y(a=>{"use strict";var wt=a&&a.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),St=a&&a.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),Ee=a&&a.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var r in e)r!=="default"&&Object.hasOwnProperty.call(e,r)&&wt(t,e,r);return St(t,e),t},Te=a&&a.__awaiter||function(e,t,r,n){function s(o){return o instanceof r?o:new r(function(i){i(o)})}return new(r||(r=Promise))(function(o,i){function u(f){try{c(n.next(f))}catch(p){i(p)}}function l(f){try{c(n.throw(f))}catch(p){i(p)}}function c(f){f.done?o(f.value):s(f.value).then(u,l)}c((n=n.apply(e,t||[])).next())})};Object.defineProperty(a,"__esModule",{value:!0});a.getIDToken=a.getState=a.saveState=a.group=a.endGroup=a.startGroup=a.info=a.notice=a.warning=a.error=a.debug=a.isDebug=a.setFailed=a.setCommandEcho=a.setOutput=a.getBooleanInput=a.getMultilineInput=a.getInput=a.addPath=a.setSecret=a.exportVariable=a.ExitCode=void 0;var _=ie(),Ae=ce(),L=N(),j=Ee(require("os")),Rt=Ee(require("path")),Ot=Oe(),be;(function(e){e[e.Success=0]="Success",e[e.Failure=1]="Failure"})(be=a.ExitCode||(a.ExitCode={}));function Et(e,t){let r=L.toCommandValue(t);if(process.env[e]=r,process.env.GITHUB_ENV||""){let s="_GitHubActionsFileCommandDelimeter_",o=`${e}<<${s}${j.EOL}${r}${j.EOL}${s}`;Ae.issueCommand("ENV",o)}else _.issueCommand("set-env",{name:e},r)}a.exportVariable=Et;function Tt(e){_.issueCommand("add-mask",{},e)}a.setSecret=Tt;function At(e){process.env.GITHUB_PATH||""?Ae.issueCommand("PATH",e):_.issueCommand("add-path",{},e),process.env.PATH=`${e}${Rt.delimiter}${process.env.PATH}`}a.addPath=At;function W(e,t){let r=process.env[`INPUT_${e.replace(/ /g,"_").toUpperCase()}`]||"";if(t&&t.required&&!r)throw new Error(`Input required and not supplied: ${e}`);return t&&t.trimWhitespace===!1?r:r.trim()}a.getInput=W;function bt(e,t){return W(e,t).split(`
`).filter(n=>n!=="")}a.getMultilineInput=bt;function qt(e,t){let r=["true","True","TRUE"],n=["false","False","FALSE"],s=W(e,t);if(r.includes(s))return!0;if(n.includes(s))return!1;throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${e}
Support boolean input list: \`true | True | TRUE | false | False | FALSE\``)}a.getBooleanInput=qt;function Pt(e,t){process.stdout.write(j.EOL),_.issueCommand("set-output",{name:e},t)}a.setOutput=Pt;function xt(e){_.issue("echo",e?"on":"off")}a.setCommandEcho=xt;function Dt(e){process.exitCode=be.Failure,qe(e)}a.setFailed=Dt;function Ut(){return process.env.RUNNER_DEBUG==="1"}a.isDebug=Ut;function kt(e){_.issueCommand("debug",{},e)}a.debug=kt;function qe(e,t={}){_.issueCommand("error",L.toCommandProperties(t),e instanceof Error?e.toString():e)}a.error=qe;function Ct(e,t={}){_.issueCommand("warning",L.toCommandProperties(t),e instanceof Error?e.toString():e)}a.warning=Ct;function Nt(e,t={}){_.issueCommand("notice",L.toCommandProperties(t),e instanceof Error?e.toString():e)}a.notice=Nt;function It(e){process.stdout.write(e+j.EOL)}a.info=It;function Pe(e){_.issue("group",e)}a.startGroup=Pe;function xe(){_.issue("endgroup")}a.endGroup=xe;function Mt(e,t){return Te(this,void 0,void 0,function*(){Pe(e);let r;try{r=yield t()}finally{xe()}return r})}a.group=Mt;function Bt(e,t){_.issueCommand("save-state",{name:e},t)}a.saveState=Bt;function jt(e){return process.env[`STATE_${e}`]||""}a.getState=jt;function Lt(e){return Te(this,void 0,void 0,function*(){return yield Ot.OidcClient.getIDToken(e)})}a.getIDToken=Lt});var R=Ge(Q());var De=require("child_process"),Ue="tempdir",ke="systemd";function X(e,t){let r=(0,De.spawn)("sudo",e,{stdio:["ignore","ignore",t?.ignoreStderr?"ignore":"inherit"]});return new Promise((n,s)=>{r.on("close",o=>{o===0?n():s(new Error(e[0]+" exited with "+o))})})}(async()=>{try{let e=(0,R.getState)(Ue);e&&((0,R.info)("Removing "+e+"..."),await X(["rm","-rf",e]));let t=(0,R.getState)(ke);t&&((0,R.info)("Removing "+t+"..."),await X(["rm","-f",t]))}catch(e){e instanceof Error?(0,R.setFailed)(e.message):(0,R.setFailed)(e+"")}})();
/**
@license
Copyright 2022 Ross Light

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
**/
