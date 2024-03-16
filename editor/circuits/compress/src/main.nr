use dep::std::println;


global roots1024Real : [i64; 4] = [1,-1,-1,1];
global roots1024Img : [i64; 4] = [-1,1,1,-1];
global zeroC : Complex = zero();

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
        FixPoint{data: (a.data * b.data) >> 24}
    }

    fn toPCM16(a : FixPoint) -> u64 {
        ((a.data >> 8) & 0xffff) as u64
    }

    fn fromPCM16(a : u64) -> FixPoint {
        FixPoint{data: (a << 8) as i64}
    }

    fn zero() -> FixPoint{
        FixPoint{data: 0}
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


}

fn zero() -> Complex{
    Complex{real: FixPoint::zero(), img: FixPoint::zero()}
}


fn dft(data : [Complex; 1024]) -> [Complex; 1024]{
    data

}
fn idft(data : [Complex; 1024]) -> [Complex; 1024]{
    data
}

fn main(){

}