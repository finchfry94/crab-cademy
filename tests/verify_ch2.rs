use std::cmp::Ordering;

fn check_guess(guess: u32, secret: u32) -> Ordering {
    guess.cmp(&secret)
}

fn parse_input(input: &str) -> u32 {
    input.trim().parse().unwrap_or(0)
}

fn main() {
    let secret = 42;
    let guess_str = "50";
    let guess = parse_input(guess_str);
    
    match check_guess(guess, secret) {
        Ordering::Less => println!("Too small!"),
        Ordering::Greater => println!("Too big!"),
        Ordering::Equal => println!("You win!"),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::cmp::Ordering;

    #[test]
    fn test_check_guess_less() {
        assert_eq!(check_guess(10, 20), Ordering::Less);
    }

    #[test]
    fn test_check_guess_greater() {
        assert_eq!(check_guess(30, 20), Ordering::Greater);
    }

    #[test]
    fn test_check_guess_equal() {
        assert_eq!(check_guess(20, 20), Ordering::Equal);
    }

    #[test]
    fn test_parse_input_valid() {
        assert_eq!(parse_input("42"), 42);
    }

    #[test]
    fn test_parse_input_invalid() {
        assert_eq!(parse_input("hello"), 0);
    }
}
