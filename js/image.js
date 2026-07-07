/* Image -> Base64 + metadata (local only) */
(function(){
  const file=document.getElementById("file"),out=document.getElementById("out"),meta=document.getElementById("meta");
  file.addEventListener("change",()=>{
    const f=file.files[0];if(!f){out.textContent="";meta.textContent="";return;}
    meta.textContent="Name: "+f.name+"\nType: "+f.type+"\nSize: "+(f.size/1024).toFixed(1)+" KB";
    const r=new FileReader();
    r.onload=()=>{const durl=r.result;out.textContent=durl.slice(0,2000)+(durl.length>2000?"\n…("+durl.length+" chars total)":"");window.__img=f;};
    r.readAsDataURL(f);
  });
})();