use core::str;
use std::{
	fs,
	io::{BufRead, BufReader, Write},
	net::{TcpListener, TcpStream},
};
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

	let response = get_response(data.first().cloned().unwrap_or(String::new()))?;
	stream.write_all(response.as_bytes())?;
	println!("Response: {response:#?}");
	Ok(())
}

struct Req<'a> {
	request_type: &'a str,
	path: &'a str,
	version: &'a str,
}

fn get_response(req: String) -> std::io::Result<String> {
	let fs_prefix = String::from("./pages");
	let status_line;
	let contents;
	let length;

	let mut request = req.split(" ");

	let request = Req {
		request_type: request.next().unwrap_or(""),
		path: &request.next().unwrap_or("").replace("../", ""),
		version: request.next().unwrap_or(""),
	};

	use format as f;
	let mut full_request_path: String = f!("{}{}", fs_prefix.clone(), request.path);

	if let Ok(false) = fs::exists(&full_request_path) {
		full_request_path = f!("{full_request_path}.html");
	}

	if request.request_type == "GET" && request.version.eq("HTTP/1.1") {
		if request.path.eq("/") {
			status_line = "HTTP/1.1 200 OK";
			contents = fs::read_to_string(f!("{fs_prefix}/index.html"))?;
		} else if !request.path.eq("") {
			status_line = "HTTP/1.1 200 OK";
			println!("{}", full_request_path);
			contents = fs::read_to_string(full_request_path).unwrap_or(String::new());
		} else {
			println!("{}", fs_prefix.clone() + request.path);
			status_line = "HTTP/1.1 404 NOT FOUND";
			contents = fs::read_to_string("./pages/404.html")?;
		}
	} else {
		status_line = "HTTP/1.1 500 SOMTHING WENT WRONG";
		contents = String::new();
	}

	length = contents.len();
	Ok(String::from(format!(
		"{status_line}\r\nContent-Lenght: {length}\r\n\r\n{contents}"
	)))
}
