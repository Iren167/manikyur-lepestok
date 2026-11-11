(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};

  // mobile menu
  var burger=$('#burger'),nav=$('#nav');
  burger.addEventListener('click',function(){var o=nav.classList.toggle('open');burger.classList.toggle('on',o);burger.setAttribute('aria-expanded',o)});
  $$('#nav a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');burger.classList.remove('on')})});

  // reveal
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  $$('.reveal').forEach(function(el){io.observe(el)});

  // tabs
  var img=$('#svcImg');
  $$('.tab').forEach(function(t){t.addEventListener('click',function(){
    $$('.tab').forEach(function(x){x.classList.remove('is-on')});t.classList.add('is-on');
    $$('.price').forEach(function(p){p.classList.toggle('is-on',p.dataset.pane===t.dataset.tab)});
    img.style.opacity=0;setTimeout(function(){img.src=t.dataset.img;img.style.opacity=1},250);
  })});

  // falling petals
  var pet=$('.petals');
  if(pet){for(var i=0;i<9;i++){var p=document.createElement('span');p.className='petal';
    p.style.left=(8+Math.random()*80)+'%';p.style.animationDuration=(7+Math.random()*6)+'s';p.style.animationDelay=(-Math.random()*10)+'s';
    p.style.transform='scale('+(.7+Math.random()*.8)+')';pet.appendChild(p)}}

  // shade picker (feature from the Pinterest board: live try-on)
  var shades=[
    {n:'Нюд',c:'#e3b9a4'},{n:'Молочный',c:'#f3e4dc'},{n:'Пыльная роза',c:'#cf9a9a'},
    {n:'Розовый кварц',c:'#e8b4bc'},{n:'Мокко',c:'#9a6b5e'},{n:'Бордо',c:'#7d2f3e'},{n:'Шампань',c:'#dcc09c'},{n:'Коралл',c:'#f08a74'},{n:'Фуксия',c:'#d6407f'},{n:'Лаванда',c:'#b8a2dc'},{n:'Мята',c:'#9fd8c0'},{n:'Небесный',c:'#9cc7ec'}
  ];
  var skin='#f0cdb8',skinD='#e4b79f';
  var NS='http://www.w3.org/2000/svg';
  // fingers: x, y(top), w, h, rotation
  var f=[{x:52,y:150,w:46,h:150,r:-24},{x:108,y:62,w:48,h:210,r:-8},{x:168,y:34,w:50,h:230,r:0},{x:228,y:58,w:48,h:210,r:8},{x:282,y:128,w:42,h:160,r:22}];
  var hand=$('#hand'),svg='<svg viewBox="0 0 380 460" role="img" aria-label="Рука с накрашенными ногтями"><defs><linearGradient id="sk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+skin+'"/><stop offset="1" stop-color="'+skinD+'"/></linearGradient>';
  f.forEach(function(g,i){svg+='<clipPath id="cn'+i+'"><rect x="'+(g.x+5)+'" y="'+(g.y+8)+'" width="'+(g.w-10)+'" height="'+(g.w*1.1)+'" rx="'+(g.w*.3)+'" transform="rotate('+g.r+' '+(g.x+g.w/2)+' '+(g.y+g.h)+')"/></clipPath>'});
  svg+='</defs><path d="M80 300 Q70 420 150 450 L250 450 Q315 420 310 300 Z" fill="url(#sk)"/>';
  f.forEach(function(g,i){var cx=g.x+g.w/2,cy=g.y+g.h;
    svg+='<g transform="rotate('+g.r+' '+cx+' '+cy+')"><rect x="'+g.x+'" y="'+g.y+'" width="'+g.w+'" height="'+(g.h+60)+'" rx="'+(g.w/2)+'" fill="url(#sk)"/></g>'});
  f.forEach(function(g,i){var cx=g.x+g.w/2,cy=g.y+g.h,nw=g.w-10,nh=g.w*1.1;
    svg+='<g transform="rotate('+g.r+' '+cx+' '+cy+')"><rect class="nail" id="n'+i+'" x="'+(g.x+5)+'" y="'+(g.y+8)+'" width="'+nw+'" height="'+nh+'" rx="'+(nw*.35)+'" fill="'+shades[0].c+'"/>'+
         '<rect class="tip" x="'+(g.x+5)+'" y="'+(g.y+8)+'" width="'+nw+'" height="'+(nh*.3)+'" fill="#fffaf7" opacity="0" style="transition:opacity .4s" clip-path="none" data-i="'+i+'"/>'+
         '<rect x="'+(g.x+10)+'" y="'+(g.y+14)+'" width="'+(nw*.22)+'" height="'+(nh*.5)+'" rx="4" fill="#fff" opacity=".35"/></g>'});
  svg+='</svg>';hand.innerHTML=svg;
  // clip tips to nail shape: apply the rounded rect clip inside the rotated group
  $$('.tip',hand).forEach(function(t,i){var g=f[i];t.setAttribute('rx',(g.w-10)*.35)});

  var sw=$('#swatches'),nameEl=$('#shadeName'),fr=$('#french'),cur=shades[2];
  nameEl.textContent=cur.n;$$('.nail',hand).forEach(function(n){n.setAttribute('fill',cur.c)});
  shades.forEach(function(s,i){var b=document.createElement('button');b.className='sw'+(i===2?' on':'');b.style.setProperty('--c',s.c);b.setAttribute('aria-label',s.n);b.title=s.n;
    b.addEventListener('click',function(){cur=s;$$('.sw').forEach(function(x){x.classList.remove('on')});b.classList.add('on');nameEl.textContent=s.n;paint()});sw.appendChild(b)});
  function paint(){
    var french=fr.checked;
    $$('.nail',hand).forEach(function(n){n.setAttribute('fill',french?'#f4d6ca':cur.c)});
    $$('.tip',hand).forEach(function(t){t.setAttribute('fill',cur.c);t.setAttribute('opacity',french?1:0)});
    nameEl.textContent=french?('Французский · '+cur.n):cur.n;
  }
  fr.addEventListener('change',paint);

  // 3D tilt cards
  $$('.card').forEach(function(c){
    c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.transform='rotateY('+(x*14)+'deg) rotateX('+(-y*14)+'deg) translateZ(8px)'});
    c.addEventListener('mouseleave',function(){c.style.transform=''});
  });
  // drag-scroll for cards
  var cs=$('#cards'),down=false,sx=0,sl=0;
  cs.addEventListener('mousedown',function(e){down=true;sx=e.pageX;sl=cs.scrollLeft;cs.style.scrollSnapType='none'});
  window.addEventListener('mouseup',function(){if(down){down=false;cs.style.scrollSnapType=''}});
  window.addEventListener('mousemove',function(e){if(down){cs.scrollLeft=sl-(e.pageX-sx)}});

  // form
  $('#form').addEventListener('submit',function(e){e.preventDefault();
    var t=this.tel.value.replace(/\D/g,'');
    var cb=$('#consent'),cerr=$('#consentErr'),box=cb.closest('.consent');
    if(!this.name.value.trim()||t.length<10){this.tel.focus();this.tel.style.borderColor='#a33';return}
    if(!cb.checked){cerr.hidden=false;box.classList.add('is-bad');cb.focus();return}
    cerr.hidden=true;box.classList.remove('is-bad');
    this.tel.style.borderColor='';$('#ok').hidden=false;this.reset();
  });
})();
