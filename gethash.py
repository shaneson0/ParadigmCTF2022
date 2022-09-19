


import hashlib
a='aGau20Kd'
for i in range(32,127):
 for j in range(32,127):
  for k in range(32,127):
   b=a+chr(i)+chr(j)+chr(k)
   c=hashlib.sha256(b.encode()).hexdigest()
   d=int(c,16)
   e=str(bin(d))
   if e.endswith('00000000000000000000')==True:
    print(b)

