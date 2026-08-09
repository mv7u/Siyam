// Siyam v0.1 — personal prototype
// Fasting rules: Sayyid al-Sistani, Ruling 1716.
// Hijri conversion is intentionally kept separate so the user-adjustable offset can be applied.

const HIJRI_MONTHS=["Muharram","Safar","Rabi al-Awwal","Rabi al-Thani","Jumada al-Ula","Jumada al-Thaniyah","Rajab","Sha'ban","Ramadan","Shawwal","Dhu al-Qi'dah","Dhu al-Hijjah"];
const special={
  "1-1":"Muharram 1","3-1":"Muharram 3","7-1":"Muharram 7",
  "17-3":"Prophet's birthday — 17 Rabi al-Awwal",
  "15-5":"15 Jumada al-Ula","27-7":"Mab'ath — 27 Rajab",
  "4-10":"4 Shawwal","5-10":"5 Shawwal","6-10":"6 Shawwal","7-10":"7 Shawwal","8-10":"8 Shawwal","9-10":"9 Shawwal",
  "25-11":"25 Dhu al-Qi'dah","29-11":"29 Dhu al-Qi'dah",
  "1-12":"1 Dhu al-Hijjah","2-12":"2 Dhu al-Hijjah","3-12":"3 Dhu al-Hijjah","4-12":"4 Dhu al-Hijjah","5-12":"5 Dhu al-Hijjah","6-12":"6 Dhu al-Hijjah","7-12":"7 Dhu al-Hijjah","8-12":"8 Dhu al-Hijjah","9-12":"Day of Arafah — 9 Dhu al-Hijjah",
  "18-12":"Eid al-Ghadir — 18 Dhu al-Hijjah","24-12":"Mubahalah — 24 Dhu al-Hijjah"
};
const offsetEl=document.getElementById("offset"), offsetLabel=document.getElementById("offsetLabel");
offsetEl.value=localStorage.getItem("hijriOffset")||0;
function setOffset(v){localStorage.setItem("hijriOffset",v); offsetLabel.textContent=(v>0?"+":"")+v+" day"+(Math.abs(v)==1?"":"s"); render();}
offsetEl.addEventListener("input",e=>setOffset(+e.target.value)); setOffset(+offsetEl.value);

function gregorianToHijri(date){
  // Tabular Islamic calendar conversion, used only as the baseline.
  const jd=Math.floor(date.getTime()/86400000)+2440587.5;
  const l=Math.floor(jd-1948439.5+10632);
  const n=Math.floor((l-1)/10631);
  const ll=l-10631*n+354;
  const j=Math.floor((10985-ll)/5316)*Math.floor(50*ll/17719)+Math.floor(ll/5670)*Math.floor(43*ll/15238);
  const ll2=ll-Math.floor((30-j)/15)*Math.floor(17719*j/50)-Math.floor(j/16)*Math.floor(15238*j/43)+29;
  const m=Math.floor(24*ll2/709);
  const d=ll2-Math.floor(709*m/24);
  const y=30*n+j-30;
  return {y,m,d};
}
function adjustedHijri(){
  const x=gregorianToHijri(new Date());
  let d=x.d + +offsetEl.value, m=x.m, y=x.y;
  while(d<1){m--;if(m<1){m=12;y--} d+=30;}
  while(d>30){d-=30;m++;if(m>12){m=1;y++}}
  return {y,m,d};
}
function isRecommended(h){
  if([1,3,7].includes(h.d)&&h.m===1) return special[`${h.d}-${h.m}`];
  if(h.d===17&&h.m===3) return special["17-3"];
  if(h.d===15&&h.m===5) return special["15-5"];
  if(h.d===27&&h.m===7) return special["27-7"];
  if(h.m===10&&h.d>=4&&h.d<=9) return special[`${h.d}-10`];
  if([25,29].includes(h.d)&&h.m===11) return special[`${h.d}-${h.m}`];
  if(h.m===12&&h.d<=9) return special[`${h.d}-12`];
  if((h.d===18||h.d===24)&&h.m===12) return special[`${h.d}-${h.m}`];
  if([13,14,15].includes(h.d)) return `Ayyam al-Bid — ${h.d} ${HIJRI_MONTHS[h.m-1]}`;
  if(h.m===7||h.m===8) return `Recommended fasting — ${HIJRI_MONTHS[h.m-1]}`;
  return null;
}
function render(){
  const h=adjustedHijri();
  document.getElementById("todayHijri").textContent=`${h.d} ${HIJRI_MONTHS[h.m-1]} ${h.y}`;
  const reason=isRecommended(h);
  document.getElementById("todayStatus").innerHTML=reason?`<span class="must">Mustahabb fast</span><div class="small">${reason}</div>`:`<div class="small">No specially emphasized fast today.</div>`;
  let next=null;
  for(let i=1;i<=370;i++){
    const dt=new Date();dt.setDate(dt.getDate()+i);
    const base=gregorianToHijri(dt);
    let hh={...base}; let dd=hh.d + +offsetEl.value, mm=hh.m, yy=hh.y;
    while(dd>30){dd-=30;mm++;if(mm>12){mm=1;yy++}} while(dd<1){mm--;if(mm<1){mm=12;yy--}dd+=30}
    const r=isRecommended({y:yy,m:mm,d:dd});
    if(r){next={i,dt,h:{y:yy,m:mm,d:dd},r};break}
  }
  document.getElementById("nextFast").textContent=next?`${next.h.d} ${HIJRI_MONTHS[next.h.m-1]} — ${next.r}`:"No upcoming fast found.";
}
document.getElementById("notifyBtn").addEventListener("click",async()=>{
  if(!("Notification" in window)){alert("Notifications are not supported here. Add Siyam to your Home Screen first.");return;}
  const p=await Notification.requestPermission();
  if(p==="granted"){alert("Notifications enabled. The push-notification server will be connected in the next build.");}
  else alert("Notifications were not enabled.");
});
render();
