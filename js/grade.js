/* Grade Calculator — weighted average */
(function(){
  const rows=document.getElementById("rows");
  const totalEl=document.getElementById("total");
  const bd=document.getElementById("breakdown");
  function row(){
    const d=document.createElement("div");
    d.style.cssText="display:grid;grid-template-columns:1fr 80px 80px;gap:8px;align-items:center;";
    d.innerHTML='<input class="g-name" placeholder="Assignment" /><input class="g-score" type="number" min="0" max="100" placeholder="%" /><input class="g-weight" type="number" min="0" step="any" placeholder="wt" />';
    rows.appendChild(d);
  }
  function calc(){
    let wsum=0,acc=0,n=0;
    rows.querySelectorAll("div").forEach(r=>{
      const s=parseFloat(r.querySelector(".g-score").value);
      const w=parseFloat(r.querySelector(".g-weight").value);
      if(!isNaN(s)&&!isNaN(w)&&w>0){acc+=s*w;wsum+=w;n++;}
    });
    if(n===0||wsum===0){totalEl.textContent="—";bd.textContent="";return;}
    const pct=acc/wsum;
    totalEl.textContent=pct.toFixed(1)+"%";
    bd.textContent=Math.round(pct)+" / 100 · "+n+" weighted item"+(n>1?"s":"");
  }
  document.getElementById("add").addEventListener("click",()=>{row();calc();});
  rows.addEventListener("input",calc);
  for(let i=0;i<3;i++) row();
  calc();
})();