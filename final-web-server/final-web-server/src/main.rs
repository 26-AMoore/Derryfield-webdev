use std::{
	io::{BufRead, BufReader, Write},
	net::{TcpListener, TcpStream},
	process::Command,
	thread,
};

fn main() -> Result<(), Box<dyn std::error::Error>> {
	let listener = TcpListener::bind("0.0.0.0:8080")?;
	let mut connections: u64 = 0;
	for stream in listener.incoming().filter_map(|c| c.ok()) {
		connections += 1;
		println!("connection num: {}", connections);
		_ = thread::spawn(move || {
			_ = handle_connections(stream);
			println!("finished connection num: {}", connections);
		});
	}
	Ok(())
}

use final_web_server::dep;
fn handle_connections(mut stream: TcpStream) -> std::io::Result<()> {
	let buf_reader = BufReader::new(&stream);
	let data: Vec<_> = buf_reader
		.lines()
		.map(|m| m.unwrap())
		.take_while(|s| !s.is_empty())
		.collect();

	// println!("Request: {data:#?}");
	/*	_ = Command::new("notify-send")
		.arg("finished")
		.arg(format!("{:#?}", data))
		.output();
	*/

	let header = data.first().map(AsRef::<str>::as_ref).unwrap_or_default();
	let response = dep::get_response(header);
	stream.write_all(response.as_slice())?;
	//	println!("Responded <3");
	//	println!("Response: {response:#?}");
	//	println!("{rez:?}");
	Ok(())
}
