<script>
{
const ARTIFACT_URL='https://claude.ai/artifact/Htm6PYjMGAap7JXGWsv7jt';
const BRAND='Keptly';
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- copy: es / en ---------- */
const T={
es:{
 wAlt:'Vidriera de una florería',tagline:'cuidar también es una forma de querer',
 wP:'Acá las flores no se compran: se cuidan. La elegís, la regás, le das sol y le hablás. Cuando florece, se la mandás en su maceta a alguien que querés.',wEnter:'Empezar a cuidar',
 back:'Volver al inicio',close:'Cerrar',menu:'Menú',tTest:'Modo prueba: el tiempo pasa 6 veces más rápido',tSick:'Simular hongo',tRand:'Flor al azar',tReset:'Empezar de nuevo',tHide:'Ocultar interfaz (U)',share:'Mandar una flor',
 sec_tienda:'Elegí tu flor',sec_vivero:'Vivero',sec_tarjeta:'Personalizar',sec_enviar:'Enviar',
 tab_tienda:'Tienda',tab_vivero:'Vivero',tab_tarjeta:'Crear',tab_enviar:'Enviar',
 rp_tienda:'Catálogo',rp_vivero:'Tu planta',rp_tarjeta:'Hacela tuya',rp_enviar:'Lista para viajar',
 s_flor:'Flores',s_maceta:'Maceta',s_como:'Cómo va',s_diario:'Diario',s_mensaje:'Mensaje',s_tarjeta:'Tarjeta',
 profile:'Perfil',name:'Nombre',phPlant:'Ponele un nombre',species:'Especie',care:'Cuidado',says:'Lo que dice',needs:'Necesidades',water:'Agua',light:'Luz',love:'Cariño',until:'Hasta que florezca',
 nDem:'Demasiada',nSed:'Tiene sed',nBien:'Bien',nRest:'Descansa',nFalta:'Le falta',nSola:'Solita',sickS:'Enferma',
 aStage:'La maceta',testMode:'Modo prueba',keys:'<kbd>1</kbd>Regar <kbd>2</kbd>Sol <kbd>3</kbd>Hablar <kbd>4</kbd>Curar',
 health:'Salud',hLow:'Se apaga',hMid:'Débil',deadS:'Se murió',capDead:n=>'Se murió el día '+n,warnDying:'Se está apagando. Cuidala ya.',deadMsg:'Se murió. A veces pasa, aunque una se desviva. Cuidar cansa y no siempre alcanza.',ctaReplant:'Volver a plantar',replanted:'Una semilla nueva, en la misma maceta. Con más calma esta vez.',aW:'Regar',aL:'Sol',aA:'Hablarle',aC:'Curar',
 sp:{
  rosa:{n:'Rosa',art:'una rosa',mean:'Te quiero, de verdad.',careT:'Delicada',tags:['Intensa','Fiel','Pide cariño'],d:'Rosal mini en maceta de barro. Pide atención todos los días, sobre todo cariño.'},
  tulipan:{n:'Tulipán',art:'un tulipán',mean:'Estoy acá, aunque no lo diga.',careT:'Media',tags:['Tranquilo','Constante','Discreto'],d:'Tulipanes rojos en maceta. Agradecen la rutina y no hacen escándalo.'},
  girasol:{n:'Girasol',art:'un girasol',mean:'Siempre me doy vuelta hacia vos.',careT:'Pide sol',tags:['Solar','Cálida','Valiente'],d:'Busca la luz todo el día y se pone triste si falta. Necesita mucho sol.'}},
 stages:['Semilla','Brote','Plantín','Creciendo','Pimpollo','Abriéndose','En flor'],
 sayStage:['Es solo una semilla. Regala, dale sol y hablale: vas a verla crecer.','Asomó un brote. Chiquito, pero valiente.','Le salieron hojas nuevas.','Está más alta. Ya no es la de ayer.','Apareció un pimpollo. Falta poquito.','Se está abriendo, despacito.','Floreció.'],
 loveMsgs:['Le dijiste que la vas a esperar.','Le contaste cómo fue tu día.','Le dijiste que no tiene que apurarse.','Le prometiste volver mañana.','Le dijiste que así como está, está bien.'],
 waterMsgs:['La tierra se oscurece y huele a lluvia.','Tomó despacito. Tenía sed.'],lightMsgs:['Se estira hacia la ventana.','Un rato de sol. Le brillan las hojas.'],
 cureMsgs:['Le sacaste con cuidado una hojita enferma.','Sigue débil, pero está peleando.','Hoy se la ve un poquito mejor.','No se apura. Vos tampoco.','Ya casi. Las manchas se están yendo.'],
 sick:'Le salió un hongo. No hiciste nada mal: a veces se enferman y no depende de vos.',healed:'Se curó. Necesitaba más cuidado y ahí estuviste. No la dejaste morir.',
 defMsg:'Esta flor la cuidé yo, día por día, pensando en vos.\nDe verdad te quiero. A veces no sé decirlo, así que te lo mando así.\nPueden haber dificultades, pero voy a estar ahí para cuidarte.',
 ideas:['Esta flor la cuidé yo, día por día, pensando en vos.\nDe verdad te quiero. A veces no sé decirlo, así que te lo mando así.\nPueden haber dificultades, pero voy a estar ahí para cuidarte.','La regué, le hablé y la esperé hasta que floreció.\nQuiero que sepas que conmigo no hace falta que puedas con todo.\nAcá tenés a alguien que te cuida.','No sé hacer grandes discursos, pero sí cuidar una planta.\nAsí te quiero cuidar a vos: de a poquito, todos los días.','Para que tengas algo vivo que te recuerde que alguien piensa en vos.\nSi se te seca, avisame: la replantamos juntas.'],
 inspire:'Inspirame',
 warnSick:'Sigue enferma. Curarse lleva tiempo, no es su culpa.',warnDrown:'Demasiada agua. Esperá un ratito.',warnThirst:'Tiene sed: dale agua.',warnLight:'Le falta luz: dale sol.',warnLove:'Está solita: hablale.',
 morning:n=>'Amaneció. Día '+n+'.',nightMsg:'Se hizo de noche. Ella también descansa.',bloomed:'Floreció. Todo ese cuidado se volvió esto.',
 tooMuch:'Uy, es mucha agua. Dejala respirar.',itsNight:'Es de noche. Dejala descansar, mañana vuelve el sol.',healthy:'Está sana. Por ahora no necesita remedios.',wait:'Curarse lleva tiempo. Esperá un poquito.',
 needFirst:x=>'Primero necesita '+x+' para tener fuerzas.',needW:'agua',needL:'luz',needA:'cariño',
 tmOn:'Modo prueba: el tiempo pasa seis veces más rápido.',tmOff:'El tiempo vuelve a su ritmo.',
 notYet:'Todavía no floreció. Seguí cuidándola.',mustBloom:'Primero tiene que florecer. Seguí cuidándola.',alreadyPicked:'Tu flor ya está elegida.',alreadyCaring:'Ya estás cuidando una flor. Volvé al vivero cuando quieras.',
 capShop:'En maceta · se entrega cuando florezca',capSick:'Enferma · se está curando',capDay:n=>'día '+n,day:'Día',night:'Noche',
 lockV:'Primero elegí una flor y empezá a cuidarla.',lockT:'La tarjeta se habilita cuando tu flor florece.',lockE:'Primero creá el link en Tarjeta.',ctaShop:'Cuidar esta flor',ctaBack:'Volver a mi flor',ctaCustom:'Personalizar y enviar',ctaMake:'Crear el link',ctaLink:'Actualizar el link',ctaAnother:'Cuidar otra flor',
 errTo:'Escribí para quién es',errMsg:'Escribile algo, aunque sea corto',
 potsH:'Flores en maceta',nSpecies:n=>n+' especies',catNote:'Cada planta pide cosas distintas. La cuidás vos y, cuando florece, la mandás con una tarjeta hecha a mano.',
 howH:'Cómo funciona',how:['Elegís una flor, una maceta y le ponés nombre.','La regás, le das sol y le hablás. Ni de más ni de menos. La noche también cuenta.','A veces se enferma. No es culpa de nadie: necesita más cuidado y más paciencia.','Cuando florece, pintás la maceta, dibujás la tarjeta y la mandás con un link.'],
 diaryH:'Diario de la planta',stageOf:n=>'Etapa '+n+' de 7',complete:'Completo',
 potBase:'Base',potTone:'Tono',potBright:'Brillo',potPattern:'Diseño',potInk:'Color del diseño',potFinish:'Acabado',potDrip:'Color del esmalte',auto:'Auto',
 potDraw:'Dibujar en la maceta',potDrawSub:'Lápiz, pincel, tiza y sellos',potReset:'Restaurar color',potNote:'La maceta viaja con tu flor y se ve igual del otro lado.',
 pots:{terra:'Terracota',crema:'Crema',salvia:'Salvia',azul:'Azul',rosa:'Rosa',mostaza:'Mostaza',grafito:'Grafito'},
 decos:{none:'Lisa',stripes:'Rayas',dots:'Lunares',hearts:'Corazones',waves:'Olas',checks:'Damero',stars:'Estrellas',label:'Etiqueta'},
 pfs:{0:'Mate',1:'Brillante',2:'Moteada',3:'Esmalte'},
 paper:'Papel',font:'Letra',sticker:'Sello',texT:'Textura',inkT:'Color de letra',tapeT:'Cinta',tapeOn:'Con cinta',tapeOff:'Sin cinta',
 papers:{crema:'Crema',rosa:'Rosa',celeste:'Celeste',salvia:'Salvia',lila:'Lila',manteca:'Manteca',durazno:'Durazno',noche:'Noche'},
 texs:{0:'Lisa',1:'Renglones',2:'Puntos',3:'Cuadrícula'},
 cardDraw:'Dibujar en la tarjeta',cardDrawSub:'Un dibujito sobre tu mensaje',
 fonts:{mano:'Manuscrita',caveat:'Cursiva',luz:'Lápiz',marker:'Marcador',serif:'Editorial',elegante:'Elegante',fraunces:'Moderna',maq:'Máquina'},sizeT:'Tamaño',sizes:['Chica','Media','Grande'],alignT:'Alineación',aligns:['Izquierda','Centro'],frameT:'Marco',frames:['Sin marco','Línea','Punteado','Doble'],shapeT:'Esquinas',shapes:['Rectas','Redondas'],stks:{none:'Sin sello',heart:'Corazón',sun:'Sol',sprout:'Brote',moon:'Luna',star:'Estrella'},fungT:'Tiene un hongo',sowHint:'Arrastrá la semilla hasta la tierra de la maceta.',sowAria:'Semilla. Tocala o arrastrala a la maceta para sembrarla.',sown:'Sembrada. Ahora cuidala.',fungD:'Regala agua, sol y cariño, y curala.',noneShort:'No',dragTag:'Arrastrá la etiqueta y ponela donde quieras',
 to:'Para',phTo:'Sofi',msgL:'Mensaje',from:'De parte de',phFrom:'Mica',forX:n=>'Para '+n,liveK:'Así se ve tu tarjeta',
 preview:'Vista previa',pvTitle:'Así lo va a ver la otra persona',pvBack:'Volver a editar',
 sendH:'Tu flor está lista para viajar',sendP:'Mandá este link por donde quieras. Del otro lado van a ver tu flor en su maceta, cómo creció y tu tarjeta.',linkAria:'Link de tu flor',copy:'Copiar link',copied:'Copiado',selected:'Seleccionado',wa:'WhatsApp',shareB:'Compartir',seeHow:'Ver cómo le llega',waText:'Te mandé una flor',editMore:'Editar maceta o tarjeta',anotherB:'Cuidar otra flor',
 linkNote:'El link lleva tu flor, tu maceta y tu tarjeta adentro. No se guarda en ningún servidor.',
 gKick:'Entrega',gTitle:'Te llegó una flor',gTitle2:n=>'Te llegó una flor, '+n,someone:'Alguien',
 gStory:(who,art,nm,n,k)=>who+' eligió '+art+(nm?' y le puso '+nm:'')+'. La regó, le dio sol y le habló durante '+n+(n===1?' día':' días')+'.'+(k?(k===1?' Se enfermó una vez, y la cuidó hasta que se curó.':' Se enfermó '+k+' veces, y la cuidó cada vez hasta que se curó.'):'')+' Cuando floreció, te la mandó en su maceta.',
 gFlip:'Mirá cómo creció.',gReplay:'Ver de nuevo',gOpen:'Abrir la tarjeta',gOwn:'Cuidar una para alguien',gInPot:'en su maceta',
 sound:'Sonido',soundOn:'Sonido activado',soundOff:'Sonido apagado',mLang:'Idioma',mChange:'Cambiar de flor',mChangeSub:'Dejar esta planta y elegir otra',mHome:'Pantalla de inicio',mHomeSub:'Volver a la vidriera',
 cfChangeT:'¿Cambiar de flor?',cfChangeP:'Dejás esta planta y empezás con otra. Se pierde lo que cuidaste hasta ahora.',cfChangeOk:'Sí, cambiar',cfNo:'Mejor no',
 cfAnotherT:'¿Cuidar otra flor?',cfAnotherP:'El link que ya mandaste sigue funcionando. Empezás de cero con otra planta.',cfAnotherOk:'Empezar otra',
 cfCloseT:'¿Salir sin guardar?',cfCloseP:'Perdés los trazos que hiciste ahora.',cfCloseOk:'Salir',cfKeep:'Seguir dibujando',
 stTitlePot:'Dibujá tu maceta',stTitleCard:'Dibujá tu tarjeta',stDone:'Listo',stSize:'Grosor',undo:'Deshacer',sym:'Simetría (espejo)',redo:'Rehacer',clear:'Borrar todo',stInk:'Tinta',
 tools:{pencil:'Lápiz',marker:'Marcador',brush:'Pincel',chalk:'Tiza',stamp:'Sellos',erase:'Goma',spray:'Aerosol',water:'Acuarela',gold:'Dorado'},
 stHintPot:'Dibujá sobre la maceta. Lo que se salga de ella se corta.',stHintCard:'Dibujá con el dedo. Con la goma tocás un trazo para borrarlo.',stOut:'Se acabó la tinta. Borrá algo para seguir.',
 reset:'Empezamos de cero.',fresh:'Todo listo para otra flor.',saved:'Guardado'
},
en:{
 wAlt:'A flower shop window',tagline:'caring is also a way of loving',
 wP:'Here flowers aren’t bought, they’re tended. Pick one, water it, give it sun and talk to it. When it blooms, send it in its pot to someone you love.',wEnter:'Start caring',
 back:'Back to start',close:'Close',menu:'Menu',tTest:'Test mode: time runs 6 times faster',tSick:'Simulate fungus',tRand:'Random flower',tReset:'Start over',tHide:'Hide interface (U)',share:'Send a flower',
 sec_tienda:'Pick your flower',sec_vivero:'Garden',sec_tarjeta:'Customize',sec_enviar:'Send',
 tab_tienda:'Shop',tab_vivero:'Garden',tab_tarjeta:'Create',tab_enviar:'Send',
 rp_tienda:'Catalog',rp_vivero:'Your plant',rp_tarjeta:'Make it yours',rp_enviar:'Ready to travel',
 s_flor:'Flowers',s_maceta:'Pot',s_como:'How it goes',s_diario:'Journal',s_mensaje:'Message',s_tarjeta:'Card',
 profile:'Profile',name:'Name',phPlant:'Give it a name',species:'Species',care:'Care',says:'What it says',needs:'Needs',water:'Water',light:'Light',love:'Love',until:'Until it blooms',
 nDem:'Too much',nSed:'Thirsty',nBien:'Good',nRest:'Resting',nFalta:'Lacking',nSola:'Lonely',sickS:'Sick',
 aStage:'The pot',testMode:'Test mode',keys:'<kbd>1</kbd>Water <kbd>2</kbd>Sun <kbd>3</kbd>Talk <kbd>4</kbd>Heal',
 health:'Health',hLow:'Fading',hMid:'Weak',deadS:'It died',capDead:n=>'Died on day '+n,warnDying:'It’s fading. Care for it now.',deadMsg:'It died. Sometimes it happens, even when you give everything. Caring is tiring and it isn’t always enough.',ctaReplant:'Plant again',replanted:'A new seed, in the same pot. Gentler this time.',aW:'Water',aL:'Sun',aA:'Talk',aC:'Heal',
 sp:{
  rosa:{n:'Rose',art:'a rose',mean:'I love you, truly.',careT:'Delicate',tags:['Intense','Loyal','Needs love'],d:'A mini rose in a clay pot. It wants attention every day, especially affection.'},
  tulipan:{n:'Tulip',art:'a tulip',mean:'I’m here, even if I don’t say it.',careT:'Medium',tags:['Calm','Steady','Quiet'],d:'Red tulips in a pot. They like routine and never make a fuss.'},
  girasol:{n:'Sunflower',art:'a sunflower',mean:'I always turn toward you.',careT:'Needs sun',tags:['Sunny','Warm','Brave'],d:'It follows the light all day and gets sad without it. Needs lots of sun.'}},
 stages:['Seed','Sprout','Seedling','Growing','Bud','Opening','In bloom'],
 sayStage:['Just a seed. Water it, give it sun and talk to it: you’ll watch it grow.','A sprout peeked out. Tiny, but brave.','New leaves appeared.','Taller now. Not the one from yesterday.','A bud showed up. Almost there.','It’s opening, slowly.','It bloomed.'],
 loveMsgs:['You told it you’ll wait for it.','You told it about your day.','You told it there’s no rush.','You promised to come back tomorrow.','You told it that just as it is, it’s enough.'],
 waterMsgs:['The soil darkens and smells like rain.','It drank slowly. It was thirsty.'],lightMsgs:['It stretches toward the window.','A little sun. Its leaves glow.'],
 cureMsgs:['You carefully removed a sick little leaf.','Still weak, but fighting.','It looks a little better today.','It’s in no hurry. Neither are you.','Almost there. The spots are fading.'],
 sick:'It caught a fungus. You did nothing wrong: sometimes they get sick and it’s not up to you.',healed:'It’s healed. It needed more care and you were there. You didn’t let it die.',
 defMsg:'I raised this flower myself, day by day, thinking of you.\nI really do love you. Sometimes I can’t find the words, so I’m sending it like this.\nThere may be hard times, but I’ll be there to take care of you.',
 ideas:['I raised this flower myself, day by day, thinking of you.\nI really do love you. Sometimes I can’t find the words, so I’m sending it like this.\nThere may be hard times, but I’ll be there to take care of you.','I watered it, talked to it and waited until it bloomed.\nI want you to know that with me you don’t have to handle everything.\nHere’s someone who looks after you.','I’m not good at big speeches, but I can keep a plant alive.\nThat’s how I want to care for you: a little at a time, every day.','Something alive, so you remember someone is thinking of you.\nIf it dries out, tell me: we’ll replant it together.'],
 inspire:'Inspire me',
 warnSick:'Still sick. Getting better takes time, it’s not its fault.',warnDrown:'Too much water. Wait a moment.',warnThirst:'It’s thirsty: water it.',warnLight:'It needs light: give it sun.',warnLove:'It’s lonely: talk to it.',
 morning:n=>'Morning. Day '+n+'.',nightMsg:'Night has fallen. It rests too.',bloomed:'It bloomed. All that care turned into this.',
 tooMuch:'Oops, that’s a lot of water. Let it breathe.',itsNight:'It’s night. Let it rest, the sun comes back tomorrow.',healthy:'It’s healthy. No medicine needed for now.',wait:'Healing takes time. Wait a little.',
 needFirst:x=>'It needs '+x+' first to get its strength back.',needW:'water',needL:'light',needA:'love',
 tmOn:'Test mode: time runs six times faster.',tmOff:'Time is back to its own pace.',
 notYet:'It hasn’t bloomed yet. Keep caring for it.',mustBloom:'It has to bloom first. Keep caring for it.',alreadyPicked:'Your flower is already chosen.',alreadyCaring:'You’re already caring for a flower. Head back to the garden anytime.',
 capShop:'In its pot · delivered when it blooms',capSick:'Sick · healing',capDay:n=>'day '+n,day:'Day',night:'Night',
 lockV:'Pick a flower and start caring for it first.',lockT:'The card unlocks once your flower blooms.',lockE:'Create the link in Card first.',ctaShop:'Grow this flower',ctaBack:'Back to my flower',ctaCustom:'Customize & send',ctaMake:'Create the link',ctaLink:'Update the link',ctaAnother:'Grow another flower',
 errTo:'Write who it’s for',errMsg:'Write something, even a short note',
 potsH:'Potted flowers',nSpecies:n=>n+' species',catNote:'Every plant asks for different things. You look after it and, when it blooms, send it with a handmade card.',
 howH:'How it works',how:['Pick a flower and a pot, and give it a name.','Water it, give it sun and talk to it. Not too much, not too little. Night counts too.','Sometimes it gets sick. It’s nobody’s fault: it needs more care and more patience.','When it blooms, paint the pot, draw the card and send it with a link.'],
 diaryH:'Plant journal',stageOf:n=>'Stage '+n+' of 7',complete:'Complete',
 potBase:'Base',potTone:'Tint',potBright:'Brightness',potPattern:'Pattern',potInk:'Pattern color',potFinish:'Finish',potDrip:'Glaze color',auto:'Auto',
 potDraw:'Draw on the pot',potDrawSub:'Pencil, brush, chalk and stamps',potReset:'Reset color',potNote:'The pot travels with your flower and looks the same on the other side.',
 pots:{terra:'Terracotta',crema:'Cream',salvia:'Sage',azul:'Blue',rosa:'Pink',mostaza:'Mustard',grafito:'Graphite'},
 decos:{none:'Plain',stripes:'Stripes',dots:'Dots',hearts:'Hearts',waves:'Waves',checks:'Checks',stars:'Stars',label:'Label'},
 pfs:{0:'Matte',1:'Glossy',2:'Speckled',3:'Glazed'},
 paper:'Paper',font:'Lettering',sticker:'Sticker',texT:'Texture',inkT:'Text color',tapeT:'Tape',tapeOn:'Taped',tapeOff:'No tape',
 papers:{crema:'Cream',rosa:'Pink',celeste:'Sky',salvia:'Sage',lila:'Lilac',manteca:'Butter',durazno:'Peach',noche:'Night'},
 texs:{0:'Plain',1:'Lined',2:'Dotted',3:'Grid'},
 cardDraw:'Draw on the card',cardDrawSub:'A little doodle above your message',
 fonts:{mano:'Handwritten',caveat:'Cursive',luz:'Pencil',marker:'Marker',serif:'Editorial',elegante:'Elegant',fraunces:'Modern',maq:'Typewriter'},sizeT:'Size',sizes:['Small','Medium','Large'],alignT:'Alignment',aligns:['Left','Center'],frameT:'Frame',frames:['No frame','Line','Dotted','Double'],shapeT:'Corners',shapes:['Square','Round'],stks:{none:'No sticker',heart:'Heart',sun:'Sun',sprout:'Sprout',moon:'Moon',star:'Star'},fungT:'It has a fungus',sowHint:'Drag the seed onto the soil in the pot.',sowAria:'Seed. Tap it or drag it to the pot to sow it.',sown:'Sown. Now take care of it.',fungD:'Water, sun and love, then treat it.',noneShort:'No',dragTag:'Drag the tag and place it wherever you like',
 to:'To',phTo:'Sam',msgL:'Message',from:'From',phFrom:'Alex',forX:n=>'For '+n,liveK:'This is your card',
 preview:'Preview',pvTitle:'This is what the other person will see',pvBack:'Back to edit',
 sendH:'Your flower is ready to travel',sendP:'Send this link any way you like. On the other side they’ll see your flower in its pot, how it grew, and your card.',linkAria:'Your flower’s link',copy:'Copy link',copied:'Copied',selected:'Selected',wa:'WhatsApp',shareB:'Share',seeHow:'See how it arrives',waText:'I sent you a flower',editMore:'Edit pot or card',anotherB:'Grow another flower',
 linkNote:'The link carries your flower, pot and card inside it. Nothing is stored on a server.',
 gKick:'Delivery',gTitle:'A flower for you',gTitle2:n=>'A flower for you, '+n,someone:'Someone',
 gStory:(who,art,nm,n,k)=>who+' picked '+art+(nm?' and named it '+nm:'')+'. They watered it, gave it sun and talked to it for '+n+(n===1?' day':' days')+'.'+(k?(k===1?' It got sick once, and they cared for it until it healed.':' It got sick '+k+' times, and they cared for it every time until it healed.'):'')+' When it bloomed, they sent it to you in its pot.',
 gFlip:'Watch how it grew.',gReplay:'Watch again',gOpen:'Open the card',gOwn:'Grow one for someone',gInPot:'in its pot',
 sound:'Sound',soundOn:'Sound on',soundOff:'Sound off',mLang:'Language',mChange:'Change flower',mChangeSub:'Leave this plant and pick another',mHome:'Start screen',mHomeSub:'Back to the shop window',
 cfChangeT:'Change flower?',cfChangeP:'You’ll leave this plant and start with another. What you’ve cared for so far is lost.',cfChangeOk:'Yes, change',cfNo:'Not now',
 cfAnotherT:'Grow another flower?',cfAnotherP:'The link you already sent keeps working. You start from scratch with a new plant.',cfAnotherOk:'Start another',
 cfCloseT:'Leave without saving?',cfCloseP:'You’ll lose the strokes you just made.',cfCloseOk:'Leave',cfKeep:'Keep drawing',
 stTitlePot:'Draw your pot',stTitleCard:'Draw your card',stDone:'Done',stSize:'Size',undo:'Undo',sym:'Symmetry (mirror)',redo:'Redo',clear:'Clear all',stInk:'Ink',
 tools:{pencil:'Pencil',marker:'Marker',brush:'Brush',chalk:'Chalk',stamp:'Stamps',erase:'Eraser',spray:'Spray',water:'Watercolor',gold:'Gold'},
 stHintPot:'Draw on the pot. Anything outside it gets cut off.',stHintCard:'Draw with your finger. With the eraser, tap a stroke to remove it.',stOut:'Out of ink. Erase something to keep going.',
 reset:'Starting fresh.',fresh:'All set for another flower.',saved:'Saved'
}};
let LANG='es';
const t=(k,...a)=>{const v=(T[LANG]&&T[LANG][k]!==undefined)?T[LANG][k]:T.es[k];return typeof v==='function'?v(...a):v};
const FLt=k=>(T[LANG].sp[k]||T.es.sp[k]);

/* ---------- data ---------- */
const FL={rosa:{care:3,dw:1.1,dl:1,da:1.25},tulipan:{care:2,dw:1,dl:1,da:1},girasol:{care:2,dw:1,dl:1.4,da:.9}};
const ORDER=['rosa','tulipan','girasol'];
const th=(sp,i)=>i<0?'img/maceta_terra.webp':'img/th_'+sp+'_'+i+'.jpg';
const POTC={terra:'#d9733c',crema:'#f1e6cf',salvia:'#a9bca2',azul:'#6a9bc9',rosa:'#ee9ab0',mostaza:'#e6b51d',grafito:'#4b4f56'};
const INK={terra:'#fff4e0',crema:'#c9633a',salvia:'#fffaf0',azul:'#fffaf0',rosa:'#fffaf0',mostaza:'#fff8e6',grafito:'#f3e7d0'};
const POTS=Object.keys(POTC),DECOS=['none','stripes','dots','hearts','waves','checks','stars','label'];
const PAL=['#30343b','#ffffff','#d9567a','#f08aa6','#e8743b','#f2b632','#f6e27a','#8fbf6a','#4f7f50','#4aa6a1','#6a9bc9','#3d63a6','#9b7fd1','#c9a3e8','#8a5a3a','#f1e6cf'];
const PAPERS={crema:'#fffdf8',rosa:'#fbe3ea',celeste:'#e4eefb',salvia:'#e6efe2',lila:'#ece4f7',manteca:'#fbf0c8',durazno:'#fbe0cf',noche:'#343a4d'};
const TCOL=['#3e3a35','#3d63a6','#b8435f','#4f6b49','#6a4b8f','#1f1f1f','#fffaf0'];
const FONTS=['mano','caveat','luz','marker','serif','elegante','fraunces','maq'],STK=['none','heart','sun','sprout','moon','star'];
const STKI={heart:'i-heart',sun:'i-sun',sprout:'i-sprout',moon:'i-moon',star:'i-star'};
const CYCLE=30,NIGHT=22,GOAL=120,CURES=5;
const KEY='keptly1';
const LIM={pot:900,card:700};

const fresh=()=>({f:'rosa',name:'',w:55,l:55,a:55,g:0,day:1,t:0,mode:'shop',hp:100,sick:false,cure:0,k:0,roll:Math.random(),
 pc:'terra',ph:0,pb:100,pd:'none',pk:-1,pf:0,pg:3,pw:[],
 paper:'crema',gx:null,gy:null,fz:1,al:0,fr:0,rd:0,tx:0,cc:0,tp:0,tf:'mano',ts:'none',cw:[],
 to:'',msg:'',from:'',code:'',test:false,seen:false});
let S=fresh(),tab='tienda',gift=null,previewing=false,lastWarn='',lastCure=0,timer=null;
const seg={tienda:'flor',vivero:'diario',tarjeta:'mensaje',enviar:''};
const SEGS={tienda:['flor','maceta','como'],vivero:['diario','maceta'],tarjeta:['mensaje','maceta','tarjeta'],enviar:[]};
const sane=s=>{s.pw=Array.isArray(s.pw)?s.pw:[];s.cw=Array.isArray(s.cw)?s.cw:[];return s};
try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&typeof s==='object'&&FL[s.f])S=sane(Object.assign(fresh(),s))}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const stageOf=g=>Math.min(6,Math.floor(g/(GOAL/6)));
const isNight=()=>S.mode==='grow'&&S.t>=NIGHT;
const curMsg=()=>S.msg||t('defMsg');
const potCfg=o=>({pc:o.pc,ph:o.ph,pb:o.pb,pd:o.pd,pk:o.pk,pf:o.pf,pg:o.pg,pw:o.pw});
const VN={es:{rosa:['roja','rosada','crema','amarilla','coral','bordó','lila','durazno','rosa y blanca','fucsia'],tulipan:['amarillo','violeta','rosa','rojo','naranja','bordó','naranja con flecos','loro fucsia','rojo y blanco','rosa lirio'],girasol:['dorado','amarillo','cobrizo','coral','crema','bordó','ámbar rojizo','limón','paja','ámbar']},
en:{rosa:['red','pink','cream','yellow','coral','burgundy','lilac','peach','pink and white','fuchsia'],tulipan:['yellow','violet','pink','red','orange','burgundy','fringed orange','magenta parrot','red and white','lily pink'],girasol:['golden','yellow','copper','coral','cream','burgundy','russet','lemon','straw','amber']}};
const vName=(f,v)=>((VN[LANG]||VN.es)[f]||[])[v]||'';
const vOf=o=>typeof o.v==='number'&&o.v>=0&&o.v<10?o.v:0;
const mkGift=()=>({v:vOf(S),t:S.to.trim()||'…',m:curMsg().trim(),d:S.from.trim(),nm:S.name.trim(),f:S.f,p:S.paper,n:S.day,k:S.k,l:LANG,pc:S.pc,ph:S.ph,pb:S.pb,pd:S.pd,pk:S.pk,pf:S.pf,pg:S.pg,pw:S.pw,tx:S.tx,cc:S.cc,tp:S.tp,tf:S.tf,ts:S.ts,cw:S.cw,gx:S.gx,gy:S.gy,fz:S.fz,al:S.al,fr:S.fr,rd:S.rd});
const potLabel=(nm,to)=>nm||(to&&to!=='…'?to:'')||BRAND;

