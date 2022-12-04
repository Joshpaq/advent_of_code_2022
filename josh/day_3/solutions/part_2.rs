use std::fs::File;
use std::io::{prelude::*, BufReader};

use clap::Parser;

#[derive(Parser)]
struct Args {
    #[clap(short)]
    filename: String
}

fn read_lines_from_file (filename: String) -> Vec<String> {
    let file = File::open(filename).expect("");
    let buffer = BufReader::new(file);
    buffer.lines()
        .map(|line| line.expect(""))
        .collect()
}

fn main() {
    let args = Args::parse();

    let lines = read_lines_from_file(args.filename);

    let mut sum = 0;

    let chars = ['a', 'b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    let mut seen  = [false; 52];

    let mut index = 0;
    for line in lines {
        let first = (index + 1) % 3 == 1;
        for (char_index, c) in chars.iter().enumerate() {
            if line.chars().find(|&line_char| line_char == *c).is_some() {
                seen[char_index] = if first { true } else { seen[char_index] };
            } else {
                seen[char_index] = false
            }
        }

        
        if (index + 1) % 3 == 0 {
            let value = seen.iter().position(|&x| x).unwrap_or(0) as i32;

            sum += if value == 0 { value } else { value + 1 };

            seen = [false; 52];
        }

        index += 1;
    }

    println!("{}", sum)
}
