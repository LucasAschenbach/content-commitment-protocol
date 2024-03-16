use dep::std::println;

global sizeDFT = 32;
global logConst = 5;
global logConstInc = 6;
global overlap = sizeDFT/4;//512;
global lowpass : [i64; sizeDFT] = [16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 4806752, 1377157, 394562, 113043, 32387, 9279, 2658, 761, 2658, 9279, 32387, 113043, 394562, 1377157, 4806752, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216];
global rootsReal : [i64; sizeDFT] = [16777216, 16454846, 15500126, 13949745, 11863283, 9320921, 6420362, 3273072, 0, -3273072, -6420362, -9320921, -11863283, -13949745, -15500126, -16454846, -16777216, -16454846, -15500126, -13949745, -11863283, -9320921, -6420362, -3273072, 0, 3273072, 6420362, 9320921, 11863283, 13949745, 15500126, 16454846];
global rootsImg : [i64; sizeDFT] = [0, -3273072, -6420362, -9320921, -11863283, -13949745, -15500126, -16454846, -16777216, -16454846, -15500126, -13949745, -11863283, -9320921, -6420362, -3273072, 0, 3273072, 6420362, 9320921, 11863283, 13949745, 15500126, 16454846, 16777216, 16454846, 15500126, 13949745, 11863283, 9320921, 6420362, 3273072];
global zeroC : Complex = Complex{real : FixPoint{data : 0}, img : FixPoint {data : 0}};
global lookupReverse : [u64; sizeDFT] = [0, 16, 8, 24, 4, 20, 12, 28, 2, 18, 10, 26, 6, 22, 14, 30, 1, 17, 9, 25, 5, 21, 13, 29, 3, 19, 11, 27, 7, 23, 15, 31];


//first 24bits are decimal places
struct FixPoint{
    data : i64
}
impl FixPoint{
    fn add(a : FixPoint, b : FixPoint) -> FixPoint {
        FixPoint{data: a.data + b.data}
    }

    fn sub(a : FixPoint, b : FixPoint) -> FixPoint {
        FixPoint{data: a.data - b.data}
    }

    fn mul(a : FixPoint, b : FixPoint) -> FixPoint {
        FixPoint{data: FixPoint::shiftRi64((a.data * b.data), 24)}
    }

    fn toPCM16(a : FixPoint) -> i64 {
        let mut absA : i64 = a.data;
        if(a.data < 0){
            absA *= -1;
            absA = (((absA as u64) >> 9)%(1<<16)) as i64;
            absA *= -1;
        }else{
            absA = (((absA as u64) >> 9)%(1<<16)) as i64;
        }
        absA
    }

    fn fromPCM16(a : i64) -> FixPoint {
        FixPoint{data: FixPoint::shiftLi64(a, 9)}
    }

    fn zero() -> FixPoint{
        FixPoint{data: 0}
    }

    fn intToFix(inp : i64) -> FixPoint{
        FixPoint{data : FixPoint::shiftLi64(inp, 24)}
    }

    fn shiftRi64(a : i64, shift: u64) -> i64{
        let mut absA : i64 = a;
        if(a < 0){
            absA *= -1;
            absA = ((absA as u64) >> shift) as i64;
            absA *= -1;
        }else{
            absA = ((absA as u64) >> shift) as i64;
        }
        absA
    }


    fn shiftLi64(a : i64, shift: u64) -> i64{
        let mut absA : i64 = a;
        if(a < 0){
            absA *= -1;
            absA = ((absA as u64) << shift) as i64;
            absA *= -1;
        }else{
            absA = ((absA as u64) << shift) as i64;
        }
        absA
    }
}
struct Complex{
    real : FixPoint,
    img : FixPoint
}

impl Complex{
    fn add(a : Complex, b : Complex) -> Complex{
        Complex{real : FixPoint::add(a.real,b.real), img : FixPoint::add(a.img,b.img)}
    }

    fn sub(a : Complex, b : Complex) -> Complex{
        Complex{real : FixPoint::sub(a.real, b.real), img : FixPoint::sub(a.img,b.img)}
    }

    fn mul(a : Complex, b : Complex) -> Complex{
        Complex{real : FixPoint::sub(FixPoint::mul(a.real, b.real), FixPoint::mul(a.img, b.img)), img: FixPoint::add(FixPoint::mul(a.real, b.img), FixPoint::mul(a.img, b.real))}
    }

    fn conj(a : Complex) -> Complex{
        Complex{real : a.real, img : FixPoint{data : a.img.data * -1}}
    }

    fn shift(a : Complex, shift: u64) -> Complex{
        Complex{real: FixPoint{data : FixPoint::shiftRi64(a.real.data, shift)}, img : FixPoint{data : FixPoint::shiftRi64(a.img.data, shift)}}
    }

    fn printC(a : Complex){
        let rl = a.real.data;
        let im = a.img.data;
        println((rl, im))
    }
}

fn zero() -> Complex{
    Complex{real: FixPoint::zero(), img: FixPoint::zero()}
}
fn reverseBit(number : u64) -> u64{
    lookupReverse[number]
}
fn reverseBits<N>(data: [Complex; N]) -> [Complex; N]{
    let mut res : [Complex; N] = [zeroC; N];
    for i in 0..N{
        res[reverseBit(i)] = data[i];        
    }
    res
}

