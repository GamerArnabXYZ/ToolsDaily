/* Tip Calculator */
(function(){
  const bill=document.getElementById("bill"),pct=document.getElementById("pct"),people=document.getElementById("people");
  const pp=document.getElementById("pp"),tipAmt=document.getElementById("tip-amt"),totalAmt=document.getElementById("total-amt");
  function calc(){const b=parseFloat(bill.value)||0,p=parseFloat(pct.value)||0,n=Math.max(1,parseInt(people.value,10)||1);const tip=b*p/100,total=b+tip;
    tipAmt.textContent="$"+tip.toFixed(2);totalAmt.textContent="$"+total.toFixed(2);pp.textContent="$"+(total/n).toFixed(2);}
  [bill,pct,people].forEach(e=>e.addEventListener("input",calc));calc();
})();