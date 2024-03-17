use dep::std;
use crate::dft::downsample;

pub fn crop<N,M>(sound: [Field; N], start: Field, end: Field) -> pub [Field; M] {
    assert(M - 1 == end - start);
    let len: u32 = N as u32;
    let mut sound_new: [Field; M] = [0; M];
    for i in 0..(len-1) {
        sound_new[i] = sound[start + i as Field];
    }
    sound_new
}

pub fn compress<N>(sound: [i64; N]) -> ([i64; N],u64) {
    //assert(N == M * 2.pow_32(compression_power));
    // TODO
    downsample(sound)
}
