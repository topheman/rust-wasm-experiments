!function(t){function e(e){for(var n,s,o=e[0],r=e[1],a=0,c=[];a<o.length;a++)s=o[a],i[s]&&c.push(i[s][0]),i[s]=0;for(n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n]);for(h&&h(e);c.length;)c.shift()()}var n={},i={0:0};var s={};var o={2:function(){return{"./ball_wasm":{__wbg_sqrt_6ac1ec864938feb9:function(t){return n[1].exports.__wbg_sqrt_6ac1ec864938feb9(t)},__wbg_random_918d3291fe65513c:function(){return n[1].exports.__wbg_random_918d3291fe65513c()},__wbindgen_throw:function(t,e){return n[1].exports.__wbindgen_throw(t,e)}}}}};function r(e){if(n[e])return n[e].exports;var i=n[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.e=function(t){var e=[],n=i[t];if(0!==n)if(n)e.push(n[2]);else{var a=new Promise(function(e,s){n=i[t]=[e,s]});e.push(n[2]=a);var c,l=document.getElementsByTagName("head")[0],h=document.createElement("script");h.charset="utf-8",h.timeout=120,r.nc&&h.setAttribute("nonce",r.nc),h.src=function(t){return r.p+""+t+".bundle.js"}(t),c=function(e){h.onerror=h.onload=null,clearTimeout(u);var n=i[t];if(0!==n){if(n){var s=e&&("load"===e.type?"missing":e.type),o=e&&e.target&&e.target.src,r=new Error("Loading chunk "+t+" failed.\n("+s+": "+o+")");r.type=s,r.request=o,n[1](r)}i[t]=void 0}};var u=setTimeout(function(){c({type:"timeout",target:h})},12e4);h.onerror=h.onload=c,l.appendChild(h)}return({1:[2]}[t]||[]).forEach(function(t){var n=s[t];if(n)e.push(n);else{var i,a=o[t](),c=fetch(r.p+""+{2:"4783bab8b76c15aa2430"}[t]+".module.wasm");if(a instanceof Promise&&"function"==typeof WebAssembly.compileStreaming)i=Promise.all([WebAssembly.compileStreaming(c),a]).then(function(t){return WebAssembly.instantiate(t[0],t[1])});else if("function"==typeof WebAssembly.instantiateStreaming)i=WebAssembly.instantiateStreaming(c,a);else{i=c.then(function(t){return t.arrayBuffer()}).then(function(t){return WebAssembly.instantiate(t,a)})}e.push(s[t]=i.then(function(e){return r.w[t]=(e.instance||e).exports}))}}),Promise.all(e)},r.m=t,r.c=n,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(n,i,function(e){return t[e]}.bind(null,i));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r.oe=function(t){throw console.error(t),t},r.w={};var a=window.webpackJsonp=window.webpackJsonp||[],c=a.push.bind(a);a.push=e,a=a.slice();for(var l=0;l<a.length;l++)e(a[l]);var h=c;r(r.s=0)}([function(t,e,n){"use strict";n.r(e);const i=300;function s(){const t=[],e={width:window.innerWidth,height:window.innerHeight,mode:"wasm-compute-js-render-canvas",track:function(n){if("function"!=typeof n)throw new Error("Must be a function that will be called on window resize to update width / height");n(e),t.push(n)}},n=function(t,e){let n;return function(...i){clearTimeout(n),n=setTimeout(()=>t.apply(this,i),e)}}(()=>{e.width=window.innerWidth,e.height=window.innerHeight,t.forEach(t=>{t(e)})},i);return window.addEventListener("resize",n,!1),{cleanup:()=>{window.removeEventListener("resize",n)},stage:e}}function o(t){const e=document.getElementById("root"),n=document.createElement("p"),i=document.createElement("button");i.innerText="SHUFFLE";const s=document.createElement("p");s.append(i);const o=function(){const t=document.createElement("div");return t.className="wasm-compute-js-render-html js-compute-js-render-html",t.style.position="absolute",t.style.top="0px",t.style.left="0px",t.style.zIndex=-1,t}(),r=function(){const t=document.createElement("canvas");return t.className="wasm-compute-js-render-canvas js-compute-js-render-canvas",t.style.position="absolute",t.style.top="0px",t.style.left="0px",t.style.zIndex=-1,t}();t.track(({width:t,height:e})=>{r.width=t,r.height=e}),t.track(({width:t,height:e})=>{o.style.width=`${t}px`,o.style.height=`${e}px`});const a=function(t=[],e){const n=t.map(t=>{const n=document.createElement("input");n.name="render-mode",n.type="radio",n.value=t.value,n.id=t.value,n.checked=e.mode===t.value,n.onchange=(t=>{[...document.getElementsByClassName(e.mode)].forEach(t=>t.style.display="none"),e.mode=t.target.value,[...document.getElementsByClassName(e.mode)].forEach(t=>t.style.display="block")});const i=document.createElement("label");i.innerText=t.label,i.htmlFor=t.value;const s=document.createElement("li");return s.appendChild(n),s.appendChild(i),s}),i=document.createElement("ul");n.forEach(t=>i.appendChild(t)),i.style.listStyle="none",i.style.paddingLeft="20px";const s=document.createElement("p");s.innerText="Choose an implementation between JavaScript and Rust/WASM:";const o=document.createElement("div");return o.appendChild(s),o.appendChild(i),o}([{value:"wasm-compute-js-render-canvas",label:"compute by WASM - render by JS into canvas"},{value:"wasm-compute-js-render-html",label:"compute by WASM - render by JS into html"},{value:"js-compute-js-render-canvas",label:"compute by JS - render by JS into canvas"},{value:"js-compute-js-render-html",label:"compute by JS - render by JS into html"}],t);return e.appendChild(a),e.appendChild(n),e.appendChild(s),e.appendChild(r),e.appendChild(o),{rootNode:e,infosNode:n,shuffleButton:i,canvasRenderNode:r,canvasCtx:r.getContext("2d"),htmlRenderNode:o}}class r{constructor(t,e){this.x=t,this.y=e}get_length(){return Math.sqrt(this.x*this.x+this.y*this.y)}dot(t){return this.x*t.x+this.y*t.y}normalize(){return new r(this.x/this.get_length(),this.y/this.get_length())}scale(t){return new r(this.x*t,this.y*t)}}var a=r;var c=class{constructor(t,e,n,i,s,o,r,a,c){this.x=t,this.y=e,this.velocity_x=n,this.velocity_y=i,this.radius=s,this.mass=o,this.gravity=r,this.elasticity=a,this.friction=c}step(){this.x=this.x+this.gravity*this.velocity_x,this.y=this.y+this.gravity*this.velocity_y,this.velocity_x=this.friction*this.velocity_x,this.velocity_y=this.friction*this.velocity_y}manageStageBorderCollision(t,e){this.x-this.radius<0&&(this.velocity_x=-this.velocity_x*this.elasticity,this.x=this.radius),this.x+this.radius>t&&(this.velocity_x=-this.velocity_x*this.elasticity,this.x=t-this.radius),this.y-this.radius<0&&(this.velocity_y=-this.velocity_y*this.elasticity,this.y=this.radius),this.y+this.radius>e&&(this.velocity_y=-this.velocity_y*this.elasticity,this.y=e-this.radius)}checkBallCollision(t){const e=this.x-t.x,n=this.y-t.y,i=this.radius+t.radius;return e*e+n*n<=i*i}resolveBallCollision(t){const e=this.get_vector_2d(t),n=e.get_length(),i=e.scale((this.radius+t.radius-n)/n),s=1/this.mass,o=1/t.mass,r=new a(this.velocity_x-t.velocity_x,this.velocity_y-t.velocity_y),c=i.normalize(),l=r.dot(c);if(l>0)return;const h=-1.85*l/(s+o),u=c.scale(h),d=u.scale(s),m=u.scale(o);this.velocity_x=(this.velocity_x+d.x)*this.elasticity,this.velocity_y=(this.velocity_y+d.y)*this.elasticity,t.velocity_x=(t.velocity_x-m.x)*this.elasticity,t.velocity_y=(t.velocity_y-m.y)*this.elasticity}setRandomPositionAndSpeedInBounds(t,e){this.x=this.random()*t,this.y=this.random()*e,this.velocity_x=10*this.random(),this.velocity_y=10*this.random()}get_vector_2d(t){return new a(this.x-t.x,this.y-t.y)}random(){return Math.random()}};const l=1.3,h=1,u=.98,d=1;n.e(1).then(n.bind(null,1)).then(t=>{function e({x:e=0,y:n=0,velocityX:i=0,velocityY:s=0,radius:o=15,mass:r=l,gravity:a=h,elasticity:m=u,friction:y=d,wasm:p=!0}={}){return new(p?t.Ball:c)(e,n,i,s,o,r,a,m,y)}function n(t){t.forEach(t=>t.step()),t.forEach(t=>t.manageStageBorderCollision(m.width,m.height));for(let e=0;e<t.length;e++)for(let n=e+1;n<t.length;n++)!0===t[e].checkBallCollision(t[n])&&t[e].resolveBallCollision(t[n])}function i(t,e,n="#900000"){e.fillStyle=n,e.beginPath(),e.arc(t.x,t.y,t.radius,0,2*Math.PI,!0),e.closePath(),e.fill()}function r(t,e="#900000"){return`<div class="ball" style="position:absolute;top:${t.y-t.radius}px;left:${t.x-t.radius}px;background:${e};width:${2*t.radius}px;height:${2*t.radius}px;border-radius:${t.radius}px"></div>`}const a={"wasm-compute-js-render-canvas":function(){p.clearRect(0,0,m.width,m.height),b.wasm.forEach(t=>i(t,p,"blue"))},"wasm-compute-js-render-html":function(){f.innerHTML=b.wasm.map(t=>r(t,"darkblue")).join("")},"js-compute-js-render-canvas":function(){p.clearRect(0,0,m.width,m.height),b.js.forEach(t=>i(t,p,"red"))},"js-compute-js-render-html":function(){f.innerHTML=b.js.map(t=>r(t,"darkred")).join("")}};const{stage:m}=s(),{infosNode:y,canvasCtx:p,htmlRenderNode:f,shuffleButton:v}=o(m);let g=0,w=0;const b={wasm:Array.from(Array(10),t=>e()),js:Array.from(Array(10),t=>e({wasm:!1}))},x=()=>{b.wasm.forEach(t=>{t.setRandomPositionAndSpeedInBounds(m.width,m.height)}),b.js.forEach(t=>{t.setRandomPositionAndSpeedInBounds(m.width,m.height)})};v.onclick=x,x(),function t(e){requestAnimationFrame(t),g=e-w,n(b.wasm),n(b.js),y.innerText=`Delta: ${g.toFixed(4)}ms - FrameRate: ${Math.round(1e3/g)} FPS`,a[m.mode](),w=e}()}).catch(t=>{const e=document.createElement("p");e.innerText="An error occured:";const n=document.createElement("pre");n.innerText=t.message;const i=document.getElementById("root");i.appendChild(e),i.appendChild(n)})}]);
//# sourceMappingURL=bundle.js.map