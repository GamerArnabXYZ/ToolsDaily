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
    const nameEl=document.createElement("span");
    nameEl.style.cssText="flex:1;font-size:14px;";
    nameEl.textContent=nm;
    const mk=document.createElement("button");
    mk.type="button";
    mk.className="mark btn-copy";
    mk.style.height="28px";
    mk.textContent="P";
    const del=document.createElement("button");
    del.type="button";
    del.className="del btn-copy";
    del.style.height="28px";
    del.style.color="var(--error,#ee0000)";
    del.textContent="✕";
    d.append(nameEl,mk,del);
    mk.addEventListener("click",()=>{mk.textContent= mk.textContent==="P"?"A":"P";mk.style.color= mk.textContent==="P"?"var(--ink)":"var(--error,#ee0000)";render();});
    del.addEventListener("click",()=>{d.remove();render();});
    list.appendChild(d);render();
  }
  name.addEventListener("keydown",e=>{if(e.key==="Enter"&&name.value.trim()){add(name.value.trim());name.value="";}});
  document.getElementById("clear").addEventListener("click",()=>{list.innerHTML="";render();});
  ["Ava","Ben","Cleo"].forEach(add);
})();