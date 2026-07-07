/* Rubric Scorer — weighted 0-100 criteria */
(function(){
  const rows=document.getElementById("rows"),total=document.getElementById("total"),info=document.getElementById("info");
  function row(){const d=document.createElement("div");d.style.cssText="display:grid;grid-template-columns:1fr 90px 70px;gap:8px;align-items:center;";
    d.innerHTML='<input class="r-name" placeholder="Criterion"/><input class="r-weight" type="number" min="0" step="any" placeholder="wt"/><input class="r-score" type="number" min="0" max="100" placeholder="0-100"/>';rows.appendChild(d);}
  function calc(){let w=0,acc=0,n=0;rows.querySelectorAll("div").forEach(r=>{const s=parseFloat(r.querySelector(".r-score").value),wt=parseFloat(r.querySelector(".r-weight").value);if(!isNaN(s)&&!isNaN(wt)&&wt>0){acc+=s*wt;w+=wt;n++;}});if(n===0||w===0){total.textContent="—";info.textContent="";return;}const pct=acc/w;total.textContent=Math.round(pct)+" / 100";info.textContent=n+" criterion · "+Math.round(w)+" total weight";}
  document.getElementById("add").addEventListener("click",()=>{row();calc();});
  rows.addEventListener("input",calc);
  [["Content",2,0],["Clarity",1,0],["Originality",1,0]].forEach(([nm,wt])=>{row();const r=rows.lastElementChild;r.querySelector(".r-name").value=nm;r.querySelector(".r-weight").value=wt;});
  calc();
})();