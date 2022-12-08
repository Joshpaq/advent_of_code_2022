use std::collections::HashSet;
use std::fs::File;
use std::io::{prelude::*, BufReader};
use clap::Parser;

#[derive(Parser)]
struct Args {
    #[clap(short)]
    filename: String
}

fn is_unique (slice: &[char]) -> bool {
    let mut set = HashSet::new();

    for c in slice {
        if !set.insert(c) {
            return false
        }
    }

    true
}

fn main() {
    let args = Args::parse();

    let file = File::open(args.filename).expect("Unable to open file.");
    let mut line = String::new();
    BufReader::new(file).read_line(&mut line).expect("Error reading line from buffer.");

    let line_chars: Vec<char> = line.chars().collect();

    for i in 0..line_chars.len() {
        if is_unique(&line_chars[i..i + 14]) {
            return println!("{}", i + 14)
        }
    }
}
