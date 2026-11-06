const introScreen = document.getElementById("introScreen");
const enterButton = document.getElementById("enterButton");
const soundtrack = document.getElementById("soundtrack");
const soundToggle = document.getElementById("soundToggle");
const soundLabel = document.getElementById("soundLabel");

enterButton.addEventListener("click", () => {
  introScreen.classList.add("is-gone");
  // Browsers only allow audio after a user gesture. The visitor can enable it below.
  window.setTimeout(() => introScreen.setAttribute("aria-hidden", "true"), 1000);
});

async function toggleSound() {
  if (soundtrack.paused) {
    try {
      await soundtrack.play();
      soundToggle.classList.add("is-playing");
      soundToggle.setAttribute("aria-pressed", "true");
      soundLabel.textContent = "SOUND ON";
    } catch (error) {
      soundLabel.textContent = "ADD MUSIC FILE";
      console.info("Add assets/music/emotional-piano.mp3 to enable the soundtrack.");
    }
  } else {
    soundtrack.pause();
    soundToggle.classList.remove("is-playing");
    soundToggle.setAttribute("aria-pressed", "false");
    soundLabel.textContent = "SOUND OFF";
  }
}
soundToggle.addEventListener("click", toggleSound);

// Reveal sections as they enter the viewport.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

// Keep in-page navigation smooth, including browsers with limited CSS support.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});


// Six-scene birthday mini-film (all photos remain fully visible).
const filmScenes=[
 ['SCENE 01 · THE BEGINNING','Once upon a time...','A whole lifetime of little moments waiting to happen.','assets/images/01-childhood.jpg'],
 ['SCENE 02 · THE LITTLE THINGS','A heart that notices.','The small moments, the soft side, the things that make you you.','assets/images/05-kitten-kindness.jpg'],
 ['SCENE 03 · THE MANY ERAS','Every version, still you.','Different days, different looks, one wonderfully evolving story.','assets/images/03-cafe-moment.jpg'],
 ['SCENE 04 · FINDING YOUR LIGHT','Keep choosing your light.','Even on days you cannot see it clearly, it is still there.','assets/images/04-lights-and-dreams.jpg'],
 ['SCENE 05 · THE ADVENTURE','There is so much more ahead.','New places, new chances, and memories you have not made yet.','assets/images/11-outdoors.jpg'],
 ['SCENE 06 · TO BE CONTINUED','Your best chapters await.','And the best part? You get to write them your way. Happy Birthday, Arushi.','assets/images/02-portrait-maroon.jpg']
];
let filmIndex=0,filmTimer=null;
function renderFilm(i){filmIndex=(i+filmScenes.length)%filmScenes.length;const s=filmScenes[filmIndex],img=document.getElementById('filmImage');if(!img)return;img.style.opacity=0;setTimeout(()=>{img.src=s[3];img.alt=s[1];document.getElementById('filmKicker').textContent=s[0];document.getElementById('filmTitle').textContent=s[1];document.getElementById('filmText').textContent=s[2];document.getElementById('filmCounter').textContent=`0${filmIndex+1} / 06`;document.getElementById('filmProgress').style.width=((filmIndex+1)/6*100)+'%';img.style.opacity=1},160)}
function stopFilm(){if(filmTimer){clearInterval(filmTimer);filmTimer=null}const b=document.getElementById('filmPlay');if(b)b.textContent='PLAY FILM ▶'}
document.getElementById('filmPrev')?.addEventListener('click',()=>{stopFilm();renderFilm(filmIndex-1)});document.getElementById('filmNext')?.addEventListener('click',()=>{stopFilm();renderFilm(filmIndex+1)});document.getElementById('filmPlay')?.addEventListener('click',()=>{if(filmTimer){stopFilm();return}if(filmIndex===5)renderFilm(0);document.getElementById('filmPlay').textContent='PAUSE FILM Ⅱ';filmTimer=setInterval(()=>{if(filmIndex===5){stopFilm();return}renderFilm(filmIndex+1)},4200)});

// Tap a photo to view the whole image in a lightbox.
const lightbox=document.getElementById('lightbox'),lightboxImage=document.getElementById('lightboxImage');document.querySelectorAll('.photo-open').forEach(b=>b.addEventListener('click',()=>{lightboxImage.src=b.dataset.full;lightbox.classList.add('open')}));function closePhoto(){lightbox?.classList.remove('open')}document.getElementById('lightboxClose')?.addEventListener('click',closePhoto);lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closePhoto()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closePhoto()});

