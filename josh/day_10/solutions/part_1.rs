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
    let mut signal_values = [0, 0, 0, 0, 0, 0];

    for i in 0..220 {
        let cycle = i + 1;

        println!("Cycle {}: {}", cycle, x);

        if cycle >= 20 && ((cycle - 20) % 40) == 0 {
            signal_values[(cycle - 20) / 40] = x * cycle as i32;
            println!("{:?}", signal_values);
        }
        
        if read {
            let instruction = lines.pop_front().unwrap();
            println!("Instruction: {}", instruction);
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

    println!("{}", signal_values.iter().sum::<i32>())
}
