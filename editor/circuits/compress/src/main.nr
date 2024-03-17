use dep::std;
use dep::audio_lib::transform::compress;

global SIZE = 100; // size of the sound array
global SIZE_OLD = 100; // size of the old sound array
global LAST_OP_ARGS = 0; // size of the previous operation arguments

fn main(
    // Commitment ----------------------------
    com: pub Field,
    // Content Operation ---------------------
    sound_new: pub [Field; SIZE],
    rate_new: pub Field,
    sound_old: [Field; SIZE_OLD],
    rate_old: Field,
    // op args
    compression_power: Field,
    // Previous proof data  ------------------
    verification_key : [Field; 114],
    proof : [Field; 93],
    last_op_args: [Field; LAST_OP_ARGS],
    key_hash : Field,
    // ---------------------------------------
) {
    // merge com, sound_new, prev_inputs into a single array
    let mut public_inputs = [0; 1 + SIZE_OLD + LAST_OP_ARGS];
    public_inputs[0] = com;
    for i in 1..SIZE_OLD {
        public_inputs[i] = sound_old[i];
    }
    for i in SIZE_OLD+1..SIZE_OLD+LAST_OP_ARGS {
        public_inputs[i] = last_op_args[i];
    }

    // Verify original sound_old belongs to com
    std::verify_proof(
        verification_key.as_slice(),
        proof.as_slice(),
        public_inputs,
        key_hash,
    );

    // Verify new sound is proper crop of old sound
    let (sound_test, len) = compress(sound_old);
    assert!(len == SIZE);
    for i in 0..SIZE-1 {
        assert!(sound_test[i] == sound_new[i]);
    }
}

#[test]
fn test_main() {

    // Uncomment to make test fail
    // main(1, 1);
}
