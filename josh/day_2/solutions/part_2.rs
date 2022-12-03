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

fn calculate_game_score (a: &str, b: &str) -> i32 {
    match b {
        "X" => match a { // lose
            "A" => 3,
            "B" => 1,
            "C" => 2,
            _ => 0
        },
        "Y" => match a { // draw
            "A" => 1 + 3,
            "B" => 2 + 3,
            "C" => 3 + 3,
            _ => 0
        },
        "Z" => match a { // win
            "A" => 2 + 6,
            "B" => 3 + 6,
            "C" => 1 + 6,
            _ => 0
        },
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
        acc + calculate_game_score(a, b)
    });

    println!("{}", total_score);
}