/* ---------- sound: tiny synth, no files ---------- */
let AC=null,SND=true;
try{SND=localStorage.getItem('keptly_snd')!=='0'}catch(e){}
function ac(){
 if(!SND)return null;
 if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}
 if(AC.state==='suspended')AC.resume().catch(()=>{});
 return AC;
}
function tone(f,d,type,vol,delay,to){
 const c=ac();if(!c)return;const t0=c.currentTime+(delay||0),o=c.createOscillator(),g=c.createGain();
 o.type=type||'sine';o.frequency.setValueAtTime(f,t0);if(to)o.frequency.exponentialRampToValueAtTime(to,t0+d);
 g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol||.12,t0+Math.min(.02,d/3));g.gain.exponentialRampToValueAtTime(.0001,t0+d);
 o.connect(g).connect(c.destination);o.start(t0);o.stop(t0+d+.05);
}
let NB=null;
function noise(d,ft,f,vol,delay,q,to){
 const c=ac();if(!c)return;
 if(!NB){NB=c.createBuffer(1,c.sampleRate,c.sampleRate);const x=NB.getChannelData(0);for(let i=0;i<x.length;i++)x[i]=Math.random()*2-1}
 const t0=c.currentTime+(delay||0),s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();
 s.buffer=NB;s.loop=true;fl.type=ft;fl.frequency.setValueAtTime(f,t0);if(to)fl.frequency.exponentialRampToValueAtTime(to,t0+d);fl.Q.value=q||1;
 g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol||.1,t0+Math.min(.04,d/3));g.gain.exponentialRampToValueAtTime(.0001,t0+d);
 s.connect(fl).connect(g).connect(c.destination);s.start(t0);s.stop(t0+d+.05);
}
const SFX={
 tap(){tone(620,.07,'sine',.07,0,420)},
 tab(){tone(480,.05,'triangle',.05)},
 water(){noise(.7,'bandpass',900,.1,0,1.2,2200);[0,.18,.34,.52].forEach((d,i)=>tone(700+i*140,.12,'sine',.07,d+.1,380))},
 sun(){tone(392,.9,'sine',.07,0);tone(494,.9,'sine',.06,.08);tone(587,1.1,'sine',.06,.16)},
 love(){tone(110,.16,'sine',.2,0,70);tone(110,.18,'sine',.2,.2,70);tone(880,.6,'triangle',.05,.34);tone(1318,.7,'sine',.03,.4)},
 cure(){[523,659,784,1047].forEach((f,i)=>tone(f,.4,'triangle',.07,i*.09))},
 grow(){[392,494,587,784].forEach((f,i)=>tone(f,.35,'sine',.08,i*.1))},
 bloom(){[523,659,784,988,1319].forEach((f,i)=>tone(f,.9,'sine',.07,i*.13));noise(.6,'highpass',5000,.025,.5)},
 sick(){tone(260,.9,'sine',.1,0,150);tone(262,.9,'triangle',.04,0,148)},
 die(){[392,330,262,196].forEach((f,i)=>tone(f,.8,'sine',.09,i*.34))},
 warn(){tone(300,.12,'square',.04,0,260)},
 paper(){noise(.22,'highpass',2400,.07,0,.7,5200);noise(.18,'bandpass',1500,.04,.05,1)},
 pop(){tone(300,.14,'sine',.12,0,900)},
 scratch(k){const f={pencil:3600,chalk:2300,brush:1100,marker:1500,spray:5200,water:900,gold:2800}[k]||2500;noise(.07,'bandpass',f,k==='brush'?.03:.05,0,.9)},
 erase(){noise(.18,'lowpass',1200,.06,0,.8,300)},
 ding(){tone(784,.5,'sine',.09,0);tone(1175,.7,'sine',.07,.12)},
 err(){tone(210,.18,'sine',.1,0,150)},
 done(){[523,659,784].forEach((f,i)=>tone(f,.3,'triangle',.07,i*.08))},
 off(){tone(440,.08,'sine',.06,0,330)}
};
const sfx=(k,a)=>{try{SFX[k](a)}catch(e){}};
function setSnd(on,persist){SND=on;if(persist){try{localStorage.setItem('keptly_snd',on?'1':'0')}catch(e){}}
 document.querySelectorAll('[data-snd]').forEach(b=>{b.setAttribute('aria-pressed',on);b.innerHTML=`<svg class="ic"><use href="#${on?'i-vol':'i-mute'}"/></svg>`;b.setAttribute('aria-label',t('sound'));b.title=t('sound')});
 if(on&&persist){ac();sfx('tap')}}
