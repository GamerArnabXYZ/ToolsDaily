/* Quiz Maker — build MCQ, auto-grade */
(function(){
  const builder=document.getElementById("builder"),playArea=document.getElementById("play-area"),score=document.getElementById("score");
  function q(){const d=document.createElement("div");d.style.cssText="border:1px solid var(--hairline);border-radius:8px;padding:12px;display:grid;gap:8px;";
    d.innerHTML='<input class="q-text" placeholder="Question"/><input class="q-ans" placeholder="Correct answer"/><input class="q-wrong" placeholder="Other option"/>';
    builder.appendChild(d);}
  function start(){
    const qs=[...builder.children].map(d=>({q:d.querySelector(".q-text").value.trim(),a:d.querySelector(".q-ans").value.trim(),wrong:d.querySelector(".q-wrong").value.trim()})).filter(x=>x.q&&x.a);
    if(!qs.length){playArea.innerHTML='<p class="body-sm" style="color:var(--mute);">Add at least one complete question.</p>';return;}
    let i=0,right=0;
    function show(){
      score.textContent="";
      if(i>=qs.length){playArea.innerHTML='<p style="font-size:20px;font-weight:600;">Done — '+right+'/'+qs.length+' correct.</p>';return;}
      const item=qs[i];const opts=[item.a,item.wrong].filter(Boolean).sort(()=>Math.random()-0.5);
      const html='<p style="font-weight:600;">'+(i+1)+'. '+item.q+'</p>'+opts.map(o=>'<button class="opt btn-copy" type="button" style="display:block;width:100%;text-align:left;margin-top:8px;">'+o+'</button>').join("");
      playArea.innerHTML=html;
      playArea.querySelectorAll(".opt").forEach(b=>b.addEventListener("click",()=>{if(b.textContent===item.a){right++;b.style.color="var(--link,#0070f3)";}else{b.style.color="var(--error,#ee0000)";}playArea.querySelectorAll(".opt").forEach(x=>x.disabled=true);i++;setTimeout(show,450);}));
    }
    show();
  }
  document.getElementById("addq").addEventListener("click",()=>{q();});
  document.getElementById("play").addEventListener("click",start);
  q();q();
})();