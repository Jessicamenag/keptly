#!/usr/bin/env python3
"""Build Keptly: index.html (uses img/) and keptly_preview.html (images inlined)."""
import os,base64,json
H=os.path.dirname(os.path.abspath(__file__))
src=''.join(open(os.path.join(H,'src',f)).read() for f in ['a_css.html','b_body.html','c1.js','c2.js','c3.js'])
open(os.path.join(H,'index.html'),'w').write(src)
pv=os.path.join(H,'keptly_preview.html')
if not os.path.exists(pv):
    print('ok index.html');raise SystemExit
old=open(pv).read()
j=old.index('<head>')+6; s0=old.index('const M=',j); s1=old.index('};const fix',s0)
MT={'.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.mp4':'video/mp4'}
M={}
for f in sorted(os.listdir(os.path.join(H,'img'))):
    e=os.path.splitext(f)[1]
    if e in MT: M['img/'+f]='data:'+MT[e]+';base64,'+base64.b64encode(open(os.path.join(H,'img',f),'rb').read()).decode()
k=old.index('</script>',s1)+9
shim=old[j:s0]+'const M='+json.dumps(M)+old[s1+1:k]
i=src.index('<head>')+6
open(os.path.join(H,'keptly_preview.html'),'w').write(src[:i]+shim+src[i:])
print('ok',len(M),'images')
