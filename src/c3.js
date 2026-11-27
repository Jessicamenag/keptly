
/* ---------- render ---------- */
function needState(v,k){if(k==='w')return v>100?[t('nDem'),1]:v<25?[t('nSed'),1]:[t('nBien'),0];if(k==='l')return isNight()?[t('nRest'),0]:v<25?[t('nFalta'),1]:[t('nBien'),0];return v<25?[t('nSola'),1]:[t('nBien'),0]}
function setBar(b,tt,v,k,c){$(b).style.width=clamp(k==='w'?v/1.2:v,0,100)+'%';const [s,bad]=needState(v,k);$(b).style.background=bad?'var(--bad)':c;$(tt).textContent=s;$(tt).classList.toggle('bad',!!bad)}

function renderProfile(){
 const v=FLt(S.f),F=FL[S.f];
 $('spcRow').innerHTML=ORDER.map(k=>`<button class="spc" type="button" data-spc="${k}" aria-pressed="${k===S.f}" title="${esc(FLt(k).n)}" aria-label="${esc(FLt(k).n)}" ${S.mode!=='shop'&&k!==S.f?'disabled style="opacity:.35"':''}><img src="${th(k,5)}" alt=""></button>`).join('');
 if($('pName').value!==S.name)$('pName').value=S.name;$('pName').disabled=S.mode==='sent';
 $('lvl').innerHTML=[1,2,3].map(i=>`<i class="${i<=F.care?'on':''}"></i>`).join('');$('lvlT').textContent=v.careT;
 $('trImg').src=th(S.f,5);$('trImg').dataset.f=S.f;$('trK').textContent=v.n+(S.name?' · '+S.name:'');$('trT').textContent=v.mean;$('trTags').innerHTML=v.tags.map(x=>`<span>${esc(x)}</span>`).join('');
 const growing=S.mode!=='shop';$('needsBlk').style.display=growing?'':'none';$('aboutBlk').style.display=growing?'none':'';
 $('aboutT').textContent=v.d;
 if(growing){
  $('bH').style.width=clamp(S.hp,0,100)+'%';$('bH').style.background=S.hp<35?'var(--bad)':'var(--ok)';$('tH').textContent=S.hp<35?t('hLow'):S.hp<70?t('hMid'):t('nBien');$('tH').classList.toggle('bad',S.hp<35);
  setBar('bW','tW',S.w,'w','#4d9be0');setBar('bL','tL',S.l,'l','#e0a21b');setBar('bA','tA',S.a,'a','var(--rose)');
  const p=Math.round(S.g/GOAL*100);$('bG').style.width=p+'%';$('gPct').textContent=p+'%';
  $('stageT').textContent=S.mode==='dead'?t('deadS'):S.sick?t('sickS'):t('stages')[stageOf(S.g)];
 }
}
function renderStage(anim){
 const st=S.mode==='shop'?6:S.mode==='dead'?Math.max(1,stageOf(S.g)):stageOf(S.g);
 if(!SC.main)SC.main=Scene($('pile'));
 SC.main.pot(potCfg(S),potLabel(S.name,S.to));
 SC.main.show(S.f,st,anim,S.mode==='shop'?null:vOf(S));
 const dead=S.mode==='dead',ill=S.sick&&S.mode==='grow';
 const hurt=S.mode==='grow'||dead?clamp((100-S.hp)/70,0,1):0;
 SC.main.sick(ill,Math.max(ill?1-.75*S.cure/CURES:0,hurt),dead?19:hurt*9,dead);
 SC.main.seed(S.mode==='grow'&&S.sow===false?S.f:null,t('sowAria'));
 SC.main.memo(ill&&!dead,`<svg class="ic mi" viewBox="0 0 24 24"><use href="#i-fung"/></svg><b>${esc(t('fungT'))}</b><span>${esc(t('fungD'))}</span><i class="fdots">${Array.from({length:CURES},(_,i)=>`<u class="${i<S.cure?'on':''}"></u>`).join('')}</i>`);
 const showTag=(S.mode==='card'||S.mode==='sent')&&tab!=='vivero'&&!(tab==='tarjeta'&&seg.tarjeta==='maceta');
 SC.main.tag(showTag?(S.to?t('forX',S.to):t('forX','…')):null,PAPERS[S.paper],S.tf,S.ts,TCOL[S.cc],S.gx,S.gy);
 $('veil').classList.toggle('on',isNight());
 const v=FLt(S.f);
 $('cap').innerHTML=S.mode==='dead'?`<b>${esc(S.name||v.n)}</b>${esc(t('capDead',S.day))}`:S.mode==='shop'?`<b>${esc(v.n)}</b>${esc(t('capShop'))}`:`<b>${esc(S.name||v.n)}</b>${esc(S.sick?t('capSick'):t('stages')[st]+(st>=6?' · '+vName(S.f,vOf(S)):'')+' · '+t('capDay',S.day))}`;
}

