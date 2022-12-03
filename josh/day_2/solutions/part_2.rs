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

fn calculate_game_score ((a, b): (&str, &str)) -> i32 {
    match (a, b) {
      ("X", "A") => 3,
      ("X", "B") => 1,
      ("X", "C") => 2,
      ("Y", "A") => 1 + 3,
      ("Y", "B") => 2 + 3,
      ("Y", "C") => 3 + 3,
      ("Z", "A") => 2 + 6,
      ("Z", "B") => 3 + 6,
      ("Z", "C") => 1 + 6,
      _ => 0
    }
}

fn main() {
    let args = Args::parse();

    let lines = read_lines_from_file(args.filename);
    
    let total_score = lines.iter().fold(0, |acc, line| {
        let mut vec_string: Vec<&str> = line.split_whitespace().collect();
        let b = vec_string.pop().expect("");
        let a = vec_string.pop().expect("");
        acc + calculate_game_score((a, b))
    });

    println!("{}", total_score);
}
