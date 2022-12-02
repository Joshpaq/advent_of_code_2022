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

    let mut elves: Vec<i32> = lines
    .iter()
    .fold(vec![0], |mut acc, line| -> Vec<i32> {
        if line.is_empty() {
            acc.push(0);
        } else {
            let len = acc.len() - 1;
            acc[len] = acc.last().unwrap() + line.parse::<i32>().unwrap();
        }

        acc
    });

    elves.sort_by(|a, b| b.cmp(a));

    println!("{:?}", &elves[0..3].iter().sum::<i32>());
}
