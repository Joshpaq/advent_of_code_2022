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

fn left (parent: &Knot, mut current: &mut Knot) {
    if parent.x < current.x - 1 {
        if parent.y > current.y {
            current.y += 1;
        }
        if parent.y < current.y {
            current.y -= 1;
        }
        current.x -= 1;
    }
}

fn right (parent: &Knot, mut current: &mut Knot) {
    if parent.x > current.x + 1 {
        if parent.y > current.y {
            current.y += 1;
        }
        if parent.y < current.y {
            current.y -= 1;
        }
        current.x += 1;
    }
}

fn up (parent: &Knot, mut current: &mut Knot) {
    if parent.y > current.y + 1 {
        if parent.x > current.x {
            current.x += 1;
        }
        if parent.x < current.x {
            current.x -= 1;
        }
        current.y += 1;
    }
}

fn down (parent: &Knot, mut current: &mut Knot) {
    if parent.y < current.y - 1 {
        if parent.x > current.x {
            current.x += 1;
        }
        if parent.x < current.x {
            current.x -= 1;
        }
        current.y -= 1;
    }
}

struct Knot {
    x: i32,
    y: i32
}

struct Rope {
    knots: Vec<Knot>
}

impl Rope {
    fn new(knot_count: i32) -> Rope {
        if knot_count < 2 {
            panic!("Ropes must have 2 or more knots!")
        }

        let mut knots: Vec<Knot> = Vec::new();
        for _ in 0..knot_count { knots.push(Knot { x: 0, y: 0 })}

        Rope { knots }
    }

    fn step (&mut self, direction: &str) {
        let mut parent_knot = Knot { x: 0, y: 0 };

        for (i, knot) in self.knots.iter_mut().enumerate() {
            if i == 0 {
                match direction {
                    "R" => { knot.x += 1 },
                    "L" => { knot.x -= 1 },
                    "U" => { knot.y += 1 },
                    "D" => { knot.y -= 1 },
                    _ => panic!("Unknown Direction")
                }
            } else {
                match direction {
                    "R" => {
                        right(&parent_knot, knot);
                        up(&parent_knot, knot);
                        down(&parent_knot, knot);
                    },
                    "L" => {
                        left(&parent_knot, knot);
                        up(&parent_knot, knot);
                        down(&parent_knot, knot);
                    },
                    "U" => {
                        up(&parent_knot, knot);
                        right(&parent_knot, knot);
                        left(&parent_knot, knot);
                    },
                    "D" => {
                        down(&parent_knot, knot);
                        right(&parent_knot, knot);
                        left(&parent_knot, knot);
                    },
                    _ => panic!("Unkown Direction!")
                }
            }
    
            parent_knot.x = knot.x;
            parent_knot.y = knot.y;
        }
    }
}

fn main() {
    let args = Args::parse();

    let lines = read_lines_from_file(args.filename);

    let mut tail_history: HashSet<String> = HashSet::new();
    let mut rope = Rope::new(10);

    for line in lines {
        let split_line = line.split_whitespace().collect::<Vec<&str>>();
        let direction = *split_line.get(0).unwrap();
        let amount: i32 = split_line.get(1).unwrap().parse().unwrap();

        for _ in 0..amount {
            rope.step(direction);
            let last = rope.knots.last().unwrap();
            let tail_string = format!("{}_{}", last.x, last.y);
            tail_history.insert(tail_string);
        }
    }

    println!("{}", tail_history.len())
}
