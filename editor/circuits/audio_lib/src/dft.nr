use dep::std::println;

global logConst = 7;
global sizeDFT = 128;
global logConstInc = logConst+1;
global overlap = sizeDFT/4;
global lowpass : [i64; sizeDFT] = [16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 12274473, 8980196, 6570052, 4806752, 3516695, 2572869, 1882351, 1377157, 1007550, 737139, 539302, 394562, 288667, 211193, 154512, 113043, 82704, 60508, 44268, 32387, 23695, 17335, 12683, 9279, 6788, 4966, 3633, 2658, 1945, 1423, 1041, 761, 1041, 1423, 1945, 2658, 3633, 4966, 6788, 9279, 12683, 17335, 23695, 32387, 44268, 60508, 82704, 113043, 154512, 211193, 288667, 394562, 539302, 737139, 1007550, 1377157, 1882351, 2572869, 3516695, 4806752, 6570052, 8980196, 12274473, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216];

//[16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 4806752, 1377157, 394562, 113043, 32387, 9279, 2658, 761, 2658, 9279, 32387, 113043, 394562, 1377157, 4806752, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216, 16777216];
global rootsReal : [i64; sizeDFT] = [16777216, 16757007, 16696429, 16595627, 16454846, 16274423, 16054794, 15796488, 15500126, 15166423, 14796183, 14390298, 13949745, 13475586, 12968963, 12431097, 11863283, 11266889, 10643353, 9994175, 9320921, 8625212, 7908724, 7173184, 6420362, 5652073, 4870168, 4076530, 3273072, 2461728, 1644454, 823218, 0, -823218, -1644454, -2461728, -3273072, -4076530, -4870168, -5652073, -6420362, -7173184, -7908724, -8625212, -9320921, -9994175, -10643353, -11266889, -11863283, -12431097, -12968963, -13475586, -13949745, -14390298, -14796183, -15166423, -15500126, -15796488, -16054794, -16274423, -16454846, -16595627, -16696429, -16757007, -16777216, -16757007, -16696429, -16595627, -16454846, -16274423, -16054794, -15796488, -15500126, -15166423, -14796183, -14390298, -13949745, -13475586, -12968963, -12431097, -11863283, -11266889, -10643353, -9994175, -9320921, -8625212, -7908724, -7173184, -6420362, -5652073, -4870168, -4076530, -3273072, -2461728, -1644454, -823218, 0, 823218, 1644454, 2461728, 3273072, 4076530, 4870168, 5652073, 6420362, 7173184, 7908724, 8625212, 9320921, 9994175, 10643353, 11266889, 11863283, 12431097, 12968963, 13475586, 13949745, 14390298, 14796183, 15166423, 15500126, 15796488, 16054794, 16274423, 16454846, 16595627, 16696429, 16757007];

//[16777216, 16454846, 15500126, 13949745, 11863283, 9320921, 6420362, 3273072, 0, -3273072, -6420362, -9320921, -11863283, -13949745, -15500126, -16454846, -16777216, -16454846, -15500126, -13949745, -11863283, -9320921, -6420362, -3273072, 0, 3273072, 6420362, 9320921, 11863283, 13949745, 15500126, 16454846];
global rootsImg : [i64; sizeDFT] = [0, -823218, -1644454, -2461728, -3273072, -4076530, -4870168, -5652073, -6420362, -7173184, -7908724, -8625212, -9320921, -9994175, -10643353, -11266889, -11863283, -12431097, -12968963, -13475586, -13949745, -14390298, -14796183, -15166423, -15500126, -15796488, -16054794, -16274423, -16454846, -16595627, -16696429, -16757007, -16777216, -16757007, -16696429, -16595627, -16454846, -16274423, -16054794, -15796488, -15500126, -15166423, -14796183, -14390298, -13949745, -13475586, -12968963, -12431097, -11863283, -11266889, -10643353, -9994175, -9320921, -8625212, -7908724, -7173184, -6420362, -5652073, -4870168, -4076530, -3273072, -2461728, -1644454, -823218, 0, 823218, 1644454, 2461728, 3273072, 4076530, 4870168, 5652073, 6420362, 7173184, 7908724, 8625212, 9320921, 9994175, 10643353, 11266889, 11863283, 12431097, 12968963, 13475586, 13949745, 14390298, 14796183, 15166423, 15500126, 15796488, 16054794, 16274423, 16454846, 16595627, 16696429, 16757007, 16777216, 16757007, 16696429, 16595627, 16454846, 16274423, 16054794, 15796488, 15500126, 15166423, 14796183, 14390298, 13949745, 13475586, 12968963, 12431097, 11863283, 11266889, 10643353, 9994175, 9320921, 8625212, 7908724, 7173184, 6420362, 5652073, 4870168, 4076530, 3273072, 2461728, 1644454, 823218];

//[0, -3273072, -6420362, -9320921, -11863283, -13949745, -15500126, -16454846, -16777216, -16454846, -15500126, -13949745, -11863283, -9320921, -6420362, -3273072, 0, 3273072, 6420362, 9320921, 11863283, 13949745, 15500126, 16454846, 16777216, 16454846, 15500126, 13949745, 11863283, 9320921, 6420362, 3273072];
global lookupReverse : [u64; sizeDFT] = [0, 64, 32, 96, 16, 80, 48, 112, 8, 72, 40, 104, 24, 88, 56, 120, 4, 68, 36, 100, 20, 84, 52, 116, 12, 76, 44, 108, 28, 92, 60, 124, 2, 66, 34, 98, 18, 82, 50, 114, 10, 74, 42, 106, 26, 90, 58, 122, 6, 70, 38, 102, 22, 86, 54, 118, 14, 78, 46, 110, 30, 94, 62, 126, 1, 65, 33, 97, 17, 81, 49, 113, 9, 73, 41, 105, 25, 89, 57, 121, 5, 69, 37, 101, 21, 85, 53, 117, 13, 77, 45, 109, 29, 93, 61, 125, 3, 67, 35, 99, 19, 83, 51, 115, 11, 75, 43, 107, 27, 91, 59, 123, 7, 71, 39, 103, 23, 87, 55, 119, 15, 79, 47, 111, 31, 95, 63, 127];

global zeroC : Complex = Complex{real : FixPoint{data : 0}, img : FixPoint {data : 0}};
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

pub fn downsample<M> (data : [i64; M]) -> ([i64; M], u64){
    let mut res : [i64; M] = [0; M];
    let mut cmplx : [Complex; M] = [zeroC; M];
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
                if j < overlap & i > 0{ 
                    resCmplx[idx] = Complex::shift(Complex::add(resCmplx[idx],chunk[j]),1);  
                }else{
                    resCmplx[idx] = Complex::add(resCmplx[idx], chunk[j]);
                }
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
    let test = [4000 ; sizeDFT];
    print(downsample(test));
}
