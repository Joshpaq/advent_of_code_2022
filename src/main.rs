use std::fs::{File};
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

#[derive(Clone, Debug, Eq, PartialEq)]
struct Point {
    x: usize,
    y: usize,
    elevation: usize
}

impl Point {
    fn get_possible_next(&self, map: &[Vec<Point>]) -> Vec<Point> {
        let mut possible_next: Vec<Point> = vec![];
        let height = map.len();
        let width = map[self.y].len();
        
        if self.y > 0 && self.elevation + 1 >= map[self.y - 1][self.x].elevation {
            possible_next.push(Point { x: self.x, y: self.y - 1, elevation: map[self.y - 1][self.x].elevation });
        }

        if self.y < height - 1 && self.elevation + 1 >= map[self.y + 1][self.x].elevation {
            possible_next.push(Point { x: self.x, y: self.y + 1, elevation: map[self.y + 1][self.x].elevation });
        }

        if self.x > 0 && self.elevation + 1 >= map[self.y][self.x - 1].elevation {
            possible_next.push(Point { x: self.x - 1, y: self.y, elevation: map[self.y][self.x - 1].elevation });
        }

        if self.x < width - 1 && self.elevation + 1 >= map[self.y][self.x + 1].elevation {
            possible_next.push(Point { x: self.x + 1, y: self.y, elevation: map[self.y][self.x + 1].elevation });
        }

        possible_next
    }

    fn distance (&self, other: &Point) -> usize {
        return other.x.abs_diff(self.x) + other.y.abs_diff(self.y)
    }
}

fn char_to_height (c: char) -> usize {
    match c {
        'a' | 'A' => 1, 
        'b' | 'B' => 2, 
        'c' | 'C' => 3, 
        'd' | 'D' => 4, 
        'e' | 'E' => 5, 
        'f' | 'F' => 6, 
        'g' | 'G' => 7, 
        'h' | 'H' => 8, 
        'i' | 'I' => 9, 
        'j' | 'J' => 10, 
        'k' | 'K' => 11, 
        'l' | 'L' => 12, 
        'm' | 'M' => 13, 
        'n' | 'N' => 14, 
        'o' | 'O' => 15, 
        'p' | 'P' => 16, 
        'q' | 'Q' => 17, 
        'r' | 'R' => 18, 
        's' | 'S' => 19, 
        't' | 'T' => 20, 
        'u' | 'U' => 21, 
        'v' | 'V' => 22,
        'w' | 'W' => 23,
        'x' | 'X' => 24,
        'y' | 'Y' => 25,
        'z' | 'Z' => 26,
        _ => panic!("UNHANDLED CHAR")
    }
}

fn calculate (start: (usize, usize), end: (usize, usize), map: &Vec<Vec<Point>>) -> usize {
    let height = map.len();
    let width = map.get(0).unwrap().len();

    let mut points: Vec<Point> = vec![];
    map.iter().for_each(|row| {
        row.iter().for_each(|p| {
            points.push(p.clone())
        })
    });

    println!("{:?}", end);
    
    println!("{:?}", points);

    let mut shortest = usize::MAX;

    let start = map.get(start.0).unwrap().get(start.1).unwrap();
    let stop = Point { x: end.0, y: end.1, elevation: 0 };
    let mut path: Vec<Point> = vec![start.clone()];
    let mut possible_next = start.get_possible_next(map);
    let mut dead: Vec<Point> = vec![];

    println!("POSSIBLE NEXT FROMT START: {:?}", possible_next);
    let mut current_distance = start.distance(&stop);

    while let Some(p) = possible_next.pop() {
        println!("Current Point: {:?}", p);

        if p.distance(&stop) > current_distance {
            continue;
        }

        // using current distance isn't right, I need a way to unwind the possible next and choose a different branch.. i'm close
        current_distance = p.distance(&stop);

        if let Some(_) = dead.iter().find(|d| d.x == p.x && d.y == p.y) {
            println!("Dead: {:?}", p);
            continue;
        }

        if let Some(_) = path.iter().find(|d| d.x == p.x && d.y == p.y) {
            println!("Been Here: {:?}", p);
            continue;
        }

        path.push(p.clone());
        if p.x == end.0 && p.y == end.1 && shortest > path.len() {
            println!("FOUND IT?!!: {:?}", path);
            shortest = path.len();
            break;
        }
        
        println!("Path: {:?}", path);

        possible_next = p.get_possible_next(map);

        println!("{:?}", possible_next);

        if possible_next.len() == 0 {
            dead.push(path.pop().unwrap());
            possible_next = path.last().unwrap().get_possible_next(map);
        }
    }
    
    shortest
}

fn main() {
    let args = Args::parse();

    let lines = read_lines_from_file(args.filename);

    let mut start: (usize, usize) = (0, 0);
    let mut end: (usize, usize) = (0, 0);

    let map: Vec<Vec<Point>> = lines.iter().enumerate().map(|(y, row)| {
        row.chars().enumerate().map(|(x, c)| {
            if c == 'S' {
                start.0 = x;
                start.1 = y;
            }

            if c == 'E' {
                end.0 = x;
                end.1 = y;
            }

            Point { x, y, elevation: char_to_height(c) }
        }).collect()
    }).collect();

    println!("{:?}", calculate(start, end, &map));
}
