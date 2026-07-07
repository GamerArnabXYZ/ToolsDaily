/* Attendance Tracker */
(function(){
  const name=document.getElementById("name"),list=document.getElementById("list");
  function render(){
    const rows=[...list.children];let p=0,a=0;
    rows.forEach(r=>{r.querySelector(".mark").textContent=== "P"?p++:a++;});
    const tot=p+a;
    document.getElementById("present").textContent=p;
    document.getElementById("absent").textContent=a;
    document.getElementById("rate").textContent=tot?Math.round(p/tot*100)+"%":"—";
  }
  function add(nm){
    const d=document.createElement("div");
    d.style.cssText="display:flex;gap:8px;align-items:center;";
    d.innerHTML='<span style="flex:1;font-size:14px;">'+nm+'</span><button class="mark btn-copy" type="button" style="height:28px;">P</button><button class="del btn-copy" type="button" style="height:28px;color:var(--error,#ee0000);">✕</button>';
    const mk=d.querySelector(".mark");
    mk.addEventListener("click",()=>{mk.textContent= mk.textContent==="P"?"A":"P";mk.style.color= mk.textContent==="P"?"var(--ink)":"var(--error,#ee0000)";render();});
    d.querySelector(".del").addEventListener("click",()=>{d.remove();render();});
    list.appendChild(d);render();
  }
  name.addEventListener("keydown",e=>{if(e.key==="Enter"&&name.value.trim()){add(name.value.trim());name.value="";}});
  document.getElementById("clear").addEventListener("click",()=>{list.innerHTML="";render();});
  ["Ava","Ben","Cleo"].forEach(add);
})();