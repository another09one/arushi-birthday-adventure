import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

(() => {
  const canvas = document.querySelector('#birthday3D');
  if (!canvas) return;
  const loading = document.querySelector('#threeLoading');
  const panel = document.querySelector('#threeInteraction');
  const interactButton = document.querySelector('#threeInteract');
  const countLabel = document.querySelector('#threeCollected');
  const locationLabel = document.querySelector('#threeLocation');
  const objectiveLabel = document.querySelector('#threeObjective');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#a8b8d5');
  scene.fog = new THREE.Fog('#a8b8d5', 30, 78);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 150);
  camera.position.set(0, 8.5, 13);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.7));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  scene.add(new THREE.HemisphereLight(0xe8efff, 0x6b5875, 2.0));
  const sun = new THREE.DirectionalLight(0xffe4bd, 2.6);
  sun.position.set(-8, 16, 9); sun.castShadow = true; sun.shadow.mapSize.set(1024,1024); scene.add(sun);
  const fill = new THREE.PointLight(0xb4a0ff, 22, 38); fill.position.set(8,7,-7); scene.add(fill);

  const mat = (color, roughness=.78, metalness=0) => new THREE.MeshStandardMaterial({color,roughness,metalness});
  const grass = mat('#6d9b83'), grassLight = mat('#94b98c'), pathMat = mat('#d9c4a0'), waterMat = new THREE.MeshStandardMaterial({color:'#7db8c8',roughness:.25,metalness:.12,transparent:true,opacity:.9});
  const gold = new THREE.MeshStandardMaterial({color:'#f4d38b',emissive:'#8a5b1d',emissiveIntensity:.55,metalness:.35,roughness:.35});
  const island = new THREE.Mesh(new THREE.CylinderGeometry(18,19,1.5,72),grass); island.position.y=-.8; island.receiveShadow=true; island.castShadow=true; scene.add(island);
  const islandTop = new THREE.Mesh(new THREE.CylinderGeometry(17.8,18,0.22,72),grassLight); islandTop.position.y=-.03; islandTop.receiveShadow=true; scene.add(islandTop);
  const water = new THREE.Mesh(new THREE.CylinderGeometry(22,22,.28,72),waterMat); water.position.y=-1.55; scene.add(water);
  const path = new THREE.Mesh(new THREE.TorusGeometry(9.5,.72,10,100),pathMat); path.rotation.x=Math.PI/2; path.position.y=.09; path.scale.set(1, .82, 1); scene.add(path);
  const centralSquare = new THREE.Mesh(new THREE.CylinderGeometry(3.6,3.9,.22,48),pathMat); centralSquare.position.set(0,.12,0); centralSquare.receiveShadow=true; scene.add(centralSquare);

  // Soft pastel sky decorations
  const starField = new THREE.Group();
  for(let i=0;i<110;i++){const a=Math.random()*Math.PI*2,r=24+Math.random()*25,y=5+Math.random()*20;const m=new THREE.Mesh(new THREE.SphereGeometry(.045+Math.random()*.04,6,6),gold);m.position.set(Math.cos(a)*r,y,Math.sin(a)*r);starField.add(m)}
  scene.add(starField);
  const cloudMat=mat('#fff6e8');
  function cloud(x,y,z,s=1){const g=new THREE.Group();[[0,0,0],[.65,.12,0],[-.55,.08,0],[.1,.35,0]].forEach(([a,b,c],i)=>{const q=new THREE.Mesh(new THREE.SphereGeometry(i===3?.55:.48,14,12),cloudMat);q.position.set(a,b,c);q.scale.set(1,.68,.7);g.add(q)});g.position.set(x,y,z);g.scale.setScalar(s);scene.add(g);return g}
  const clouds=[cloud(-14,9,-12,1.3),cloud(13,11,-10,1.1),cloud(-15,8,10,.9)];

  function tree(x,z,scale=1){const g=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.18,.25,1.5,8),mat('#805b49'));trunk.position.y=.75;trunk.castShadow=true;g.add(trunk);[[0,1.8,0,.9],[.42,2.2,.08,.62],[-.38,2.15,-.08,.65]].forEach(([a,b,c,r])=>{const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),mat(['#79a77d','#8fb68a','#a5bf8c'][Math.floor(Math.random()*3)]));crown.position.set(a,b,c);crown.castShadow=true;g.add(crown)});g.position.set(x,0,z);g.scale.setScalar(scale);scene.add(g)}
  [[-13,-7,1.1],[-12,6,.9],[12,-8,1.1],[13,5,1],[-7,-13,.8],[8,13,.9],[-16,0,.7],[16,0,.7]].forEach(v=>tree(...v));
  function lamp(x,z){const g=new THREE.Group();const pole=new THREE.Mesh(new THREE.CylinderGeometry(.06,.08,2.1,8),mat('#5d5266'));pole.position.y=1.05;g.add(pole);const orb=new THREE.Mesh(new THREE.SphereGeometry(.25,16,12),new THREE.MeshStandardMaterial({color:'#fff0bd',emissive:'#ffca73',emissiveIntensity:2}));orb.position.y=2.2;g.add(orb);const l=new THREE.PointLight('#ffd58a',3,5);l.position.y=2.2;g.add(l);g.position.set(x,0,z);scene.add(g)}
  [[-5,-7],[5,-7],[-7,5],[7,5],[0,-10],[0,10]].forEach(v=>lamp(...v));

  function labelSprite(text,color='#fff4dc'){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='rgba(24,25,42,.78)';ctx.roundRect(8,8,496,112,28);ctx.fill();ctx.strokeStyle='rgba(244,211,139,.8)';ctx.lineWidth=3;ctx.stroke();ctx.font='bold 36px Arial';ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(text.toUpperCase(),256,78);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));sp.scale.set(5.1,1.28,1);return sp}
  function building(x,z,color,title,icon){const g=new THREE.Group();const base=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.4,.35,8),pathMat);base.position.y=.2;g.add(base);const body=new THREE.Mesh(new THREE.BoxGeometry(3.1,2.5,2.6),mat(color));body.position.y=1.55;body.castShadow=true;body.receiveShadow=true;g.add(body);const roof=new THREE.Mesh(new THREE.ConeGeometry(2.45,1.6,8),mat('#51445f'));roof.position.y=3.55;roof.rotation.y=Math.PI/8;roof.castShadow=true;g.add(roof);const door=new THREE.Mesh(new THREE.BoxGeometry(.72,1.3,.12),mat('#4a394b'));door.position.set(0,.95,1.36);g.add(door);const sign=labelSprite(icon+'  '+title);sign.position.y=4.65;g.add(sign);g.position.set(x,0,z);scene.add(g);return g}
  building(-10,-3,'#d5a9bd','Memory Cottage','♡');
  building(10,-3,'#9eb8d5','Pixel Arcade','✦');
  building(-9,8,'#a8c6a0','Wishing Woods','☘');
  building(9,8,'#d6b47d','Birthday Hall','★');

  // Birthday gate, stage, cake and tiny guest avatars
  const gate=new THREE.Group();const gateMat=mat('#e7c17e',.35,.35);[-1.65,1.65].forEach(x=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.13,.18,3.7,12),gateMat);p.position.set(x,1.8,-15);gate.add(p)});const arch=new THREE.Mesh(new THREE.TorusGeometry(1.65,.14,10,40,Math.PI),gateMat);arch.position.set(0,3.55,-15);arch.rotation.z=Math.PI;gate.add(arch);const gateSign=labelSprite('THE NEXT CHAPTER');gateSign.position.set(0,4.7,-15);gate.add(gateSign);scene.add(gate);
  const stage=new THREE.Group();const platform=new THREE.Mesh(new THREE.CylinderGeometry(3.2,3.5,.5,32),mat('#b78e9f'));platform.position.y=.25;stage.add(platform);const cakeBase=new THREE.Mesh(new THREE.CylinderGeometry(.95,1.05,.75,24),mat('#f3d4d0'));cakeBase.position.y=.9;stage.add(cakeBase);const cakeTop=new THREE.Mesh(new THREE.CylinderGeometry(.98,.98,.18,24),mat('#fff0d9'));cakeTop.position.y=1.35;stage.add(cakeTop);for(let i=0;i<5;i++){const candle=new THREE.Mesh(new THREE.CylinderGeometry(.045,.05,.42,8),mat(['#c4a4db','#f2c78d','#a8c8c4'][i%3]));candle.position.set(Math.cos(i*Math.PI*2/5)*.48,1.65,Math.sin(i*Math.PI*2/5)*.48);stage.add(candle);const flame=new THREE.Mesh(new THREE.SphereGeometry(.1,8,8),new THREE.MeshBasicMaterial({color:'#ffdc86'}));flame.position.copy(candle.position);flame.position.y+=.25;stage.add(flame)}stage.position.set(0,0,0);scene.add(stage);

  const character=new THREE.Group();
  const skin=mat('#d89b79'), hair=mat('#211923'), shirt=mat('#a98bc5'), skirt=mat('#59496f'), shoe=mat('#f1d8c5');
  const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.43,.65,5,10),shirt);torso.position.y=1.45;torso.castShadow=true;character.add(torso);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.48,24,18),skin);head.position.y=2.35;head.castShadow=true;character.add(head);
  const hairCap=new THREE.Mesh(new THREE.SphereGeometry(.51,20,14,0,Math.PI*2,0,Math.PI*.62),hair);hairCap.position.set(0,2.49,-.04);hairCap.scale.set(1.04,1.18,1.08);character.add(hairCap);
  const hairBack=new THREE.Mesh(new THREE.CapsuleGeometry(.27,.95,5,8),hair);hairBack.position.set(0,1.72,-.34);character.add(hairBack);
  const eyesMat=new THREE.MeshBasicMaterial({color:'#33232b'});[-.17,.17].forEach(x=>{const eye=new THREE.Mesh(new THREE.SphereGeometry(.045,8,8),eyesMat);eye.position.set(x,2.39,.425);character.add(eye)});
  const smile=new THREE.Mesh(new THREE.TorusGeometry(.09,.018,6,14,Math.PI),mat('#9a4d56'));smile.position.set(0,2.19,.445);smile.rotation.z=Math.PI;character.add(smile);
  const skirtMesh=new THREE.Mesh(new THREE.ConeGeometry(.53,.65,12),skirt);skirtMesh.position.y=.86;character.add(skirtMesh);
  const limbs=[];for(let side of [-1,1]){const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.13,.52,4,8),skin);arm.position.set(side*.52,1.48,0);arm.rotation.z=side*.22;character.add(arm);const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.14,.48,4,8),skin);leg.position.set(side*.2,.32,0);character.add(leg);const foot=new THREE.Mesh(new THREE.SphereGeometry(.17,10,8),shoe);foot.position.set(side*.2,.1,.1);character.add(foot);limbs.push(arm,leg)}
  const nameTag=labelSprite('ARUSHI','#ffe7b6');nameTag.scale.set(2.5,.62,1);nameTag.position.y=3.25;character.add(nameTag);character.position.set(0,0,5.8);scene.add(character);

  function guest(x,z,bodyColor,name,emoji){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CapsuleGeometry(.32,.52,4,8),mat(bodyColor));b.position.y=1.1;g.add(b);const h=new THREE.Mesh(new THREE.SphereGeometry(.34,16,12),skin);h.position.y=1.8;g.add(h);const tag=labelSprite(emoji+' '+name);tag.scale.set(2.7,.68,1);tag.position.y=2.55;g.add(tag);g.position.set(x,0,z);scene.add(g);return g}
  const guests=[guest(-3,-1,'#df9fbd','BESTIE','♡'),guest(3,-1,'#8bb9bb','PARTY PAL','✦'),guest(-4,4,'#d4b47e','HYPE SQUAD','★'),guest(4,4,'#a99acb','DANCE CAPTAIN','♫')];

  const collectibles=[];
  for(let i=0;i<6;i++){const a=i*Math.PI/3+.4;const obj=new THREE.Group();const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.38),gold);gem.castShadow=true;obj.add(gem);const halo=new THREE.Mesh(new THREE.TorusGeometry(.56,.035,8,24),new THREE.MeshBasicMaterial({color:'#ffe4a4',transparent:true,opacity:.75}));halo.rotation.x=Math.PI/2;obj.add(halo);obj.position.set(Math.cos(a)*7.4,1.5,Math.sin(a)*7.4);scene.add(obj);collectibles.push({group:obj,got:false})}

  const interactables=[
    {name:'MEMORY COTTAGE',x:-10,z:-3,title:'A little museum of you.',text:'Every version of you deserves to be remembered — the tiny beginnings, the brave steps, the silly smiles and every chapter in between.',action:'OPEN THE MEMORY GALLERY',target:'#moments',kicker:'THE MEMORY MEADOW'},
    {name:'PIXEL ARCADE',x:10,z:-3,title:'Ready for some nonsense?',text:'No high scores needed. Just balloons to pop, pairs to match and a wish machine that is suspiciously good at making you smile.',action:'PLAY THE MINI-GAMES',target:'#party',kicker:'THE PIXEL ARCADE'},
    {name:'WISHING WOODS',x:-9,z:8,title:'A forest full of good things.',text:'Take a breath. Make a wish. You do not have to have everything figured out to be proud of how far you have come.',action:'READ YOUR LITTLE WISHES',target:'#adventure',kicker:'THE WISHING WOODS'},
    {name:'BIRTHDAY HALL',x:9,z:8,title:'The party is waiting for you!',text:'Your guests are here, the cake is ready, and there is absolutely no such thing as dancing badly tonight.',action:'JOIN YOUR BIRTHDAY PARTY',target:'#party',kicker:'THE GRAND CELEBRATION'},
    {name:'THE CAKE STAGE',x:0,z:0,title:'Five candles. A million possibilities.',text:'Make a wish for the year ahead. May it be kinder than you expect, brighter than you imagine and full of moments that make you feel alive.',action:'MAKE YOUR BIRTHDAY WISH',target:'#adventure',kicker:'A WISH JUST FOR YOU'},
    ...guests.map((g,i)=>({name:['BESTIE','PARTY PAL','HYPE SQUAD','DANCE CAPTAIN'][i],x:g.position.x,z:g.position.z,title:'Your birthday crew says...',text:'We came all this way just to remind you how loved you are. Now go on — the dance floor is yours. No awkward dancing judgement here. Only good vibes.',action:'JOIN THE PARTY',target:'#party',kicker:'A MESSAGE FROM YOUR GUESTS'})),
    {name:'THE SECRET GATE',x:0,z:-15,title:'Your story keeps going.',text:'Six stars, six reminders: you are loved, you are enough today, you can begin again, you can take your time, you are allowed to dream big, and your best chapters are still unwritten.',action:'SEE YOUR NEXT CHAPTER',target:'#letter',kicker:'TO BE CONTINUED'}
  ];
  let collected=0,nearby=null,dragging=false,lastX=0,lastY=0,yaw=0,pitch=.22,jump=0,walkTime=0;
  const quest={memory:false,arcade:false,guests:false,stars:false};
  const questEls={memory:document.querySelector('#questMemory'),arcade:document.querySelector('#questArcade'),guests:document.querySelector('#questGuests'),stars:document.querySelector('#questStars')};
  function refreshQuest(){let done=Object.values(quest).filter(Boolean).length;document.querySelector('#questProgress').textContent=`${done} / 4 adventures completed`;Object.entries(quest).forEach(([k,v])=>{if(questEls[k]){questEls[k].classList.toggle('done',v);questEls[k].textContent=(v?'✓ ':'○ ')+({memory:'Visit Memory Cottage',arcade:'Win the Balloon Pop challenge',guests:'Say hello to the birthday crew',stars:'Collect all six wishing stars'}[k])}});if(done===4)objectiveLabel.textContent='All quests complete — the secret gate awaits!'}
  const miniGame=document.querySelector('#worldMiniGame');
  let balloonTimer=null,balloonScore=0,balloonSeconds=20;
  function stopBalloon(){if(balloonTimer){clearInterval(balloonTimer);balloonTimer=null}}
  function openBalloonGame(){panel.hidden=true;miniGame.hidden=false;stopBalloon();balloonScore=0;balloonSeconds=20;document.querySelector('#miniGameScore').textContent='0 / 10';document.querySelector('#miniGameTimer').textContent='20s';document.querySelector('#miniGameResult').textContent='';document.querySelector('#miniGameStart').hidden=false;document.querySelector('#miniGameStart').textContent='START THE CHALLENGE';document.querySelector('#balloonField').innerHTML=''}
  function startBalloonGame(){stopBalloon();balloonScore=0;balloonSeconds=20;const field=document.querySelector('#balloonField');field.innerHTML='';document.querySelector('#miniGameStart').hidden=true;document.querySelector('#miniGameResult').textContent='Quick! Pop the balloons!';document.querySelector('#miniGameScore').textContent='0 / 10';document.querySelector('#miniGameTimer').textContent='20s';Array.from({length:10},(_,i)=>{const b=document.createElement('button');b.className='balloon-pop';b.textContent='🎈';b.setAttribute('aria-label','Pop balloon '+(i+1));b.addEventListener('click',()=>{if(b.classList.contains('popped'))return;b.classList.add('popped');b.textContent='✨';balloonScore++;document.querySelector('#miniGameScore').textContent=balloonScore+' / 10';if(balloonScore===10)finishBalloon(true)});field.appendChild(b)});balloonTimer=setInterval(()=>{balloonSeconds--;document.querySelector('#miniGameTimer').textContent=balloonSeconds+'s';if(balloonSeconds<=0)finishBalloon(false)},1000)}
  function finishBalloon(won){stopBalloon();document.querySelector('#miniGameStart').hidden=false;document.querySelector('#miniGameStart').textContent=won?'PLAY AGAIN':'TRY AGAIN';document.querySelector('#miniGameResult').textContent=won?'YOU DID IT! Arcade quest complete. You are officially the birthday champion! 🎉':'Time is up! No pressure — every champion gets another try.';if(won){quest.arcade=true;refreshQuest()}}
  document.querySelector('#miniGameStart').addEventListener('click',startBalloonGame);
  document.querySelector('#miniGameClose').addEventListener('click',()=>{stopBalloon();miniGame.hidden=true});
  refreshQuest();
  const keys={};
  function showPanel(item){if(item.name==='PIXEL ARCADE'){openBalloonGame();return}document.querySelector('#threePanelKicker').textContent=item.kicker;document.querySelector('#threePanelTitle').textContent=item.title;document.querySelector('#threePanelText').textContent=item.text;const btn=document.querySelector('#threePanelAction');btn.textContent=item.action+' ↗';btn.onclick=()=>{panel.hidden=true;document.querySelector(item.target)?.scrollIntoView({behavior:'smooth'});};panel.hidden=false}
  function closePanel(){panel.hidden=true}
  document.querySelector('#threeClose').addEventListener('click',closePanel);
  function nearest(){let best=null,d=2.65;for(const item of interactables){const dist=Math.hypot(character.position.x-item.x,character.position.z-item.z);if(dist<d){d=dist;best=item}}return best}
  function collectNearby(){for(const c of collectibles){if(!c.got&&Math.hypot(character.position.x-c.group.position.x,character.position.z-c.group.position.z)<1.35){c.got=true;collected++;c.group.visible=false;countLabel.textContent=collected;objectiveLabel.textContent=collected===6?'The secret gate is open!':'Keep exploring for glowing stars';if(collected===6){quest.stars=true;refreshQuest();const gateGlow=new THREE.PointLight('#ffdc8a',35,14);gateGlow.position.set(0,3,-15);scene.add(gateGlow);if(Object.values(quest).every(Boolean)){showPanel({kicker:'QUEST COMPLETE',title:'You found every little star!',text:'Every corner explored, every challenge completed, every wish collected. The secret gate is open. You do not have to earn your place in this world. You already belong here.',action:'VISIT THE SECRET GATE',target:'#letter'})}else{objectiveLabel.textContent='Six stars found! Complete the other adventures to open the gate.'}}}}}
  function interact(){if(panel.hidden===false){closePanel();return}if(nearby){if(nearby.name==='THE SECRET GATE'&&Object.values(quest).some(v=>!v)){showPanel({kicker:'YOUR FINAL QUEST',title:'One more little adventure first.',text:`Your quest log is ${Object.values(quest).filter(Boolean).length} of 4 complete. Visit the Memory Cottage, win the arcade challenge, greet the guests and collect six stars. The gate opens when every part of the island has been explored.`,action:'KEEP EXPLORING',target:'#3d-adventure'});return}
    if(nearby.name==='MEMORY COTTAGE'){quest.memory=true;refreshQuest()}
    const guest=guests.find(g=>Math.hypot(g.position.x-character.position.x,g.position.z-character.position.z)<2.65);
    if(guest){quest.guests=true;refreshQuest();showPanel({kicker:'A MESSAGE FROM YOUR PARTY CREW',title:'We saved you the best seat.',text:'We came all this way just to remind you how loved you are. Your kindness, the way you listen, and the way you help people feel seen make you unforgettable. Tonight, let everyone celebrate YOU.',action:'JOIN THE PARTY',target:'#party'});return}
    showPanel(nearby);return}const guest=guests.find(g=>Math.hypot(g.position.x-character.position.x,g.position.z-character.position.z)<1.8);if(guest){showPanel({kicker:'A PARTY GUEST SAYS...',title:'You deserve to be celebrated!',text:'We came all this way just to remind you how loved you are. Now go on — the dance floor is yours.',action:'LET’S PARTY',target:'#party'})}}
  function clampIsland(){const r=Math.hypot(character.position.x,character.position.z);if(r>15.5){character.position.x*=15.5/r;character.position.z*=15.5/r}}
  function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
  new ResizeObserver(resize).observe(canvas.parentElement);resize();
  window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();keys[k]=true;if(k==='e')interact();if(k===' '){jump=.22}});
  window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
  document.querySelectorAll('[data-3d]').forEach(btn=>{const k=btn.dataset['3d'];const map={forward:'w',back:'s',left:'a',right:'d'};const key=map[k];const down=e=>{e.preventDefault();keys[key]=true};const up=e=>{e.preventDefault();keys[key]=false};btn.addEventListener('pointerdown',down);['pointerup','pointerleave','pointercancel'].forEach(ev=>btn.addEventListener(ev,up))});
  document.querySelector('#threeJump').addEventListener('click',()=>jump=.22);
  interactButton.addEventListener('click',interact);
  document.querySelector('#threeReset').addEventListener('click',()=>{yaw=0;pitch=.22;camera.position.set(character.position.x,8.5,character.position.z+13)});
  canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;yaw-=(e.clientX-lastX)*.006;pitch=THREE.MathUtils.clamp(pitch+(e.clientY-lastY)*.003,-.15,.7);lastX=e.clientX;lastY=e.clientY});
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>canvas.addEventListener(ev,()=>dragging=false));
  document.querySelector('#threeHint').textContent=matchMedia('(pointer:coarse)').matches?'Use the arrow pad to explore · Tap INTERACT near a place':'WASD / ARROWS to move · E to interact · Drag to look';

  document.querySelectorAll('[data-outfit]').forEach(btn=>btn.addEventListener('click',()=>{shirt.color.set(btn.dataset.outfit);document.querySelectorAll('[data-outfit]').forEach(b=>b.classList.toggle('active',b===btn));}));

  const clock=new THREE.Clock();
  function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);const forward=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0);const side=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0);const moving=forward!==0||side!==0;
    if(moving&&!panel.hidden===false){const angle=Math.atan2(side,forward)+yaw;const speed=dt*5.1;character.position.x+=Math.sin(angle)*speed;character.position.z-=Math.cos(angle)*speed;character.rotation.y=angle;walkTime+=dt*10;character.position.y=Math.abs(Math.sin(walkTime))*.07;limbs.forEach((l,i)=>{if(i%2===0)l.rotation.x=Math.sin(walkTime+(i===0?0:Math.PI))*.35;else l.rotation.x=Math.sin(walkTime+(i===1?0:Math.PI))*.3});}else{character.position.y=THREE.MathUtils.damp(character.position.y,0,8,dt);limbs.forEach(l=>l.rotation.x=THREE.MathUtils.damp(l.rotation.x,0,8,dt))}
    if(jump>0){character.position.y+=jump;jump*=.83;if(jump<.01)jump=0}clampIsland();collectNearby();nearby=nearest();interactButton.disabled=!nearby;if(nearby){locationLabel.textContent=nearby.name;document.querySelector('#threeHint').textContent='Press E or tap INTERACT · '+nearby.name}else{locationLabel.textContent='STARLIGHT ISLAND';if(!panel.hidden){}else document.querySelector('#threeHint').textContent=matchMedia('(pointer:coarse)').matches?'Explore with the arrow pad · Find the glowing stars':'WASD / ARROWS to move · E to interact · Drag to look'}
    collectibles.forEach((c,i)=>{if(!c.got){c.group.rotation.y+=dt*1.1;c.group.position.y=1.5+Math.sin(clock.elapsedTime*2+i)*.18}});guests.forEach((g,i)=>{g.rotation.y=Math.sin(clock.elapsedTime*.6+i)*.15;g.position.y=Math.sin(clock.elapsedTime*1.6+i)*.05});clouds.forEach((c,i)=>{c.position.x+=dt*(.15+i*.04);if(c.position.x>20)c.position.x=-20});starField.rotation.y+=dt*.003;
    const target=new THREE.Vector3(character.position.x+Math.sin(yaw)*12,6.8+pitch*5,character.position.z+Math.cos(yaw)*12);camera.position.lerp(target,1-Math.pow(.001,dt));camera.lookAt(character.position.x,1.1,character.position.z);renderer.render(scene,camera)}
  animate();setTimeout(()=>loading?.classList.add('is-ready'),650);
  window.addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));
})();
