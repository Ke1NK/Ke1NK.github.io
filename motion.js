(function(){
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var css=document.createElement("style");
css.textContent=".hero{position:relative;isolation:isolate}"+
".orb{position:absolute;border-radius:50%;filter:blur(60px);opacity:.55;z-index:-1;pointer-events:none;will-change:transform}"+
".orb.o1{width:340px;height:340px;background:var(--accent-soft);top:-40px;left:-80px}"+
".orb.o2{width:260px;height:260px;background:color-mix(in srgb,var(--accent) 22%,transparent);top:120px;right:-60px}"+
".portrait,.hero>div{will-change:transform}"+
".rv{transition:transform .7s cubic-bezier(.2,.8,.2,1),opacity .7s ease}"+
".rv.pre{transform:translateY(18px);opacity:.55}"+
".kpi b,.case .num{display:inline-block}";
document.head.appendChild(css);
var hero=document.querySelector(".hero");
if(hero&&!reduce){["o1","o2"].forEach(function(c){var o=document.createElement("i");o.className="orb "+c;hero.appendChild(o);});}

function parse(t){var m=t.match(/^([^\d]*)([\d.,]+)(.*)$/);if(!m)return null;return{p:m[1],n:parseFloat(m[2].replace(/,/g,"")),s:m[3],d:(m[2].split(".")[1]||"").length,c:m[2].indexOf(",")>-1};}
function fmt(v,o){var x=v.toFixed(o.d);if(o.c)x=Number(x).toLocaleString("en-US");return o.p+x+o.s;}
function count(el){if(el.dataset.done)return;el.dataset.done="1";var t=el.textContent,o=parse(t);if(!o||reduce)return;
  el.style.minWidth=el.offsetWidth+"px";var t0=null,dur=1600;
  function step(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/dur),e=1-Math.pow(2,-10*k);el.textContent=fmt(o.n*(k<1?e:1),o);if(k<1)requestAnimationFrame(step);else el.textContent=t;}
  el.textContent=fmt(0,o);requestAnimationFrame(step);}

var io="IntersectionObserver" in window?new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;
  if(el.classList.contains("rv"))el.classList.remove("pre");else count(el);io.unobserve(el);});},{threshold:.35}):null;

function scan(){if(!io)return;
  document.querySelectorAll(".kpi b,.case .num").forEach(function(el){if(!el.dataset.seen){el.dataset.seen="1";io.observe(el);}});
  if(reduce)return;
  document.querySelectorAll(".case,.role,.fact,.skills>div").forEach(function(el){if(el.dataset.rvs)return;el.dataset.rvs="1";
    var r=el.getBoundingClientRect();if(r.top>innerHeight*.9){el.classList.add("rv","pre");io.observe(el);}});}
scan();
new MutationObserver(scan).observe(document.querySelector("main")||document.body,{childList:true,subtree:true});

if(!reduce){var por=document.querySelector(".portrait"),txt=document.querySelector(".hero>div"),orbs=document.querySelectorAll(".orb"),tick=false;
  function par(){tick=false;var y=Math.min(scrollY,900);
    if(por)por.style.transform="translateY("+(y*.12)+"px) scale("+(1-y*.00012)+")";
    if(txt)txt.style.transform="translateY("+(y*.06)+"px)";
    orbs.forEach(function(o,i){o.style.transform="translate("+(i?-1:1)*y*.08+"px,"+(y*(i?.35:.22))+"px)";});}
  addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(par);}},{passive:true});par();}
})();
