import math

#fixpoint 24 bit decimals 8 bit rest in case of 32bit integer
#00000011 110000000000000000000000
#3        .75
def quant2fix(quant):
  return quant << 8
 
def fix2quant(fix):
  return fix >> 8

def addFix(a, b):
  return a + b

def subFix(a, b):
  return a - b

def mulFix(a, b):
  return (a * b) >> 24

def fixToFloat(a):
  res = (a >> 24)
  res += (a&0xffffff)/(1<<24)
  return res


def floatToFix(a):
  first = abs(int(a))
  second = int(abs(a - first) * (1<<24))
  res = (first << 24) + second
  if(a < 0):
    res *= -1
  return res 

#Calculate roots of unity as (real, img) pairs (float)  
def genRoots(size):
  roots = []
  for i in range(0,size):
    roots.append((math.cos(-2 * math.pi * i / size), math.sin(-2 * math.pi * i / size)))
  return roots


#Print out the roots of unity as [real] [img] arrays (fix)
def printRoots(size):
  res = genRoots(size)
  resC = []
  resS = []
  for i in res:
    resC.append(floatToFix(i[0]))
    resS.append(floatToFix(i[1]))
  print(resC)
  print(resS)


res = genRoots(8)
print(res)
printRoots(8)

