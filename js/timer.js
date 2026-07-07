/* Lesson Timer (countdown) */
(function(){
  const clock=document.getElementById("clock"),mins=document.getElementById("mins");
  const start=document.getElementById("start"),pause=document.getElementById("pause"),reset=document.getElementById("reset");
  let total=600,left=600,id=null;
  function fmt(s){const m=Math.floor(s/60),sec=s%60;return m+":"+String(sec).padStart(2,"0");}
  function paint(){clock.textContent=fmt(left);}
  function tick(){if(left<=0){clearInterval(id);id=null;clock.textContent="0:00";window.DailyTools&&window.DailyTools.showToast("Time's up");return;}left--;paint();}
  function setTotal(){total=Math.max(1,parseInt(mins.value,10)||1)*60;left=total;paint();}
  start.addEventListener("click",()=>{if(!id){if(left<=0)setTotal();id=setInterval(tick,1000);}});
  pause.addEventListener("click",()=>{clearInterval(id);id=null;});
  reset.addEventListener("click",()=>{clearInterval(id);id=null;setTotal();});
  mins.addEventListener("change",()=>{clearInterval(id);id=null;setTotal();});
  setTotal();
})();