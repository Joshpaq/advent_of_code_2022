use std::fs::File;
use std::io::{prelude::*, BufReader};
use clap::Parser;
use std::collections::HashSet;

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

struct StringEnd {
    x: i32,
    y: i32
}

fn main() {
    let args = Args::parse();

    let lines = read_lines_from_file(args.filename);

    let mut tail_positions: HashSet<String> = HashSet::new();
    tail_positions.insert("0_0".to_string()); // always visits origin

    let mut head = StringEnd { x: 0, y: 0 };
    let mut tail = StringEnd { x: 0, y: 0 };

    for line in lines {
        let split_line = line.split_whitespace().collect::<Vec<&str>>();
        let direction = *split_line.get(0).unwrap();
        let amount: i32 = split_line.get(1).unwrap().parse().unwrap();

        for _ in 0..amount {
            match direction {
                "R" => {
                    head.x += 1;
                    if head.x > tail.x + 1 {
                        if head.y > tail.y {
                            tail.y += 1; // diagnal up
                        }
                        if head.y < tail.y {
                            tail.y -= 1; // diagnal down
                        }
                        tail.x += 1;
                        let tail_string = format!("{}_{}", tail.x, tail.y);
                        tail_positions.insert(tail_string);
                    }
                },
                "L" => {
                    head.x -= 1;
                    if head.x < tail.x - 1 {
                        if head.y > tail.y {
                            tail.y += 1; // diagnal up
                        }
                        if head.y < tail.y {
                            tail.y -= 1; // diagnal down
                        }
                        tail.x -= 1;
                        let tail_string = format!("{}_{}", tail.x, tail.y);
                        tail_positions.insert(tail_string);
                    }
                },
                "U" => {
                    head.y += 1;
                    if head.y > tail.y + 1 {
                        if head.x > tail.x {
                            tail.x += 1;
                        }
                        if head.x < tail.x {
                            tail.x -= 1;
                        }
                        tail.y += 1;
                        let tail_string = format!("{}_{}", tail.x, tail.y);
                        tail_positions.insert(tail_string);
                    }
                },
                "D" => {
                    head.y -= 1;
                    if head.y < tail.y - 1 {
                        if head.x > tail.x {
                            tail.x += 1;
                        }
                        if head.x < tail.x {
                            tail.x -= 1;
                        }
                        tail.y -= 1;
                        let tail_string = format!("{}_{}", tail.x, tail.y);
                        tail_positions.insert(tail_string);
                    }
                },
                _ => panic!("Unkown Direction!")
            }
        }
    }

    println!("{}", tail_positions.len());
}