fn dft<N>(data: [Complex; N]) -> [Complex; N]{
    let mut bitReversed = reverseBits(data);
    for i in 1..logConstInc{
        let mut wm = sizeDFT >> i;      
        let m = 1 << i;
        let mh = 1 << (i-1);
        //let rootMul = Complex::conj(Complex{real: FixPoint{data: rootsReal[wm]}, img: FixPoint{data: rootsImg[wm]}});
        for idx in 0..wm{
            let k = idx * m;
            let mut rootIdx = 0;
            let mut tempRoot = Complex{real: FixPoint{data: rootsReal[rootIdx]}, img: FixPoint{data: rootsImg[rootIdx]}};
            for j in 0..mh{
                let t = Complex::mul(tempRoot, bitReversed[k + j + mh]);
                let u = bitReversed[k + j];
                bitReversed[k + j] = Complex::add(u,t);
                bitReversed[k + j + mh] = Complex::sub(u,t);
                rootIdx += wm;
                rootIdx %= sizeDFT;
                
                tempRoot = Complex{real: FixPoint{data: rootsReal[rootIdx]}, img: FixPoint{data: rootsImg[rootIdx]}};
            }
        }
    }
    bitReversed
}

fn idft<N>(data: [Complex; N]) -> [Complex; N]{
    let mut bitReversed = reverseBits(data);
    for i in 1..logConstInc{
        let mut wm = sizeDFT >> i;      
        let m = 1 << i;
        let mh = 1 << (i-1);
        for idx in 0..wm{
            let k = idx * m;
            let mut rootIdx = 0;
            let mut tempRoot = Complex{real: FixPoint{data: rootsReal[rootIdx]}, img: FixPoint{data: rootsImg[rootIdx]}};
            for j in 0..mh{
                let t = Complex::mul(tempRoot, bitReversed[k + j + mh]);
                let u = bitReversed[k + j];
                bitReversed[j + k] = Complex::add(u,t);
                bitReversed[k + j + mh] = Complex::sub(u,t);
                rootIdx += wm;
                rootIdx %= sizeDFT;
                tempRoot = Complex::conj(Complex{real: FixPoint{data: rootsReal[rootIdx]}, img: FixPoint{data: rootsImg[rootIdx]}});
            }
        }
    }
    for i in 0..N{
        bitReversed[i] = Complex::shift(bitReversed[i], logConst);
    }
    bitReversed
}
//fn ridft(start: u64, end: u64){
//    data
//}
fn calculateRounds(size : u64) -> u64 {
    let mut rounds = 1;
    let mut rmsize = size - sizeDFT;
    if (rmsize % sizeDFT == 0){
        rounds += (rmsize / sizeDFT) * 2;
    }else{
        rounds += (rmsize / sizeDFT + 1) * 2;
    }
    rounds
}

fn downsample<M> (data : [i64; M]) -> ([i64; M], u64){
    let mut res : [i64; M] = [0; M];
    let mut cmplx : [Complex; M] = [zeroC; M];
    //let mut last : [Complex; sizeDFT] = [zeroC; sizeDFT];
    let mut resCmplx : [Complex; M] = [zeroC; M];
    for i in 0..M{
        cmplx[i] = Complex{real: FixPoint::fromPCM16(data[i]), img: FixPoint::zero()};
    }
    let mut offset = 0;
    for i in 0..(M/(sizeDFT-overlap) + 1){
        let mut chunk : [Complex; sizeDFT] = [zeroC; sizeDFT];
        for j in 0..sizeDFT{
            let idx = offset + j;
            if(idx < M){
                chunk[j] = cmplx[idx];
            }            
        }
        chunk = dft(chunk);
        for j in 0..sizeDFT{
            chunk[j] = Complex::mul(chunk[j],Complex{real: FixPoint{data : lowpass[j]}, img : FixPoint::zero()});
        }
        chunk = idft(chunk);
        for j in 0..sizeDFT{
            let idx = offset + j;
            if idx < M{
                //println(chunk[j]);
                if j < overlap & i > 0{ 
                    resCmplx[idx] = Complex::shift(Complex::add(resCmplx[idx],chunk[j]),1);  
                }else{
                    resCmplx[idx] = Complex::add(resCmplx[idx], chunk[j]);
                }
                          
                //resCmplx[idx] = Complex::add(resCmplx[idx], chunk[j]);
            }
        }
        offset += sizeDFT - overlap;
    }
    for i in 0..M/2{
        res[i] = FixPoint::toPCM16(resCmplx[i*2].real);
    }
    (res, M/2 as u64)
}


fn main(){
    test_downsampling();

}

#[test]
fn test_dft(){
    let mut test = -1;
    test *= -1;
    println(test as u64);
    let oneF = FixPoint::intToFix(1);

    let oneC = Complex{real : oneF, img : FixPoint::zero()};
    println(oneC);
    let mut input : [Complex; sizeDFT] = [oneC; sizeDFT];
    for i in 0..4{
        input[i] = Complex{real : FixPoint::intToFix(i), img : FixPoint::zero()};
    }
    let output = dft(input);
    let output2 = idft(output);
    for i in 0..sizeDFT{
        Complex::printC(output2[i]);
    }
}

#[test]
fn test_downsampling(){
    let test = [4000 ; sizeDFT * 4];
    print(downsample(test));
}