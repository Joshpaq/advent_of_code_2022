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

enum Left {
  A,
  B,
  C
}

impl FromStr for Left {
    type Err = ();
    fn from_str (input: &str) -> Result<Left, Self::Err> {
        match input {
            "A" => Ok(Left::A),
            "B" => Ok(Left::B),
            "C" => Ok(Left::C),
            _ => Err(())
        }
    }
}


enum Right {
  X,
  Y,
  Z
}

impl FromStr for Right {
    type Err = ();
    fn from_str (input: &str) -> Result<Right, Self::Err> {
        match input {
            "X" => Ok(Right::X),
            "Y" => Ok(Right::Y),
            "Z" => Ok(Right::Z),
            _ => Err(())
        }
    }
}

fn calculate_game_score ((left, right): (Left, Right)) -> i32 {
    match (left, right) {
        (Left::A, Right::X) => 3,
        (Left::B, Right::X) => 1,
        (Left::C, Right::X) => 2,
        (Left::A, Right::Y) => 1 + 3,
        (Left::B, Right::Y) => 2 + 3,
        (Left::C, Right::Y) => 3 + 3,
        (Left::A, Right::Z) => 2 + 6,
        (Left::B, Right::Z) => 3 + 6,
        (Left::C, Right::Z) => 1 + 6
    }
}

fn main() {
    let args = Args::parse();

    let lines = read_lines_from_file(args.filename);
    
    let total_score = lines.iter().fold(0, |acc, line| {
        let mut vec_string: Vec<&str> = line.split_whitespace().collect();
        let right = Right::from_str(vec_string.pop().expect("")).unwrap();
        let left = Left::from_str(vec_string.pop().expect("")).unwrap();
        acc + calculate_game_score((left, right))
    });

    println!("{}", total_score);
}
