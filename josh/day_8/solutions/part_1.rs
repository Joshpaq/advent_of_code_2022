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

    let forest: Vec<Vec<i32>> = lines
        .iter()
        .map(|line| line.chars().map(|c| c.to_digit(10).unwrap() as i32).collect())
        .collect();
    let height = forest.len();
    let width = forest.first().unwrap().len();

    let mut trees = 0;

    for y in 1..(height - 1) {
        for x in 1..(width - 1) {
            let height = forest[y][x];

            let next_column = x + 1;
            let next_row = y + 1;

            if forest[y][0..x].iter().all(|tree| tree < &height) {
                trees += 1;
            } else if forest[y][next_column..].iter().all(|tree| tree < &height) {
                trees += 1;
            } else if forest[0..y].iter().all(|row| row[x] < height) {
                trees += 1;
            } else if forest[next_row..].iter().all(|row| row[x] < height) {
                trees += 1;
            }
        }
    }

    println!("{}", trees + ((height * 2) - 2) + ((width * 2) - 2));
}
