
/* ---------- strokes: draw, pack, unpack ---------- */
const STAMPS=[
 c=>`<path d="M0 9C-12 0 -8 -10 0 -4 8 -10 12 0 0 9Z" fill="${c}"/>`,
 c=>`<path d="M0 -11L3 -3.5 11 -3 4.8 2.2 6.8 10 0 5.6 -6.8 10 -4.8 2.2 -11 -3 -3 -3.5Z" fill="${c}"/>`,
 c=>[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-6.4" rx="4.3" ry="6.2" transform="rotate(${a})" fill="${c}"/>`).join('')+`<circle r="3.4" fill="#f6e27a"/>`,
 c=>`<path d="M-8 8C-9 -4 0 -11 9 -9 10 1 3 9 -8 8Z" fill="${c}"/><path d="M-7 7L5 -5" stroke="#fff" stroke-opacity=".65" stroke-width="1.2" fill="none"/>`,
 c=>`<circle r="5" fill="${c}"/>`+[0,45,90,135,180,225,270,315].map(a=>`<path d="M0 -8.4V-11.4" stroke="${c}" stroke-width="2.2" stroke-linecap="round" transform="rotate(${a})"/>`).join(''),
 c=>`<path d="M0 -10C6 -2 8 2 8 5A8 8 0 0 1 -8 5C-8 2 -6 -2 0 -10Z" fill="${c}"/>`,
 c=>`<path d="M0 -11C1 -4 4 -1 11 0 4 1 1 4 0 11 -1 4 -4 1 -11 0 -4 -1 -1 -4 0 -11Z" fill="${c}"/>`,
 c=>`<path d="M5 9A9 9 0 1 1 5 -9 7 7 0 0 0 5 9Z" fill="${c}"/>`
];
const STAR_D='M0 -11L3 -3.5 11 -3 4.8 2.2 6.8 10 0 5.6 -6.8 10 -4.8 2.2 -11 -3 -3 -3.5Z';
const Q={pot:2,card:1},KW={pot:1,card:.55},WS=[4,7,11,16,24];
const zz=n=>n<0?-2*n-1:2*n,uz=n=>n%2?-(n+1)/2:n/2;
const used=a=>a.reduce((n,s)=>n+(s.t===4?6:s.p.length),0);
function pack(strokes,kind){
 const q=Q[kind];
 return strokes.map(s=>{
  if(s.t===4)return '4'+s.c.toString(16)+s.w+':'+[s.s,Math.round(s.x/q),Math.round(s.y/q)].map(n=>n.toString(36)).join(',');
  let px=0,py=0;const o=[];
  s.p.forEach(([x,y])=>{const X=Math.round(x/q),Y=Math.round(y/q);o.push(zz(X-px).toString(36),zz(Y-py).toString(36));px=X;py=Y});
  return s.t+s.c.toString(16)+s.w+':'+o.join(',');
 }).join('~');
}
function unpack(str,kind){
 const out=[];if(typeof str!=='string'||!str)return out;
 const q=Q[kind],W=kind==='pot'?760:400,H=kind==='pot'?695:260;let pts=0;
 for(const part of str.slice(0,40000).split('~')){
  if(out.length>=400||pts>2500)break;
  const m=/^([0-8])([0-9a-f])([1-5]):([0-9a-z,]*)$/.exec(part);if(!m)continue;
  const tt=+m[1],c=parseInt(m[2],16),w=+m[3],nums=m[4].split(',').map(x=>parseInt(x,36));
  if(nums.some(n=>!isFinite(n)))continue;
  if(tt===4){if(nums.length<3)continue;out.push({t:4,c,w,s:clamp(nums[0],0,STAMPS.length-1),x:clamp(nums[1]*q,0,W),y:clamp(nums[2]*q,0,H)});pts+=6}
  else{const p=[];let X=0,Y=0;for(let i=0;i+1<nums.length;i+=2){X+=uz(nums[i]);Y+=uz(nums[i+1]);p.push([clamp(X*q,0,W),clamp(Y*q,0,H)])}if(p.length){out.push({t:tt,c,w,p});pts+=p.length}}
 }
 return out;
}
const f1=n=>(Math.round(n*10)/10);
function pathD(p){
 if(p.length===1)return `M${f1(p[0][0])} ${f1(p[0][1])}h.1`;
 let d=`M${f1(p[0][0])} ${f1(p[0][1])}`;
 if(p.length===2)return d+`L${f1(p[1][0])} ${f1(p[1][1])}`;
 for(let i=1;i<p.length-1;i++){d+=`Q${f1(p[i][0])} ${f1(p[i][1])} ${f1((p[i][0]+p[i+1][0])/2)} ${f1((p[i][1]+p[i+1][1])/2)}`}
 const l=p[p.length-1];return d+`L${f1(l[0])} ${f1(l[1])}`;
}
function strokeSVG(s,kind){
 const k=KW[kind],w=WS[s.w-1]*k,col=PAL[s.c]||PAL[0];
 if(s.t===4){const sc=(WS[s.w-1]+8)/(kind==='pot'?10:16),r=((Math.round(s.x)*13+Math.round(s.y)*7)%30)-15;return `<g transform="translate(${f1(s.x)} ${f1(s.y)}) rotate(${r}) scale(${sc.toFixed(2)})">${STAMPS[s.s](col)}</g>`}
 const d=pathD(s.p),b=`fill="none" stroke-linejoin="round"`;
 if(s.t===0)return `<path d="${d}" ${b} stroke-linecap="round" stroke="${col}" stroke-width="${Math.max(1.4,w*.42).toFixed(1)}" opacity=".9"/><path d="${d}" ${b} stroke-linecap="round" stroke="${col}" stroke-width="${Math.max(2,w*.8).toFixed(1)}" stroke-dasharray="${(w*.18+.6).toFixed(1)} ${(w*.5+1).toFixed(1)}" opacity=".35"/>`;
 if(s.t===6){let a='',b2='',c2='';const r=rnd(Math.round(s.p[0][0]*7+s.p[0][1]*3)),R=Math.max(5,w*1.35);const pts=[];for(let i=0;i<s.p.length;i++){const A=s.p[i],B=s.p[i+1];pts.push(A);if(B){const n=Math.min(5,Math.floor(Math.hypot(B[0]-A[0],B[1]-A[1])/2.2));for(let k=1;k<=n;k++)pts.push([A[0]+(B[0]-A[0])*k/(n+1),A[1]+(B[1]-A[1])*k/(n+1)])}}
  for(const q of pts){for(let k=0;k<9;k++){const ang=r()*6.283,rr=R*r()*(.6+r()*.5),x=(q[0]+Math.cos(ang)*rr).toFixed(1),y=(q[1]+Math.sin(ang)*rr).toFixed(1),m=`M${x} ${y}h.1`;if(k<4)a+=m;else if(k<7)b2+=m;else c2+=m}}
  const g=`fill="none" stroke="${col}" stroke-linecap="round"`;return `<path d="${a}" ${g} stroke-width="${Math.max(1.7,w*.2).toFixed(1)}" opacity=".95"/><path d="${b2}" ${g} stroke-width="${Math.max(1.2,w*.13).toFixed(1)}" opacity=".85"/><path d="${c2}" ${g} stroke-width="${Math.max(2,w*.26).toFixed(1)}" opacity=".5"/>`}
 if(s.t===7){const g=`fill="none" stroke="${col}" stroke-linecap="round" stroke-linejoin="round"`;return `<path d="${d}" ${g} stroke-width="${(w*2.7).toFixed(1)}" opacity=".16" style="mix-blend-mode:multiply" transform="translate(.8 .8)"/><path d="${d}" ${g} stroke-width="${(w*2.1).toFixed(1)}" opacity=".3" style="mix-blend-mode:multiply"/><path d="${d}" ${g} stroke-width="${(w*1.1).toFixed(1)}" opacity=".26" style="mix-blend-mode:multiply" transform="translate(${(w*.2).toFixed(1)} ${(w*.15).toFixed(1)})"/>`}
 if(s.t===8){const g=`fill="none" stroke-linecap="round" stroke-linejoin="round"`;return `<g filter="url(#foilF)"><path d="${d}" ${g} stroke="url(#goldG)" stroke-width="${(w*1.05).toFixed(1)}"/></g>`}
 if(s.t===1)return `<path d="${d}" ${b} stroke-linecap="round" stroke="${col}" stroke-width="${(w*1.2).toFixed(1)}" opacity=".55" style="mix-blend-mode:multiply"/>`;
 if(s.t===2){const g=`fill="none" stroke-linecap="round" stroke-linejoin="round"`,r=rnd(Math.round(s.p[0][0]*5+s.p[0][1]*11));let st='';for(let i=0;i<9;i++){const o=(r()-.5)*w*1.2,lt=r()>.5;st+=`<path d="${d}" ${g} stroke="${lt?'#fff':'#000'}" stroke-opacity="${(.05+r()*.11).toFixed(2)}" stroke-width="${(.7+r()*w*.16).toFixed(1)}" transform="translate(${o.toFixed(1)} ${(-o*.75).toFixed(1)})"/>`}return `<g filter="url(#brushF)"><path d="${d}" ${g} stroke="${col}" stroke-width="${(w*1.5).toFixed(1)}" opacity=".95"/>${st}</g>`}
 return `<g filter="url(#chalkF)"><path d="${d}" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="${col}" stroke-width="${(w*1.7).toFixed(1)}" opacity=".95"/></g><g filter="url(#dustF)"><path d="${d}" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="${col}" stroke-width="${(w*2.6).toFixed(1)}" opacity=".35"/></g>`;
}
const strokesSVG=(a,kind)=>a.map(s=>strokeSVG(s,kind)).join('');

/* ---------- pot decoration ---------- */
const SIL='240,92 160,112 131,150 130,180 131,210 134,240 151,270 167,300 172,330 178,360 184,390 190,420 196,450 203,480 209,510 215,540 223,570 256,600 499,600 530,570 538,540 545,510 552,480 560,450 567,420 574,390 581,360 588,330 595,300 613,270 631,240 636,210 639,180 639,150 618,120 533,92';
const BODY='167,278 589,278 532,570 221,570';
const rnd=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
function pattern(d,ink){
 let g='';
 if(d==='stripes')g=`<rect x="100" y="318" width="560" height="30" fill="${ink}"/><rect x="100" y="372" width="560" height="12" fill="${ink}"/>`;
 else if(d==='dots'){for(let r=0;r<5;r++)for(let x=(r%2?172:144);x<650;x+=56)g+=`<circle cx="${x}" cy="${316+r*52}" r="10" fill="${ink}"/>`}
 else if(d==='hearts'){for(let r=0;r<3;r++)for(let x=(r%2?180:145);x<650;x+=70)g+=`<path transform="translate(${x} ${338+r*84}) scale(2)" d="M0 7C-16-5-9-17 0-9 9-17 16-5 0 7Z" fill="${ink}"/>`}
 else if(d==='waves'){for(let r=0;r<5;r++)g+=`<path d="M70 ${312+r*48} q35 -26 70 0${' t70 0'.repeat(9)}" fill="none" stroke="${ink}" stroke-width="9" stroke-linecap="round"/>`}
 else if(d==='checks'){for(let j=0;j<8;j++)for(let i=0;i<17;i++)if((i+j)%2===0)g+=`<rect x="${96+i*36}" y="${286+j*36}" width="36" height="36" fill="${ink}" opacity=".92"/>`}
 else if(d==='stars'){for(let r=0;r<3;r++)for(let x=(r%2?190:150);x<650;x+=80)g+=`<path transform="translate(${x} ${336+r*82}) scale(1.7)" d="${STAR_D}" fill="${ink}"/>`}
 else if(d==='label')g=`<g transform="rotate(-3 379 424)"><rect x="257" y="372" width="244" height="106" rx="8" fill="#fffdf6" stroke="rgba(0,0,0,.08)"/><rect x="326" y="360" width="106" height="26" fill="rgba(236,228,206,.9)" transform="rotate(-4 379 373)"/><text class="lbl" x="379" y="440" text-anchor="middle" font-family="Give You Glory,cursive" font-weight="400" font-size="56" fill="#3e3a35"></text></g>`;
 return g;
}
function potLayers(cfg,u){
 const ink=cfg.pk>=0?PAL[cfg.pk]:(INK[cfg.pc]||'#fff');
 let below='',above='';
 if(cfg.pf===3){
  const c=PAL[cfg.pg]||PAL[3],xs=[175,265,350,440,525,595],ws=[30,26,34,28,30,26],ls=[130,70,150,95,120,62];
  below+=`<g fill="${c}"><rect x="110" y="140" width="550" height="64"/>`+xs.map((x,i)=>`<rect x="${x-ws[i]/2}" y="190" width="${ws[i]}" height="${ls[i]}" rx="${ws[i]/2}"/>`).join('')+`</g><path d="M130 160 Q380 138 640 160" stroke="#fff" stroke-opacity=".28" stroke-width="8" fill="none" stroke-linecap="round"/>`;
 }
 if(cfg.pd!=='none')below+=`<g clip-path="url(#bd_${u})">${pattern(cfg.pd,ink)}</g>`;
 if(cfg.pf===2){const r=rnd(11);for(let i=0;i<110;i++){const x=130+r()*510,y=108+r()*490,rr=.9+r()*3;below+=`<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${rr.toFixed(1)}" ry="${(rr*(.6+r()*.5)).toFixed(1)}" fill="${i%3?'#3a2a20':'#fff'}" opacity="${i%3?.32:.5}"/>`}}
 if(cfg.pf===1)above+=`<path d="M196 320 Q206 430 238 552" stroke="#fff" stroke-opacity=".34" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M158 168 Q380 140 612 168" stroke="#fff" stroke-opacity=".3" stroke-width="10" fill="none" stroke-linecap="round"/>`;
 return{below,above};
}
const FILTERS='<filter id="chalkF" filterUnits="userSpaceOnUse" x="-50" y="-50" width="900" height="800"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 8 0 0 0 -3.2" result="a"/><feComposite in="SourceGraphic" in2="a" operator="in" result="g"/><feDisplacementMap in="g" in2="n" scale="3.5" xChannelSelector="R" yChannelSelector="G"/></filter><filter id="dustF" filterUnits="userSpaceOnUse" x="-50" y="-50" width="900" height="800"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="9" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 12 0 0 0 -6.4" result="a"/><feComposite in="SourceGraphic" in2="a" operator="in"/></filter><filter id="brushF" filterUnits="userSpaceOnUse" x="-50" y="-50" width="900" height="800"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="2" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 6 0 0 0 -1.9" result="a"/><feComposite in="SourceGraphic" in2="a" operator="in" result="g"/><feDisplacementMap in="g" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G"/></filter><filter id="foilF" filterUnits="userSpaceOnUse" x="-50" y="-50" width="900" height="800"><feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0" result="z"/><feComposite in="SourceGraphic" in2="n" operator="arithmetic" k1=".5" k2=".85" k3="0" k4="0" result="m"/><feComposite in="m" in2="SourceGraphic" operator="in"/></filter>';
const GOLDG='<linearGradient id="goldG" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="760" y2="695"><stop offset="0" stop-color="#8a6516"/><stop offset=".18" stop-color="#f6dc84"/><stop offset=".34" stop-color="#c9982c"/><stop offset=".5" stop-color="#fff0b0"/><stop offset=".68" stop-color="#b68623"/><stop offset=".84" stop-color="#f1d06e"/><stop offset="1" stop-color="#8a6516"/></linearGradient>';
const potDefs=u=>`<defs>${GOLDG}${FILTERS}<clipPath id="sil_${u}"><polygon points="${SIL}"/></clipPath><clipPath id="bd_${u}"><polygon points="${BODY}"/></clipPath></defs>`;
function potShade(u,pc,paint){
 return `<defs><filter id="af_${u}" color-interpolation-filters="sRGB"><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/></filter><mask id="pm_${u}" maskUnits="userSpaceOnUse" x="0" y="0" width="760" height="695"><g filter="url(#af_${u})">${paint}</g></mask><linearGradient id="cy_${u}" x1="130" x2="640" y1="0" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#000" stop-opacity=".4"/><stop offset=".15" stop-color="#000" stop-opacity=".14"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".38" stop-color="#fff" stop-opacity=".22"/><stop offset=".52" stop-color="#000" stop-opacity="0"/><stop offset=".85" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient><linearGradient id="rm_${u}" x1="0" x2="0" y1="92" y2="190" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#000" stop-opacity=".0"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs><g mask="url(#pm_${u})"><rect x="100" y="80" width="580" height="540" fill="url(#cy_${u})"/></g><g mask="url(#pm_${u})" style="mix-blend-mode:soft-light"><image href="img/maceta_${pc}.webp" width="760" height="695" opacity=".95" style="filter:grayscale(1) contrast(1.35)"/></g><g mask="url(#pm_${u})" style="mix-blend-mode:multiply" opacity=".16"><image href="img/maceta_${pc}.webp" width="760" height="695" style="filter:grayscale(1) contrast(1.4) brightness(1.15)"/></g>`;
}
function potSVG(cfg,u,strokes){
 const L=potLayers(cfg,u),sk=strokesSVG(strokes,'pot'),paint=L.below+sk;
 return potDefs(u)+`<g clip-path="url(#sil_${u})">${L.below}${sk}${paint?potShade(u,cfg.pc,paint):''}${L.above}</g>`;
}

/* ---------- scene: pot + deco + cut-out plant, stop-motion ---------- */
const META={"rosa":[{"w":493,"h":321,"ax":246.5},{"w":499,"h":429,"ax":240.1},{"w":424,"h":482,"ax":198.9},{"w":407,"h":447,"ax":156.9},{"w":377,"h":492,"ax":197.3},{"w":388,"h":499,"ax":168.6}],"tulipan":[{"w":499,"h":274,"ax":249.5},{"w":499,"h":442,"ax":219.5},{"w":427,"h":500,"ax":213.5},{"w":465,"h":482,"ax":222.1},{"w":430,"h":462,"ax":216.3},{"w":407,"h":474,"ax":174.5}],"girasol":[{"w":424,"h":297,"ax":207.0},{"w":470,"h":324,"ax":233.1},{"w":441,"h":478,"ax":227.4},{"w":403,"h":489,"ax":211.8},{"w":345,"h":499,"ax":162.5},{"w":375,"h":500,"ax":123.0}]};
const DIRT={rosa:[.31,.18,.13,.14,.13,.115],tulipan:[.24,.21,.18,.115,.10,.095],girasol:[.32,.19,.11,.11,.125,.105]};
const SEEDS={
 rosa:'<path d="M20 4c8 3 12 11 10 20-2 8-7 12-10 12s-8-4-10-12C8 15 12 7 20 4z" fill="#b5532b"/><path d="M20 4c-2-2-5-2-7 0 3 0 5 1 7 0zM20 4c2-2 5-2 7 0-3 0-5 1-7 0z" fill="#5f8559"/><path d="M14 14c1-3 3-5 6-6" stroke="#e9a37f" stroke-width="2" fill="none" stroke-linecap="round"/>',
 tulipan:'<path d="M20 3c2 6 12 10 12 22 0 8-6 12-12 12S8 33 8 25C8 13 18 9 20 3z" fill="#d6a456"/><path d="M20 3c-2 8-6 14-6 30M20 3c2 8 6 14 6 30" stroke="#9c6f2c" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M15 36l-2 3m7-2v3m5-3l2 3" stroke="#e8dcc2" stroke-width="1.8" stroke-linecap="round"/>',
 girasol:'<path d="M20 2c8 6 11 16 9 26-1 6-5 10-9 10s-8-4-9-10C9 18 12 8 20 2z" fill="#37332f"/><path d="M20 4c-3 8-3 22 0 32M14 10c-2 7-2 15 0 22M26 10c2 7 2 15 0 22" stroke="#d9d3c4" stroke-width="2.2" fill="none" stroke-linecap="round"/>'};
const VMETA={"rosa":[[{"w":359,"h":474,"ax":186.0,"d":0.103},{"w":355,"h":495,"ax":186.5,"d":0.123},{"w":399,"h":500,"ax":184.5,"d":0.098}],[{"w":361,"h":468,"ax":182.0,"d":0.106},{"w":365,"h":476,"ax":179.5,"d":0.107},{"w":393,"h":500,"ax":179.5,"d":0.098}],[{"w":361,"h":477,"ax":186.5,"d":0.106},{"w":359,"h":484,"ax":183.5,"d":0.103},{"w":397,"h":500,"ax":183.5,"d":0.108}],[{"w":361,"h":473,"ax":186.0,"d":0.105},{"w":357,"h":493,"ax":180.0,"d":0.099},{"w":391,"h":500,"ax":182.5,"d":0.098}],[{"w":359,"h":481,"ax":187.0,"d":0.12},{"w":351,"h":472,"ax":178.5,"d":0.145},{"w":398,"h":500,"ax":182.5,"d":0.1}],[{"w":380,"h":472,"ax":198.5,"d":0.105},{"w":366,"h":494,"ax":190.0,"d":0.101},{"w":404,"h":500,"ax":188.0,"d":0.098}],[{"w":358,"h":487,"ax":186.5,"d":0.111},{"w":363,"h":496,"ax":188.5,"d":0.107},{"w":402,"h":500,"ax":183.0,"d":0.1}],[{"w":356,"h":477,"ax":180.5,"d":0.108},{"w":372,"h":497,"ax":189.5,"d":0.115},{"w":397,"h":500,"ax":181.0,"d":0.106}],[{"w":361,"h":508,"ax":182.5,"d":0.106},{"w":364,"h":499,"ax":184.5,"d":0.102},{"w":397,"h":500,"ax":183.0,"d":0.1}],[{"w":377,"h":487,"ax":189.5,"d":0.102},{"w":364,"h":496,"ax":183.5,"d":0.105},{"w":402,"h":500,"ax":182.5,"d":0.098}]],"tulipan":[[{"w":354,"h":441,"ax":168.0,"d":0.096},{"w":335,"h":475,"ax":153.0,"d":0.092},{"w":352,"h":500,"ax":167.5,"d":0.084}],[{"w":348,"h":468,"ax":163.5,"d":0.1},{"w":356,"h":487,"ax":172.0,"d":0.086},{"w":357,"h":500,"ax":171.5,"d":0.082}],[{"w":355,"h":465,"ax":170.5,"d":0.089},{"w":355,"h":475,"ax":170.0,"d":0.088},{"w":355,"h":500,"ax":169.5,"d":0.086}],[{"w":363,"h":473,"ax":170.5,"d":0.092},{"w":366,"h":491,"ax":173.5,"d":0.089},{"w":365,"h":500,"ax":173.0,"d":0.086}],[{"w":360,"h":467,"ax":173.0,"d":0.091},{"w":354,"h":486,"ax":171.0,"d":0.088},{"w":359,"h":500,"ax":172.5,"d":0.084}],[{"w":359,"h":482,"ax":168.0,"d":0.091},{"w":357,"h":477,"ax":168.5,"d":0.09},{"w":366,"h":500,"ax":168.0,"d":0.086}],[{"w":360,"h":474,"ax":173.5,"d":0.09},{"w":357,"h":492,"ax":169.0,"d":0.085},{"w":366,"h":500,"ax":170.0,"d":0.084}],[{"w":345,"h":456,"ax":166.0,"d":0.091},{"w":351,"h":486,"ax":169.5,"d":0.086},{"w":371,"h":500,"ax":165.0,"d":0.082}],[{"w":354,"h":471,"ax":168.0,"d":0.093},{"w":349,"h":486,"ax":171.5,"d":0.09},{"w":346,"h":500,"ax":165.5,"d":0.086}],[{"w":354,"h":479,"ax":168.5,"d":0.089},{"w":343,"h":474,"ax":162.0,"d":0.09},{"w":384,"h":500,"ax":170.0,"d":0.082}]],"girasol":[[{"w":293,"h":463,"ax":137.0,"d":0.101},{"w":303,"h":487,"ax":134.0,"d":0.094},{"w":323,"h":500,"ax":133.0,"d":0.09}],[{"w":289,"h":472,"ax":133.5,"d":0.095},{"w":320,"h":498,"ax":132.5,"d":0.092},{"w":327,"h":500,"ax":131.5,"d":0.09}],[{"w":283,"h":461,"ax":122.5,"d":0.103},{"w":315,"h":493,"ax":130.0,"d":0.093},{"w":322,"h":500,"ax":128.5,"d":0.092}],[{"w":290,"h":472,"ax":133.0,"d":0.095},{"w":320,"h":491,"ax":133.0,"d":0.093},{"w":328,"h":500,"ax":132.0,"d":0.09}],[{"w":285,"h":485,"ax":130.5,"d":0.097},{"w":310,"h":498,"ax":129.0,"d":0.092},{"w":319,"h":500,"ax":129.0,"d":0.092}],[{"w":291,"h":481,"ax":132.5,"d":0.095},{"w":309,"h":500,"ax":129.5,"d":0.09},{"w":324,"h":500,"ax":129.0,"d":0.09}],[{"w":285,"h":447,"ax":130.5,"d":0.101},{"w":290,"h":502,"ax":128.5,"d":0.092},{"w":318,"h":500,"ax":127.0,"d":0.092}],[{"w":288,"h":445,"ax":130.5,"d":0.104},{"w":319,"h":500,"ax":132.0,"d":0.092},{"w":323,"h":500,"ax":130.0,"d":0.092}],[{"w":292,"h":453,"ax":133.0,"d":0.105},{"w":318,"h":498,"ax":132.5,"d":0.098},{"w":325,"h":500,"ax":130.5,"d":0.094}],[{"w":286,"h":458,"ax":130.5,"d":0.099},{"w":303,"h":496,"ax":130.0,"d":0.095},{"w":317,"h":500,"ax":128.5,"d":0.094}]]};
const CW=[34,42,70,70,70,70],BASE=36.2,M0=[.25,.6,.58,.85,.94,.93];
const J=[[0,0,0],[.25,-.15,.5],[-.2,.1,-.45],[.15,.2,.3],[-.25,-.1,-.2],[.1,-.2,.4]];
ORDER.forEach(sp=>{for(let i=0;i<6;i++){const m=new Image();m.src='img/'+sp+'_'+i+'.webp'}const m=new Image();m.src='img/hoja_'+sp+'.webp'});
POTS.forEach(p=>{const m=new Image();m.src='img/maceta_'+p+'.webp'});

function Scene(el){
 el.innerHTML=`<div class="sheet2"></div><div class="sheet"></div><img class="potimg" src="img/maceta_terra.webp" alt=""><div class="plant"><img class="pa" alt=""><img class="pb" alt=""><div class="fung"><svg viewBox="0 0 100 114" aria-hidden="true"><g class="sp" style="--i:0"><path d="M47.1,52.0 L46.0,53.8 L44.0,55.4 L42.1,53.7 L40.5,52.0 L41.7,50.0 L44.0,49.7 L46.5,49.8Z" fill="#c8c46a" opacity=".85"/><path d="M45.7,52.0 L45.5,53.4 L44.0,53.5 L42.8,53.1 L41.9,52.0 L42.1,50.3 L44.0,50.4 L45.3,50.8Z" fill="#6b4a24"/><path d="M44.5,51.5 L44.3,52.3 L43.5,52.4 L42.9,52.1 L42.4,51.5 L43.1,51.1 L43.5,50.6 L44.1,51.0Z" fill="#a98450"/></g><g class="sp" style="--i:1"><path d="M59.3,46.0 L58.6,47.4 L57.0,48.3 L54.6,48.2 L54.6,46.0 L54.9,44.1 L57.0,43.2 L58.9,44.3Z" fill="#c8c46a" opacity=".85"/><path d="M58.9,46.0 L58.0,46.9 L57.0,47.3 L55.9,47.0 L55.0,46.0 L55.7,44.9 L57.0,44.5 L58.4,44.8Z" fill="#7a5428"/><path d="M57.3,45.6 L57.1,46.0 L56.6,46.4 L56.0,46.1 L56.0,45.6 L56.1,45.1 L56.6,44.9 L57.3,45.0Z" fill="#a98450"/></g><g class="sp" style="--i:2"><path d="M53.6,38.0 L52.0,39.8 L50.0,41.6 L48.2,39.6 L47.0,38.0 L47.4,35.7 L50.0,35.7 L52.2,36.0Z" fill="#c8c46a" opacity=".85"/><path d="M51.5,38.0 L51.6,39.4 L50.0,40.1 L48.5,39.4 L47.5,38.0 L48.7,36.8 L50.0,36.0 L51.5,36.6Z" fill="#5e4222"/><path d="M50.4,37.6 L50.1,38.1 L49.6,38.5 L48.9,38.2 L48.8,37.6 L48.9,37.0 L49.6,37.0 L50.2,37.0Z" fill="#a98450"/></g><g class="sp" style="--i:3"><path d="M40.6,44.0 L40.2,46.0 L38.0,46.6 L36.5,45.4 L35.7,44.0 L36.1,42.3 L38.0,42.4 L39.7,42.5Z" fill="#c8c46a" opacity=".85"/><path d="M39.3,44.0 L38.9,44.8 L38.0,45.1 L36.7,45.1 L36.8,44.0 L37.1,43.1 L38.0,42.7 L39.3,42.8Z" fill="#6b4a24"/><path d="M38.2,43.7 L38.1,44.1 L37.7,44.3 L37.1,44.2 L36.9,43.7 L37.1,43.2 L37.7,43.2 L38.1,43.3Z" fill="#a98450"/></g><g class="sp" style="--i:4"><path d="M64.8,58.0 L64.6,60.3 L62.0,61.4 L60.3,59.5 L59.5,58.0 L60.2,56.4 L62.0,55.7 L64.1,56.1Z" fill="#c8c46a" opacity=".85"/><path d="M64.0,58.0 L63.2,59.1 L62.0,59.3 L60.7,59.2 L60.2,58.0 L60.6,56.7 L62.0,55.8 L63.5,56.6Z" fill="#7a5428"/><path d="M62.4,57.6 L62.2,58.1 L61.6,58.4 L61.2,58.0 L60.6,57.6 L61.0,57.0 L61.6,56.7 L62.2,57.0Z" fill="#a98450"/></g><g class="sp" style="--i:5"><path d="M49.4,62.0 L48.7,63.5 L47.0,63.8 L45.0,63.8 L45.1,62.0 L45.6,60.8 L47.0,60.1 L48.5,60.7Z" fill="#c8c46a" opacity=".85"/><path d="M48.5,62.0 L47.9,62.8 L47.0,63.1 L46.1,62.8 L45.7,62.0 L45.9,61.0 L47.0,60.9 L48.4,60.7Z" fill="#5e4222"/><path d="M47.4,61.7 L47.0,62.0 L46.7,62.2 L46.2,62.0 L46.0,61.7 L46.3,61.3 L46.7,60.9 L47.3,61.1Z" fill="#a98450"/></g><g class="sp" style="--i:6"><path d="M57.2,66.0 L56.6,67.4 L55.0,67.6 L53.8,67.1 L52.9,66.0 L53.6,64.7 L55.0,63.6 L56.3,64.8Z" fill="#c8c46a" opacity=".85"/><path d="M56.1,66.0 L56.3,67.2 L55.0,67.3 L54.2,66.7 L53.5,66.0 L54.2,65.3 L55.0,64.7 L56.3,64.8Z" fill="#6b4a24"/><path d="M55.4,65.7 L55.2,66.1 L54.7,66.2 L54.3,66.0 L54.2,65.7 L54.2,65.3 L54.7,65.2 L55.2,65.3Z" fill="#a98450"/></g><g class="sp" style="--i:7"><path d="M42.9,58.0 L42.3,59.1 L41.0,60.2 L39.1,59.7 L38.5,58.0 L39.2,56.4 L41.0,55.8 L42.7,56.5Z" fill="#c8c46a" opacity=".85"/><path d="M42.2,58.0 L42.0,58.9 L41.0,59.1 L40.3,58.6 L40.0,58.0 L40.2,57.2 L41.0,56.9 L42.1,57.0Z" fill="#7a5428"/><path d="M41.4,57.7 L41.1,58.1 L40.7,58.3 L40.2,58.2 L40.0,57.7 L40.4,57.4 L40.7,57.3 L41.0,57.4Z" fill="#a98450"/></g><g class="sp" style="--i:8"><path d="M53.6,50.0 L53.2,51.0 L52.0,51.9 L50.3,51.5 L49.7,50.0 L50.6,48.8 L52.0,48.1 L53.6,48.5Z" fill="#c8c46a" opacity=".85"/><path d="M53.0,50.0 L53.0,50.9 L52.0,51.4 L51.0,50.9 L50.6,50.0 L51.1,49.2 L52.0,49.1 L53.0,49.1Z" fill="#5e4222"/><path d="M52.2,49.7 L52.2,50.1 L51.7,50.3 L51.4,50.0 L51.3,49.7 L51.3,49.3 L51.7,49.2 L52.0,49.5Z" fill="#a98450"/></g><g class="sp" style="--i:9"><path d="M61.4,40.0 L61.0,40.9 L60.0,42.0 L58.5,41.4 L58.5,40.0 L58.5,38.6 L60.0,37.9 L61.4,38.7Z" fill="#c8c46a" opacity=".85"/><path d="M61.1,40.0 L60.9,40.8 L60.0,40.8 L59.4,40.5 L58.5,40.0 L59.1,39.2 L60.0,38.9 L61.0,39.1Z" fill="#6b4a24"/><path d="M60.2,39.8 L60.2,40.1 L59.8,40.3 L59.5,40.0 L59.4,39.8 L59.5,39.5 L59.8,39.4 L60.1,39.4Z" fill="#a98450"/></g><g class="sp" style="--i:10"><path d="M37.6,52.0 L37.2,53.1 L36.0,53.3 L34.4,53.4 L34.3,52.0 L34.7,50.9 L36.0,50.3 L37.6,50.6Z" fill="#c8c46a" opacity=".85"/><path d="M37.1,52.0 L37.0,52.9 L36.0,53.1 L35.2,52.8 L34.8,52.0 L35.4,51.5 L36.0,51.0 L36.7,51.4Z" fill="#7a5428"/><path d="M36.1,51.8 L36.1,52.1 L35.8,52.1 L35.4,52.1 L35.2,51.8 L35.4,51.5 L35.8,51.4 L36.1,51.5Z" fill="#a98450"/></g><g class="sp" style="--i:11"><path d="M49.7,45.0 L49.4,46.2 L48.0,46.2 L46.8,46.1 L46.6,45.0 L47.0,44.1 L48.0,43.3 L49.2,43.9Z" fill="#c8c46a" opacity=".85"/><path d="M49.1,45.0 L48.9,45.8 L48.0,46.2 L47.3,45.7 L46.9,45.0 L47.2,44.3 L48.0,44.0 L48.8,44.2Z" fill="#5e4222"/><path d="M48.2,44.8 L48.1,45.1 L47.8,45.2 L47.4,45.1 L47.3,44.8 L47.4,44.4 L47.8,44.3 L48.0,44.5Z" fill="#a98450"/></g><circle class="spore" style="--i:0;--dx:3px" cx="45" cy="48" r=".9"/><circle class="spore" style="--i:1;--dx:-4px" cx="56" cy="42" r=".9"/><circle class="spore" style="--i:2;--dx:5px" cx="50" cy="56" r=".9"/><circle class="spore" style="--i:3;--dx:-6px" cx="60" cy="52" r=".9"/><circle class="spore" style="--i:4;--dx:7px" cx="40" cy="50" r=".9"/></svg></div></div><div class="leaf"><img alt=""><i class="tape"></i></div><img class="potfront" alt="" aria-hidden="true"><svg class="deco" viewBox="0 0 760 695" aria-hidden="true"></svg><button type="button" class="seedb" id="${el.id}Seed"><img alt="" draggable="false"></button><div class="memo" id="${el.id}Memo"></div><div class="tag" id="${el.id}Tag"></div>`;
 const pl=el.querySelector('.plant'),A=el.querySelector('.pa'),B=el.querySelector('.pb'),leaf=el.querySelector('.leaf'),lf=leaf.querySelector('img');
 const fungEl=el.querySelector('.fung'),fungSvg=fungEl.querySelector('svg');
 const spSvg=fungSvg.cloneNode(false);[...fungSvg.querySelectorAll('.spore')].forEach(n=>spSvg.appendChild(n));fungEl.appendChild(spSvg);
 const seedEl=el.querySelector('.seedb');
 const potEl=el.querySelector('.potimg'),potF=el.querySelector('.potfront'),deco=el.querySelector('.deco'),tag=$(el.id+'Tag'),memo=$(el.id+'Memo');
 const o={sp:null,dv:0,tv:0,n:0,wig:0,pk:'',pw:null,droop:0};
 const put=(im,fi,sc,op)=>{
  if(fi<0||op<.02){im.style.opacity=0;return}
  const vr=fi>=3&&o.v!=null,m=vr?VMETA[o.sp][o.v][fi-3]:META[o.sp][fi],cw=CW[fi],w=m.w/512*cw,l=50-m.ax/512*cw,k=o.sp+fi+(vr?'v'+o.v:'');
  if(im.dataset.k!==k){im.src=vr?'img/v_'+o.sp+'_'+o.v+'_'+(fi-3)+'.webp':'img/'+o.sp+'_'+fi+'.webp';im.dataset.k=k}
  const dd=vr?m.d:DIRT[o.sp][fi],dc=dd*m.h/512*cw,sink=dd?dc+1.2:0;
  im.style.clipPath=dd?'inset(0 0 '+(dd*100).toFixed(1)+'% 0)':'none';
  im.style.width=w+'cqw';im.style.left=l+'cqw';im.style.bottom=(BASE-sink).toFixed(2)+'cqw';im.style.transformOrigin=(m.ax/m.w*100)+'% '+(dd?(100-dd*100+1.6/(m.h/512*cw)*100*0):100).toFixed(2)+'%';
  im.style.transform='scale('+sc.toFixed(3)+')';im.style.opacity=op.toFixed(2);im._g=[im.src,w,m.h/512*cw,l,114-(BASE-sink)-m.h/512*cw];
 };
 const frame=()=>{
  if(!o.sp||el.offsetParent===null||document.hidden)return;
  o.n++;
  if(o.dv!==o.tv){const d=o.tv-o.dv;o.dv+=Math.sign(d)*Math.min(Math.abs(d),1/8);if(Math.abs(o.tv-o.dv)<1e-6)o.dv=o.tv}
  const lo=Math.min(5,Math.floor(o.dv+1e-6)),f=o.dv-lo;
  const sw=f>=.5,tt=sw?(f-.5)/.5:0;
  const bs=M0[lo]+(1-M0[lo])*tt+(tt>=.5&&tt<1?.04:0);
  put(A,lo-1,1+.1*f,lo===0||sw?0:1);
  put(B,lo,bs,sw?1:0);
  const vg=(sw?B:A)._g;if(vg&&fungSvg.dataset.m!==vg.join('|')){fungSvg.dataset.m=vg.join('|');const st=fungSvg.style,u='url('+vg[0]+')';st.webkitMaskImage=st.maskImage=u;st.webkitMaskRepeat=st.maskRepeat='no-repeat';st.webkitMaskSize=st.maskSize=vg[1].toFixed(2)+'cqw '+vg[2].toFixed(2)+'cqw';st.webkitMaskPosition=st.maskPosition=vg[3].toFixed(2)+'cqw '+vg[4].toFixed(2)+'cqw'}
  const moving=o.dv!==o.tv,w=o.wig>0?o.wig:0;
  if(moving||o.n%2===0||w){
   const j=J[(o.n*5+(o.n>>2))%J.length],wr=w?(o.wig%2?1:-1)*w*.35:0;
   pl.style.transform='translateX('+j[0]+'cqw) rotate('+(j[2]+wr+o.droop).toFixed(2)+'deg)';
   if(w)o.wig--;
  }
 };
 setInterval(frame,110);
 return{
  seed(kind,label){seedEl.classList.toggle('on',!!kind);if(kind&&seedEl.dataset.k!==kind){seedEl.dataset.k=kind;seedEl.firstElementChild.src='img/seed_'+(SEEDS[kind]?kind:'rosa')+'.webp'}if(label)seedEl.setAttribute('aria-label',label);seedEl.style.transform='';seedEl.classList.remove('sowing','drag','back')},
  show(sp,stage,anim,v){
   const spChanged=sp!==o.sp;o.v=v==null?null:v;
   if(spChanged){o.sp=sp;A.dataset.k=B.dataset.k='';lf.src='img/hoja_'+sp+'.webp'}
   if(spChanged||anim===false||stage!==o.tv+1){o.tv=o.dv=stage}else o.tv=stage;
   frame();
  },
  pot(cfg,label){
   const k=[cfg.pc,cfg.ph,cfg.pb,cfg.pd,cfg.pk,cfg.pf,cfg.pg,label].join('|');
   if(k===o.pk&&cfg.pw===o.pw)return;o.pk=k;o.pw=cfg.pw;
   potEl.src='img/maceta_'+cfg.pc+'.webp';potF.src=potEl.src;potF.style.setProperty('--ph',cfg.ph+'deg');potF.style.setProperty('--pb',(cfg.pb/100).toFixed(2));
   potEl.style.setProperty('--ph',cfg.ph+'deg');potEl.style.setProperty('--pb',(cfg.pb/100).toFixed(2));
   deco.innerHTML=potSVG(cfg,el.id,cfg.pw);
   const tx=deco.querySelector('text.lbl');if(tx){tx.textContent=label;tx.setAttribute('font-size',Math.max(26,Math.min(58,210/(Math.max(label.length,4)*.46))))}
  },
  tag(text,paper,font,stk,tcol,gx,gy){
   tag.classList.toggle('on',text!==null);
   if(text===null)return;
   tag.className='tag on f-'+font+(stk!=='none'?' hs':'');tag.style.background=paper;tag.style.color=tcol||'#3e3a35';
   if(typeof gx==='number'&&typeof gy==='number'){tag.style.left=Math.min(Math.max(gx,7),66)+'%';tag.style.top=Math.min(Math.max(gy,6),86)+'%';tag.style.bottom='auto'}else{tag.style.left='';tag.style.top='';tag.style.bottom=''}
   tag.innerHTML='<small>'+esc(BRAND)+'</small>'+esc(text)+(stk!=='none'?`<svg class="ic ti"><use href="#${STKI[stk]}"/></svg>`:'');
  },
  memo(on,html){memo.classList.toggle('on',!!on);if(on)memo.innerHTML=html},
  wiggle(){o.wig=8},
  sick(on,ill,droop,dead){leaf.classList.toggle('on',!!on&&!dead);pl.classList.toggle('ill',ill>0);pl.classList.toggle('fsick',!!on&&!dead);pl.classList.toggle('dead',!!dead);pl.style.setProperty('--ill',ill||0);pl.style.setProperty('--fg',on&&!dead?Math.max(.35,Math.min(1,ill)):0);o.droop=droop||0;o.n=0;frame()}
 };
}
const SC={main:null,gift:null};
function fx(kind){
 const el=$('fx');el.className='fx';void el.offsetWidth;
 if(kind==='l'){
  const W=el.clientWidth||360,H=el.clientHeight||440,sx=W*.2,sy=H*.15,tx=W*.5,ty=H*.6,R=Math.min(W,H)*.06;
  const ang=Math.atan2(ty-sy,tx-sx),len=Math.hypot(tx-sx,ty-sy)*1.25;let rays='';
  [-.34,-.2,-.07,.06,.19,.32].forEach((d,i)=>{const w=.045+(i%2)*.025,a1=ang+d-w,a2=ang+d+w;
   rays+=`<polygon class="ray" style="--i:${i}" points="${sx.toFixed(1)},${sy.toFixed(1)} ${(sx+len*Math.cos(a1)).toFixed(1)},${(sy+len*Math.sin(a1)).toFixed(1)} ${(sx+len*Math.cos(a2)).toFixed(1)},${(sy+len*Math.sin(a2)).toFixed(1)}" fill="url(#rg)"/>`});
  const dust=[[.34,.3],[.46,.42],[.58,.36],[.42,.52],[.55,.5],[.5,.28]].map((q,i)=>`<circle class="dust" style="--i:${i}" cx="${(W*q[0]).toFixed(0)}" cy="${(H*q[1]).toFixed(0)}" r="${1.2+i%3*.6}"/>`).join('');
  el.innerHTML=`<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs>
   <linearGradient id="rg" gradientUnits="userSpaceOnUse" x1="${sx}" y1="${sy}" x2="${tx}" y2="${ty}"><stop offset="0" stop-color="#fff3c4" stop-opacity=".95"/><stop offset=".7" stop-color="#ffe49a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd978" stop-opacity=".05"/></linearGradient>
   <radialGradient id="sg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffdf0"/><stop offset=".38" stop-color="#ffe9a0"/><stop offset=".62" stop-color="#ffc94d" stop-opacity=".9"/><stop offset="1" stop-color="#ffb938" stop-opacity="0"/></radialGradient>
   <radialGradient id="pg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".6"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>
   <filter id="bl" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><feGaussianBlur stdDeviation="${(W*.006).toFixed(1)}"/></filter></defs>
   <g filter="url(#bl)">${rays}</g>
   <ellipse class="pool" cx="${tx}" cy="${ty-H*.06}" rx="${W*.3}" ry="${H*.26}" fill="url(#pg)"/>
   <g class="disc"><circle cx="${sx}" cy="${sy}" r="${R*3.2}" fill="url(#sg)" opacity=".75"/><circle cx="${sx}" cy="${sy}" r="${R}" fill="#fff8d6"/><circle cx="${sx}" cy="${sy}" r="${R*1.35}" fill="none" stroke="#fffdf0" stroke-opacity=".55" stroke-width="${R*.25}"/></g>${dust}</svg>`;
  el.classList.add('l');return;
 }
 const icon={w:'i-drop',a:'i-heart',c:'i-pill'}[kind];
 el.innerHTML=icon?[12,38,64,84].map((x,i)=>`<span style="left:${x}%;top:${(i%2)*18}%;animation-delay:${i*.12}s;color:${kind==='w'?'#4d9be0':kind==='a'?'#d9567a':'#8e74c9'}"><svg class="ic" style="width:26px;height:26px"><use href="#${icon}"/></svg></span>`).join(''):'';
 el.classList.add(kind);
}
function say(x){$('say').textContent=x}
let toastT=null;
function toast(x){const e=$('toast');e.textContent=x;e.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>e.classList.remove('on'),2200)}

