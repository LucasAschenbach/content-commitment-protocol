use dep::audio_lib::transform::compress;

global SIZE = 100;

fn main(sound: [i64; SIZE]) {
    compress(sound)
}

#[test]
fn test_main() {
    main(1, 2);

    // Uncomment to make test fail
    // main(1, 1);
}
