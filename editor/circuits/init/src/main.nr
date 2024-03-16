use dep::std;

global SIZE = 10;

fn main(com: pub Field, sound: [Field; SIZE]) {
    let com_test = std::hash::pedersen_hash(sound);
    assert(com == com_test);
}

#[test]
fn test_main() {

    // Uncomment to make test fail
    // main(1, 1);
}
