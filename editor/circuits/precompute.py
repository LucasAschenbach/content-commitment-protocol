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

def reverseBit(a, bits):
  fstr = "{:0" + str(bits) + "b}"
  rev = int(fstr.format(a)[::-1], 2)
  return rev

def reverseBits(bits):
  res = []
  for i in range(0,(1<<bits)):
    res.append(reverseBit(i, bits))
  return res


def floatToFix(a):
  first = abs(int(a))
  second = int(abs(abs(a) - first) * (1<<24))
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
  print("")
  print(resS)

def createGaussian(size):
  phi = (size / 6)
  gaussian = []
  for i in range(0,size):
    z = 0
    if i < size/2:
      z = i
    else:
      z = i - size
    gaussian.append(1/(math.sqrt(math.pi * 2) * phi) * math.exp(-(z*z)/(2*phi*phi)))
  return gaussian

#linear lowpass
def createLowPass(size):
  lowpass = []
  for i in range(0, size):
    if i < size/4:
      lowpass.append(1.0)
    elif size - i < size/4:
      lowpass.append(1.0)
    elif i < size/2:
      damp = i - size/4
      lowpass.append(-4.0/size * damp + 1)
    else:
      damp = (size - i) - size/4
      lowpass.append(-4.0/size * damp + 1)
  return lowpass

#expo lowpass
def createLowPassExp(size, slope):
  lowpass = []
  for i in range(0, size):
    if i < size/4:
      lowpass.append(1.0)
    elif size - i < size/4:
      lowpass.append(1.0)
    elif i < size/2:
      damp = i - size/4
      lowpass.append(math.exp(-4.0/size * damp * slope))
    else:
      damp = (size - i) - size/4
      lowpass.append(math.exp(-4.0/size * damp * slope))
  return lowpass

def arrAsFix(arr):
  res = []
  for i in arr:
    res.append(floatToFix(i))
  return res

  
bits = 5
size = 1<<5
print(arrAsFix(createLowPassExp(size, 10)))
print("")
printRoots(size)
print("")
print(reverseBits(bits))