/* ---------- card ---------- */
const cardHTML=(g,sm)=>{
 const dood=g.cw&&g.cw.length?`<svg class="doodle" viewBox="0 0 400 260" aria-hidden="true">${strokesSVG(g.cw,'card')}</svg>`:'';
 return `<div class="cardx f-${g.tf} tx${g.tx} fz${g.fz==null?1:g.fz} al${g.al||0} fr${g.fr||0}${g.rd?' rd':''}${g.tp?' taped':''}${sm?' sm':''}" style="--paper:${PAPERS[g.p]};--tcol:${TCOL[g.cc]}">${g.ts!=='none'?`<span class="stk"><svg class="ic"><use href="#${STKI[g.ts]}"/></svg></span>`:''}${dood}<div class="to">${esc(t('forX',g.t))}</div><div class="msg">${esc(g.m)}</div><div class="from">${g.d?'— '+esc(g.d):''}</div><div class="mean">${esc(FLt(g.f).n)}: “${esc(FLt(g.f).mean)}”</div></div>`;
};
const updCardPrev=()=>{const e=$('cprev');if(e)e.innerHTML=cardHTML(mkGift(),true)};

/* ---------- drawing studio ---------- */
const ST={on:false,kind:'pot',W:760,H:695,strokes:[],undo:[],redo:[],tool:0,col:0,size:3,stamp:0,cur:null,svg:null,dirty:false,drawing:false,erasing:false,erased:false,lastS:0,lastP:null};
const TICON=['i-pencil','i-marker','i-brush','i-chalk','i-stamp','i-eraser','i-spray','i-water','i-gold'],TNAME=['pencil','marker','brush','chalk','stamp','erase','spray','water','gold'];
function stHint(msg,warn){const h=$('stHint');h.textContent=msg;h.classList.toggle('warn',!!warn)}
function stBuild(){
 $('stTools').innerHTML=TNAME.map((n,i)=>`<button class="tl2" type="button" data-tl="${i}" aria-pressed="${ST.tool===i}"><svg class="ic"><use href="#${TICON[i]}"/></svg>${esc(t('tools')[n])}</button>`).join('');
 $('stCols').innerHTML=PAL.map((c,i)=>`<button type="button" data-col="${i}" aria-pressed="${ST.col===i}" style="background:${c}" aria-label="${c}"></button>`).join('');
 $('stStamps').innerHTML=STAMPS.map((fn,i)=>`<button type="button" data-stp="${i}" aria-pressed="${ST.stamp===i}"><svg width="28" height="28" viewBox="-13 -13 26 26">${fn(PAL[ST.col]===PAL[1]?'#b9bec8':PAL[ST.col])}</svg></button>`).join('');
 $('stStamps').style.display=ST.tool===4?'flex':'none';
 $('stCols').style.display=ST.tool===5?'none':'flex';
 $('stSize').value=ST.size;$('stSize').style.display=ST.tool===5?'none':'';
 stUi();
}
function stUi(){
 const u=used(ST.strokes)+(ST.cur?ST.cur.p.length:0);
 $('stInkBar').style.width=clamp(u/LIM[ST.kind]*100,0,100)+'%';
 $('stInkBar').style.background=u>LIM[ST.kind]*.9?'var(--bad)':'var(--ink)';
 $('stUndo').disabled=!ST.undo.length;$('stRedo').disabled=!ST.redo.length;$('stClear').disabled=!ST.strokes.length;
}
const stMirror=s=>s.t===4?Object.assign({},s,{x:ST.W-s.x}):Object.assign({},s,{p:s.p.map(q=>[ST.W-q[0],q[1]])});
function stRedraw(){
 const s=$('sStk');if(s)s.innerHTML=strokesSVG(ST.strokes,ST.kind);
 const l=$('sLive');if(l)l.innerHTML=ST.cur?strokeSVG(ST.cur,ST.kind)+(ST.sym?strokeSVG(stMirror(ST.cur),ST.kind):''):'';
 const sh=$('sShade');if(sh&&!ST.drawing){const L=potLayers(potCfg(Object.assign({},S,{pw:[]})),'st'),paint=L.below+strokesSVG(ST.strokes,'pot');sh.innerHTML=paint?potShade('st',S.pc,paint):''}
 const sy=$('stSym');if(sy)sy.setAttribute('aria-pressed',!!ST.sym);
 stUi();
}
function stFit(){
 if(!ST.on||!ST.svg)return;
 const cv=$('stCv'),cs=getComputedStyle(cv),aw=cv.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),ah=cv.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
 const sc=Math.max(.1,Math.min(aw/ST.W,ah/ST.H));ST.svg.style.width=(ST.W*sc)+'px';ST.svg.style.height=(ST.H*sc)+'px';
}
function openStudio(kind){
 ST.kind=kind;ST.W=kind==='pot'?760:400;ST.H=kind==='pot'?695:260;
 ST.strokes=(kind==='pot'?S.pw:S.cw).slice();ST.undo=[];ST.redo=[];ST.dirty=false;ST.cur=null;ST.drawing=ST.erasing=false;
 const cv=$('stCv');cv.className='stcv '+kind;
 if(kind==='pot'){
  const cfg=potCfg(S),L=potLayers(cfg,'st');
  cv.innerHTML=`<svg viewBox="0 0 760 695" id="stSvg">${potDefs('st')}<image href="img/maceta_${S.pc}.webp" width="760" height="695" style="filter:hue-rotate(${S.ph}deg) brightness(${S.pb/100}) drop-shadow(0 18px 24px rgba(30,32,38,.22))"/><g clip-path="url(#sil_st)"><g>${L.below}</g><g id="sStk"></g><g id="sShade"></g><g>${L.above}</g><g id="sLive"></g></g></svg>`;
 }else{
  cv.innerHTML=`<svg viewBox="0 0 400 260" id="stSvg"><defs>${GOLDG}${FILTERS}<clipPath id="clc"><rect width="400" height="260" rx="10"/></clipPath></defs><rect width="400" height="260" rx="10" fill="${PAPERS[S.paper]}"/><g clip-path="url(#clc)"><g id="sStk"></g><g id="sLive"></g></g><rect x="1.5" y="1.5" width="397" height="257" rx="9" fill="none" stroke="${S.paper==='noche'?'#ffffff55':'#30343b33'}" stroke-dasharray="5 5"/></svg>`;
 }
 ST.svg=$('stSvg');
 ['pointerdown','pointermove','pointerup','pointercancel'].forEach(ev=>ST.svg.addEventListener(ev,stPtr));
 ST.svg.addEventListener('contextmenu',e=>e.preventDefault());
 $('stTitle').textContent=t(kind==='pot'?'stTitlePot':'stTitleCard');
 stHint(t(kind==='pot'?'stHintPot':'stHintCard'));
 $('studio').classList.add('on');document.body.classList.add('lock');ST.on=true;
 stBuild();stFit();stRedraw();sfx('tap');
}
function closeStudio(){ST.on=false;$('studio').classList.remove('on');document.body.classList.remove('lock');ST.svg=null;$('stCv').innerHTML=''}
function stDone(){
 if(ST.kind==='pot')S.pw=ST.strokes.slice();else S.cw=ST.strokes.slice();
 save();closeStudio();sfx('done');render();toast(t('saved'));
}
function stAskClose(){
 if(!ST.dirty){closeStudio();return}
 confirmDlg({title:t('cfCloseT'),text:t('cfCloseP'),ok:t('cfCloseOk'),no:t('cfKeep'),danger:true},()=>closeStudio());
}
const stPush=()=>{ST.undo.push(ST.strokes.slice());if(ST.undo.length>40)ST.undo.shift();ST.redo=[];ST.dirty=true};
function stPt(e){const r=ST.svg.getBoundingClientRect();return[clamp((e.clientX-r.left)/r.width*ST.W,0,ST.W),clamp((e.clientY-r.top)/r.height*ST.H,0,ST.H)]}
function eraseAt(p){
 const r=ST.kind==='pot'?20:11,keep=[];let hit=false;
 for(const s of ST.strokes){
  let near=false;
  if(s.t===4)near=Math.hypot(p[0]-s.x,p[1]-s.y)<r+10*(ST.kind==='pot'?1:.6);
  else{const rr=r+WS[s.w-1]*KW[ST.kind]*.6;
   for(let i=0;i<s.p.length&&!near;i++){const a=s.p[i],b=s.p[i+1]||a,dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy;let u=L?((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L:0;u=clamp(u,0,1);if(Math.hypot(p[0]-(a[0]+u*dx),p[1]-(a[1]+u*dy))<rr)near=true}}
  if(near)hit=true;else keep.push(s);
 }
 if(hit){if(!ST.erased){stPush();ST.erased=true}ST.strokes=keep;stRedraw();const n=Date.now();if(n-ST.lastS>120){ST.lastS=n;sfx('erase')}}
}
function stPtr(e){
 if(!ST.on)return;
 if(e.type==='pointerdown'){
  if(e.pointerType==='mouse'&&e.button!==0)return;
  e.preventDefault();try{ST.svg.setPointerCapture(e.pointerId)}catch(x){}
  const p=stPt(e);
  if(ST.tool===5){ST.erasing=true;ST.erased=false;eraseAt(p);return}
  if(used(ST.strokes)>=LIM[ST.kind]){stHint(t('stOut'),true);sfx('err');return}
  stHint(t(ST.kind==='pot'?'stHintPot':'stHintCard'));
  if(ST.tool===4){stPush();ST.strokes.push({t:4,c:ST.col,w:ST.size,s:ST.stamp,x:p[0],y:p[1]});if(ST.sym)ST.strokes.push(stMirror({t:4,c:ST.col,w:ST.size,s:ST.stamp,x:p[0],y:p[1]}));stRedraw();sfx('pop');return}
  ST.cur={t:ST.tool,c:ST.col,w:ST.size,p:[p]};ST.drawing=true;ST.lastP=p;stRedraw();return;
 }
 if(e.type==='pointermove'){
  if(!ST.drawing&&!ST.erasing)return;e.preventDefault();
  const evs=e.getCoalescedEvents?e.getCoalescedEvents():[e],min=ST.kind==='pot'?6:3.4;
  for(const ev of (evs.length?evs:[e])){
   const p=stPt(ev);
   if(ST.erasing){eraseAt(p);continue}
   const a=ST.cur.p[ST.cur.p.length-1];
   if(Math.hypot(p[0]-a[0],p[1]-a[1])>=min){
    if(used(ST.strokes)+ST.cur.p.length>=LIM[ST.kind]){stHint(t('stOut'),true);ST.lastP=null;stEnd();return}
    ST.cur.p.push(p);ST.lastP=p;
    const n=Date.now();if(n-ST.lastS>90){ST.lastS=n;sfx('scratch',TNAME[ST.tool])}
   }else ST.lastP=p;
  }
  stRedraw();return;
 }
 if(e.type==='pointerup'||e.type==='pointercancel')stEnd();
}
function stEnd(){
 if(ST.drawing&&ST.cur){
  const a=ST.cur.p[ST.cur.p.length-1],lp=ST.lastP;
  if(lp&&Math.hypot(lp[0]-a[0],lp[1]-a[1])>1&&used(ST.strokes)+ST.cur.p.length<LIM[ST.kind])ST.cur.p.push(lp);
  stPush();ST.strokes.push(ST.cur);if(ST.sym&&used(ST.strokes)+ST.cur.p.length<LIM[ST.kind])ST.strokes.push(stMirror(ST.cur));ST.cur=null;
 }
 ST.drawing=false;ST.erasing=false;stRedraw();
}
function stUndo(){if(!ST.undo.length)return;ST.redo.push(ST.strokes.slice());ST.strokes=ST.undo.pop();ST.dirty=true;stRedraw();sfx('tap')}
function stRedo(){if(!ST.redo.length)return;ST.undo.push(ST.strokes.slice());ST.strokes=ST.redo.pop();ST.dirty=true;stRedraw();sfx('tap')}
function stClear(){if(!ST.strokes.length)return;stPush();ST.strokes=[];stRedraw();sfx('erase')}