// Birthday star quest: each star unlocks one wish.
const birthdayWishes=['May you learn to speak to yourself with the same gentleness you offer the people you love.','May you be brave enough to try, and kind enough to yourself when things take time.','May unexpected opportunities find you — and may you believe you deserve to take them.','May your days be filled with genuine laughter, safe people, and memories that feel like sunshine.','May this next chapter remind you how much is possible. Your story is only getting started. ♡'];let foundStars=new Set();
function updateStars(){document.getElementById('starCount').textContent=`${foundStars.size} / 5 STARS`;if(foundStars.size===5){document.getElementById('questTitle').textContent='You found every little wish!';document.getElementById('questDescription').textContent='Your birthday sky is full. Keep every wish close.'}}
document.querySelectorAll('.quest-star').forEach(b=>b.addEventListener('click',()=>{const n=Number(b.dataset.star);if(foundStars.has(n))return;foundStars.add(n);b.classList.add('found');document.getElementById('wishUnlock').innerHTML=`<span class="eyebrow">WISH ${foundStars.size} OF 5 · JUST FOR YOU</span><p>${birthdayWishes[n]}</p>`;updateStars()}));document.getElementById('questReset')?.addEventListener('click',()=>{foundStars.clear();document.querySelectorAll('.quest-star').forEach(b=>b.classList.remove('found'));document.getElementById('questTitle').textContent='The night sky is waiting.';document.getElementById('questDescription').textContent='Find all five stars. Each one holds a little wish for your next chapter.';document.getElementById('wishUnlock').innerHTML='<span class="eyebrow">YOUR FIRST WISH IS WAITING</span><p>Tap a glowing star to reveal it.</p>';updateStars()});

// Virtual cake: tap each candle to blow it out; the final one releases confetti.
document.querySelectorAll('.candle').forEach(c=>c.addEventListener('click',()=>{if(!c.classList.contains('lit'))return;c.classList.remove('lit');c.textContent='·';const left=document.querySelectorAll('.candle.lit').length;document.getElementById('cakeMessage').textContent=left?`Lovely. ${left} candle${left===1?'':'s'} left — make another wish.`:'All candles blown out. May every wish find its way to you. ♡';if(!left)birthdayConfetti()}));
function birthdayConfetti(){for(let i=0;i<36;i++){const el=document.createElement('span');el.textContent=['✦','✧','♡','·'][i%4];el.style.cssText=`position:fixed;z-index:50;left:${Math.random()*100}vw;top:-20px;color:${['#c5a77d','#e7b7c0','#b9a3d2'][i%3]};font-size:${12+Math.random()*16}px;pointer-events:none;animation:partyFall ${2+Math.random()*2}s linear forwards`;document.body.appendChild(el);setTimeout(()=>el.remove(),4200)}}const partyStyle=document.createElement('style');partyStyle.textContent='@keyframes partyFall{to{transform:translateY(110vh) rotate(540deg);opacity:0}}';document.head.appendChild(partyStyle);

// Virtual party: a lively animated guest crowd, party mode, and three mini-games.
const partyStage=document.querySelector('.party-stage');
document.getElementById('partyMode')?.addEventListener('click',()=>{partyStage?.classList.toggle('party-on');const on=partyStage?.classList.contains('party-on');document.getElementById('partyMode').textContent=on?'PARTY MODE: ON ✨':'START THE PARTY ✨';if(on)birthdayConfetti()});

// Balloon rush — tap ten balloons before the 20-second countdown ends.
let balloonCount=0,balloonTime=20,balloonClock=null;
const balloonField=document.getElementById('balloonField');
function finishBalloonGame(won){clearInterval(balloonClock);balloonClock=null;document.getElementById('balloonFeedback').textContent=won?'You did it! The birthday crowd is cheering for you! 🎉':'Time! That was still a pretty excellent party.';if(won)birthdayConfetti();}
function spawnBalloons(){balloonField.innerHTML='';for(let i=0;i<10;i++){const b=document.createElement('button');b.className='balloon';b.type='button';b.setAttribute('aria-label','Pop balloon');b.addEventListener('click',()=>{if(b.classList.contains('popped'))return;b.classList.add('popped');balloonCount++;document.getElementById('balloonScore').textContent=`${balloonCount} / 10`;if(balloonCount===10)finishBalloonGame(true)});balloonField.appendChild(b)}}
document.getElementById('balloonStart')?.addEventListener('click',()=>{clearInterval(balloonClock);balloonCount=0;balloonTime=20;document.getElementById('balloonScore').textContent='0 / 10';document.getElementById('balloonTimer').textContent='20s';document.getElementById('balloonFeedback').textContent='Go, go, go!';spawnBalloons();balloonClock=setInterval(()=>{balloonTime--;document.getElementById('balloonTimer').textContent=`${balloonTime}s`;if(balloonTime<=0)finishBalloonGame(false)},1000)});

