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

    let mut stacks: Vec<Vec<char>> = Vec::new();
    let mut moves = false;
    for line in lines {
        if line.is_empty() {
            stacks.iter_mut().for_each(|s| s.reverse());
            moves = true;
            continue
        }

        if moves {
            // move stacks

            let mut amount = 0;
            let mut from = 0;
            let mut to = 0;

            for (i, c) in line.split(' ').enumerate() {
                if i == 1 {
                    amount = c.parse::<i32>().unwrap() as usize
                } else if i == 3 {
                    from = (c.parse::<i32>().unwrap() - 1) as usize
                } else if i == 5 {
                    to = (c.parse::<i32>().unwrap() - 1) as usize
                }
            }

            let at = stacks[from].len() - amount;

            let mut temp_stack = vec![];
            temp_stack.extend(stacks[from].drain(at..));

            stacks[to].extend(temp_stack.drain(..).rev());
        } else {
            // build stacks
            for (i, c) in line.chars().enumerate() {
                if c.is_alphabetic() {
                    let index = (i - 1) / 4;

                    while index + 1 > stacks.len() {
                        stacks.push(Vec::new());
                    }

                    stacks[(i - 1) / 4].push(c);
                }
            }
        }
    }

    println!("{}", stacks.into_iter().map(|s| *s.last().unwrap()).collect::<String>());
}
