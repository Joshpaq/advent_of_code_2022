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

    let mut largest = 0;
    let mut sum = 0;

    for line in lines {
        if line.is_empty() {
            largest = if sum > largest { sum } else { largest };
            sum = 0;
        } else {
            sum += line.parse::<i32>().unwrap();
        }
    }

    println!("{}", largest);
}
