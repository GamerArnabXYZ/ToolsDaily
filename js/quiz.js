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
      if(i>=qs.length){
        const done=document.createElement("p");
        done.style.cssText="font-size:20px;font-weight:600;";
        done.textContent="Done — "+right+"/"+qs.length+" correct.";
        playArea.innerHTML="";
        playArea.appendChild(done);
        return;
      }
      const item=qs[i];const opts=[item.a,item.wrong].filter(Boolean).sort(()=>Math.random()-0.5);
      playArea.innerHTML="";
      const q=document.createElement("p");
      q.style.fontWeight="600";
      q.textContent=(i+1)+". "+item.q;
      playArea.appendChild(q);
      opts.forEach(o=>{
        const b=document.createElement("button");
        b.type="button";
        b.className="opt btn-copy";
        b.style.cssText="display:block;width:100%;text-align:left;margin-top:8px;";
        b.textContent=o;
        b.addEventListener("click",()=>{
          if(b.textContent===item.a){right++;b.style.color="var(--link,#0070f3)";}
          else{b.style.color="var(--error,#ee0000)";}
          playArea.querySelectorAll(".opt").forEach(x=>x.disabled=true);
          i++;setTimeout(show,450);
        });
        playArea.appendChild(b);
      });
    }
    show();
  }
  document.getElementById("addq").addEventListener("click",()=>{q();});
  document.getElementById("play").addEventListener("click",start);
  q();q();
})();