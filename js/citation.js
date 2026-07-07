/* Citation Builder */
(function(){
  const f={author:"c-author",title:"c-title",year:"c-year",pub:"c-pub",url:"c-url",style:"c-style"};
  const out=document.getElementById("cite-out");
  function val(k){return document.getElementById(f[k]).value.trim();}
  function build(){
    const a=val("author"),t=val("title"),y=val("year"),p=val("pub"),u=val("url"),s=document.getElementById(f.style).value;
    if(!t&&!a){out.textContent="";return;}
    let c;
    if(s==="apa") c=(a?a+". ":"")+(y?"("+y+"). ":"")+(t?"\""+t+"\". ":"")+(p?p+". ":"")+(u?u:"")+(u? ".":"");
    else if(s==="mla") c=(a?a+". ":"")+(t?"\""+t+"\". ":"")+(p?(p+", "):"")+(y?y+".":"");
    else c=(a?a+". ":"")+(t?"\""+t+"\". ":"")+(p?p+": ":"")+(y?y+".":"");
    out.textContent=c.trim();
  }
  Object.values(f).forEach(k=>document.getElementById(k).addEventListener("input",build));
  build();
})();