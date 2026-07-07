/* Base64 encode / decode (UTF-8 safe) */
(function(){
  const i=document.getElementById("in"), o=document.getElementById("out");
  const toB64=s=>{const bytes=new TextEncoder().encode(s);let bin="";bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin);};
  const fromB64=s=>{const bin=atob(s);const bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));return new TextDecoder().decode(bytes);};
  document.getElementById("enc").addEventListener("click",()=>{try{o.textContent=toB64(i.value);}catch(e){o.textContent="Error: "+e.message;}});
  document.getElementById("dec").addEventListener("click",()=>{try{o.textContent=fromB64(i.value.trim());}catch(e){o.textContent="Invalid Base64.";}});
})();