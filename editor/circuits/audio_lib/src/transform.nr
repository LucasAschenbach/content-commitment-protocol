use dep::std;

pub fn crop<N,M>(sound: [Field; N], start: Field, end: Field) -> pub [Field; M] {
    assert(M - 1 == end - start);
    let len: u32 = N as u32;
    let mut sound_new: [Field; M] = [0; M];
    for i in 0..(len-1) {
        sound_new[i] = sound[start + i as Field];
    }
    sound_new
}

pub fn compress<N,M>(sound: [Field; N], rate: Field, compression_power: Field) -> [Field; M] {
    assert(N == M * 2.pow_32(compression_power));
    // TODO
    let mut sound_new: [Field; M] = [0; M];
    sound_new
}
