use std::{
	io::{BufRead, BufReader, Write},
	net::{TcpListener, TcpStream},
};
mod parser;
pub use parser::dep;

fn main() -> Result<(), Box<dyn std::error::Error>> {
	let listener = TcpListener::bind("127.0.0.1:7878")?;
	for stream in listener.incoming().filter_map(|c| c.ok()) {
		println!("NEW CONNECTION");
		handle_connections(stream)?;
	}
	Ok(())
}

fn handle_connections(mut stream: TcpStream) -> std::io::Result<()> {
	let buf_reader = BufReader::new(&stream);
	let data: Vec<_> = buf_reader
		.lines()
		.map(|m| m.unwrap())
		.take_while(|s| !s.is_empty())
		.collect();

	println!("Request: {data:#?}");

	let response = dep::get_response(data.first().cloned().unwrap_or(String::new()));
	_ = stream.write_all(response.as_slice());
	println!("Responded <3");
	//	println!("Response: {response:#?}");
	//	println!("{rez:?}");
	Ok(())
}
