/* CSS Minifier */
(function(){
  const i=document.getElementById("in"),o=document.getElementById("out");
  function min(css){
    return css
      .replace(/\/\*[^]*?\*\//g,"")      // comments
      .replace(/\s*([{}:;,>])\s*/g,"$1")  // ws around tokens
      .replace(/\s+/g," ")                  // runs of ws
      .replace(/;\}/g,"}")                  // last semicolon
      .trim();
  }
  document.getElementById("min").addEventListener("click",()=>o.textContent=min(i.value));
  i.addEventListener("input",()=>o.textContent=i.value.trim()?min(i.value):"");
})();