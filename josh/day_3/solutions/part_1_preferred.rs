use std::fs::File;
use std::io::{prelude::*, BufReader};
use std::str::FromStr;

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
fn get_priority (char: char) -> i32 {
    match char {
        'a' => 1,
        'b' => 2,
        'c' => 3,
        'd' => 4,
        'e' => 5,
        'f' => 6,
        'g' => 7,
        'h' => 8,
        'i' => 9,
        'j' => 10,
        'k' => 11,
        'l' => 12,
        'm' => 13,
        'n' => 14,
        'o' => 15,
        'p' => 16,
        'q' => 17,
        'r' => 18,
        's' => 19,
        't' => 20,
        'u' => 21,
        'v' => 22,
        'w' => 23,
        'x' => 24,
        'y' => 25,
        'z' => 26,
        'A' => 27,
        'B' => 28,
        'C' => 29,
        'D' => 30,
        'E' => 31,
        'F' => 32,
        'G' => 33,
        'H' => 34,
        'I' => 35,
        'J' => 36,
        'K' => 37,
        'L' => 38,
        'M' => 39,
        'N' => 40,
        'O' => 41,
        'P' => 42,
        'Q' => 43,
        'R' => 44,
        'S' => 45,
        'T' => 46,
        'U' => 47,
        'V' => 48,
        'W' => 49,
        'X' => 50,
        'Y' => 51,
        'Z' => 52,
        _ => 0
    }
}

// this one is preferred because it does it without creating two new substrings
fn main() {
    let args = Args::parse();

    let lines = read_lines_from_file(args.filename);

    let mut sum = 0;

    for line in lines {
        for (index, char) in line.chars().enumerate() {
            let line_middle = line.len() / 2;
            if index >= line_middle {
                continue;
            }

            let index_from_left = line.find(char).unwrap();
            if index_from_left < index {
                continue;
            }

            let index_from_right = line.rfind(char).unwrap_or(line.len() + 1);
            if index_from_right < line.len() && index_from_right >= line_middle {
                sum += get_priority(char);
            }
        }
    }

    println!("{}", sum)
}
