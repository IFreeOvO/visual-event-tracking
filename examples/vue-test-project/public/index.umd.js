(function(j,P){typeof exports=="object"&&typeof module!="undefined"?module.exports=P():typeof define=="function"&&define.amd?define(P):(j=typeof globalThis!="undefined"?globalThis:j||self,j.__TRACK_CLIENT_SDK__=P())})(this,function(){"use strict";var j=typeof global=="object"&&global&&global.Object===Object&&global,P=typeof self=="object"&&self&&self.Object===Object&&self,x=j||P||Function("return this")(),U=x.Symbol,fe=Object.prototype,Qe=fe.hasOwnProperty,Ze=fe.toString,L=U?U.toStringTag:void 0;function et(e){var t=Qe.call(e,L),r=e[L];try{e[L]=void 0;var n=!0}catch(a){}var i=Ze.call(e);return n&&(t?e[L]=r:delete e[L]),i}var tt=Object.prototype,rt=tt.toString;function nt(e){return rt.call(e)}var it="[object Null]",at="[object Undefined]",de=U?U.toStringTag:void 0;function R(e){return e==null?e===void 0?at:it:de&&de in Object(e)?et(e):nt(e)}function S(e){return e!=null&&typeof e=="object"}var ot="[object Symbol]";function st(e){return typeof e=="symbol"||S(e)&&R(e)==ot}var Y=Array.isArray,ut=/\s/;function ct(e){for(var t=e.length;t--&&ut.test(e.charAt(t)););return t}var lt=/^\s+/;function ft(e){return e&&e.slice(0,ct(e)+1).replace(lt,"")}function _(e){var t=typeof e;return e!=null&&(t=="object"||t=="function")}var he=NaN,dt=/^[-+]0x[0-9a-f]+$/i,ht=/^0b[01]+$/i,pt=/^0o[0-7]+$/i,gt=parseInt;function pe(e){if(typeof e=="number")return e;if(st(e))return he;if(_(e)){var t=typeof e.valueOf=="function"?e.valueOf():e;e=_(t)?t+"":t}if(typeof e!="string")return e===0?e:+e;e=ft(e);var r=ht.test(e);return r||pt.test(e)?gt(e.slice(2),r?2:8):dt.test(e)?he:+e}function ge(e){return e}var vt="[object AsyncFunction]",bt="[object Function]",yt="[object GeneratorFunction]",mt="[object Proxy]";function J(e){if(!_(e))return!1;var t=R(e);return t==bt||t==yt||t==vt||t==mt}var K=x["__core-js_shared__"],ve=function(){var e=/[^.]+$/.exec(K&&K.keys&&K.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}();function _t(e){return!!ve&&ve in e}var Tt=Function.prototype,Ot=Tt.toString;function Ct(e){if(e!=null){try{return Ot.call(e)}catch(t){}try{return e+""}catch(t){}}return""}var xt=/[\\^$.*+?()[\]{}|]/g,Et=/^\[object .+?Constructor\]$/,wt=Function.prototype,jt=Object.prototype,St=wt.toString,$t=jt.hasOwnProperty,At=RegExp("^"+St.call($t).replace(xt,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function It(e){if(!_(e)||_t(e))return!1;var t=J(e)?At:Et;return t.test(Ct(e))}function Pt(e,t){return e==null?void 0:e[t]}function Q(e,t){var r=Pt(e,t);return It(r)?r:void 0}var be=Object.create,Lt=function(){function e(){}return function(t){if(!_(t))return{};if(be)return be(t);e.prototype=t;var r=new e;return e.prototype=void 0,r}}();function Rt(e,t,r){switch(r.length){case 0:return e.call(t);case 1:return e.call(t,r[0]);case 2:return e.call(t,r[0],r[1]);case 3:return e.call(t,r[0],r[1],r[2])}return e.apply(t,r)}function Mt(e,t){var r=-1,n=e.length;for(t||(t=Array(n));++r<n;)t[r]=e[r];return t}var Nt=800,kt=16,Ft=Date.now;function Dt(e){var t=0,r=0;return function(){var n=Ft(),i=kt-(n-r);if(r=n,i>0){if(++t>=Nt)return arguments[0]}else t=0;return e.apply(void 0,arguments)}}function Ut(e){return function(){return e}}var B=function(){try{var e=Q(Object,"defineProperty");return e({},"",{}),e}catch(t){}}(),Bt=B?function(e,t){return B(e,"toString",{configurable:!0,enumerable:!1,value:Ut(t),writable:!0})}:ge,qt=Dt(Bt),Ht=9007199254740991,zt=/^(?:0|[1-9]\d*)$/;function ye(e,t){var r=typeof e;return t=t==null?Ht:t,!!t&&(r=="number"||r!="symbol"&&zt.test(e))&&e>-1&&e%1==0&&e<t}function Z(e,t,r){t=="__proto__"&&B?B(e,t,{configurable:!0,enumerable:!0,value:r,writable:!0}):e[t]=r}function q(e,t){return e===t||e!==e&&t!==t}var Gt=Object.prototype,Vt=Gt.hasOwnProperty;function Xt(e,t,r){var n=e[t];(!(Vt.call(e,t)&&q(n,r))||r===void 0&&!(t in e))&&Z(e,t,r)}function Wt(e,t,r,n){var i=!r;r||(r={});for(var a=-1,u=t.length;++a<u;){var o=t[a],s=void 0;s===void 0&&(s=e[o]),i?Z(r,o,s):Xt(r,o,s)}return r}var me=Math.max;function Yt(e,t,r){return t=me(t===void 0?e.length-1:t,0),function(){for(var n=arguments,i=-1,a=me(n.length-t,0),u=Array(a);++i<a;)u[i]=n[t+i];i=-1;for(var o=Array(t+1);++i<t;)o[i]=n[i];return o[t]=r(u),Rt(e,this,o)}}function Jt(e,t){return qt(Yt(e,t,ge),e+"")}var Kt=9007199254740991;function _e(e){return typeof e=="number"&&e>-1&&e%1==0&&e<=Kt}function ee(e){return e!=null&&_e(e.length)&&!J(e)}function Qt(e,t,r){if(!_(r))return!1;var n=typeof t;return(n=="number"?ee(r)&&ye(t,r.length):n=="string"&&t in r)?q(r[t],e):!1}function Zt(e){return Jt(function(t,r){var n=-1,i=r.length,a=i>1?r[i-1]:void 0,u=i>2?r[2]:void 0;for(a=e.length>3&&typeof a=="function"?(i--,a):void 0,u&&Qt(r[0],r[1],u)&&(a=i<3?void 0:a,i=1),t=Object(t);++n<i;){var o=r[n];o&&e(t,o,n,a)}return t})}var er=Object.prototype;function Te(e){var t=e&&e.constructor,r=typeof t=="function"&&t.prototype||er;return e===r}function tr(e,t){for(var r=-1,n=Array(e);++r<e;)n[r]=t(r);return n}var rr="[object Arguments]";function Oe(e){return S(e)&&R(e)==rr}var Ce=Object.prototype,nr=Ce.hasOwnProperty,ir=Ce.propertyIsEnumerable,te=Oe(function(){return arguments}())?Oe:function(e){return S(e)&&nr.call(e,"callee")&&!ir.call(e,"callee")};function ar(){return!1}var xe=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Ee=xe&&typeof module=="object"&&module&&!module.nodeType&&module,or=Ee&&Ee.exports===xe,we=or?x.Buffer:void 0,sr=we?we.isBuffer:void 0,je=sr||ar,ur="[object Arguments]",cr="[object Array]",lr="[object Boolean]",fr="[object Date]",dr="[object Error]",hr="[object Function]",pr="[object Map]",gr="[object Number]",vr="[object Object]",br="[object RegExp]",yr="[object Set]",mr="[object String]",_r="[object WeakMap]",Tr="[object ArrayBuffer]",Or="[object DataView]",Cr="[object Float32Array]",xr="[object Float64Array]",Er="[object Int8Array]",wr="[object Int16Array]",jr="[object Int32Array]",Sr="[object Uint8Array]",$r="[object Uint8ClampedArray]",Ar="[object Uint16Array]",Ir="[object Uint32Array]",f={};f[Cr]=f[xr]=f[Er]=f[wr]=f[jr]=f[Sr]=f[$r]=f[Ar]=f[Ir]=!0,f[ur]=f[cr]=f[Tr]=f[lr]=f[Or]=f[fr]=f[dr]=f[hr]=f[pr]=f[gr]=f[vr]=f[br]=f[yr]=f[mr]=f[_r]=!1;function Pr(e){return S(e)&&_e(e.length)&&!!f[R(e)]}function Lr(e){return function(t){return e(t)}}var Se=typeof exports=="object"&&exports&&!exports.nodeType&&exports,M=Se&&typeof module=="object"&&module&&!module.nodeType&&module,Rr=M&&M.exports===Se,re=Rr&&j.process,$e=function(){try{var e=M&&M.require&&M.require("util").types;return e||re&&re.binding&&re.binding("util")}catch(t){}}(),Ae=$e&&$e.isTypedArray,Ie=Ae?Lr(Ae):Pr;function Mr(e,t){var r=Y(e),n=!r&&te(e),i=!r&&!n&&je(e),a=!r&&!n&&!i&&Ie(e),u=r||n||i||a,o=u?tr(e.length,String):[],s=o.length;for(var c in e)u&&(c=="length"||i&&(c=="offset"||c=="parent")||a&&(c=="buffer"||c=="byteLength"||c=="byteOffset")||ye(c,s))||o.push(c);return o}function Nr(e,t){return function(r){return e(t(r))}}function kr(e){var t=[];if(e!=null)for(var r in Object(e))t.push(r);return t}var Fr=Object.prototype,Dr=Fr.hasOwnProperty;function Ur(e){if(!_(e))return kr(e);var t=Te(e),r=[];for(var n in e)n=="constructor"&&(t||!Dr.call(e,n))||r.push(n);return r}function Pe(e){return ee(e)?Mr(e):Ur(e)}var N=Q(Object,"create");function Br(){this.__data__=N?N(null):{},this.size=0}function qr(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}var Hr="__lodash_hash_undefined__",zr=Object.prototype,Gr=zr.hasOwnProperty;function Vr(e){var t=this.__data__;if(N){var r=t[e];return r===Hr?void 0:r}return Gr.call(t,e)?t[e]:void 0}var Xr=Object.prototype,Wr=Xr.hasOwnProperty;function Yr(e){var t=this.__data__;return N?t[e]!==void 0:Wr.call(t,e)}var Jr="__lodash_hash_undefined__";function Kr(e,t){var r=this.__data__;return this.size+=this.has(e)?0:1,r[e]=N&&t===void 0?Jr:t,this}function E(e){var t=-1,r=e==null?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}E.prototype.clear=Br,E.prototype.delete=qr,E.prototype.get=Vr,E.prototype.has=Yr,E.prototype.set=Kr;function Qr(){this.__data__=[],this.size=0}function H(e,t){for(var r=e.length;r--;)if(q(e[r][0],t))return r;return-1}var Zr=Array.prototype,en=Zr.splice;function tn(e){var t=this.__data__,r=H(t,e);if(r<0)return!1;var n=t.length-1;return r==n?t.pop():en.call(t,r,1),--this.size,!0}function rn(e){var t=this.__data__,r=H(t,e);return r<0?void 0:t[r][1]}function nn(e){return H(this.__data__,e)>-1}function an(e,t){var r=this.__data__,n=H(r,e);return n<0?(++this.size,r.push([e,t])):r[n][1]=t,this}function O(e){var t=-1,r=e==null?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}O.prototype.clear=Qr,O.prototype.delete=tn,O.prototype.get=rn,O.prototype.has=nn,O.prototype.set=an;var Le=Q(x,"Map");function on(){this.size=0,this.__data__={hash:new E,map:new(Le||O),string:new E}}function sn(e){var t=typeof e;return t=="string"||t=="number"||t=="symbol"||t=="boolean"?e!=="__proto__":e===null}function z(e,t){var r=e.__data__;return sn(t)?r[typeof t=="string"?"string":"hash"]:r.map}function un(e){var t=z(this,e).delete(e);return this.size-=t?1:0,t}function cn(e){return z(this,e).get(e)}function ln(e){return z(this,e).has(e)}function fn(e,t){var r=z(this,e),n=r.size;return r.set(e,t),this.size+=r.size==n?0:1,this}function $(e){var t=-1,r=e==null?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}$.prototype.clear=on,$.prototype.delete=un,$.prototype.get=cn,$.prototype.has=ln,$.prototype.set=fn;var Re=Nr(Object.getPrototypeOf,Object),dn="[object Object]",hn=Function.prototype,pn=Object.prototype,Me=hn.toString,gn=pn.hasOwnProperty,vn=Me.call(Object);function bn(e){if(!S(e)||R(e)!=dn)return!1;var t=Re(e);if(t===null)return!0;var r=gn.call(t,"constructor")&&t.constructor;return typeof r=="function"&&r instanceof r&&Me.call(r)==vn}function yn(){this.__data__=new O,this.size=0}function mn(e){var t=this.__data__,r=t.delete(e);return this.size=t.size,r}function _n(e){return this.__data__.get(e)}function Tn(e){return this.__data__.has(e)}var On=200;function Cn(e,t){var r=this.__data__;if(r instanceof O){var n=r.__data__;if(!Le||n.length<On-1)return n.push([e,t]),this.size=++r.size,this;r=this.__data__=new $(n)}return r.set(e,t),this.size=r.size,this}function A(e){var t=this.__data__=new O(e);this.size=t.size}A.prototype.clear=yn,A.prototype.delete=mn,A.prototype.get=_n,A.prototype.has=Tn,A.prototype.set=Cn;var Ne=typeof exports=="object"&&exports&&!exports.nodeType&&exports,ke=Ne&&typeof module=="object"&&module&&!module.nodeType&&module,xn=ke&&ke.exports===Ne,Fe=xn?x.Buffer:void 0;Fe&&Fe.allocUnsafe;function En(e,t){return e.slice()}var De=x.Uint8Array;function wn(e){var t=new e.constructor(e.byteLength);return new De(t).set(new De(e)),t}function jn(e,t){var r=wn(e.buffer);return new e.constructor(r,e.byteOffset,e.length)}function Sn(e){return typeof e.constructor=="function"&&!Te(e)?Lt(Re(e)):{}}function $n(e){return function(t,r,n){for(var i=-1,a=Object(t),u=n(t),o=u.length;o--;){var s=u[++i];if(r(a[s],s,a)===!1)break}return t}}var An=$n(),ne=function(){return x.Date.now()},In="Expected a function",Pn=Math.max,Ln=Math.min;function Ue(e,t,r){var n,i,a,u,o,s,c=0,d=!1,l=!1,g=!0;if(typeof e!="function")throw new TypeError(In);t=pe(t)||0,_(r)&&(d=!!r.leading,l="maxWait"in r,a=l?Pn(pe(r.maxWait)||0,t):a,g="trailing"in r?!!r.trailing:g);function y(h){var C=n,D=i;return n=i=void 0,c=h,u=e.apply(D,C),u}function m(h){return c=h,o=setTimeout(v,t),d?y(h):u}function T(h){var C=h-s,D=h-c,Ke=t-C;return l?Ln(Ke,a-D):Ke}function I(h){var C=h-s,D=h-c;return s===void 0||C>=t||C<0||l&&D>=a}function v(){var h=ne();if(I(h))return W(h);o=setTimeout(v,T(h))}function W(h){return o=void 0,g&&n?y(h):(n=i=void 0,u)}function li(){o!==void 0&&clearTimeout(o),c=0,n=s=i=o=void 0}function fi(){return o===void 0?u:W(ne())}function le(){var h=ne(),C=I(h);if(n=arguments,i=this,s=h,C){if(o===void 0)return m(s);if(l)return clearTimeout(o),o=setTimeout(v,t),y(s)}return o===void 0&&(o=setTimeout(v,t)),u}return le.cancel=li,le.flush=fi,le}function ie(e,t,r){(r!==void 0&&!q(e[t],r)||r===void 0&&!(t in e))&&Z(e,t,r)}function Rn(e){return S(e)&&ee(e)}function ae(e,t){if(!(t==="constructor"&&typeof e[t]=="function")&&t!="__proto__")return e[t]}function Mn(e){return Wt(e,Pe(e))}function Nn(e,t,r,n,i,a,u){var o=ae(e,r),s=ae(t,r),c=u.get(s);if(c){ie(e,r,c);return}var d=a?a(o,s,r+"",e,t,u):void 0,l=d===void 0;if(l){var g=Y(s),y=!g&&je(s),m=!g&&!y&&Ie(s);d=s,g||y||m?Y(o)?d=o:Rn(o)?d=Mt(o):y?(l=!1,d=En(s)):m?(l=!1,d=jn(s)):d=[]:bn(s)||te(s)?(d=o,te(o)?d=Mn(o):(!_(o)||J(o))&&(d=Sn(s))):l=!1}l&&(u.set(s,d),i(d,s,n,a,u),u.delete(s)),ie(e,r,d)}function Be(e,t,r,n,i){e!==t&&An(t,function(a,u){if(i||(i=new A),_(a))Nn(e,t,u,r,Be,n,i);else{var o=n?n(ae(e,u),a,u+"",e,t,i):void 0;o===void 0&&(o=a),ie(e,u,o)}},Pe)}var kn=Zt(function(e,t,r){Be(e,t,r)}),k=(e=>(e[e.Click=0]="Click",e[e.Expose=1]="Expose",e))(k||{}),G=(e=>(e[e.No=0]="No",e[e.YES=1]="YES",e))(G||{}),V=(e=>(e.Beacon="beacon",e.Gif="gif",e))(V||{}),qe=(e=>(e[e.NO=0]="NO",e[e.YES=1]="YES",e))(qe||{}),w=(e=>(e.Validate="validate",e.Report="report",e.ReportAndValidate="reportAndValidate",e))(w||{}),F=(e=>(e[e.Fail=0]="Fail",e[e.Success=1]="Success",e))(F||{}),Fn=Object.defineProperty,Dn=(e,t,r)=>t in e?Fn(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,He=(e,t,r)=>Dn(e,typeof t!="symbol"?t+"":t,r);class Un{constructor(){He(this,"taskQueue",[]),He(this,"isProcessing",!1)}addTask(t){if(typeof t!="function")throw new Error("\u5FC5\u987B\u4F20\u5165\u51FD\u6570\u7C7B\u578B\u4EFB\u52A1");this.taskQueue.push(t),this.isProcessing||this.schedule()}schedule(){this.isProcessing=!0,requestIdleCallback(t=>this.runTasks(t))}runTasks(t){for(;this.taskQueue.length>0&&t.timeRemaining()>0;){const r=this.taskQueue.shift();r==null||r()}this.taskQueue.length>0?this.schedule():this.isProcessing=!1}}var Bn=Object.defineProperty,ze=Object.getOwnPropertySymbols,qn=Object.prototype.hasOwnProperty,Hn=Object.prototype.propertyIsEnumerable,Ge=(e,t,r)=>t in e?Bn(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,zn=(e,t)=>{for(var r in t||(t={}))qn.call(t,r)&&Ge(e,r,t[r]);if(ze)for(var r of ze(t))Hn.call(t,r)&&Ge(e,r,t[r]);return e};const Gn=["svg","path","g","image","text","line","rect","polygon","circle","ellipse"];function Vn(e,t){let r=0;for(;e;)e.nodeName.toLowerCase()===t&&(r+=1),e=e.previousElementSibling;return r}function Xn(e){const t=e.tagName.toLowerCase();return Gn.indexOf(t)!==-1?`*[name()='${t}']`:t}function Wn(e){let t=e;const r=[];for(;t;){const n=t.nodeName.toLowerCase(),i=Vn(t,n);r.push(`${Xn(t)}[${i}]`),t=t.parentElement}return`/${r.reverse().join("/")}`}function b(e){const t=document;return t.evaluate(e,t).iterateNext()}function Ve(e){var t;return Array.from(((t=e.parentNode)==null?void 0:t.children)||[]).map(r=>{const n=r.tagName.toLowerCase(),i=r.id?`#${r.id}`:"",a=r.className?`.${r.className.split(" ").join(".")}`:"";return`${n}[${i}${a}]`}).join("|")}function Xe(e){const t=[];for(const r in e)if(Object.prototype.hasOwnProperty.call(e,r)){let n=e[r];typeof n=="object"&&n!==null&&(n=JSON.stringify(n)),t.push(`${encodeURIComponent(r)}=${encodeURIComponent(String(n))}`)}return t.join("&")}function Yn(e,t){var r,n;return e.substring(0,e.lastIndexOf("/"))===t.substring(0,t.lastIndexOf("/"))?se((r=b(e))!=null?r:void 0,(n=b(t))!=null?n:void 0):!1}function We(e,t,r){return e.map(n=>{const i=zn({},n);return n.fieldXpath.startsWith(t)&&(i.fieldXpath=n.fieldXpath.replace(t,r)),i})}function oe(e,t){return e.substring(0,e.lastIndexOf("["))+`[${t+1}]`}function se(e,t){var r,n;const i=Array.from((r=e==null?void 0:e.classList)!=null?r:[]).join(","),a=Array.from((n=t==null?void 0:t.classList)!=null?n:[]).join(",");return i===a}var Jn=Object.defineProperty,Kn=(e,t,r)=>t in e?Jn(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,Qn=(e,t,r)=>Kn(e,t+"",r);class Zn{constructor(t){Qn(this,"baseURL",""),Object.assign(this,t)}sendRequest(t,r,n,i){let a="";return t==="GET"?a=`${this.baseURL}${r}${n?`?${Xe(n)}`:""}`:a=`${this.baseURL}${r}`,new Promise((u,o)=>{const s=new XMLHttpRequest;s.open(t,a),this.setHeaders(s,i?i.headers:{}),i!=null&&i.signal&&i.signal.addEventListener("abort",()=>s.abort()),s.onreadystatechange=()=>{s.readyState===4&&(s.status>=200&&s.status<300?u(JSON.parse(s.responseText)):o(new Error(`\u8BF7\u6C42\u5931\u8D25\uFF0C\u72B6\u6001\u7801\uFF1A${s.status}`)))},s.onerror=c=>{o(c)},t==="POST"?s.send(JSON.stringify(n)):s.send()})}setHeaders(t,r={}){t.setRequestHeader("Content-Type","application/json;charset=UTF-8");for(const n in r)t.setRequestHeader(n,r[n])}post(t,r,n){return this.sendRequest("POST",t,r,n)}get(t,r,n){return this.sendRequest("GET",t,r,n)}}var ei=Object.defineProperty,ti=(e,t,r)=>t in e?ei(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,ri=(e,t,r)=>ti(e,t+"",r);class ni{constructor(){ri(this,"routerChangeCallback"),this.setupListeners()}onChange(t){typeof t=="function"&&(this.routerChangeCallback=Ue(t,100))}setupListeners(){["pushState","replaceState"].forEach(t=>{const r=window.history[t];window.history[t]=(...n)=>{r.apply(window.history,n),this.routerChangeCallback&&this.routerChangeCallback(...n)}}),window.addEventListener("popstate",(...t)=>{this.routerChangeCallback&&this.routerChangeCallback(...t)}),window.addEventListener("hashchange",(...t)=>{this.routerChangeCallback&&this.routerChangeCallback(...t)})}}var ii=Object.defineProperty,Ye=Object.getOwnPropertySymbols,ai=Object.prototype.hasOwnProperty,oi=Object.prototype.propertyIsEnumerable,ue=(e,t,r)=>t in e?ii(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,Je=(e,t)=>{for(var r in t||(t={}))ai.call(t,r)&&ue(e,r,t[r]);if(Ye)for(var r of Ye(t))oi.call(t,r)&&ue(e,r,t[r]);return e},p=(e,t,r)=>ue(e,typeof t!="symbol"?t+"":t,r),X=(e,t,r)=>new Promise((n,i)=>{var a=s=>{try{o(r.next(s))}catch(c){i(c)}},u=s=>{try{o(r.throw(s))}catch(c){i(c)}},o=s=>s.done?n(s.value):Promise.resolve(s.value).then(a,u);o((r=r.apply(e,t)).next())});const ce="data-tracking-config";class si{constructor(t){p(this,"intersectionObserverOptions",{}),p(this,"intersectionObserver"),p(this,"mutationObserver"),p(this,"eleObserverMap",new Map),p(this,"siblingEleMap",new Map),p(this,"serverURL"),p(this,"request"),p(this,"router"),p(this,"projectId"),p(this,"trackingClientURL"),p(this,"sendType",V.Beacon),p(this,"taskManager"),p(this,"mode",w.Report),p(this,"exposeConfigList",[]),p(this,"clickConfigList",[]),p(this,"accuracy",85/100),p(this,"requestAbortController"),kn(this,t),this.request=new Zn({baseURL:this.serverURL}),this.router=new ni,this.taskManager=new Un}registerMutationObserver(){const t={attributes:!1,childList:!0,subtree:!0};this.mutationObserver=new MutationObserver(Ue(this.observeDomChange.bind(this),1e3/60)),this.mutationObserver.observe(document.body,t),this.observeDomChange()}observeDomChange(){this.exposeConfigList.forEach(t=>{this.taskManager.addTask(()=>{this.handleExpose(t,this.eleObserverMap,this.siblingEleMap,this.intersectionObserver)})})}removeExpose(t,r,n,i,a,u){if(u==null||u.unobserve(t),i.delete(r),n===G.YES){const o=a.get(t);o&&(o.forEach(s=>{u==null||u.unobserve(s)}),a.delete(t))}}handleExpose(t,r,n,i){const{xpath:a,validationMarker:u,isSiblingEffective:o}=t,s=b(a),c=r.get(a);if(!s){c&&this.removeExpose(c,a,o,r,n,i);return}if(c){if(s===c)return;this.removeExpose(c,a,o,r,n,i)}const d=Ve(s);this.checkMarker(d,u)&&(s.setAttribute(ce,JSON.stringify({id:t.id,xpath:t.xpath,datasource:t.datasource,eventName:t.eventName})),i==null||i.observe(s),r.set(a,s),o===G.YES&&this.taskManager.addTask(()=>{let l=0;const g=oe(a,l),y=b(g);n.set(s,new Set([]));const m=(T,I,v)=>{if(!v)return;if(v===s||!se(v,s)){l++,T=oe(a,l),v=b(T),this.taskManager.addTask(()=>m(T,I,v));return}const W=We(t.datasource,t.xpath,T);v.setAttribute(ce,JSON.stringify({id:t.id,xpath:T,datasource:W,eventName:t.eventName})),i==null||i.observe(v),I.get(s).add(v),l++,T=oe(a,l),v=b(T),this.taskManager.addTask(()=>m(T,I,v))};m(g,n,y)}))}checkMarker(t,r){const n=ci(t,r),i=Math.min(t.length,r.length);return n/i>this.accuracy}registerClickEvent(){document.body.addEventListener("click",t=>{var r;let n=t.target,i=Wn(n),a=!1;const u=i,o=this.clickConfigList.find(d=>{const l=d.xpath;if(l===u)return!0;if(u.startsWith(l))return n=b(l),!0;if(d.isSiblingEffective===G.YES){if(Yn(l,i))return a=!0,!0;const g=l.substring(0,l.lastIndexOf("/"));if(u.startsWith(g)){const y=u.replace(`${g}/`,"").split("/").shift();i=`${g}/${y}`,n=b(i);const m=b(l);return se(n,m!=null?m:void 0)?(a=!0,!0):!1}}return!1}),s=Ve(n),c=(r=o==null?void 0:o.validationMarker)!=null?r:"";if(o&&this.checkMarker(s,c)){let d=o.datasource;a&&(d=We(o.datasource,o.xpath,i));const l=this.getEventData(d);let g;this.mode!==w.Report&&(g=this.validateData(d)?F.Success:F.Fail),this.report({eventId:o.id,eventType:k.Click,xpath:u,data:l,eventName:o.eventName,validationResult:g})}},{capture:!0})}createIntersectionObserver(t){const r=n=>{n.forEach(i=>{if(i.intersectionRatio>=t){let a={};try{a=JSON.parse(i.target.getAttribute(ce)||"{}")}catch(s){a={}}const u=this.getEventData(a.datasource||[]);let o;this.mode!==w.Report&&(o=this.validateData(a.datasource||[])?F.Success:F.Fail),this.report({eventId:a.id,eventType:k.Expose,xpath:a.xpath,data:u,validationResult:o,eventName:a.eventName})}})};return new IntersectionObserver(r,{threshold:t})}getEventData(t){const r={};return t.forEach(n=>{var i;const a=b(n.fieldXpath);if(a){let u="";a instanceof HTMLInputElement||a instanceof HTMLTextAreaElement?u=a.value:a instanceof HTMLImageElement||a instanceof HTMLAudioElement||a instanceof HTMLVideoElement?u=a.src:u=(i=a.textContent)!=null?i:"",r[n.fieldName]=u}}),r}validateData(t){return t.every(r=>{let n="";const i=b(r.fieldXpath);return i&&(n=i.innerText),(r==null?void 0:r.isRequired)===qe.YES&&!n?!1:r!=null&&r.reg?new RegExp(r.reg).test(n):!0})}report(t){this.mode===w.Validate?this.reportValidation(t):this.mode===w.Report?this.reportLog(t):this.mode===w.ReportAndValidate&&(this.reportValidation(Je({},t)),this.reportLog(Je({},t)))}reportLog(t){if(delete t.validationResult,delete t.eventName,this.sendType===V.Beacon){const r=new Blob([JSON.stringify(t)],{type:"application/json"});navigator.sendBeacon(`${this.serverURL}/tracking/report`,r)}else if(this.sendType===V.Gif){let r=new Image;const n=Xe(t),i=`${this.serverURL}/tracking/track.gif?${n}`;r.src=i,r=null}}reportValidation(t){var r;window.parent.postMessage({type:"client-sdk",method:"reportValidation",params:t},ui((r=this.trackingClientURL)!=null?r:""))}getCurrentTrackingConfig(t,r){return X(this,null,function*(){let n=[];try{const i=yield this.request.get(`/tracking?page=1&filter=projectId||$eq||${this.projectId}&filter=url||$eq||${encodeURIComponent(t)}`,void 0,r);i.code===200&&(n=i.data.data)}catch(i){n=[]}return n})}addAllListeners(){this.registerMutationObserver(),this.registerClickEvent()}setTrackingConfig(){return X(this,null,function*(){this.requestAbortController&&(this.requestAbortController.abort(),this.requestAbortController=void 0),this.requestAbortController=new AbortController;const t=yield this.getCurrentTrackingConfig(location.href,{signal:this.requestAbortController.signal});this.exposeConfigList=t.filter(r=>r.eventType.includes(k.Expose)),this.clickConfigList=t.filter(r=>r.eventType.includes(k.Click))})}start(){return X(this,null,function*(){this.router.onChange(()=>X(this,null,function*(){yield this.setTrackingConfig(),this.observeDomChange()})),this.intersectionObserver=this.createIntersectionObserver(this.intersectionObserverOptions.threshold||.5),yield this.setTrackingConfig(),this.addAllListeners()})}}function ui(e){return new URL(e).origin}function ci(e,t){let r=0;const n=Math.min(e.length,t.length);for(let i=0;i<n&&e[i]===t[i];i++)r++;return r}return si});
