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
    let lines_length = lines.len() as i32;

    let mut sum = 0;

    for line in lines {
        let mut elves: Vec<&str> = line.split(',').collect();
        let two = elves.pop().expect("");
        let mut two_split: Vec<&str> = two.split('-').collect();
        let two_two = two_split.pop().expect("").parse::<i32>().unwrap();
        let two_one = two_split.pop().expect("").parse::<i32>().unwrap();
        let one = elves.pop().expect("");
        let mut one_split: Vec<&str> = one.split('-').collect();
        let one_two = one_split.pop().expect("").parse::<i32>().unwrap();
        let one_one = one_split.pop().expect("").parse::<i32>().unwrap();

        if one_one < two_one && one_two < two_one || one_one > two_two && one_two > two_two { sum += 1 }
    }

    println!("{}", lines_length - sum)
}
