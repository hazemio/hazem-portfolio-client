import{Ht as e,Ut as t}from"./hooks-BjZhQqE0.js";var n=t((e=>{var t={data:``},n=e=>{if(typeof window==`object`){let t=(e?e.querySelector(`#_goober`):window._goober)||Object.assign(document.createElement(`style`),{innerHTML:` `,id:`_goober`});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||t},r=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,i=/\/\*[^]*?\*\/|  +/g,a=/\n+/g,o=(e,t)=>{let n=``,r=``,i=``;for(let a in e){let s=e[a];a[0]==`@`?a[1]==`i`?n=a+` `+s+`;`:r+=a[1]==`f`?o(s,a):a+`{`+o(s,a[1]==`k`?``:t)+`}`:typeof s==`object`?r+=o(s,t?t.replace(/([^,])+/g,e=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+` `+t:t)):a):s!=null&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,`-$&`).toLowerCase(),i+=o.p?o.p(a,s):a+`:`+s+`;`)}return n+(t&&i?t+`{`+i+`}`:i)+r},s={},c=e=>{if(typeof e==`object`){let t=``;for(let n in e)t+=n+c(e[n]);return t}return e},l=(e,t,n,l,u)=>{let d=c(e),f=s[d]||(s[d]=(e=>{let t=0,n=11;for(;t<e.length;)n=101*n+e.charCodeAt(t++)>>>0;return`go`+n})(d));if(!s[f]){let t=d===e?(e=>{let t,n,o=[{}];for(;t=r.exec(e.replace(i,``));)t[4]?o.shift():t[3]?(n=t[3].replace(a,` `).trim(),o.unshift(o[0][n]=o[0][n]||{})):o[0][t[1]]=t[2].replace(a,` `).trim();return o[0]})(e):e;s[f]=o(u?{[`@keyframes `+f]:t}:t,n?``:`.`+f)}let p=n&&s.g?s.g:null;return n&&(s.g=s[f]),((e,t,n,r)=>{r?t.data=t.data.replace(r,e):t.data.indexOf(e)===-1&&(t.data=n?e+t.data:t.data+e)})(s[f],t,l,p),f},u=(e,t,n)=>e.reduce((e,r,i)=>{let a=t[i];if(a&&a.call){let e=a(n),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;a=t?`.`+t:e&&typeof e==`object`?e.props?``:o(e,``):!1===e?``:e}return e+r+(a??``)},``);function d(e){let t=this||{},r=e.call?e(t.p):e;return l(r.unshift?r.raw?u(r,[].slice.call(arguments,1),t.p):r.reduce((e,n)=>Object.assign(e,n&&n.call?n(t.p):n),{}):r,n(t.target),t.g,t.o,t.k)}var f,p,m,h=d.bind({g:1}),g=d.bind({k:1});e.css=d,e.extractCss=e=>{let t=n(e),r=t.data;return t.data=``,r},e.glob=h,e.keyframes=g,e.setup=function(e,t,n,r){o.p=t,f=e,p=n,m=r},e.styled=function(e,t){let n=this||{};return function(){let r=arguments;function i(a,o){let s=Object.assign({},a),c=s.className||i.className;n.p=Object.assign({theme:p&&p()},s),n.o=/ *go\d+/.test(c),s.className=d.apply(n,r)+(c?` `+c:``),t&&(s.ref=o);let l=e;return e[0]&&(l=s.as||e,delete s.as),m&&l[0]&&m(s),f(l,s)}return t?t(i):i}}})),r=t(((t,r)=>{var i=Object.create,a=Object.defineProperty,o=Object.getOwnPropertyDescriptor,s=Object.getOwnPropertyNames,c=Object.getPrototypeOf,l=Object.prototype.hasOwnProperty,u=(e,t)=>{for(var n in t)a(e,n,{get:t[n],enumerable:!0})},d=(e,t,n,r)=>{if(t&&typeof t==`object`||typeof t==`function`)for(let i of s(t))!l.call(e,i)&&i!==n&&a(e,i,{get:()=>t[i],enumerable:!(r=o(t,i))||r.enumerable});return e},f=(e,t,n)=>(n=e==null?{}:i(c(e)),d(t||!e||!e.__esModule?a(n,`default`,{value:e,enumerable:!0}):n,e)),p=e=>d(a({},`__esModule`,{value:!0}),e),m={};u(m,{CheckmarkIcon:()=>q,ErrorIcon:()=>B,LoaderIcon:()=>U,ToastBar:()=>Y,ToastIcon:()=>J,Toaster:()=>ye,default:()=>be,resolveValue:()=>g,toast:()=>M,useToaster:()=>P,useToasterStore:()=>A}),r.exports=p(m);var h=e=>typeof e==`function`,g=(e,t)=>h(e)?e(t):e,ee=(()=>{let e=0;return()=>(++e).toString()})(),_=(()=>{let e;return()=>{if(e===void 0&&typeof window<`u`){let t=matchMedia(`(prefers-reduced-motion: reduce)`);e=!t||t.matches}return e}})(),v=e(),y=20,b=`default`,x=(e,t)=>{let{toastLimit:n}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,n)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return x(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||i===void 0?{...e,dismissed:!0,visible:!1}:e)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+a}))}}},S=[],C={toasts:[],pausedAt:void 0,settings:{toastLimit:y}},w={},T=(e,t=b)=>{w[t]=x(w[t]||C,e),S.forEach(([e,n])=>{e===t&&n(w[t])})},E=e=>Object.keys(w).forEach(t=>T(e,t)),D=e=>Object.keys(w).find(t=>w[t].toasts.some(t=>t.id===e)),O=(e=b)=>t=>{T(t,e)},k={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},A=(e={},t=b)=>{let[n,r]=(0,v.useState)(w[t]||C),i=(0,v.useRef)(w[t]);(0,v.useEffect)(()=>(i.current!==w[t]&&r(w[t]),S.push([t,r]),()=>{let e=S.findIndex(([e])=>e===t);e>-1&&S.splice(e,1)}),[t]);let a=n.toasts.map(t=>({...e,...e[t.type],...t,removeDelay:t.removeDelay||e[t.type]?.removeDelay||e?.removeDelay,duration:t.duration||e[t.type]?.duration||e?.duration||k[t.type],style:{...e.style,...e[t.type]?.style,...t.style}}));return{...n,toasts:a}},te=(e,t=`blank`,n)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:`status`,"aria-live":`polite`},message:e,pauseDuration:0,...n,id:n?.id||ee()}),j=e=>(t,n)=>{let r=te(t,e,n);return O(r.toasterId||D(r.id))({type:2,toast:r}),r.id},M=(e,t)=>j(`blank`)(e,t);M.error=j(`error`),M.success=j(`success`),M.loading=j(`loading`),M.custom=j(`custom`),M.dismiss=(e,t)=>{let n={type:3,toastId:e};t?O(t)(n):E(n)},M.dismissAll=e=>M.dismiss(void 0,e),M.remove=(e,t)=>{let n={type:4,toastId:e};t?O(t)(n):E(n)},M.removeAll=e=>M.remove(void 0,e),M.promise=(e,t,n)=>{let r=M.loading(t.loading,{...n,...n?.loading});return typeof e==`function`&&(e=e()),e.then(e=>{let i=t.success?g(t.success,e):void 0;return i?M.success(i,{id:r,...n,...n?.success}):M.dismiss(r),e}).catch(e=>{let i=t.error?g(t.error,e):void 0;i?M.error(i,{id:r,...n,...n?.error}):M.dismiss(r)}),e};var N=e(),ne=1e3,P=(e,t=`default`)=>{let{toasts:n,pausedAt:r}=A(e,t),i=(0,N.useRef)(new Map).current,a=(0,N.useCallback)((e,t=ne)=>{if(i.has(e))return;let n=setTimeout(()=>{i.delete(e),o({type:4,toastId:e})},t);i.set(e,n)},[]);(0,N.useEffect)(()=>{if(r)return;let e=Date.now(),i=n.map(n=>{if(n.duration===1/0)return;let r=(n.duration||0)+n.pauseDuration-(e-n.createdAt);if(r<0){n.visible&&M.dismiss(n.id);return}return setTimeout(()=>M.dismiss(n.id,t),r)});return()=>{i.forEach(e=>e&&clearTimeout(e))}},[n,r,t]);let o=(0,N.useCallback)(O(t),[t]),s=(0,N.useCallback)(()=>{o({type:5,time:Date.now()})},[o]),c=(0,N.useCallback)((e,t)=>{o({type:1,toast:{id:e,height:t}})},[o]),l=(0,N.useCallback)(()=>{r&&o({type:6,time:Date.now()})},[r,o]),u=(0,N.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:i=8,defaultPosition:a}=t||{},o=n.filter(t=>(t.position||a)===(e.position||a)&&t.height),s=o.findIndex(t=>t.id===e.id),c=o.filter((e,t)=>t<s&&e.visible).length;return o.filter(e=>e.visible).slice(...r?[c+1]:[0,c]).reduce((e,t)=>e+(t.height||0)+i,0)},[n]);return(0,N.useEffect)(()=>{n.forEach(e=>{if(e.dismissed)a(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[n,a]),{toasts:n,handlers:{updateHeight:c,startPause:s,endPause:l,calculateOffset:u}}},F=f(e()),I=n(),L=f(e()),R=n(),z=n(),re=z.keyframes`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,ie=z.keyframes`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ae=z.keyframes`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,B=(0,z.styled)(`div`)`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||`#ff4b4b`};
  position: relative;
  transform: rotate(45deg);

  animation: ${re} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${ie} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||`#fff`};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${ae} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,V=n(),H=V.keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,U=(0,V.styled)(`div`)`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||`#e0e0e0`};
  border-right-color: ${e=>e.primary||`#616161`};
  animation: ${H} 1s linear infinite;
`,W=n(),G=W.keyframes`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,K=W.keyframes`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,q=(0,W.styled)(`div`)`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||`#61d345`};
  position: relative;
  transform: rotate(45deg);

  animation: ${G} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${K} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||`#fff`};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,oe=(0,R.styled)(`div`)`
  position: absolute;
`,se=(0,R.styled)(`div`)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ce=R.keyframes`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,le=(0,R.styled)(`div`)`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ce} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,J=({toast:e})=>{let{icon:t,type:n,iconTheme:r}=e;return t===void 0?n===`blank`?null:L.createElement(se,null,L.createElement(U,{...r}),n!==`loading`&&L.createElement(oe,null,n===`error`?L.createElement(B,{...r}):L.createElement(q,{...r}))):typeof t==`string`?L.createElement(le,null,t):t},ue=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,de=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,fe=`0%{opacity:0;} 100%{opacity:1;}`,pe=`0%{opacity:1;} 100%{opacity:0;}`,me=(0,I.styled)(`div`)`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,he=(0,I.styled)(`div`)`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,ge=(e,t)=>{let n=e.includes(`top`)?1:-1,[r,i]=_()?[fe,pe]:[ue(n),de(n)];return{animation:t?`${(0,I.keyframes)(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${(0,I.keyframes)(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Y=F.memo(({toast:e,position:t,style:n,children:r})=>{let i=e.height?ge(e.position||t||`top-center`,e.visible):{opacity:0},a=F.createElement(J,{toast:e}),o=F.createElement(he,{...e.ariaProps},g(e.message,e));return F.createElement(me,{className:e.className,style:{...i,...n,...e.style}},typeof r==`function`?r({icon:a,message:o}):F.createElement(F.Fragment,null,a,o))}),X=n(),Z=f(e());(0,X.setup)(Z.createElement);var _e=({id:e,className:t,style:n,onHeightUpdate:r,children:i})=>{let a=Z.useCallback(t=>{if(t){let n=()=>{let n=t.getBoundingClientRect().height;r(e,n)};n(),new MutationObserver(n).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return Z.createElement(`div`,{ref:a,className:t,style:n},i)},Q=(e,t)=>{let n=e.includes(`top`),r=n?{top:0}:{bottom:0},i=e.includes(`center`)?{justifyContent:`center`}:e.includes(`right`)?{justifyContent:`flex-end`}:{};return{left:0,right:0,display:`flex`,position:`absolute`,transition:_()?void 0:`all 230ms cubic-bezier(.21,1.02,.73,1)`,transform:`translateY(${t*(n?1:-1)}px)`,...r,...i}},ve=X.css`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,$=16,ye=({reverseOrder:e,position:t=`top-center`,toastOptions:n,gutter:r,children:i,toasterId:a,containerStyle:o,containerClassName:s})=>{let{toasts:c,handlers:l}=P(n,a);return Z.createElement(`div`,{"data-rht-toaster":a||``,style:{position:`fixed`,zIndex:9999,top:$,left:$,right:$,bottom:$,pointerEvents:`none`,...o},className:s,onMouseEnter:l.startPause,onMouseLeave:l.endPause},c.map(n=>{let a=n.position||t,o=Q(a,l.calculateOffset(n,{reverseOrder:e,gutter:r,defaultPosition:t}));return Z.createElement(_e,{id:n.id,key:n.id,onHeightUpdate:l.updateHeight,className:n.visible?ve:``,style:o},n.type===`custom`?g(n.message,n):i?i(n):Z.createElement(Y,{toast:n,position:a}))}))},be=M}));export{r as t};