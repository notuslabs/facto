use anchor_lang::prelude::Pubkey;

pub const fn get_base58ch_to_number_map() -> [u8; 128] {
    let mut map = [0xFF; 128];
    let mut number = 0;

    let mut i = '1' as usize;
    while i <= '9' as usize {
        map[i] = number;
        number += 1;
        i += 1;
    }

    i = 'A' as usize;
    while i <= 'Z' as usize {
        if i != 'I' as usize && i != 'O' as usize {
            map[i] = number;
            number += 1;
        }
        i += 1;
    }

    i = 'a' as usize;
    while i <= 'z' as usize {
        if i != 'l' as usize {
            map[i] = number;
            number += 1;
        }
        i += 1;
    }

    map
}

pub const fn str_to_pubkey(s: &'static str) -> Pubkey {
    let s = s.as_bytes();
    assert!(
        s.len() <= 44,
        "Public key string length should be no more than 44"
    );
    assert!(s.len() > 0, "Public key string cannot be empty");

    let map = get_base58ch_to_number_map();
    let mut bytes = [0u8; 32];
    let mut i = 0;
    let mut index = 0;

    while i < s.len() {
        assert!(s[i] <= 127, "Invalid Base58 character found");

        let mut val = map[s[i] as usize] as usize;
        assert!(val != 0xFF, "Invalid Base58 character found");

        let mut j = 0;
        while j < index {
            val += (bytes[j] as usize) * 58;
            bytes[j] = (val & 0xFF) as u8;
            val >>= 8;
            j += 1;
        }

        while val > 0 {
            bytes[index] = (val & 0xFF) as u8;
            index += 1;
            val >>= 8;
        }

        i += 1;
    }

    i = 0;
    while i < s.len() && s[i] == '1' as u8 {
        bytes[index] = 0;
        index += 1;
    }

    i = 0;
    while i < 16 {
        (bytes[i], bytes[31 - i]) = (bytes[31 - i], bytes[i]);
        i += 1;
    }

    Pubkey::new_from_array(bytes)
}