// Memory match game — six pairs of birthday-themed symbols.
const matchSymbols=['🎂','🎈','🎁','💖','⭐','🧁'];let matchDeck=[],matchOpen=[],matchPairs=0,matchLock=false;
function setupMatch(){matchDeck=[...matchSymbols,...matchSymbols].sort(()=>Math.random()-.5);matchOpen=[];matchPairs=0;matchLock=false;document.getElementById('matchStats').textContent='0 / 6 pairs';document.getElementById('matchFeedback').textContent='Take your time. It is a celebration, not an exam.';const board=document.getElementById('matchBoard');board.innerHTML='';matchDeck.forEach((symbol,i)=>{const b=document.createElement('button');b.className='match-card';b.type='button';b.textContent='?';b.setAttribute('aria-label','Hidden memory card');b.addEventListener('click',()=>flipMatch(b,i,symbol));board.appendChild(b)})}
function flipMatch(btn,i,symbol){if(matchLock||btn.classList.contains('flipped')||btn.classList.contains('matched'))return;btn.classList.add('flipped');btn.textContent=symbol;matchOpen.push({btn,symbol});if(matchOpen.length===2){if(matchOpen[0].symbol===matchOpen[1].symbol){matchOpen.forEach(x=>x.btn.classList.add('matched'));matchOpen=[];matchPairs++;document.getElementById('matchStats').textContent=`${matchPairs} / 6 pairs`;if(matchPairs===6){document.getElementById('matchFeedback').textContent='Perfect match! You cleared the birthday board!';birthdayConfetti()}}else{matchLock=true;setTimeout(()=>{matchOpen.forEach(x=>{x.btn.classList.remove('flipped');x.btn.textContent='?'});matchOpen=[];matchLock=false},750)}}}
document.getElementById('matchReset')?.addEventListener('click',setupMatch);setupMatch();

// A small birthday fortune wheel.
const fortunes=['A beautiful surprise is closer than you think. ✨','You are allowed to take up space and shine. ♡','A new adventure will give you a story to tell.','May the next chapter feel lighter, kinder and brighter.','Someone is very lucky to have you in their world.','Your future has room for every dream you have not said out loud.'];
document.getElementById('fortuneSpin')?.addEventListener('click',()=>{const orb=document.getElementById('fortuneOrb');orb.classList.remove('spin');void orb.offsetWidth;orb.classList.add('spin');document.getElementById('fortuneText').textContent=fortunes[Math.floor(Math.random()*fortunes.length)]});

// Browser-local guestbook. Shared multi-device wishes require the Firebase setup in README.
const wishStoreKey='arushiBirthdayWishes';function renderWishes(){const wall=document.getElementById('wishNotes');if(!wall)return;let wishes=[];try{wishes=JSON.parse(localStorage.getItem(wishStoreKey)||'[]')}catch{}wall.innerHTML='';wishes.slice(-12).reverse().forEach(w=>{const card=document.createElement('div');card.className='wish-note';const msg=document.createTextNode(w.message);const who=document.createElement('small');who.textContent='— '+w.name;card.append(msg,who);wall.appendChild(card)})}
document.getElementById('wishForm')?.addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('wishName').value.trim(),message=document.getElementById('wishMessage').value.trim();if(!name||!message)return;let wishes=[];try{wishes=JSON.parse(localStorage.getItem(wishStoreKey)||'[]')}catch{}wishes.push({name,message});localStorage.setItem(wishStoreKey,JSON.stringify(wishes.slice(-30)));e.target.reset();renderWishes()});renderWishes();

// Playlist selector supports three user-supplied, properly licensed audio tracks.
const musicSelect=document.getElementById('musicSelect'),partyAudio=document.getElementById('partyAudio');musicSelect?.addEventListener('change',()=>{partyAudio.src=musicSelect.value;partyAudio.load();partyAudio.play().catch(()=>{})});


