use std::collections::HashSet;
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

#[derive(Debug)]
struct Directory {
    name: String,
    size: i64
}

fn main() {
    let args = Args::parse();

    let lines = read_lines_from_file(args.filename);

    let mut directories: Vec<Directory> = vec![Directory { name: "/".to_string(), size: 0 }];
    let mut path: Vec<String> = vec![];

    for line in lines.iter() {
        let parts: Vec<&str> = line.split_whitespace().collect();

        if parts[0] == "$" {
            if parts[1] == "cd" {
                if parts[2] == ".." {
                    path.pop();
                } else {
                    path.push(parts[2].to_string());
                    directories.push(Directory { name: path.join("_"), size: 0 });
                }
            }
        } else if parts[0] != "dir" {
            let mut b = path.clone();
            while b.len() > 0 {
                let flat_path = b.join("_");

                let directory = directories.iter_mut().find(|d| d.name.eq(&flat_path)).unwrap();
                directory.size += parts[0].parse::<i64>().unwrap();

                b.pop();
            }
        }
    }

    let outer = directories.iter().find(|d| d.name.eq("/")).unwrap();

    println!("{}", directories.iter().filter(|x| x.size <= 100000).map(|x| x.size).sum::<i64>());
    println!("{}", directories.iter().filter(|x| x.size >= 30000000 - (70000000 - outer.size)).map(|x| x.size).min().unwrap());
}
