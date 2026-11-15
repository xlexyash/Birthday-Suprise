(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const scenes = $$(".scene");
  let currentScene = 0, musicOn = false, photoIndex = 0, toastTimer, fadeTimer;
  const audio = $("#bgMusic"), musicButton = $("#musicToggle");
  audio.volume = 0;
  function fadeAudio(target, pauseAfter=false) {
    clearInterval(fadeTimer);
    const start = audio.volume, steps = 16, delta = (target-start)/steps;
    let step = 0;
    fadeTimer = setInterval(() => { step++; audio.volume = Math.max(0,Math.min(1,start+delta*step)); if(step>=steps){clearInterval(fadeTimer);audio.volume=target;if(pauseAfter)audio.pause();} }, 35);
  }
  const toast = (message) => { toast.textContent = message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(()=>toast.classList.remove("show"),2400); };
  function showScene(index) {
    currentScene = Math.max(0, Math.min(4,index));
    scenes.forEach((scene,i)=>{scene.classList.toggle("active",i===currentScene);scene.setAttribute("aria-hidden",i===currentScene?"false":"true");});
    window.scrollTo({top:0,behavior:"smooth"});
    if(currentScene===4) fireworks(95);
  }
  function toggleMusic(force) {
    const want = typeof force === "boolean" ? force : !musicOn;
    if(want) {
      audio.play().then(()=>{musicOn=true;fadeAudio(.82);musicButton.innerHTML='♫ <span>Music on</span>';}).catch(()=>{musicOn=false;musicButton.innerHTML='♫ <span>Music off</span>';toast("Music couldn't start. Tap the music button to try again.");});
    } else { musicOn=false;fadeAudio(0,true);musicButton.innerHTML='♫ <span>Music off</span>'; }
  }
  $("#openSurprise").addEventListener("click",()=>{toggleMusic(true);burst(innerWidth/2,innerHeight/2,90);showScene(1);});
  musicButton.addEventListener("click",()=>toggleMusic());
  $$(".next-scene").forEach(button=>button.addEventListener("click",()=>showScene(currentScene+1)));
  $("#replayButton").addEventListener("click",()=>showScene(0));

  // Photo viewer with keyboard and touch-friendly controls.
  const photoPaths=["assets/dua-main.jpg","assets/dua-detail-1.jpg","assets/dua-detail-2.jpg","assets/dua-detail-3.jpg"];
  const lightbox=$("#lightbox"), lightboxImage=$("#lightboxImage");
  function openPhoto(i){photoIndex=(i+4)%4;lightboxImage.src=photoPaths[photoIndex];lightbox.classList.add("show");}
  function closePhoto(){lightbox.classList.remove("show");}
  $$(".photo-open").forEach(btn=>btn.addEventListener("click",()=>openPhoto(Number(btn.dataset.photo))));
  $("#lightboxClose").addEventListener("click",closePhoto);
  $("#photoPrev").addEventListener("click",()=>openPhoto(photoIndex-1));
  $("#photoNext").addEventListener("click",()=>openPhoto(photoIndex+1));
  lightbox.addEventListener("click",e=>{if(e.target===lightbox)closePhoto();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closePhoto();if(lightbox.classList.contains("show")&&e.key==="ArrowRight")openPhoto(photoIndex+1);if(lightbox.classList.contains("show")&&e.key==="ArrowLeft")openPhoto(photoIndex-1);});

  // Small WebAudio-generated effects avoid external sound dependencies.
  let soundCtx;
  function tone(freq=500,duration=.12,type="sine",volume=.06){try{soundCtx ||= new (window.AudioContext||window.webkitAudioContext)();if(soundCtx.state==="suspended")soundCtx.resume();const o=soundCtx.createOscillator(),g=soundCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(volume,soundCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,soundCtx.currentTime+duration);o.connect(g);g.connect(soundCtx.destination);o.start();o.stop(soundCtx.currentTime+duration);}catch(_){}}
  function popSound(){tone(180,.09,"triangle",.1);setTimeout(()=>tone(90,.12,"sine",.06),35);}

  // Canvas particles / confetti / fireworks.
  const canvas=$("#effects"),ctx=canvas.getContext("2d");let W=0,H=0,particles=[];
  function resize(){W=canvas.width=Math.round(innerWidth*devicePixelRatio);H=canvas.height=Math.round(innerHeight*devicePixelRatio);canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);}
  addEventListener("resize",resize,{passive:true});resize();
  const palette=["#f5d58e","#f3a8c6","#c7a7f4","#fff1dc","#91c8e7","#e77c91"];
  function burst(x,y,count=45,firework=false){for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=(firework?2.5:1.2)+Math.random()*(firework?5:4);particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-(firework?1:0),life:50+Math.random()*40,max:90,size:1.5+Math.random()*3,color:palette[Math.floor(Math.random()*palette.length)],gravity:firework?.045:.09,shape:Math.random()>.5?"dot":"rect"});}}
  function fireworks(count=6){for(let i=0;i<count;i++)setTimeout(()=>burst(innerWidth*(.15+Math.random()*.7),innerHeight*(.15+Math.random()*.45),35,true),i*100);}
  function animate(){ctx.clearRect(0,0,innerWidth,innerHeight);particles=particles.filter(p=>p.life>0);for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=p.gravity;p.vx*=.99;p.life--;ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.color;if(p.shape==="rect"){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.life*.08);ctx.fillRect(0,0,p.size*1.7,p.size*.8);ctx.restore();}else{ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();}}ctx.globalAlpha=1;requestAnimationFrame(animate);}animate();
  // Ambient tiny stars.
  for(let i=0;i<36;i++){const x=Math.random()*innerWidth,y=Math.random()*innerHeight;particles.push({x,y,vx:(Math.random()-.5)*.08,vy:-.03,life:300+Math.random()*500,max:800,size:.5+Math.random()*1.3,color:"#f4dcae",gravity:0,shape:"dot"});}

  // Cake itself is the touch target.
  let cakeCut=false;
  $("#cakeButton").addEventListener("click",e=>{if(cakeCut)return;cakeCut=true;e.currentTarget.classList.add("cut");$$(".candle b",e.currentTarget).forEach(flame=>flame.style.opacity="0");$("#cakeHint").textContent="A little slice of birthday magic!";$("#cakeResult").textContent="You did it! Happy Birthday Dua! ♡";burst(innerWidth/2,innerHeight*.48,85);tone(660,.16);setTimeout(()=>tone(880,.22),140);});

  // Five independent balloon interactions.
  const balloons=$$(".balloon");let popped=0;
  balloons.forEach(balloon=>balloon.addEventListener("click",()=>{if(balloon.classList.contains("popped"))return;balloon.classList.add("popped");popped++;const r=balloon.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,22);popSound();$("#balloonCount").textContent=popped===5?"All five wishes are on their way! ✨":`${5-popped} wishes still floating in the air`;if(popped===5){setTimeout(()=>{fireworks(8);toast("Every wish deserves a little magic! ✨");},350);}}));

  // Gift box.
  let giftOpened=false;
  $("#giftButton").addEventListener("click",e=>{if(giftOpened)return;giftOpened=true;e.currentTarget.classList.add("open");burst(innerWidth/2,innerHeight*.6,55);$("#giftMessage").textContent="You deserve all the happiness in the world. Keep shining, Dua. ♡";tone(520,.2);});

  // Tap-to-blow candles; optional microphone is deliberately not requested automatically.
  let blown=false;
  function blow(){if(blown)return;blown=true;$(".wish-card").classList.add("blown");$("#wishResult").textContent="Wish sent into the universe. ✨";burst(innerWidth/2,innerHeight*.55,55);tone(740,.12);setTimeout(()=>tone(990,.2),100);}
  $("#blowButton").addEventListener("click",blow);

  // Envelope opens and reveals the full letter.
  let letterOpened=false;
  $("#letterButton").addEventListener("click",e=>{if(letterOpened)return;letterOpened=true;e.currentTarget.classList.add("open");$("#letterFull").classList.add("show");$("#letterHint").textContent="A little love, folded just for you. ♡";tone(420,.15);});

  $("#finalWish").addEventListener("click",()=>{fireworks(28);burst(innerWidth/2,innerHeight*.45,180);toast("May every wish find its way to you, Dua. ♡");});
  // Touch gestures are native; prevent double-tap zoom on the tactile party controls.
  $$(".cake-button,.balloon,.gift-button,.envelope").forEach(el=>el.style.touchAction="manipulation");
})();