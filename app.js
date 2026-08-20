const MONTHS=["Muharram","Safar","Rabi al-Awwal","Rabi al-Thani","Jumada al-Ula","Jumada al-Thaniyah","Rajab","Sha'ban","Ramadan","Shawwal","Dhu al-Qi'dah","Dhu al-Hijjah"];
const offsetEl=document.getElementById("offset"), offsetLabel=document.getElementById("offsetLabel");
offsetEl.value=localStorage.getItem("hijriOffset")||0;
function baseline(date){const jd=Math.floor(date.getTime()/86400000)+2440587.5,l=Math.floor(jd-1948439.5+10632),n=Math.floor((l-1)/10631),ll=l-10631*n+354,j=Math.floor((10985-ll)/5316)*Math.floor(50*ll/17719)+Math.floor(ll/5670)*Math.floor(43*ll/15238),l2=ll-Math.floor((30-j)/15)*Math.floor(17719*j/50)-Math.floor(j/16)*Math.floor(15238*j/43)+29,m=Math.floor(24*l2/709),d=l2-Math.floor(709*m/24),y=30*n+j-30;return{y,m,d}}
function adjFromBase(x){let d=x.d+ +offsetEl.value,m=x.m,y=x.y;while(d>30){d-=30;m++;if(m>12){m=1;y++}}while(d<1){m--;if(m<1){m=12;y--}d+=30}return{y,m,d}}
function hijri(date){return adjFromBase(baseline(date))}
function key(h){return `${h.d}-${h.m}`}
const special={
"1-1":"1 Muharram","3-1":"3 Muharram","7-1":"7 Muharram",
"17-3":"17 Rabi al-Awwal — birthday of the Prophet (peace be upon him)",
"15-5":"15 Jumada al-Ula","27-7":"27 Rajab — al-Mab'ath",
"25-11":"25 Dhu al-Qi'dah","29-11":"29 Dhu al-Qi'dah",
"18-12":"18 Dhu al-Hijjah — Eid al-Ghadir","24-12":"24 Dhu al-Hijjah — Day of Mubahalah"
};
function reason(h){
 if((h.m===1&&[1,3,7].includes(h.d))||special[key(h)]) return special[key(h)];
 if(h.m===3&&h.d===17)return special["17-3"];
 if(h.m===5&&h.d===15)return special["15-5"];
 if(h.m===7&&h.d===27)return special["27-7"];
 if(h.m===10&&h.d>=4&&h.d<=9)return `${h.d} Shawwal`;
 if(h.m===12&&h.d>=1&&h.d<=9)return h.d===9?"9 Dhu al-Hijjah — Day of Arafah (fasting is disapproved if it prevents reciting its supplications)":`${h.d} Dhu al-Hijjah`;
 if(h.m===12&&[18,24].includes(h.d))return special[key(h)];
 if([13,14,15].includes(h.d))return `${h.d} ${MONTHS[h.m-1]} — Ayyam al-Bid`;
 if(h.m===7||h.m===8)return `Any day of ${MONTHS[h.m-1]} is recommended`;
 return null;
}
function recurringExplanation(date){
 const day=date.getDay(); // Sun 0, Thu 4
 // Need the Hijri day of the date to identify first/last Thursday and first Wed after 10.
 const h=hijri(date);
 if(day===4 && h.d<=7) return "First Thursday of the Hijri month";
 if(day===4 && h.d>=23) return "Last Thursday of the Hijri month";
 if(day===3 && h.d>=11 && h.d<=17) return "First Wednesday after the 10th of the Hijri month";
 return null;
}
function reasonAll(date){
 const h=hijri(date);
 const r=reason(h);
 const rr=recurringExplanation(date);
 return [r,rr].filter(Boolean);
}
function render(){
 const h=hijri(new Date()), reasons=reasonAll(new Date());
 document.getElementById("todayHijri").textContent=`${h.d} ${MONTHS[h.m-1]} ${h.y}`;
 document.getElementById("todayStatus").innerHTML=reasons.length?`<span class="must">Mustahabb fast</span><div class="small">${reasons.join(" · ")}</div>`:`<div class="small">No specially emphasized day listed for today.</div>`;
 let next=null;
 for(let i=1;i<=370;i++){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+i);const rs=reasonAll(d);if(rs.length){next={d,h:hijri(d),rs};break}}
 document.getElementById("nextFast").textContent=next?`${next.h.d} ${MONTHS[next.h.m-1]} — ${next.rs[0]}`:"No upcoming fast found.";
 document.getElementById("ruleText").textContent=reasons.length?reasons.join(" · "):"Ruling 1716: fasting on any day is recommended apart from unlawful/disapproved days; some days are emphasized more.";
}
function setOffset(v){localStorage.setItem("hijriOffset",v);offsetLabel.textContent=(v>0?"+":"")+v+" day"+(Math.abs(v)==1?"":"s");render()}
offsetEl.addEventListener("input",e=>setOffset(+e.target.value));setOffset(+offsetEl.value);
document.getElementById("notifyBtn").addEventListener("click",async()=>{if(!("Notification"in window)){alert("Please add Siyam to your iPhone Home Screen first.");return}const p=await Notification.requestPermission();alert(p==="granted"?"Notifications are allowed. Scheduled push reminders are the next build.":"Notifications were not enabled.")});
