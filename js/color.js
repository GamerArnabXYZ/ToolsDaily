/* Color Picker — HEX/RGB/HSL conversion */
(function(){
  const pick=document.getElementById("pick"),hex=document.getElementById("hex"),rgb=document.getElementById("rgb"),hsl=document.getElementById("hsl");
  function h2r(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];}
  function r2h([r,g,b]){return "#"+[r,g,b].map(x=>x.toString(16).padStart(2,"0")).join("");}
  function r2hsl([r,g,b]){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;if(d){if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360;}const l=(mx+mn)/2,s=d===0?0:d/(1-Math.abs(2*l-1));return [Math.round(h),Math.round(s*100),Math.round(l*100)];}
  function update(val){const [r,g,b]=h2r(val);hex.value=val.toUpperCase();rgb.value="rgb("+r+", "+g+", "+b+")";const [h,s,l]=r2hsl([r,g,b]);hsl.value="hsl("+h+", "+s+"%, "+l+"%)";}
  pick.addEventListener("input",()=>update(pick.value));
  hex.addEventListener("input",()=>{if(/^#[0-9a-fA-F]{6}$/.test(hex.value))update(hex.value);});
  update(pick.value);
})();