const sw=(attr,val,color,label,on,cls)=>`<button type="button" ${attr}="${val}" aria-pressed="${on}" ${cls?`class="${cls}"`:''} style="background:${color}" title="${esc(label)}" aria-label="${esc(label)}"></button>`;
const palRow=(attr,cur,withAuto)=>`<div class="sw">`+(withAuto?`<button type="button" ${attr}="-1" class="auto" aria-pressed="${cur===-1}" title="${esc(t('auto'))}" aria-label="${esc(t('auto'))}"></button>`:'')+PAL.map((c,i)=>sw(attr,i,c,c,cur===i)).join('')+`</div>`;
const drawCta=kind=>{const p=clamp(used(kind==='pot'?S.pw:S.cw)/LIM[kind]*100,0,100);return `<button class="drawcta" type="button" data-draw="${kind}"><svg class="ic"><use href="#i-brush"/></svg><span style="flex:1"><b>${esc(t(kind==='pot'?'potDraw':'cardDraw'))}</b><small>${esc(t(kind==='pot'?'potDrawSub':'cardDrawSub'))}</small><span class="minibar"><i style="width:${p}%"></i></span></span></button>`};
const L=x=>`<div class="lab">${esc(x)}</div>`;
function potPanel(){
 let h=L(t('potBase'))+`<div class="sw">`+POTS.map(p=>sw('data-pot',p,POTC[p],t('pots')[p],p===S.pc)).join('')+`</div>`;
 h+=`<div class="slide"><span>${esc(t('potTone'))}</span><input type="range" data-sl="ph" min="-180" max="180" step="5" value="${S.ph}" aria-label="${esc(t('potTone'))}" style="--trk:linear-gradient(90deg,#d9567a,#f2b632,#8fbf6a,#4aa6a1,#6a9bc9,#9b7fd1,#d9567a)"></div>`;
 h+=`<div class="slide"><span>${esc(t('potBright'))}</span><input type="range" data-sl="pb" min="70" max="130" step="2" value="${S.pb}" aria-label="${esc(t('potBright'))}" style="--trk:linear-gradient(90deg,#444,#eee)"></div>`;
 h+=L(t('potPattern'))+`<div class="opts">`+DECOS.map(d=>`<button class="opt" type="button" data-deco="${d}" aria-pressed="${d===S.pd}">${esc(t('decos')[d])}</button>`).join('')+`</div>`;
 if(S.pd!=='none'&&S.pd!=='label')h+=L(t('potInk'))+palRow('data-pk',S.pk,true);
 h+=L(t('potFinish'))+`<div class="opts">`+[0,1,2,3].map(i=>`<button class="opt" type="button" data-pf="${i}" aria-pressed="${i===S.pf}">${esc(t('pfs')[i])}</button>`).join('')+`</div>`;
 if(S.pf===3)h+=L(t('potDrip'))+palRow('data-pg',S.pg,false);
 h+=drawCta('pot')+`<p class="note" style="margin-top:14px">${esc(t('potNote'))}</p>`;
 return h;
}
function cardPanel(){
 let h=`<div class="cprevw" style="margin:0 0 4px"><div class="k"><svg class="ic" style="width:14px;height:14px"><use href="#i-eye"/></svg>${esc(t('liveK'))}</div><div id="cprev"></div></div>`;
 h+=L(t('paper'))+`<div class="sw">`+Object.keys(PAPERS).map(k=>sw('data-paper',k,PAPERS[k],t('papers')[k],k===S.paper)).join('')+`</div>`;
 h+=L(t('texT'))+`<div class="opts">`+[0,1,2,3].map(i=>`<button class="opt" type="button" data-tx="${i}" aria-pressed="${i===S.tx}">${esc(t('texs')[i])}</button>`).join('')+`</div>`;
 h+=L(t('font'))+`<div class="opts">`+FONTS.map(f=>`<button class="opt ${f}" type="button" data-font="${f}" aria-pressed="${f===S.tf}">${esc(t('fonts')[f])}</button>`).join('')+`</div>`;
 h+=L(t('sizeT'))+`<div class="opts">`+t('sizes').map((n,i)=>`<button class="opt" type="button" data-fz="${i}" aria-pressed="${i===S.fz}">${esc(n)}</button>`).join('')+`</div>`;
 h+=L(t('alignT'))+`<div class="opts">`+t('aligns').map((n,i)=>`<button class="opt" type="button" data-al="${i}" aria-pressed="${i===S.al}">${esc(n)}</button>`).join('')+`</div>`;
 h+=L(t('shapeT'))+`<div class="opts">`+t('shapes').map((n,i)=>`<button class="opt" type="button" data-rd="${i}" aria-pressed="${i===S.rd}">${esc(n)}</button>`).join('')+`</div>`;
 h+=L(t('frameT'))+`<div class="opts">`+t('frames').map((n,i)=>`<button class="opt" type="button" data-fr="${i}" aria-pressed="${i===S.fr}">${esc(n)}</button>`).join('')+`</div>`;
 h+=L(t('inkT'))+`<div class="sw">`+TCOL.map((c,i)=>sw('data-cc',i,c,c,i===S.cc)).join('')+`</div>`;
 h+=L(t('sticker'))+`<div class="opts">`+STK.map(s=>s==='none'?`<button class="stkb none" type="button" data-stk="none" aria-pressed="${S.ts==='none'}" title="${esc(t('stks').none)}" aria-label="${esc(t('stks').none)}">${esc(t('noneShort'))}</button>`:`<button class="stkb" type="button" data-stk="${s}" aria-pressed="${S.ts===s}" title="${esc(t('stks')[s])}" aria-label="${esc(t('stks')[s])}"><svg class="ic"><use href="#${STKI[s]}"/></svg></button>`).join('')+`<button class="opt" type="button" data-tp="${S.tp?0:1}" aria-pressed="${!!S.tp}"><svg class="ic" style="width:16px;height:16px"><use href="#i-tape"/></svg>${esc(S.tp?t('tapeOn'):t('tapeOff'))}</button></div>`;
 h+=drawCta('card');
 return h;
}
function giftObj(g){
 const o={t:g.t,m:g.m,f:g.f,p:g.p,n:g.n,k:g.k,l:g.l,pc:g.pc,tf:g.tf};
 if(g.v)o.v=g.v;if(g.d)o.d=g.d;if(g.nm)o.nm=g.nm;if(g.ph)o.ph=g.ph;if(g.pb!==100)o.pb=g.pb;if(g.pd!=='none')o.pd=g.pd;if(g.pk>=0)o.pk=g.pk;if(g.pf)o.pf=g.pf;if(g.pf===3)o.pg=g.pg;
 if(g.ts!=='none')o.ts=g.ts;if(g.tx)o.tx=g.tx;if(g.cc)o.cc=g.cc;if(g.tp)o.tp=g.tp;if(g.fz!==1&&g.fz!=null)o.fz=g.fz;if(g.al)o.al=g.al;if(g.fr)o.fr=g.fr;if(g.rd)o.rd=g.rd;if(typeof g.gx==='number'&&typeof g.gy==='number'){o.gx=Math.round(g.gx);o.gy=Math.round(g.gy)}
 if(g.pw.length)o.pw=pack(g.pw,'pot');if(g.cw.length)o.cw=pack(g.cw,'card');
 return o;
}
const RPB=()=>$('rpBody');
function renderRight(){
 const segs=SEGS[tab]||[];if(segs.length&&!segs.includes(seg[tab]))seg[tab]=segs[0];
 $('rpTitle').textContent=t('rp_'+tab);
 $('seg').innerHTML=segs.length>1?segs.map(s=>`<button type="button" data-seg="${s}" aria-pressed="${seg[tab]===s}">${esc(t('s_'+s))}</button>`).join(''):'';
 $('seg').style.display=segs.length>1?'':'none';
 const b=RPB(),cur=seg[tab];
 if(cur==='maceta')b.innerHTML=potPanel();
 else if(tab==='tienda'&&cur==='flor')b.innerHTML=`<div class="gh">${esc(t('potsH'))} <span>${esc(t('nSpecies',ORDER.length))}</span></div><div class="circles">`+ORDER.map(k=>`<button class="cir" type="button" data-spc="${k}" aria-pressed="${k===S.f}"><span class="o"><img src="${th(k,5)}" alt=""></span><b>${esc(FLt(k).n)}</b>${esc(FLt(k).careT)}</button>`).join('')+`</div><p class="note" style="margin-top:14px">${esc(t('catNote'))}</p>`;
 else if(tab==='tienda')b.innerHTML=`<div class="gh">${esc(t('howH'))}</div><ol class="note" style="padding-left:18px;margin:0;display:grid;gap:8px">${t('how').map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`;
 else if(tab==='vivero'){
  const st=stageOf(S.g);
  b.innerHTML=`<div class="gh">${esc(t('diaryH'))} <span>${esc(S.mode==='grow'||S.mode==='dead'?t('stageOf',st+1):t('complete'))}</span></div><div class="circles">`+t('stages').map((k,i)=>{const lk=(S.mode==='grow'||S.mode==='dead')&&i>st;return `<div class="cir${lk?' locked':''}"><span class="o"><img src="${i===0?'img/seeds_'+S.f+'.webp':(!lk&&i>=4&&S.mode!=='shop'&&S.v!=null?'img/v_'+S.f+'_'+vOf(S)+'_'+(i-4)+'.webp':th(S.f,i-1))}" class="${i===0||(!lk&&i>=4&&S.mode!=='shop'&&S.v!=null)?'ct':''}" alt="">${lk?'<span class="lock"><svg class="ic"><use href="#i-lock"/></svg></span>':''}</span>${esc(k)}</div>`}).join('')+`</div>`;
 }else if(tab==='tarjeta'&&cur==='tarjeta'){b.innerHTML=cardPanel();updCardPrev()}
 else if(tab==='tarjeta'){
  b.innerHTML=`<div class="form">
  <label>${esc(t('to'))}<input class="field" id="fTo" maxlength="30" placeholder="${esc(t('phTo'))}" autocomplete="off" value="${esc(S.to)}"></label><p class="err" id="errTo"></p>
  <label><span style="display:flex;justify-content:space-between;align-items:center;gap:8px">${esc(t('msgL'))}<button class="mini" id="inspire" type="button" data-inspire="1" style="min-height:34px;padding:6px 12px"><svg class="ic"><use href="#i-dice"/></svg>${esc(t('inspire'))}</button></span><textarea class="field" id="fMsg" maxlength="400">${esc(curMsg())}</textarea></label><p class="err" id="errMsg"></p>
  <label>${esc(t('from'))}<input class="field" id="fFrom" maxlength="30" placeholder="${esc(t('phFrom'))}" autocomplete="off" value="${esc(S.from)}"></label></div>
  <div class="cprevw"><div class="k"><svg class="ic" style="width:14px;height:14px"><use href="#i-eye"/></svg>${esc(t('liveK'))}</div><div id="cprev"></div></div>`;
  $('fTo').oninput=e=>{S.to=e.target.value;$('errTo').textContent='';renderStage();updCardPrev();save()};
  $('fMsg').oninput=e=>{S.msg=e.target.value;$('errMsg').textContent='';updCardPrev();save()};
  $('fFrom').oninput=e=>{S.from=e.target.value;updCardPrev();save()};
  updCardPrev();
 }else{
  S.code=enc(giftObj(mkGift()));save();
  const url=base()+'#'+S.code;
  b.innerHTML=`<div class="form"><div class="gh" style="margin:0">${esc(t('sendH'))}</div><p class="note">${esc(t('sendP'))}</p>
  <div class="linkrow"><input class="field" id="linkOut" readonly aria-label="${esc(t('linkAria'))}" value="${esc(url)}"></div>
  <div class="sendact">
  ${navigator.share?`<button class="bigbtn pri" id="shareNat" type="button"><svg class="ic"><use href="#i-send"/></svg>${esc(t('shareB'))}</button><a class="bigbtn" id="waBtn" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(t('waText')+' '+url)}"><svg class="ic"><use href="#i-chat2"/></svg>${esc(t('wa'))}</a>`:`<a class="bigbtn pri" id="waBtn" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(t('waText')+' '+url)}"><svg class="ic"><use href="#i-chat2"/></svg>${esc(t('wa'))}</a>`}
  <button class="bigbtn" id="copy" type="button"><svg class="ic"><use href="#i-copy"/></svg><span id="copyLbl">${esc(t('copy'))}</span></button>
  </div>
  <p class="note">${esc(t('linkNote'))}</p>
  <button class="bigbtn ghost" id="editMore" type="button"><svg class="ic"><use href="#i-brush"/></svg>${esc(t('editMore'))}</button></div>`;
  $('copy').onclick=async()=>{const el=$('linkOut');try{await navigator.clipboard.writeText(el.value);$('copyLbl').textContent=t('copied')}catch(e){el.focus();el.select();$('copyLbl').textContent=t('selected')}sfx('ding');setTimeout(()=>{const c=$('copyLbl');if(c)c.textContent=t('copy')},2400)};
  $('editMore').onclick=()=>{seg.tarjeta='maceta';go('tarjeta')};
  if($('shareNat'))$('shareNat').onclick=()=>{try{navigator.share({title:BRAND,text:t('waText'),url}).catch(()=>{})}catch(e){}};
 }
}
function renderDock(){
 const on=tab==='vivero'&&S.mode==='grow',d=$('dock');d.classList.toggle('on',on);
 if(!on)return;
 const night=isNight(),sig=(night?'n':'d')+(S.sick?'s':'h');
 const defs=[['w','i-drop','aW','1','#4d9be0'],['l',night?'i-moon':'i-sun','aL','2','#e0a21b'],['a','i-chat','aA','3','var(--rose)']];
 if(S.sick)defs.push(['c','i-pill','aC','4','#8e74c9']);
 if(d.dataset.sig!==sig||d.dataset.lang!==LANG){
  d.dataset.sig=sig;d.dataset.lang=LANG;d.classList.toggle('n3',!S.sick);
  d.innerHTML=defs.map(([k,ic,lb,kb,col])=>`<button type="button" data-act="${k}" style="--mc:${col}"><span class="top2"><svg class="ic"><use href="#${ic}"/></svg>${esc(t(lb))}<kbd>${kb}</kbd></span><i class="m"><b></b></i><span class="sub"></span></button>`).join('');
 }
 defs.forEach(([k])=>{
  const b=d.querySelector(`[data-act="${k}"]`);if(!b)return;
  const v=k==='w'?S.w:k==='l'?S.l:k==='a'?S.a:S.cure/CURES*100,pct=k==='w'?S.w/1.2:v;
  const low=k==='w'?(S.w<30||S.w>100):k==='l'?(!night&&S.l<30):k==='a'?S.a<30:false;
  const sub=k==='w'?(S.w>100?t('nDem'):S.w<30?t('nSed'):''):k==='l'?(night?t('nRest'):S.l<30?t('nFalta'):''):k==='a'?(S.a<30?t('nSola'):''):CURES-S.cure+'×';
  b.classList.toggle('low',low);b.querySelector('.m b').style.width=clamp(pct,0,100)+'%';b.querySelector('.sub').innerHTML=esc(sub)||'&nbsp;';
 });
}
function renderChrome(){
 document.body.dataset.view=tab;
 const avail={tienda:true,vivero:S.mode!=='shop',tarjeta:S.mode==='card'||S.mode==='sent',enviar:S.mode==='sent'};
 document.querySelectorAll('[data-tab]').forEach(b=>{b.classList.toggle('on',b.dataset.tab===tab);{const lk=!avail[b.dataset.tab]&&b.dataset.tab!==tab;b.classList.toggle('lock',lk);b.setAttribute('aria-disabled',lk)}b.querySelector('span').textContent=t('tab_'+b.dataset.tab)});
 $('secName').textContent=t('sec_'+tab);
 const cta=$('cta');let tx,dis=false;
 if(tab==='tienda')tx=S.mode==='shop'?t('ctaShop'):t('ctaBack');
 else if(tab==='vivero'){tx=S.mode==='dead'?t('ctaReplant'):t('ctaCustom');dis=S.mode==='grow'}
 else if(tab==='tarjeta')tx=S.mode==='sent'?t('ctaLink'):t('ctaMake');
 else tx=t('ctaAnother');
 cta.innerHTML=esc(tx)+'<svg class="ic"><use href="#'+(tab==='tarjeta'?'i-send':'i-arrow')+'"/></svg>';cta.setAttribute('aria-disabled',dis);document.querySelector('.ctas').classList.toggle('hid',tab==='vivero'&&S.mode==='grow');
 $('prevBtn').classList.toggle('on',tab==='tarjeta'||tab==='enviar');
 const n=isNight();$('dayPill').innerHTML=S.mode==='grow'?`<svg class="ic"><use href="#${n?'i-moon':'i-sun'}"/></svg>${esc(n?t('night'):t('day'))} ${S.day}`:'';
 [$('tTest'),$('bTest')].forEach(b=>b.setAttribute('aria-pressed',S.test));
 $('tSick').classList.toggle('hide',!(S.test&&S.mode==='grow'&&!S.sick));
 $('keys').innerHTML=t('keys');$('keys').style.display=tab==='vivero'&&S.mode==='grow'?'':'none';
}
let lastSig='';
function render(anim,light){
 renderProfile();renderStage(anim);
 const sig=[S.mode,stageOf(S.g),S.sick,tab,LANG].join();
 if(!light||sig!==lastSig)renderRight();
 lastSig=sig;renderDock();renderChrome();
}

/* ---------- static text, menu, dialogs ---------- */
function applyStatic(){
 document.documentElement.lang=LANG;
 document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
 document.querySelectorAll('[data-i18n-ph]').forEach(e=>e.placeholder=t(e.dataset.i18nPh));
 document.querySelectorAll('[data-i18n-t]').forEach(e=>{e.title=t(e.dataset.i18nT);e.setAttribute('aria-label',t(e.dataset.i18nT))});
 document.querySelectorAll('[data-i18n-aria]').forEach(e=>e.setAttribute('aria-label',t(e.dataset.i18nAria)));
 $('foot').innerHTML=t('foot')||'';
 $('wPoster').alt=t('wAlt');
 fillLang();setSnd(SND,false);
 document.title=BRAND+' · '+t('tagline');
}
const fillLang=()=>document.querySelectorAll('[data-langbox]').forEach(b=>{b.innerHTML=['es','en'].map(l=>`<button type="button" data-lang="${l}" aria-pressed="${l===LANG}">${l.toUpperCase()}</button>`).join('')});
T.es.foot='<a href="https://jessicamena.com">Hecho por Jessica Mena</a>';T.en.foot='<a href="https://jessicamena.com">Made by Jessica Mena</a>';
function setLang(l,persist){
 LANG=l;if(persist){try{localStorage.setItem('keptly_lang',l)}catch(e){}}
 applyStatic();
 if($('menuScrim').classList.contains('on'))openMenu();
 if(gift)renderGift();else{render();refreshSay()}
}
function refreshSay(){if(S.mode==='dead')say(t('deadMsg'));else if(tab==='vivero'&&S.mode==='grow')say(S.sick?t('sick'):t('sayStage')[stageOf(S.g)]);else if(tab==='tienda'&&S.mode!=='shop')say(t('alreadyCaring'));else say('')}
function openMenu(){
 $('menuBody').innerHTML=`<button class="mi" type="button" data-menu="snd"><svg class="ic"><use href="#${SND?'i-vol':'i-mute'}"/></svg><span>${esc(t('sound'))}<small>${esc(SND?t('soundOn'):t('soundOff'))}</small></span></button>
 <div class="mi sw2"><span>${esc(t('mLang'))}</span><span class="lang" data-langbox></span></div>
 ${S.mode!=='shop'?`<button class="mi danger" type="button" data-menu="change"><svg class="ic"><use href="#i-swap"/></svg><span>${esc(t('mChange'))}<small>${esc(t('mChangeSub'))}</small></span></button>`:''}
 <button class="mi" type="button" data-menu="home"><svg class="ic"><use href="#i-home"/></svg><span>${esc(t('mHome'))}<small>${esc(t('mHomeSub'))}</small></span></button>`;
 fillLang();$('menuScrim').classList.add('on');
}
const closeMenu=()=>$('menuScrim').classList.remove('on');
let dlgCb=null;
function confirmDlg(o,cb){
 $('dlgT').textContent=o.title;$('dlgP').textContent=o.text;$('dlgOk').textContent=o.ok;$('dlgNo').textContent=o.no||t('cfNo');
 $('dlgOk').className='btn2 '+(o.danger?'dng':'pri');dlgCb=cb;$('dlgScrim').classList.add('on');$('dlgNo').focus();
}
const closeDlg=()=>{$('dlgScrim').classList.remove('on');dlgCb=null};
function startOver(keepStyle){
 const keep=keepStyle?{pc:S.pc,ph:S.ph,pb:S.pb,pd:S.pd,pk:S.pk,pf:S.pf,pg:S.pg,pw:S.pw,paper:S.paper,tx:S.tx,cc:S.cc,tp:S.tp,tf:S.tf,ts:S.ts,cw:S.cw}:{};
 const x=S.test;S=Object.assign(fresh(),keep);S.test=x;S.seen=true;lastWarn='';save();startTimer();say('');seg.tienda='flor';go('tienda');toast(t('fresh'));
}
const askChange=()=>confirmDlg({title:t('cfChangeT'),text:t('cfChangeP'),ok:t('cfChangeOk'),danger:true},()=>startOver(true));
const askAnother=()=>confirmDlg({title:t('cfAnotherT'),text:t('cfAnotherP'),ok:t('cfAnotherOk')},()=>startOver(false));

/* ---------- game ---------- */
function warn(){
 let k='',x='';
 if(S.sick&&S.w>25&&S.l>25&&S.a>25){k='enferma';x=t('warnSick')}
 else if(S.w>100){k='ahogada';x=t('warnDrown')}
 else if(S.w<25){k='sed';x=t('warnThirst')}
 else if(S.l<25&&!isNight()){k='luz';x=t('warnLight')}
 else if(S.a<25){k='carino';x=t('warnLove')}
 if(k&&k!==lastWarn){say(x);if(k!=='enferma')sfx('warn')}lastWarn=k;
}
function getSick(){S.sick=true;S.cure=0;lastWarn='enferma';say(t('sick'));sfx('sick')}
function tick(){
 if(gift||S.mode!=='grow'||S.sow===false||tab!=='vivero'||document.hidden||ST.on)return;
 const v=FL[S.f],m=S.sick?1.5:1,night=isNight();
 S.w=clamp(S.w-2.3*v.dw*m,0,120);S.a=clamp(S.a-1.9*v.da*m,0,100);if(!night)S.l=clamp(S.l-2.5*v.dl*m,0,100);
 const crit=(S.w<5||S.w>112?1:0)+(S.l<5&&!night?1:0)+(S.a<5?1:0);
 if(crit)S.hp-=1.5*crit;else if(S.sick)S.hp-=.4;else if(S.w>25&&S.w<=100&&(S.l>25||night)&&S.a>25)S.hp+=1.5;
 S.hp=clamp(S.hp,0,100);
 if(S.hp<=0){S.mode='dead';S.sick=false;say(t('deadMsg'));sfx('die');render();save();return}
 const prev=stageOf(S.g);
 if(!S.sick&&S.w>25&&S.w<=100&&S.l>25&&S.a>25)S.g=Math.min(GOAL,S.g+1);
 const now=stageOf(S.g);
 if(!S.sick&&((S.k===0&&S.g>=48)||(S.k===1&&S.g>=92&&S.roll<.6)))getSick();
 else if(now>prev){say(t('sayStage')[now]);lastWarn='';sfx(now===6?'bloom':'grow')}
 else if(S.hp<65&&lastWarn!=='muere'){lastWarn='muere';say(t('warnDying'));sfx('warn')}
 else warn();
 S.t=(S.t+1)%CYCLE;
 if(S.t===0){S.day++;if(!S.sick)say(t('morning',S.day))}
 else if(S.t===NIGHT&&!S.sick)say(t('nightMsg'));
 if(S.g>=GOAL){S.mode='card';say(t('bloomed'));sfx('bloom')}
 render(undefined,true);save();
}
function act(kind){
 if(S.mode!=='grow')return;
 if(S.sow===false){say(t('sowHint'));sfx('err');return}
 if(kind==='w'){S.w=clamp(S.w+30,0,120);fx('w');sfx('water');say(S.w>100?t('tooMuch'):pick(t('waterMsgs')))}
 if(kind==='l'){if(isNight()){say(t('itsNight'));sfx('err');return}S.l=clamp(S.l+30,0,100);fx('l');sfx('sun');say(pick(t('lightMsgs')))}
 if(kind==='a'){S.a=clamp(S.a+30,0,100);fx('a');sfx('love');say(pick(t('loveMsgs')))}
 if(kind==='c'){
  if(!S.sick){say(t('healthy'));return}
  const now=Date.now();if(now-lastCure<(S.test?1200:4000)){say(t('wait'));sfx('err');return}
  const low=S.w<40?t('needW'):S.l<40&&!isNight()?t('needL'):S.a<40?t('needA'):'';if(low){say(t('needFirst',low));sfx('err');return}
  lastCure=now;S.cure++;fx('c');sfx('cure');if(S.cure>=CURES){S.sick=false;S.k++;S.cure=0;say(t('healed'));sfx('grow')}else say(t('cureMsgs')[S.cure-1]);
 }
 lastWarn=S.sick?'enferma':'';render(undefined,true);if(SC.main)SC.main.wiggle();save();
}
function startTimer(){clearInterval(timer);timer=setInterval(tick,S.test?170:1000)}

/* ---------- link ---------- */
const b64e=s=>{const by=new TextEncoder().encode(s);let r='';by.forEach(x=>r+=String.fromCharCode(x));return btoa(r).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const b64d=x=>{x=x.replace(/-/g,'+').replace(/_/g,'/');while(x.length%4)x+='=';const r=atob(x);return new TextDecoder().decode(Uint8Array.from(r,c=>c.charCodeAt(0)))};
const enc=o=>'k-'+b64e(JSON.stringify(o));
function dec(h){
 try{
  let j;
  if(h.startsWith('k-')){const x=h.slice(2);if(!/^[A-Za-z0-9_-]+$/.test(x)||x.length>60000)return null;j=b64d(x)}
  else if(h.startsWith('flor-')){const x=h.slice(5);if(!/^[0-9a-f]+$/.test(x)||x.length%2)return null;j=new TextDecoder().decode(new Uint8Array(x.match(/../g).map(b=>parseInt(b,16))))}
  else return null;
  const o=JSON.parse(j);if(!o||typeof o!=='object')return null;
  const s=(v,n)=>typeof v==='string'?v.slice(0,n):'',oneOf=(v,a,d)=>a.includes(v)?v:d,ni=(v,a,b,d)=>{v=parseInt(v,10);return isFinite(v)?clamp(v,a,b):d};
  return{t:s(o.t,30),m:s(o.m,400),d:s(o.d,30),nm:s(o.nm,24),f:oneOf(o.f,ORDER,'rosa'),p:oneOf(o.p,Object.keys(PAPERS),'crema'),n:ni(o.n,1,999,1),k:ni(o.k,0,9,0),v:ni(o.v,0,9,0),l:oneOf(o.l,['es','en'],''),
   pc:oneOf(o.pc,POTS,'terra'),ph:ni(o.ph,-180,180,0),pb:ni(o.pb,70,130,100),pd:oneOf(o.pd,DECOS,'none'),pk:ni(o.pk,-1,15,-1),pf:ni(o.pf,0,3,0),pg:ni(o.pg,0,15,3),pw:unpack(o.pw,'pot'),
   tf:oneOf(o.tf,FONTS,'mano'),ts:oneOf(o.ts,STK,'none'),tx:ni(o.tx,0,3,0),cc:ni(o.cc,0,TCOL.length-1,0),tp:ni(o.tp,0,1,0),fz:ni(o.fz,0,2,1),al:ni(o.al,0,1,0),fr:ni(o.fr,0,3,0),rd:ni(o.rd,0,1,0),cw:unpack(o.cw,'card'),gx:o.gx==null?null:ni(o.gx,-15,90,null),gy:o.gy==null?null:ni(o.gy,-5,92,null)};
 }catch(e){return null}
}
const base=()=>window.self!==window.top&&ARTIFACT_URL?ARTIFACT_URL:location.href.split('#')[0];

/* ---------- looping video backgrounds (no audio) ---------- */
const wV=$('wVideo'),gV=$('gVideo'),mq=window.matchMedia('(orientation:portrait)'),still=window.matchMedia('(prefers-reduced-motion:reduce)');
function setVideo(v,on){
 if(!v)return;
 if(!on){try{v.pause()}catch(e){}return}
 const port=mq.matches,s=port?'img/tienda_m.mp4':'img/tienda_d.mp4',p=port?'img/poster_m.jpg':'img/poster_d.jpg';
 if(v.dataset.s!==s){v.dataset.s=s;v.src=s;v.poster=p;if(v===wV)$('wPoster').src=p}
 v.muted=true;v.defaultMuted=true;
 if(!still.matches){const pr=v.play();if(pr&&pr.catch)pr.catch(()=>{})}
}
const vidSync=()=>{setVideo(wV,$('welcome').classList.contains('on'));setVideo(gV,$('gift').classList.contains('on'))};
if(mq.addEventListener)mq.addEventListener('change',()=>{wV.dataset.s='';gV.dataset.s='';vidSync()});

/* ---------- gift / preview ---------- */
let flipT=null;
function playFlip(){
 clearTimeout(flipT);let i=0;if(!SC.gift)SC.gift=Scene($('gPile'));
 const g=gift,sc=SC.gift,tagText=t('forX',g.t||'…');
 const cap=()=>{$('gCap').innerHTML=`<b>${esc(t('stages')[i])}</b>${i===6?esc((g.nm||FLt(g.f).n)+' · '+vName(g.f,g.v)+' · '+t('gInPot')):'&nbsp;'}`};
 sc.pot(g,potLabel(g.nm,g.t));sc.show(g.f,0,false,g.v);sc.sick(false,0);sc.tag(null,PAPERS[g.p],g.tf,g.ts,TCOL[g.cc],g.gx,g.gy);cap();
 const step=()=>{i++;sc.show(g.f,i,undefined,g.v);cap();sfx(i===6?'bloom':'grow');
  if(i===6){setTimeout(()=>sc.tag(tagText,PAPERS[g.p],g.tf,g.ts,TCOL[g.cc],g.gx,g.gy),900);return}
  flipT=setTimeout(step,1600)};
 flipT=setTimeout(step,700);
}
function renderGift(){
 const g=gift,v=FLt(g.f),who=g.d||t('someone');
 $('gKick').textContent=BRAND+' · '+t('gKick');
 $('gTitle').textContent=g.t&&g.t!=='…'?t('gTitle2',g.t):t('gTitle');
 $('gStory').textContent=t('gStory',who,v.art,g.nm,g.n,g.k);
 $('env').innerHTML=cardHTML(g)+`<button class="envx" type="button"><svg class="ic"><use href="#i-x"/></svg>${esc(t('close'))}</button>`;
 $('env').classList.remove('on');
 $('ownWrap').style.display=previewing?'none':'';
 playFlip();
}

/* ---------- routing ---------- */
function route(){
 const h=location.hash.slice(1);
 let g=null,pv=false;
 if(h==='vista'){if(S.mode==='card'||S.mode==='sent'){g=mkGift();pv=true}}
 else g=dec(h);
 gift=g;previewing=pv;
 $('gift').classList.toggle('on',!!gift);$('gift').classList.toggle('preview',pv);$('app').style.display=gift?'none':'';
 $('welcome').classList.toggle('on',!gift&&!S.seen);
 if(ST.on)closeStudio();
 if(gift){
  if(!pv){let st='';try{st=localStorage.getItem('keptly_lang')||''}catch(e){}if(!st&&gift.l)LANG=gift.l}
  applyStatic();renderGift();vidSync();return;
 }
 if(['tienda','vivero','tarjeta','enviar'].includes(h))tab=h;
 else tab=S.mode==='shop'?'tienda':S.mode==='grow'||S.mode==='dead'?'vivero':S.mode==='card'?'tarjeta':'enviar';
 if(tab==='vivero'&&S.mode==='shop')tab='tienda';
 if(tab==='tarjeta'&&!(S.mode==='card'||S.mode==='sent'))tab=S.mode==='shop'?'tienda':'vivero';
 if(tab==='enviar'&&S.mode!=='sent')tab=S.mode==='card'?'tarjeta':S.mode==='grow'||S.mode==='dead'?'vivero':'tienda';
 applyStatic();
 if(S.mode==='dead')say(t('deadMsg'));else if(tab==='vivero'&&!$('say').textContent)say(S.sick?t('sick'):t('sayStage')[stageOf(S.g)]);
 if(tab==='tienda')say(S.mode==='shop'?'':t('alreadyCaring'));
 render(false);vidSync();window.scrollTo(0,0);
}
const go=x=>{if(location.hash.slice(1)===x)route();else location.hash=x};

/* ---------- events ---------- */
document.addEventListener('click',e=>{
 const sc=e.target.closest('.scrim');
 if(sc&&e.target===sc){if(sc.id==='menuScrim')closeMenu();else closeDlg();return}
 const b=e.target.closest('button');if(!b)return;
 const d=b.dataset;
 if(b.id==='stSym'){ST.sym=!ST.sym;sfx('tap');stRedraw();return}
 if(d.tl!==undefined){ST.tool=+d.tl;sfx('tap');stBuild();return}
 if(d.col!==undefined&&ST.on){ST.col=+d.col;sfx('tap');stBuild();return}
 if(d.stp!==undefined){ST.stamp=+d.stp;sfx('tap');stBuild();return}
 if(d.snd!==undefined){setSnd(!SND,true);if($('menuScrim').classList.contains('on'))openMenu();return}
 if(d.menu){closeMenu();if(d.menu==='snd')setSnd(!SND,true);else if(d.menu==='change')askChange();else if(d.menu==='home'){S.seen=false;save();route()}return}
 if(d.lang){setLang(d.lang,true);return}
 if(d.draw){sfx('tap');openStudio(d.draw);return}
 if(d.spc&&S.mode==='shop'){S.f=d.spc;sfx('tap');save();render();return}
 if(d.tab){if(b.classList.contains('lock')){sfx('tap');toast(t({vivero:'lockV',tarjeta:'lockT',enviar:'lockE'}[d.tab]));return}sfx('tab');go(d.tab);return}
 if(d.seg){seg[tab]=d.seg;sfx('tab');renderRight();renderStage();return}
 if(d.act){if(['w','l','a','c'].includes(d.act))act(d.act);return}
 if(d.pot){S.pc=d.pot;sfx('tap');save();renderStage();renderRight();return}
 if(d.deco){S.pd=d.deco;sfx('tap');save();renderStage();renderRight();return}
 if(d.pk!==undefined){S.pk=+d.pk;sfx('tap');save();renderStage();renderRight();return}
 if(d.pf!==undefined){S.pf=+d.pf;sfx('tap');save();renderStage();renderRight();return}
 if(d.pg!==undefined){S.pg=+d.pg;sfx('tap');save();renderStage();renderRight();return}
 if(d.paper){S.paper=d.paper;sfx('tap');save();renderStage();renderRight();return}
 if(d.tx!==undefined){S.tx=+d.tx;sfx('tap');save();renderRight();return}
 if(d.cc!==undefined){S.cc=+d.cc;sfx('tap');save();renderStage();renderRight();return}
 if(d.tp!==undefined){S.tp=+d.tp;sfx('tap');save();renderRight();return}
 if(d.fz!==undefined||d.al!==undefined||d.fr!==undefined||d.rd!==undefined){['fz','al','fr','rd'].forEach(k=>{if(d[k]!==undefined)S[k]=+d[k]});sfx('tap');save();renderStage();renderRight();return}
 if(d.font){S.tf=d.font;sfx('tap');save();renderStage();renderRight();return}
 if(d.stk){S.ts=d.stk;sfx('tap');save();renderStage();renderRight();return}
 if(d.inspire){const id=T[LANG].ideas,i=id.indexOf(curMsg());S.msg=id[(i+1)%id.length];sfx('tap');save();renderRight();return}
});
document.addEventListener('input',e=>{
 const s=e.target.dataset&&e.target.dataset.sl;
 if(s){S[s]=+e.target.value;save();renderStage()}
 if(e.target.id==='stSize'){ST.size=+e.target.value}
});
$('menuBtn').onclick=openMenu;
$('dlgNo').onclick=closeDlg;$('dlgOk').onclick=()=>{const cb=dlgCb;closeDlg();if(cb)cb()};
$('stClose').onclick=stAskClose;$('stDone').onclick=stDone;$('stUndo').onclick=stUndo;$('stRedo').onclick=stRedo;$('stClear').onclick=stClear;
$('enter').onclick=()=>{S.seen=true;save();sfx('tap');$('welcome').classList.remove('on');vidSync()};

$('pName').oninput=e=>{S.name=e.target.value;save();renderProfile();renderStage()};
const toggleTest=()=>{S.test=!S.test;save();startTimer();renderChrome();if(tab==='vivero')say(S.test?t('tmOn'):t('tmOff'))};
$('tTest').onclick=toggleTest;$('bTest').onclick=toggleTest;
$('tSick').onclick=()=>{if(S.mode==='grow'&&!S.sick){getSick();render();save()}};
$('tRand').onclick=()=>{if(S.mode!=='shop'){say(t('alreadyPicked'));return}S.f=pick(ORDER.filter(k=>k!==S.f));save();render()};
$('tReset').onclick=()=>startOver(false);
const toggleUI=()=>{const on=document.body.classList.toggle('hideui');$('tHide').setAttribute('aria-pressed',on)};
$('tHide').onclick=toggleUI;
$('shareBtn').onclick=()=>{if(S.mode==='sent')go('enviar');else if(S.mode==='card')go('tarjeta');else if(S.mode==='grow'||S.mode==='dead'){go('vivero');say(S.mode==='dead'?t('deadMsg'):t('mustBloom'))}else go('tienda')};
$('prevBtn').onclick=()=>go('vista');
$('pvBack').onclick=()=>go(S.mode==='sent'?'enviar':'tarjeta');
$('cta').onclick=()=>{
 if($('cta').getAttribute('aria-disabled')==='true'){say(t('notYet'));sfx('err');return}
 if(tab==='tienda'){if(S.mode==='shop'){S.mode='grow';S.sow=false;S.v=Math.floor(Math.random()*10);S.hp=100;S.w=55;S.l=55;S.a=55;S.g=0;S.day=1;S.t=0;lastWarn='';$('say').textContent='';save();startTimer();sfx('grow');go('vivero');say(t('sowHint'))}else go(S.mode==='grow'||S.mode==='dead'?'vivero':S.mode==='card'?'tarjeta':'enviar');return}
 if(tab==='vivero'){if(S.mode==='dead'){Object.assign(S,{mode:'grow',sow:false,v:Math.floor(Math.random()*10),hp:100,w:55,l:55,a:55,g:0,day:1,t:0,sick:false,cure:0,k:0,roll:Math.random()});lastWarn='';save();startTimer();render(false);say(t('replanted'));sfx('grow');return}go('tarjeta');return}
 if(tab==='tarjeta'){
  const to=S.to.trim(),m=curMsg().trim();
  if(!to){seg.tarjeta='mensaje';renderRight();$('errTo').textContent=t('errTo');$('fTo').focus();sfx('err');return}
  if(!m){seg.tarjeta='mensaje';renderRight();$('errMsg').textContent=t('errMsg');$('fMsg').focus();sfx('err');return}
  S.code=enc(giftObj(mkGift()));S.mode='sent';save();sfx('ding');go('enviar');return;
 }
 askAnother();
};
const toggleDev=()=>{document.body.classList.toggle('dev');try{localStorage.setItem('keptly_dev',document.body.classList.contains('dev')?'1':'')}catch(e){}};
try{if(localStorage.getItem('keptly_dev'))document.body.classList.add('dev')}catch(e){}
$('secName').ondblclick=toggleDev;
document.addEventListener('keydown',e=>{
 if(ST.on){
  if(e.key==='Escape'){e.preventDefault();stAskClose();return}
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?stRedo():stUndo()}
  return;
 }
 if(e.key==='Escape'){closeMenu();closeDlg();return}
 if(e.target.matches('input,textarea')||e.metaKey||e.ctrlKey||e.altKey)return;
 const k=e.key.toLowerCase();
 if(k==='d'&&e.shiftKey){toggleDev();return}
 if(k==='u'){toggleUI();return}
 if(tab==='vivero'&&S.mode==='grow'){const m={1:'w',2:'l',3:'a',4:'c',r:'w',s:'l',h:'a',c:'c'}[k];if(m){e.preventDefault();act(m)}}
});
document.body.appendChild($('env'));
$('openCard').onclick=()=>{$('env').classList.add('on');sfx('paper');const x=$('env').querySelector('.envx');if(x)x.focus({preventScroll:true})};
$('env').addEventListener('click',e=>{if(e.target.id==='env'||e.target.closest('.envx')){$('env').classList.remove('on');$('openCard').focus({preventScroll:true})}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('env').classList.contains('on'))$('env').classList.remove('on')});
$('replay').onclick=()=>playFlip();
$('plantOwn').onclick=()=>{if(S.mode==='sent'){const x=S.test;S=fresh();S.test=x}S.seen=true;save();location.hash='tienda'};
window.addEventListener('hashchange',route);
window.addEventListener('resize',stFit);
window.addEventListener('pointerdown',()=>{if(SND)ac()},{once:true,passive:true});

/* boot */
(function(){
 let l='';try{l=localStorage.getItem('keptly_lang')||''}catch(e){}
 if(l!=='es'&&l!=='en')l=((navigator.language||'es').toLowerCase().startsWith('es'))?'es':'en';
 LANG=l;
})();
route();startTimer();

/* ---------- drag the tag anywhere on the pile ---------- */
(function(){
 const tg=$('pileTag');if(!tg)return;let d=null,hinted=false;
 const pile=()=>$('pile');
 const canDrag=()=>tab==='tarjeta'&&S.mode==='card'&&tg.classList.contains('on');
 tg.addEventListener('pointerdown',e=>{
  if(!canDrag())return;
  const r=pile().getBoundingClientRect(),t0=tg.getBoundingClientRect();
  d={id:e.pointerId,dx:e.clientX-t0.left,dy:e.clientY-t0.top,r};tg.setPointerCapture(e.pointerId);tg.classList.add('drag');e.preventDefault();sfx('tap');
 });
 tg.addEventListener('pointermove',e=>{
  if(!d||e.pointerId!==d.id)return;
  const x=clamp((e.clientX-d.dx-d.r.left)/d.r.width*100,-15,90),y=clamp((e.clientY-d.dy-d.r.top)/d.r.height*100,-5,92);
  S.gx=x;S.gy=y;tg.style.left=x+'%';tg.style.top=y+'%';tg.style.bottom='auto';
 });
 const end=e=>{if(!d)return;d=null;tg.classList.remove('drag');save();sfx('pop')};
 tg.addEventListener('pointerup',end);tg.addEventListener('pointercancel',end);
 new MutationObserver(()=>{const w=canDrag();if(w&&!tg.classList.contains('can')){tg.classList.add('can');if(!hinted){hinted=true;toast(t('dragTag'))}}else if(!w&&tg.classList.contains('can'))tg.classList.remove('can')}).observe(tg,{attributes:true,attributeFilter:['class']});
})();

;(function(){
 const sd=$('pileSeed'),pile=$('pile');if(!sd)return;let d=null;
 const cq=()=>pile.clientWidth/100;
 const over=()=>{const r=sd.getBoundingClientRect(),q=pile.getBoundingClientRect(),k=cq();const x=(r.left+r.width/2-q.left)/k,y=(r.top+r.height/2-q.top)/k;return Math.abs(x-50)<22&&y>64&&y<86};
 const sow=()=>{if(S.sow!==false)return;const q=pile.getBoundingClientRect(),r=sd.getBoundingClientRect(),k=cq();
  const dx=q.left+50*k-(r.left+r.width/2),dy=q.top+75*k-(r.top+r.height/2),cur=sd.style.transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
  const bx=cur?+cur[1]:0,by=cur?+cur[2]:0;
  sd.classList.remove('drag','back');sd.classList.add('sowing');sd.style.transform='translate('+(bx+dx)+'px,'+(by+dy)+'px) scale(.35)';
  S.sow=true;save();sfx('grow');
  setTimeout(()=>{say(t('sown'));render(true)},380)};
 sd.addEventListener('pointerdown',e=>{if(S.sow!==false)return;e.preventDefault();sd.setPointerCapture(e.pointerId);d={x:e.clientX,y:e.clientY,moved:false};sd.classList.add('drag');sd.classList.remove('back')});
 sd.addEventListener('pointermove',e=>{if(!d)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.abs(dx)+Math.abs(dy)>6)d.moved=true;sd.style.transform='translate('+dx+'px,'+dy+'px) scale(1.12) rotate('+(dx*.1)+'deg)'});
 const end=()=>{if(!d)return;const was=d;d=null;const ok=!was.moved||over();if(ok)sow();else{sd.classList.remove('drag');sd.classList.add('back');sd.style.transform='';sfx('err');say(t('sowHint'))}};
 sd.addEventListener('pointerup',end);sd.addEventListener('pointercancel',()=>{if(d){d=null;sd.classList.remove('drag');sd.classList.add('back');sd.style.transform=''}});
 sd.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();sow()}});
})();

;(function(){const b=document.querySelector('.bottom');if(!b||!window.ResizeObserver)return;const set=()=>document.documentElement.style.setProperty('--bh',Math.ceil(b.getBoundingClientRect().height)+'px');set();new ResizeObserver(set).observe(b)})();
}
</script>
</body>
</html>
