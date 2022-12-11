use std::fs::File;
use std::io::{prelude::*, BufReader};
use clap::Parser;
use std::collections::{HashSet, VecDeque};

#[derive(Parser)]
struct Args {
    #[clap(short)]
    filename: String
}

fn read_lines_from_file (filename: String) -> VecDeque<String> {
    let file = File::open(filename).expect("");
    let buffer = BufReader::new(file);
    buffer.lines()
        .map(|line| line.expect(""))
        .collect()
}

fn main() {
    let args = Args::parse();

    let mut lines = read_lines_from_file(args.filename);

    let mut x = 1;
    let mut read = true;
    let mut value: i32 = 0;
    let mut crt = [["."; 40], ["."; 40], ["."; 40], ["."; 40], ["."; 40], ["."; 40]];

    for i in 0..240 {
        let cycle = i + 1;


        let vertical = i / 40;
        let horizontal = i % 40;
        let horizontal_within_x_bounds = (horizontal as i32 - x).abs() < 2;
        if horizontal_within_x_bounds {
            crt[vertical][horizontal] = "#";
        }

        if read {
            let instruction = match lines.pop_front() {
                Some(v) => v,
                None => break
            };

            if instruction != "noop" {
                let split_instruction = instruction.split_whitespace().collect::<Vec<&str>>();
                value = split_instruction[1].parse().unwrap();
                read = false;
            }
        } else {
            x += value;
            value = 0;
            read = true;
        }
    }

    println!("{:?}", crt[0].join(""));
    println!("{:?}", crt[1].join(""));
    println!("{:?}", crt[2].join(""));
    println!("{:?}", crt[3].join(""));
    println!("{:?}", crt[4].join(""));
    println!("{:?}", crt[5].join(""));
}
