"use strict";var It=Object.create;var G=Object.defineProperty;var Nt=Object.getOwnPropertyDescriptor;var Bt=Object.getOwnPropertyNames;var jt=Object.getPrototypeOf,kt=Object.prototype.hasOwnProperty;var v=(e,t)=>()=>(e&&(t=e(e=0)),t);var O=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),$t=(e,t)=>{for(var r in t)G(e,r,{get:t[r],enumerable:!0})},Ae=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Bt(t))!kt.call(e,i)&&i!==r&&G(e,i,{get:()=>t[i],enumerable:!(n=Nt(t,i))||n.enumerable});return e};var J=(e,t,r)=>(r=e!=null?It(jt(e)):{},Ae(t||!e||!e.__esModule?G(r,"default",{value:e,enumerable:!0}):r,e)),Lt=e=>Ae(G({},"__esModule",{value:!0}),e);var K=O(I=>{"use strict";Object.defineProperty(I,"__esModule",{value:!0});I.toCommandProperties=I.toCommandValue=void 0;function Vt(e){return e==null?"":typeof e=="string"||e instanceof String?e:JSON.stringify(e)}I.toCommandValue=Vt;function Ft(e){return Object.keys(e).length?{title:e.title,file:e.file,line:e.startLine,endLine:e.endLine,col:e.startColumn,endColumn:e.endColumn}:{}}I.toCommandProperties=Ft});var Me=O(E=>{"use strict";var Gt=E&&E.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),Jt=E&&E.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),Kt=E&&E.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var r in e)r!=="default"&&Object.hasOwnProperty.call(e,r)&&Gt(t,e,r);return Jt(t,e),t};Object.defineProperty(E,"__esModule",{value:!0});E.issue=E.issueCommand=void 0;var Yt=Kt(require("os")),Ue=K();function Ce(e,t,r){let n=new ne(e,t,r);process.stdout.write(n.toString()+Yt.EOL)}E.issueCommand=Ce;function zt(e,t=""){Ce(e,{},t)}E.issue=zt;var qe="::",ne=class{constructor(t,r,n){t||(t="missing.command"),this.command=t,this.properties=r,this.message=n}toString(){let t=qe+this.command;if(this.properties&&Object.keys(this.properties).length>0){t+=" ";let r=!0;for(let n in this.properties)if(this.properties.hasOwnProperty(n)){let i=this.properties[n];i&&(r?r=!1:t+=",",t+=`${n}=${Wt(i)}`)}}return t+=`${qe}${Ht(this.message)}`,t}};function Ht(e){return Ue.toCommandValue(e).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A")}function Wt(e){return Ue.toCommandValue(e).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A").replace(/:/g,"%3A").replace(/,/g,"%2C")}});function L(){return Y>z.length-16&&(De.default.randomFillSync(z),Y=0),z.slice(Y,Y+=16)}var De,z,Y,ie=v(()=>{De=J(require("crypto")),z=new Uint8Array(256),Y=z.length});var Ie,Ne=v(()=>{Ie=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i});function Qt(e){return typeof e=="string"&&Ie.test(e)}var A,V=v(()=>{Ne();A=Qt});function Xt(e,t=0){let r=(g[e[t+0]]+g[e[t+1]]+g[e[t+2]]+g[e[t+3]]+"-"+g[e[t+4]]+g[e[t+5]]+"-"+g[e[t+6]]+g[e[t+7]]+"-"+g[e[t+8]]+g[e[t+9]]+"-"+g[e[t+10]]+g[e[t+11]]+g[e[t+12]]+g[e[t+13]]+g[e[t+14]]+g[e[t+15]]).toLowerCase();if(!A(r))throw TypeError("Stringified UUID is invalid");return r}var g,q,F=v(()=>{V();g=[];for(let e=0;e<256;++e)g.push((e+256).toString(16).substr(1));q=Xt});function Zt(e,t,r){let n=t&&r||0,i=t||new Array(16);e=e||{};let o=e.node||Be,s=e.clockseq!==void 0?e.clockseq:oe;if(o==null||s==null){let h=e.random||(e.rng||L)();o==null&&(o=Be=[h[0]|1,h[1],h[2],h[3],h[4],h[5]]),s==null&&(s=oe=(h[6]<<8|h[7])&16383)}let c=e.msecs!==void 0?e.msecs:Date.now(),l=e.nsecs!==void 0?e.nsecs:ae+1,a=c-se+(l-ae)/1e4;if(a<0&&e.clockseq===void 0&&(s=s+1&16383),(a<0||c>se)&&e.nsecs===void 0&&(l=0),l>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");se=c,ae=l,oe=s,c+=122192928e5;let u=((c&268435455)*1e4+l)%4294967296;i[n++]=u>>>24&255,i[n++]=u>>>16&255,i[n++]=u>>>8&255,i[n++]=u&255;let d=c/4294967296*1e4&268435455;i[n++]=d>>>8&255,i[n++]=d&255,i[n++]=d>>>24&15|16,i[n++]=d>>>16&255,i[n++]=s>>>8|128,i[n++]=s&255;for(let h=0;h<6;++h)i[n+h]=o[h];return t||q(i)}var Be,oe,se,ae,je,ke=v(()=>{ie();F();se=0,ae=0;je=Zt});function er(e){if(!A(e))throw TypeError("Invalid UUID");let t,r=new Uint8Array(16);return r[0]=(t=parseInt(e.slice(0,8),16))>>>24,r[1]=t>>>16&255,r[2]=t>>>8&255,r[3]=t&255,r[4]=(t=parseInt(e.slice(9,13),16))>>>8,r[5]=t&255,r[6]=(t=parseInt(e.slice(14,18),16))>>>8,r[7]=t&255,r[8]=(t=parseInt(e.slice(19,23),16))>>>8,r[9]=t&255,r[10]=(t=parseInt(e.slice(24,36),16))/1099511627776&255,r[11]=t/4294967296&255,r[12]=t>>>24&255,r[13]=t>>>16&255,r[14]=t>>>8&255,r[15]=t&255,r}var H,ue=v(()=>{V();H=er});function tr(e){e=unescape(encodeURIComponent(e));let t=[];for(let r=0;r<e.length;++r)t.push(e.charCodeAt(r));return t}function W(e,t,r){function n(i,o,s,c){if(typeof i=="string"&&(i=tr(i)),typeof o=="string"&&(o=H(o)),o.length!==16)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");let l=new Uint8Array(16+i.length);if(l.set(o),l.set(i,o.length),l=r(l),l[6]=l[6]&15|t,l[8]=l[8]&63|128,s){c=c||0;for(let a=0;a<16;++a)s[c+a]=l[a];return s}return q(l)}try{n.name=e}catch{}return n.DNS=rr,n.URL=nr,n}var rr,nr,ce=v(()=>{F();ue();rr="6ba7b810-9dad-11d1-80b4-00c04fd430c8",nr="6ba7b811-9dad-11d1-80b4-00c04fd430c8"});function ir(e){return Array.isArray(e)?e=Buffer.from(e):typeof e=="string"&&(e=Buffer.from(e,"utf8")),$e.default.createHash("md5").update(e).digest()}var $e,Le,Ve=v(()=>{$e=J(require("crypto"));Le=ir});var or,Fe,Ge=v(()=>{ce();Ve();or=W("v3",48,Le),Fe=or});function sr(e,t,r){e=e||{};let n=e.random||(e.rng||L)();if(n[6]=n[6]&15|64,n[8]=n[8]&63|128,t){r=r||0;for(let i=0;i<16;++i)t[r+i]=n[i];return t}return q(n)}var Je,Ke=v(()=>{ie();F();Je=sr});function ar(e){return Array.isArray(e)?e=Buffer.from(e):typeof e=="string"&&(e=Buffer.from(e,"utf8")),Ye.default.createHash("sha1").update(e).digest()}var Ye,ze,He=v(()=>{Ye=J(require("crypto"));ze=ar});var ur,We,Qe=v(()=>{ce();He();ur=W("v5",80,ze),We=ur});var Xe,Ze=v(()=>{Xe="00000000-0000-0000-0000-000000000000"});function cr(e){if(!A(e))throw TypeError("Invalid UUID");return parseInt(e.substr(14,1),16)}var et,tt=v(()=>{V();et=cr});var rt={};$t(rt,{NIL:()=>Xe,parse:()=>H,stringify:()=>q,v1:()=>je,v3:()=>Fe,v4:()=>Je,v5:()=>We,validate:()=>A,version:()=>et});var nt=v(()=>{ke();Ge();Ke();Qe();Ze();tt();V();F();ue()});var at=O(S=>{"use strict";var lr=S&&S.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),fr=S&&S.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),ot=S&&S.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var r in e)r!=="default"&&Object.hasOwnProperty.call(e,r)&&lr(t,e,r);return fr(t,e),t};Object.defineProperty(S,"__esModule",{value:!0});S.prepareKeyValueMessage=S.issueFileCommand=void 0;var it=ot(require("fs")),le=ot(require("os")),dr=(nt(),Lt(rt)),st=K();function hr(e,t){let r=process.env[`GITHUB_${e}`];if(!r)throw new Error(`Unable to find environment variable for file command ${e}`);if(!it.existsSync(r))throw new Error(`Missing file at path: ${r}`);it.appendFileSync(r,`${st.toCommandValue(t)}${le.EOL}`,{encoding:"utf8"})}S.issueFileCommand=hr;function pr(e,t){let r=`ghadelimiter_${dr.v4()}`,n=st.toCommandValue(t);if(e.includes(r))throw new Error(`Unexpected input: name should not contain the delimiter "${r}"`);if(n.includes(r))throw new Error(`Unexpected input: value should not contain the delimiter "${r}"`);return`${e}<<${r}${le.EOL}${n}${le.EOL}${r}`}S.prepareKeyValueMessage=pr});var ct=O(N=>{"use strict";Object.defineProperty(N,"__esModule",{value:!0});N.checkBypass=N.getProxyUrl=void 0;function mr(e){let t=e.protocol==="https:";if(ut(e))return;let r=(()=>t?process.env.https_proxy||process.env.HTTPS_PROXY:process.env.http_proxy||process.env.HTTP_PROXY)();if(r)return new URL(r)}N.getProxyUrl=mr;function ut(e){if(!e.hostname)return!1;let t=process.env.no_proxy||process.env.NO_PROXY||"";if(!t)return!1;let r;e.port?r=Number(e.port):e.protocol==="http:"?r=80:e.protocol==="https:"&&(r=443);let n=[e.hostname.toUpperCase()];typeof r=="number"&&n.push(`${n[0]}:${r}`);for(let i of t.split(",").map(o=>o.trim().toUpperCase()).filter(o=>o))if(n.some(o=>o===i))return!0;return!1}N.checkBypass=ut});var ht=O(B=>{"use strict";var ni=require("net"),gr=require("tls"),fe=require("http"),lt=require("https"),vr=require("events"),ii=require("assert"),_r=require("util");B.httpOverHttp=yr;B.httpsOverHttp=wr;B.httpOverHttps=Or;B.httpsOverHttps=Er;function yr(e){var t=new P(e);return t.request=fe.request,t}function wr(e){var t=new P(e);return t.request=fe.request,t.createSocket=ft,t.defaultPort=443,t}function Or(e){var t=new P(e);return t.request=lt.request,t}function Er(e){var t=new P(e);return t.request=lt.request,t.createSocket=ft,t.defaultPort=443,t}function P(e){var t=this;t.options=e||{},t.proxyOptions=t.options.proxy||{},t.maxSockets=t.options.maxSockets||fe.Agent.defaultMaxSockets,t.requests=[],t.sockets=[],t.on("free",function(n,i,o,s){for(var c=dt(i,o,s),l=0,a=t.requests.length;l<a;++l){var u=t.requests[l];if(u.host===c.host&&u.port===c.port){t.requests.splice(l,1),u.request.onSocket(n);return}}n.destroy(),t.removeSocket(n)})}_r.inherits(P,vr.EventEmitter);P.prototype.addRequest=function(t,r,n,i){var o=this,s=de({request:t},o.options,dt(r,n,i));if(o.sockets.length>=this.maxSockets){o.requests.push(s);return}o.createSocket(s,function(c){c.on("free",l),c.on("close",a),c.on("agentRemove",a),t.onSocket(c);function l(){o.emit("free",c,s)}function a(u){o.removeSocket(c),c.removeListener("free",l),c.removeListener("close",a),c.removeListener("agentRemove",a)}})};P.prototype.createSocket=function(t,r){var n=this,i={};n.sockets.push(i);var o=de({},n.proxyOptions,{method:"CONNECT",path:t.host+":"+t.port,agent:!1,headers:{host:t.host+":"+t.port}});t.localAddress&&(o.localAddress=t.localAddress),o.proxyAuth&&(o.headers=o.headers||{},o.headers["Proxy-Authorization"]="Basic "+new Buffer(o.proxyAuth).toString("base64")),U("making CONNECT request");var s=n.request(o);s.useChunkedEncodingByDefault=!1,s.once("response",c),s.once("upgrade",l),s.once("connect",a),s.once("error",u),s.end();function c(d){d.upgrade=!0}function l(d,h,D){process.nextTick(function(){a(d,h,D)})}function a(d,h,D){if(s.removeAllListeners(),h.removeAllListeners(),d.statusCode!==200){U("tunneling socket could not be established, statusCode=%d",d.statusCode),h.destroy();var $=new Error("tunneling socket could not be established, statusCode="+d.statusCode);$.code="ECONNRESET",t.request.emit("error",$),n.removeSocket(i);return}if(D.length>0){U("got illegal response body from proxy"),h.destroy();var $=new Error("got illegal response body from proxy");$.code="ECONNRESET",t.request.emit("error",$),n.removeSocket(i);return}return U("tunneling connection has established"),n.sockets[n.sockets.indexOf(i)]=h,r(h)}function u(d){s.removeAllListeners(),U(`tunneling socket could not be established, cause=%s
`,d.message,d.stack);var h=new Error("tunneling socket could not be established, cause="+d.message);h.code="ECONNRESET",t.request.emit("error",h),n.removeSocket(i)}};P.prototype.removeSocket=function(t){var r=this.sockets.indexOf(t);if(r!==-1){this.sockets.splice(r,1);var n=this.requests.shift();n&&this.createSocket(n,function(i){n.request.onSocket(i)})}};function ft(e,t){var r=this;P.prototype.createSocket.call(r,e,function(n){var i=e.request.getHeader("host"),o=de({},r.options,{socket:n,servername:i?i.replace(/:.*$/,""):e.host}),s=gr.connect(0,o);r.sockets[r.sockets.indexOf(n)]=s,t(s)})}function dt(e,t,r){return typeof e=="string"?{host:e,port:t,localAddress:r}:e}function de(e){for(var t=1,r=arguments.length;t<r;++t){var n=arguments[t];if(typeof n=="object")for(var i=Object.keys(n),o=0,s=i.length;o<s;++o){var c=i[o];n[c]!==void 0&&(e[c]=n[c])}}return e}var U;process.env.NODE_DEBUG&&/\btunnel\b/.test(process.env.NODE_DEBUG)?U=function(){var e=Array.prototype.slice.call(arguments);typeof e[0]=="string"?e[0]="TUNNEL: "+e[0]:e.unshift("TUNNEL:"),console.error.apply(console,e)}:U=function(){};B.debug=U});var mt=O((si,pt)=>{pt.exports=ht()});var vt=O(p=>{"use strict";var Sr=p&&p.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),Rr=p&&p.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),re=p&&p.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var r in e)r!=="default"&&Object.hasOwnProperty.call(e,r)&&Sr(t,e,r);return Rr(t,e),t},m=p&&p.__awaiter||function(e,t,r,n){function i(o){return o instanceof r?o:new r(function(s){s(o)})}return new(r||(r=Promise))(function(o,s){function c(u){try{a(n.next(u))}catch(d){s(d)}}function l(u){try{a(n.throw(u))}catch(d){s(d)}}function a(u){u.done?o(u.value):i(u.value).then(c,l)}a((n=n.apply(e,t||[])).next())})};Object.defineProperty(p,"__esModule",{value:!0});p.HttpClient=p.isHttps=p.HttpClientResponse=p.HttpClientError=p.getProxyUrl=p.MediaTypes=p.Headers=p.HttpCodes=void 0;var Q=re(require("http")),he=re(require("https")),gt=re(ct()),X=re(mt()),b;(function(e){e[e.OK=200]="OK",e[e.MultipleChoices=300]="MultipleChoices",e[e.MovedPermanently=301]="MovedPermanently",e[e.ResourceMoved=302]="ResourceMoved",e[e.SeeOther=303]="SeeOther",e[e.NotModified=304]="NotModified",e[e.UseProxy=305]="UseProxy",e[e.SwitchProxy=306]="SwitchProxy",e[e.TemporaryRedirect=307]="TemporaryRedirect",e[e.PermanentRedirect=308]="PermanentRedirect",e[e.BadRequest=400]="BadRequest",e[e.Unauthorized=401]="Unauthorized",e[e.PaymentRequired=402]="PaymentRequired",e[e.Forbidden=403]="Forbidden",e[e.NotFound=404]="NotFound",e[e.MethodNotAllowed=405]="MethodNotAllowed",e[e.NotAcceptable=406]="NotAcceptable",e[e.ProxyAuthenticationRequired=407]="ProxyAuthenticationRequired",e[e.RequestTimeout=408]="RequestTimeout",e[e.Conflict=409]="Conflict",e[e.Gone=410]="Gone",e[e.TooManyRequests=429]="TooManyRequests",e[e.InternalServerError=500]="InternalServerError",e[e.NotImplemented=501]="NotImplemented",e[e.BadGateway=502]="BadGateway",e[e.ServiceUnavailable=503]="ServiceUnavailable",e[e.GatewayTimeout=504]="GatewayTimeout"})(b=p.HttpCodes||(p.HttpCodes={}));var _;(function(e){e.Accept="accept",e.ContentType="content-type"})(_=p.Headers||(p.Headers={}));var C;(function(e){e.ApplicationJson="application/json"})(C=p.MediaTypes||(p.MediaTypes={}));function br(e){let t=gt.getProxyUrl(new URL(e));return t?t.href:""}p.getProxyUrl=br;var Tr=[b.MovedPermanently,b.ResourceMoved,b.SeeOther,b.TemporaryRedirect,b.PermanentRedirect],xr=[b.BadGateway,b.ServiceUnavailable,b.GatewayTimeout],Pr=["OPTIONS","GET","DELETE","HEAD"],Ar=10,qr=5,ee=class e extends Error{constructor(t,r){super(t),this.name="HttpClientError",this.statusCode=r,Object.setPrototypeOf(this,e.prototype)}};p.HttpClientError=ee;var te=class{constructor(t){this.message=t}readBody(){return m(this,void 0,void 0,function*(){return new Promise(t=>m(this,void 0,void 0,function*(){let r=Buffer.alloc(0);this.message.on("data",n=>{r=Buffer.concat([r,n])}),this.message.on("end",()=>{t(r.toString())})}))})}};p.HttpClientResponse=te;function Ur(e){return new URL(e).protocol==="https:"}p.isHttps=Ur;var pe=class{constructor(t,r,n){this._ignoreSslError=!1,this._allowRedirects=!0,this._allowRedirectDowngrade=!1,this._maxRedirects=50,this._allowRetries=!1,this._maxRetries=1,this._keepAlive=!1,this._disposed=!1,this.userAgent=t,this.handlers=r||[],this.requestOptions=n,n&&(n.ignoreSslError!=null&&(this._ignoreSslError=n.ignoreSslError),this._socketTimeout=n.socketTimeout,n.allowRedirects!=null&&(this._allowRedirects=n.allowRedirects),n.allowRedirectDowngrade!=null&&(this._allowRedirectDowngrade=n.allowRedirectDowngrade),n.maxRedirects!=null&&(this._maxRedirects=Math.max(n.maxRedirects,0)),n.keepAlive!=null&&(this._keepAlive=n.keepAlive),n.allowRetries!=null&&(this._allowRetries=n.allowRetries),n.maxRetries!=null&&(this._maxRetries=n.maxRetries))}options(t,r){return m(this,void 0,void 0,function*(){return this.request("OPTIONS",t,null,r||{})})}get(t,r){return m(this,void 0,void 0,function*(){return this.request("GET",t,null,r||{})})}del(t,r){return m(this,void 0,void 0,function*(){return this.request("DELETE",t,null,r||{})})}post(t,r,n){return m(this,void 0,void 0,function*(){return this.request("POST",t,r,n||{})})}patch(t,r,n){return m(this,void 0,void 0,function*(){return this.request("PATCH",t,r,n||{})})}put(t,r,n){return m(this,void 0,void 0,function*(){return this.request("PUT",t,r,n||{})})}head(t,r){return m(this,void 0,void 0,function*(){return this.request("HEAD",t,null,r||{})})}sendStream(t,r,n,i){return m(this,void 0,void 0,function*(){return this.request(t,r,n,i)})}getJson(t,r={}){return m(this,void 0,void 0,function*(){r[_.Accept]=this._getExistingOrDefaultHeader(r,_.Accept,C.ApplicationJson);let n=yield this.get(t,r);return this._processResponse(n,this.requestOptions)})}postJson(t,r,n={}){return m(this,void 0,void 0,function*(){let i=JSON.stringify(r,null,2);n[_.Accept]=this._getExistingOrDefaultHeader(n,_.Accept,C.ApplicationJson),n[_.ContentType]=this._getExistingOrDefaultHeader(n,_.ContentType,C.ApplicationJson);let o=yield this.post(t,i,n);return this._processResponse(o,this.requestOptions)})}putJson(t,r,n={}){return m(this,void 0,void 0,function*(){let i=JSON.stringify(r,null,2);n[_.Accept]=this._getExistingOrDefaultHeader(n,_.Accept,C.ApplicationJson),n[_.ContentType]=this._getExistingOrDefaultHeader(n,_.ContentType,C.ApplicationJson);let o=yield this.put(t,i,n);return this._processResponse(o,this.requestOptions)})}patchJson(t,r,n={}){return m(this,void 0,void 0,function*(){let i=JSON.stringify(r,null,2);n[_.Accept]=this._getExistingOrDefaultHeader(n,_.Accept,C.ApplicationJson),n[_.ContentType]=this._getExistingOrDefaultHeader(n,_.ContentType,C.ApplicationJson);let o=yield this.patch(t,i,n);return this._processResponse(o,this.requestOptions)})}request(t,r,n,i){return m(this,void 0,void 0,function*(){if(this._disposed)throw new Error("Client has already been disposed.");let o=new URL(r),s=this._prepareRequest(t,o,i),c=this._allowRetries&&Pr.includes(t)?this._maxRetries+1:1,l=0,a;do{if(a=yield this.requestRaw(s,n),a&&a.message&&a.message.statusCode===b.Unauthorized){let d;for(let h of this.handlers)if(h.canHandleAuthentication(a)){d=h;break}return d?d.handleAuthentication(this,s,n):a}let u=this._maxRedirects;for(;a.message.statusCode&&Tr.includes(a.message.statusCode)&&this._allowRedirects&&u>0;){let d=a.message.headers.location;if(!d)break;let h=new URL(d);if(o.protocol==="https:"&&o.protocol!==h.protocol&&!this._allowRedirectDowngrade)throw new Error("Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.");if(yield a.readBody(),h.hostname!==o.hostname)for(let D in i)D.toLowerCase()==="authorization"&&delete i[D];s=this._prepareRequest(t,h,i),a=yield this.requestRaw(s,n),u--}if(!a.message.statusCode||!xr.includes(a.message.statusCode))return a;l+=1,l<c&&(yield a.readBody(),yield this._performExponentialBackoff(l))}while(l<c);return a})}dispose(){this._agent&&this._agent.destroy(),this._disposed=!0}requestRaw(t,r){return m(this,void 0,void 0,function*(){return new Promise((n,i)=>{function o(s,c){s?i(s):c?n(c):i(new Error("Unknown error"))}this.requestRawWithCallback(t,r,o)})})}requestRawWithCallback(t,r,n){typeof r=="string"&&(t.options.headers||(t.options.headers={}),t.options.headers["Content-Length"]=Buffer.byteLength(r,"utf8"));let i=!1;function o(l,a){i||(i=!0,n(l,a))}let s=t.httpModule.request(t.options,l=>{let a=new te(l);o(void 0,a)}),c;s.on("socket",l=>{c=l}),s.setTimeout(this._socketTimeout||3*6e4,()=>{c&&c.end(),o(new Error(`Request timeout: ${t.options.path}`))}),s.on("error",function(l){o(l)}),r&&typeof r=="string"&&s.write(r,"utf8"),r&&typeof r!="string"?(r.on("close",function(){s.end()}),r.pipe(s)):s.end()}getAgent(t){let r=new URL(t);return this._getAgent(r)}_prepareRequest(t,r,n){let i={};i.parsedUrl=r;let o=i.parsedUrl.protocol==="https:";i.httpModule=o?he:Q;let s=o?443:80;if(i.options={},i.options.host=i.parsedUrl.hostname,i.options.port=i.parsedUrl.port?parseInt(i.parsedUrl.port):s,i.options.path=(i.parsedUrl.pathname||"")+(i.parsedUrl.search||""),i.options.method=t,i.options.headers=this._mergeHeaders(n),this.userAgent!=null&&(i.options.headers["user-agent"]=this.userAgent),i.options.agent=this._getAgent(i.parsedUrl),this.handlers)for(let c of this.handlers)c.prepareRequest(i.options);return i}_mergeHeaders(t){return this.requestOptions&&this.requestOptions.headers?Object.assign({},Z(this.requestOptions.headers),Z(t||{})):Z(t||{})}_getExistingOrDefaultHeader(t,r,n){let i;return this.requestOptions&&this.requestOptions.headers&&(i=Z(this.requestOptions.headers)[r]),t[r]||i||n}_getAgent(t){let r,n=gt.getProxyUrl(t),i=n&&n.hostname;if(this._keepAlive&&i&&(r=this._proxyAgent),this._keepAlive&&!i&&(r=this._agent),r)return r;let o=t.protocol==="https:",s=100;if(this.requestOptions&&(s=this.requestOptions.maxSockets||Q.globalAgent.maxSockets),n&&n.hostname){let c={maxSockets:s,keepAlive:this._keepAlive,proxy:Object.assign(Object.assign({},(n.username||n.password)&&{proxyAuth:`${n.username}:${n.password}`}),{host:n.hostname,port:n.port})},l,a=n.protocol==="https:";o?l=a?X.httpsOverHttps:X.httpsOverHttp:l=a?X.httpOverHttps:X.httpOverHttp,r=l(c),this._proxyAgent=r}if(this._keepAlive&&!r){let c={keepAlive:this._keepAlive,maxSockets:s};r=o?new he.Agent(c):new Q.Agent(c),this._agent=r}return r||(r=o?he.globalAgent:Q.globalAgent),o&&this._ignoreSslError&&(r.options=Object.assign(r.options||{},{rejectUnauthorized:!1})),r}_performExponentialBackoff(t){return m(this,void 0,void 0,function*(){t=Math.min(Ar,t);let r=qr*Math.pow(2,t);return new Promise(n=>setTimeout(()=>n(),r))})}_processResponse(t,r){return m(this,void 0,void 0,function*(){return new Promise((n,i)=>m(this,void 0,void 0,function*(){let o=t.message.statusCode||0,s={statusCode:o,result:null,headers:{}};o===b.NotFound&&n(s);function c(u,d){if(typeof d=="string"){let h=new Date(d);if(!isNaN(h.valueOf()))return h}return d}let l,a;try{a=yield t.readBody(),a&&a.length>0&&(r&&r.deserializeDates?l=JSON.parse(a,c):l=JSON.parse(a),s.result=l),s.headers=t.message.headers}catch{}if(o>299){let u;l&&l.message?u=l.message:a&&a.length>0?u=a:u=`Failed request: (${o})`;let d=new ee(u,o);d.result=s.result,i(d)}else n(s)}))})}};p.HttpClient=pe;var Z=e=>Object.keys(e).reduce((t,r)=>(t[r.toLowerCase()]=e[r],t),{})});var _t=O(T=>{"use strict";var _e=T&&T.__awaiter||function(e,t,r,n){function i(o){return o instanceof r?o:new r(function(s){s(o)})}return new(r||(r=Promise))(function(o,s){function c(u){try{a(n.next(u))}catch(d){s(d)}}function l(u){try{a(n.throw(u))}catch(d){s(d)}}function a(u){u.done?o(u.value):i(u.value).then(c,l)}a((n=n.apply(e,t||[])).next())})};Object.defineProperty(T,"__esModule",{value:!0});T.PersonalAccessTokenCredentialHandler=T.BearerCredentialHandler=T.BasicCredentialHandler=void 0;var me=class{constructor(t,r){this.username=t,this.password=r}prepareRequest(t){if(!t.headers)throw Error("The request has no headers");t.headers.Authorization=`Basic ${Buffer.from(`${this.username}:${this.password}`).toString("base64")}`}canHandleAuthentication(){return!1}handleAuthentication(){return _e(this,void 0,void 0,function*(){throw new Error("not implemented")})}};T.BasicCredentialHandler=me;var ge=class{constructor(t){this.token=t}prepareRequest(t){if(!t.headers)throw Error("The request has no headers");t.headers.Authorization=`Bearer ${this.token}`}canHandleAuthentication(){return!1}handleAuthentication(){return _e(this,void 0,void 0,function*(){throw new Error("not implemented")})}};T.BearerCredentialHandler=ge;var ve=class{constructor(t){this.token=t}prepareRequest(t){if(!t.headers)throw Error("The request has no headers");t.headers.Authorization=`Basic ${Buffer.from(`PAT:${this.token}`).toString("base64")}`}canHandleAuthentication(){return!1}handleAuthentication(){return _e(this,void 0,void 0,function*(){throw new Error("not implemented")})}};T.PersonalAccessTokenCredentialHandler=ve});var Ot=O(j=>{"use strict";var yt=j&&j.__awaiter||function(e,t,r,n){function i(o){return o instanceof r?o:new r(function(s){s(o)})}return new(r||(r=Promise))(function(o,s){function c(u){try{a(n.next(u))}catch(d){s(d)}}function l(u){try{a(n.throw(u))}catch(d){s(d)}}function a(u){u.done?o(u.value):i(u.value).then(c,l)}a((n=n.apply(e,t||[])).next())})};Object.defineProperty(j,"__esModule",{value:!0});j.OidcClient=void 0;var Cr=vt(),Mr=_t(),wt=we(),ye=class e{static createHttpClient(t=!0,r=10){let n={allowRetries:t,maxRetries:r};return new Cr.HttpClient("actions/oidc-client",[new Mr.BearerCredentialHandler(e.getRequestToken())],n)}static getRequestToken(){let t=process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;if(!t)throw new Error("Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable");return t}static getIDTokenUrl(){let t=process.env.ACTIONS_ID_TOKEN_REQUEST_URL;if(!t)throw new Error("Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable");return t}static getCall(t){var r;return yt(this,void 0,void 0,function*(){let o=(r=(yield e.createHttpClient().getJson(t).catch(s=>{throw new Error(`Failed to get ID Token. 
 
        Error Code : ${s.statusCode}
 
        Error Message: ${s.message}`)})).result)===null||r===void 0?void 0:r.value;if(!o)throw new Error("Response json body do not have ID Token field");return o})}static getIDToken(t){return yt(this,void 0,void 0,function*(){try{let r=e.getIDTokenUrl();if(t){let i=encodeURIComponent(t);r=`${r}&audience=${i}`}wt.debug(`ID token url is ${r}`);let n=yield e.getCall(r);return wt.setSecret(n),n}catch(r){throw new Error(`Error message: ${r.message}`)}})}};j.OidcClient=ye});var Re=O(y=>{"use strict";var Oe=y&&y.__awaiter||function(e,t,r,n){function i(o){return o instanceof r?o:new r(function(s){s(o)})}return new(r||(r=Promise))(function(o,s){function c(u){try{a(n.next(u))}catch(d){s(d)}}function l(u){try{a(n.throw(u))}catch(d){s(d)}}function a(u){u.done?o(u.value):i(u.value).then(c,l)}a((n=n.apply(e,t||[])).next())})};Object.defineProperty(y,"__esModule",{value:!0});y.summary=y.markdownSummary=y.SUMMARY_DOCS_URL=y.SUMMARY_ENV_VAR=void 0;var Dr=require("os"),Ee=require("fs"),{access:Ir,appendFile:Nr,writeFile:Br}=Ee.promises;y.SUMMARY_ENV_VAR="GITHUB_STEP_SUMMARY";y.SUMMARY_DOCS_URL="https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary";var Se=class{constructor(){this._buffer=""}filePath(){return Oe(this,void 0,void 0,function*(){if(this._filePath)return this._filePath;let t=process.env[y.SUMMARY_ENV_VAR];if(!t)throw new Error(`Unable to find environment variable for $${y.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);try{yield Ir(t,Ee.constants.R_OK|Ee.constants.W_OK)}catch{throw new Error(`Unable to access summary file: '${t}'. Check if the file has correct read/write permissions.`)}return this._filePath=t,this._filePath})}wrap(t,r,n={}){let i=Object.entries(n).map(([o,s])=>` ${o}="${s}"`).join("");return r?`<${t}${i}>${r}</${t}>`:`<${t}${i}>`}write(t){return Oe(this,void 0,void 0,function*(){let r=!!t?.overwrite,n=yield this.filePath();return yield(r?Br:Nr)(n,this._buffer,{encoding:"utf8"}),this.emptyBuffer()})}clear(){return Oe(this,void 0,void 0,function*(){return this.emptyBuffer().write({overwrite:!0})})}stringify(){return this._buffer}isEmptyBuffer(){return this._buffer.length===0}emptyBuffer(){return this._buffer="",this}addRaw(t,r=!1){return this._buffer+=t,r?this.addEOL():this}addEOL(){return this.addRaw(Dr.EOL)}addCodeBlock(t,r){let n=Object.assign({},r&&{lang:r}),i=this.wrap("pre",this.wrap("code",t),n);return this.addRaw(i).addEOL()}addList(t,r=!1){let n=r?"ol":"ul",i=t.map(s=>this.wrap("li",s)).join(""),o=this.wrap(n,i);return this.addRaw(o).addEOL()}addTable(t){let r=t.map(i=>{let o=i.map(s=>{if(typeof s=="string")return this.wrap("td",s);let{header:c,data:l,colspan:a,rowspan:u}=s,d=c?"th":"td",h=Object.assign(Object.assign({},a&&{colspan:a}),u&&{rowspan:u});return this.wrap(d,l,h)}).join("");return this.wrap("tr",o)}).join(""),n=this.wrap("table",r);return this.addRaw(n).addEOL()}addDetails(t,r){let n=this.wrap("details",this.wrap("summary",t)+r);return this.addRaw(n).addEOL()}addImage(t,r,n){let{width:i,height:o}=n||{},s=Object.assign(Object.assign({},i&&{width:i}),o&&{height:o}),c=this.wrap("img",null,Object.assign({src:t,alt:r},s));return this.addRaw(c).addEOL()}addHeading(t,r){let n=`h${r}`,i=["h1","h2","h3","h4","h5","h6"].includes(n)?n:"h1",o=this.wrap(i,t);return this.addRaw(o).addEOL()}addSeparator(){let t=this.wrap("hr",null);return this.addRaw(t).addEOL()}addBreak(){let t=this.wrap("br",null);return this.addRaw(t).addEOL()}addQuote(t,r){let n=Object.assign({},r&&{cite:r}),i=this.wrap("blockquote",t,n);return this.addRaw(i).addEOL()}addLink(t,r){let n=this.wrap("a",t,{href:r});return this.addRaw(n).addEOL()}},Et=new Se;y.markdownSummary=Et;y.summary=Et});var St=O(w=>{"use strict";var jr=w&&w.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),kr=w&&w.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),$r=w&&w.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var r in e)r!=="default"&&Object.hasOwnProperty.call(e,r)&&jr(t,e,r);return kr(t,e),t};Object.defineProperty(w,"__esModule",{value:!0});w.toPlatformPath=w.toWin32Path=w.toPosixPath=void 0;var Lr=$r(require("path"));function Vr(e){return e.replace(/[\\]/g,"/")}w.toPosixPath=Vr;function Fr(e){return e.replace(/[/]/g,"\\")}w.toWin32Path=Fr;function Gr(e){return e.replace(/[/\\]/g,Lr.sep)}w.toPlatformPath=Gr});var we=O(f=>{"use strict";var Jr=f&&f.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),Kr=f&&f.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),Rt=f&&f.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var r in e)r!=="default"&&Object.hasOwnProperty.call(e,r)&&Jr(t,e,r);return Kr(t,e),t},bt=f&&f.__awaiter||function(e,t,r,n){function i(o){return o instanceof r?o:new r(function(s){s(o)})}return new(r||(r=Promise))(function(o,s){function c(u){try{a(n.next(u))}catch(d){s(d)}}function l(u){try{a(n.throw(u))}catch(d){s(d)}}function a(u){u.done?o(u.value):i(u.value).then(c,l)}a((n=n.apply(e,t||[])).next())})};Object.defineProperty(f,"__esModule",{value:!0});f.getIDToken=f.getState=f.saveState=f.group=f.endGroup=f.startGroup=f.info=f.notice=f.warning=f.error=f.debug=f.isDebug=f.setFailed=f.setCommandEcho=f.setOutput=f.getBooleanInput=f.getMultilineInput=f.getInput=f.addPath=f.setSecret=f.exportVariable=f.ExitCode=void 0;var R=Me(),M=at(),k=K(),Tt=Rt(require("os")),Yr=Rt(require("path")),zr=Ot(),xt;(function(e){e[e.Success=0]="Success",e[e.Failure=1]="Failure"})(xt=f.ExitCode||(f.ExitCode={}));function Hr(e,t){let r=k.toCommandValue(t);if(process.env[e]=r,process.env.GITHUB_ENV||"")return M.issueFileCommand("ENV",M.prepareKeyValueMessage(e,t));R.issueCommand("set-env",{name:e},r)}f.exportVariable=Hr;function Wr(e){R.issueCommand("add-mask",{},e)}f.setSecret=Wr;function Qr(e){process.env.GITHUB_PATH||""?M.issueFileCommand("PATH",e):R.issueCommand("add-path",{},e),process.env.PATH=`${e}${Yr.delimiter}${process.env.PATH}`}f.addPath=Qr;function be(e,t){let r=process.env[`INPUT_${e.replace(/ /g,"_").toUpperCase()}`]||"";if(t&&t.required&&!r)throw new Error(`Input required and not supplied: ${e}`);return t&&t.trimWhitespace===!1?r:r.trim()}f.getInput=be;function Xr(e,t){let r=be(e,t).split(`
`).filter(n=>n!=="");return t&&t.trimWhitespace===!1?r:r.map(n=>n.trim())}f.getMultilineInput=Xr;function Zr(e,t){let r=["true","True","TRUE"],n=["false","False","FALSE"],i=be(e,t);if(r.includes(i))return!0;if(n.includes(i))return!1;throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${e}
Support boolean input list: \`true | True | TRUE | false | False | FALSE\``)}f.getBooleanInput=Zr;function en(e,t){if(process.env.GITHUB_OUTPUT||"")return M.issueFileCommand("OUTPUT",M.prepareKeyValueMessage(e,t));process.stdout.write(Tt.EOL),R.issueCommand("set-output",{name:e},k.toCommandValue(t))}f.setOutput=en;function tn(e){R.issue("echo",e?"on":"off")}f.setCommandEcho=tn;function rn(e){process.exitCode=xt.Failure,Pt(e)}f.setFailed=rn;function nn(){return process.env.RUNNER_DEBUG==="1"}f.isDebug=nn;function on(e){R.issueCommand("debug",{},e)}f.debug=on;function Pt(e,t={}){R.issueCommand("error",k.toCommandProperties(t),e instanceof Error?e.toString():e)}f.error=Pt;function sn(e,t={}){R.issueCommand("warning",k.toCommandProperties(t),e instanceof Error?e.toString():e)}f.warning=sn;function an(e,t={}){R.issueCommand("notice",k.toCommandProperties(t),e instanceof Error?e.toString():e)}f.notice=an;function un(e){process.stdout.write(e+Tt.EOL)}f.info=un;function At(e){R.issue("group",e)}f.startGroup=At;function qt(){R.issue("endgroup")}f.endGroup=qt;function cn(e,t){return bt(this,void 0,void 0,function*(){At(e);let r;try{r=yield t()}finally{qt()}return r})}f.group=cn;function ln(e,t){if(process.env.GITHUB_STATE||"")return M.issueFileCommand("STATE",M.prepareKeyValueMessage(e,t));R.issueCommand("save-state",{name:e},k.toCommandValue(t))}f.saveState=ln;function fn(e){return process.env[`STATE_${e}`]||""}f.getState=fn;function dn(e){return bt(this,void 0,void 0,function*(){return yield zr.OidcClient.getIDToken(e)})}f.getIDToken=dn;var hn=Re();Object.defineProperty(f,"summary",{enumerable:!0,get:function(){return hn.summary}});var pn=Re();Object.defineProperty(f,"markdownSummary",{enumerable:!0,get:function(){return pn.markdownSummary}});var Te=St();Object.defineProperty(f,"toPosixPath",{enumerable:!0,get:function(){return Te.toPosixPath}});Object.defineProperty(f,"toWin32Path",{enumerable:!0,get:function(){return Te.toWin32Path}});Object.defineProperty(f,"toPlatformPath",{enumerable:!0,get:function(){return Te.toPlatformPath}})});var x=J(we());var xe=require("child_process"),Ut="tempdir",Ct="systemd",Mt="systemd_services";function Dt(e){let t=(0,xe.spawn)(e[0],e.slice(1),{stdio:["ignore","ignore","inherit"]});return new Promise((r,n)=>{t.on("close",i=>{i===0?r():n(new Error(e[0]+" exited with "+i))})})}function Pe(e,t){let r=(0,xe.spawn)("sudo",["--non-interactive",...e],{stdio:["ignore","ignore",t?.ignoreStderr?"ignore":"inherit"]});return new Promise((n,i)=>{r.on("close",o=>{o===0?n():i(new Error(e[0]+" exited with "+o))})})}(async()=>{try{let e=JSON.parse((0,x.getState)(Mt));e instanceof Array&&e.every(n=>typeof n=="string")&&Dt(["systemctl","stop","--user",...e]);let t=(0,x.getState)(Ut);t&&((0,x.info)("Removing "+t+"..."),await Pe(["rm","-rf",t]));let r=(0,x.getState)(Ct);r&&((0,x.info)("Removing "+r+"..."),await Pe(["rm","-f",r]))}catch(e){e instanceof Error?(0,x.setFailed)(e.message):(0,x.setFailed)(e+"")}})();
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