// Open-world birthday adventure: move Arushi around the map and discover four locations.
(()=>{const world=document.getElementById('adventureWorld');if(!world)return;const player=document.getElementById('worldPlayer'),prompt=document.getElementById('worldPrompt'),explore=document.getElementById('worldExplore'),panel=document.getElementById('worldDiscovery'),progress=document.getElementById('worldProgress');let x=50,y=50,near=null;const visited=new Set();const zones={meadow:{name:'Memory Meadow',title:'A meadow full of little eras.',copy:'Every version of you deserves to be remembered: the tiny you, the growing you, the laughing you, and the you who is still figuring things out. Wander through the photo gallery next and revisit the moments that make your story yours.',link:'#moments',label:'VISIT THE PHOTO GALLERY',image:'assets/images/01-childhood.jpg'},arcade:{name:'Pixel Arcade',title:'Silly games. Serious birthday business.',copy:'The arcade is open! Race the clock, pop every balloon, match the birthday symbols and spin the wish machine. Your only mission is to have fun.',link:'#party',label:'ENTER THE ARCADE',image:'assets/images/08-playful-selfie.jpg'},wishwood:{name:'Wishing Woods',title:'A little forest of reminders.',copy:'You do not have to earn your worth. You are allowed to be a work in progress and still be proud of yourself. May you find people who make you feel safe, dreams that make you feel alive, and the courage to keep choosing yourself.',link:'#adventure',label:'COLLECT YOUR FIVE STARS',image:'assets/images/04-lights-and-dreams.jpg'},plaza:{name:'Party Plaza',title:'Surprise! The whole place is here for you.',copy:'The lights are glowing, your birthday crew is waiting, and there is a cake with your name on it. This is your moment, Arushi. Make a wish that is just for you.',link:'#party',label:'GO TO YOUR BIRTHDAY PARTY',image:'assets/images/13-green-moment.jpg'}};function update(){player.style.left=x+'%';player.style.top=y+'%';let best=null,dist=999;document.querySelectorAll('.world-landmark').forEach(el=>{const r=el.getBoundingClientRect(),w=world.getBoundingClientRect(),cx=((r.left+r.width/2-w.left)/w.width)*100,cy=((r.top+r.height/2-w.top)/w.height)*100,d=Math.hypot((cx-x)*.9,cy-y);el.classList.toggle('near',d<16);if(d<dist){dist=d;best=el.dataset.zone}});near=dist<16?best:null;explore.disabled=!near;if(near){prompt.textContent='Press E or EXPLORE: '+zones[near].name;explore.textContent='EXPLORE '+zones[near].name.toUpperCase()}else{prompt.textContent='Explore the map — find a glowing location ✨';explore.textContent='EXPLORE LOCATION'}}function move(dir){const step=4;if(dir==='up')y=Math.max(9,y-step);if(dir==='down')y=Math.min(91,y+step);if(dir==='left')x=Math.max(5,x-step);if(dir==='right')x=Math.min(95,x+step);update()}function openZone(){if(!near)return;const z=zones[near];visited.add(near);document.querySelector(`[data-zone="${near}"]`).classList.add('visited');progress.textContent=visited.size+' / 4 discoveries';panel.innerHTML=`<span class="eyebrow">DISCOVERY UNLOCKED · ${z.name.toUpperCase()}</span><h3>${z.title}</h3><img src="${z.image}" alt="A moment from Arushi's story"><p>${z.copy}</p><a class="game-button" href="${z.link}">${z.label} ↗</a>`;if(visited.size===4){panel.innerHTML+='<p style="margin-top:14px;color:#e7c99a">✦ ALL FOUR LOCATIONS DISCOVERED — THE BIRTHDAY UNIVERSE IS YOURS! ✦</p>';birthdayConfetti()} }document.addEventListener('keydown',e=>{if(!world.matches(':focus')&&!world.contains(document.activeElement))return;const k=e.key.toLowerCase();const dirs={arrowup:'up',w:'up',arrowdown:'down',s:'down',arrowleft:'left',a:'left',arrowright:'right',d:'right'};if(dirs[k]){e.preventDefault();move(dirs[k])}if(k==='e'||k==='enter')openZone()});world.addEventListener('click',e=>{const mark=e.target.closest('.world-landmark');if(mark){const r=mark.getBoundingClientRect(),w=world.getBoundingClientRect();x=((r.left+r.width/2-w.left)/w.width)*100;y=((r.top+r.height/2-w.top)/w.height)*100;update();openZone()}});document.querySelectorAll('[data-move]').forEach(b=>{b.addEventListener('click',()=>{world.focus();move(b.dataset.move)})});explore.addEventListener('click',openZone);world.addEventListener('pointerdown',()=>world.focus());update()})();
