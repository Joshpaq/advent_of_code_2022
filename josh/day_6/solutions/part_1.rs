use std::collections::HashSet;
use std::fs::File;
use std::io::{prelude::*, BufReader};
use clap::Parser;
use itertools::Itertools;


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

fn is_unique ((a, b, c, d): (char, char, char, char)) -> bool {
    let mut set = HashSet::new();
    set.insert(a);
    set.insert(b);
    set.insert(c);
    set.insert(d);
    set.len() == 4
}

fn main() {
    let args = Args::parse();

    let lines = read_lines_from_file(args.filename);
    
    let index = lines
        .first()
        .unwrap()
        .chars()
        .into_iter()
        .tuple_windows()
        .position(is_unique)
        .unwrap();

    println!("{}", index + 4);
}
