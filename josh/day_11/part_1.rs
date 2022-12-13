use std::fs::{File};
use std::io::{prelude::*, BufReader};
use clap::Parser;
use regex::Regex;

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

#[derive(Debug)]
struct Monkey {
    items: Vec<usize>,
    test: usize,
    true_monkey: usize,
    false_monkey: usize,
    operation: String,
    inspections: usize
}

fn calculate_operation (operation: &str, old: usize) -> usize {
    let split: Vec<&str> = operation.split_whitespace().collect();
    let left = &split.get(0).unwrap()[..];
    let op = &split.get(1).unwrap()[..];
    let right = &split.get(2).unwrap()[..];
    let left_value: usize = if left == "old" { old } else { left.parse().unwrap() };
    let right_value: usize = if right == "old" { old } else { right.parse().unwrap() };

    match op {
        "+" => left_value + right_value,
        "*" => left_value * right_value,
        _ => panic!("UNKNWON OP")
    }
}

fn get_starting_items (line: &str) -> Vec<usize> {
    let split_line: Vec<&str> = line.split(":").collect();
    split_line.get(1).unwrap().split(",").map(|v: &str| v.trim().parse::<usize>().unwrap()).collect::<Vec<usize>>()
}

fn get_operation_str (line: &str) -> &str {
    let split_line: Vec<&str> = line.split("=").collect();
    split_line.get(1).unwrap().trim()
}

fn main() {
    let args = Args::parse();

    let lines = read_lines_from_file(args.filename);

    let mut monkeys: Vec<Monkey>= Vec::new();

    let starting_items_regex = Regex::new(r"Starting items:").unwrap();
    let test_regex = Regex::new(r"Test: divisible by (\d+)").unwrap();
    let true_regex = Regex::new(r"If true: throw to monkey (\d+)").unwrap();
    let false_regex = Regex::new(r"If false: throw to monkey (\d+)").unwrap();
    let operation_regex = Regex::new(r"Operation:").unwrap();

    let mut starting_items: Vec<usize> = Vec::new();
    let mut test: usize = 0;
    let mut true_monkey: usize = 0;
    let mut false_monkey: usize = 0;
    let mut operation: &str = "";
    for line in lines.iter() {
        if starting_items_regex.is_match(line) {
            starting_items = get_starting_items(line).clone();
        }

        if operation_regex.is_match(line) {
            operation = get_operation_str(line);
        }

        if let Some(test_line) = test_regex.captures(line) {
            test = test_line.get(1).unwrap().as_str().parse().unwrap();
        }

        if let Some(true_line) = true_regex.captures(line) {
            true_monkey = true_line.get(1).unwrap().as_str().parse().unwrap();
        }

        if let Some(false_line) = false_regex.captures(line) {
            false_monkey = false_line.get(1).unwrap().as_str().parse().unwrap();
            monkeys.push(Monkey { items: starting_items.clone(), test, true_monkey, false_monkey, operation: operation.to_string(), inspections: 0 })
        }
    }

    let mut items: Vec<Vec<usize>> = vec![vec![]; monkeys.len()];
    (0..20).for_each(|_| {
        monkeys.iter_mut().enumerate().for_each(|(i, monkey)| {
            monkey.items.append(&mut items[i]);
            monkey.items.drain(..).for_each(|item| {
                let result = calculate_operation(&monkey.operation, item) / 3;
                let monkey_index = if result % monkey.test == 0 { monkey.true_monkey } else { monkey.false_monkey };
                items[monkey_index as usize].push(result);
                monkey.inspections += 1;
            })
        })
    });

    let mut monkey_inspections = monkeys.iter().map(|monkey| monkey.inspections).collect::<Vec<usize>>();
    monkey_inspections.sort();
    monkey_inspections.reverse();
    println!("{}", monkey_inspections.get(0).unwrap() * monkey_inspections.get(1).unwrap());
}
