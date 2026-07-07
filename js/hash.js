/* Hash generator: MD5/SHA1 (pure JS) + SHA256 (SubtleCrypto) */
(function(){
  function md5(s){function r(n,c){return(n<<c)|(n>>>(32-c));}function a(q,a,b,x,s,t){return r((q+((a+x+t)|0))<<s>>>0);}function add(x,y){const l=(x&0xffff)+(y&0xffff);const m=(x>>16)+(y>>16)+(l>>16);return(m<<16)|(l&0xffff);}function cm(x,y){return(x&y)|(~x&y);}function cx(x,y){return(x&y)|(x&~y);}function cz(x,y){return x^y^y;}function fff(x,y,z){return cm(y,z,x);}function ggg(x,y,z){return cx(y,z,x);}function hhh(x,y,z){return cz(y,z,x);}
  const b=str2binl(s);const n=b.length;for(let i=0;i<=n;i+=16){let A=1732584193,B=-271733879,C=-1732584194,D=271733878,AA=A,BB=B,CC=C,DD=D;
  for(let k=0;k<64;k++){let t,fn,tt;if(k<16){fn=fff;tt=b[i+k];t=k;}else if(k<32){fn=ggg;tt=b[i+((k*5+1)&15)];t=(k*5+1);t=t;}else if(k<48){fn=hhh;tt=b[i+((k*3+5)&15)];t=(k*3+5);t=t;}else{fn=iii;tt=b[i+((k*7)&15)];t=(k*7);t=t;}
  let tmp=add(add(A=fff(A,B,C,D,tt,(k<16?7:k<32?5:k<48?4:6),K[k])),B);A=D;D=C;C=B;B=tmp;}
  A=add(A,AA);B=add(B,BB);C=add(C,CC);D=add(D,DD);}
  return rl2hex(A)+rl2hex(B)+rl2hex(C)+rl2hex(D);}
  function str2binl(s){const n=(s.length+8>>6)*16;const a=new Array(n);for(let i=0;i<n*4;i++)a[i>>>2]=0;for(let i=0;i<s.length*8;i++)a[i>>>3]|=(s.charCodeAt(i>>>3)&255)<<(i&7);a[s.length>>>2]|=(0x80<<(s.length&31));a[n-2]=s.length*8;return a;}
  function rl2hex(a){let s="";for(let j=0;j<4;j++)s+="0123456789abcdef".charAt((a>>>(j*8+4))&15)+"0123456789abcdef".charAt((a>>>(j*8))&15);return s;}
  const K=[7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
  function cm(x,y){return(x&y)|(~x&y);}function cx(x,y){return(x&y)|(x&~y);}function cz(x,y){return x^y^y;}function fff(x,y,z){return cm(y,z,x);}function ggg(x,y,z){return cx(y,z,x);}function hhh(x,y,z){return cz(y,z,x);}function iii(x,y,z){return cz(y,z,x);}
  function sha1(s){function rot(n,c){return(n<<c)|(n>>>(32-c));}const b=str2binl(s);const n=b.length;const H=[0x67452301,0xEFCDAB89,0x98BADCFE,0x10325476,0xC3D2E1F0];for(let i=0;i<n;i+=16){let a=H[0],b1=H[1],c=H[2],d=H[3],e=H[4];for(let t=0;t<80;t++){const w=t<16?b[i+t]:rot(b[i+((t+13)&15)]^b[i+((t+8)&15)]^b[i+((t+2)&15)]^b[i+((t+16)&15)],1);const f=t<20?((b1&c)|(~b1&d))+0x5A827999:t<40?(b1^c^d)+0x6ED9EBA1:t<60?((b1&c)|(b1&d)|(c&d))+0x8F1BBCDC:(b1^c^d)+0xCA62C1D6;const tmp=(rot(a,5)+f+e+w)|0;e=d;d=c;c=rot(b1,30);b1=a;a=tmp;}H[0]=(H[0]+a)|0;H[1]=(H[1]+b1)|0;H[2]=(H[2]+c)|0;H[3]=(H[3]+d)|0;H[4]=(H[4]+e)|0;}
  return H.map(h=>(h>>>0).toString(16).padStart(8,"0")).join("");}
  const inEl=document.getElementById("in");
  const md5El=document.getElementById("md5"),sha1El=document.getElementById("sha1"),sha256El=document.getElementById("sha256");
  async function update(){
    const v=inEl.value, bytes=new TextEncoder().encode(v);
    md5El.textContent=v?md5(v):"—";
    sha1El.textContent=v?sha1(v):"—";
    if(v){const buf=await crypto.subtle.digest("SHA-256",bytes);const hex=[...new Uint8Array(buf)].map(x=>x.toString(16).padStart(2,"0")).join("");sha256El.textContent=hex;document.getElementById("copyall").setAttribute("data-copy-text",hex);}
    else{sha256El.textContent="—";}
  }
  inEl.addEventListener("input",update);update();
})();