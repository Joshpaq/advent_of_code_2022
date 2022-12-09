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

    let mut max_score = 0;

    for y in 1..(height - 1) {
        for x in 1..(width - 1) {
            let height = forest[y][x];

            let next_column = x + 1;
            let next_row = y + 1;

            let current_score = 1;
            // left
            let mut done_left = false;
            current_score *= forest[y][0..x].iter().rev().fold(0, |mut acc, tree| {
                if done_left {
                    return acc
                } else {
                    if height <= *tree {
                        acc += 1;
                        done_left = true;
                    } else if height > *tree {
                        acc += 1;
                    } else {
                        done_left = true;
                    }
                }
                acc
            });

            // right
            let mut done_right = false;
            current_score *= forest[y][next_column..].iter().fold(0, |mut acc, tree| {
                if done_right {
                    return acc
                } else {
                    if height <= *tree {
                        acc += 1;
                        done_right = true;
                    } else if height > *tree {
                        acc += 1;
                    } else {
                        done_right = true;
                    }
                }
                acc
            });

            // top
            let mut done_top = false;
            current_score *= forest[0..y].iter().rev().fold(0, |mut acc, row| {
                if done_top {
                    return acc
                } else {
                    if height <= row[x] {
                        acc += 1;
                        done_top = true;
                    } else if height > row[x] {
                        acc += 1;
                    } else {
                        done_top = true;
                    }
                }
                acc
            });

            // bottom
            let mut done_bottom = false;
            current_score *= forest[next_row..].iter().fold(0, |mut acc, row| {
                if done_bottom {
                    return acc
                } else {
                    if height <= row[x] {
                        acc += 1;
                        done_bottom = true;
                    } else if height > row[x] {
                        acc += 1;
                    } else {
                        done_bottom = true;
                    }
                }
                acc
            });

            if current_score > max_score {
              max_score = current_score
            }
        }
    }

    println!("{}", score);
}
