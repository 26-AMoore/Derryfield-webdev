pub struct Request<'a> {
	request_type: &'a str,
	path: &'a str,
	version: &'a str,
}

pub mod dep {

	use crate::parser::Request;

	use super::request_line::{self, ReadResult};

	pub fn get_response(req: String) -> Vec<u8> {
		let status_line;
		let contents;
		let length: u16;

		let mut request = req.split(" ");

		let request = Request {
			request_type: request.next().unwrap_or(""),
			path: &request.next().unwrap_or("").replace("../", ""),
			version: request.next().unwrap_or(""),
		};

		if request.request_type == "GET" && request.version.eq("HTTP/1.1") {
			status_line = "HTTP/1.1 200 OK";
			contents = request_line::get_target(request);
		} else {
			status_line = "HTTP/1.1 500 SOMTHING WENT WRONG";
			contents = ReadResult::None;
		}

		let length = match contents.clone() {
			ReadResult::Text(e) => e.len(),
			ReadResult::Binary(vec) => vec.len(),
			ReadResult::None => 0,
		};
		match contents {
			ReadResult::Text(e) => String::from(format!(
				"{status_line}\r\nContent-Length: {length}\r\n\r\n{e}"
			))
			.as_bytes()
			.to_vec(),
			ReadResult::Binary(vec) => [
				String::from(format!("{status_line}\r\nContent-Length: {length}\r\n\r\n"))
					.as_bytes()
					.to_vec(),
				vec,
			]
			.concat(),
			ReadResult::None => String::from(format!("{status_line}\r\n\r\n\r\n"))
				.as_bytes()
				.to_vec(),
		}
	}
}

pub mod request_line {
	use std::fs;

	use super::Request;

	pub fn validate_req_line(request: Request) -> std::io::Result<bool> {
		if request.version.ne("HTTP/1.1") {
			return Ok(false);
		}
		return Ok(true);
	}
	#[derive(Clone)]
	pub enum ReadResult {
		Text(String),
		Binary(Vec<u8>),
		None,
	}
	pub fn get_target(request: Request) -> ReadResult {
		let fs_prefix = String::from("./pages");
		let mut full_request_path: String = f!("{}{}", fs_prefix.clone(), request.path);

		let error_404_file = "404.html"; // change later if you want
		let home_file = "index.html";

		use format as f;
		if let Ok(false) = fs::exists(&full_request_path) {
			full_request_path = f!("{full_request_path}.html");
		};
		if fs::exists(&full_request_path).is_ok() {
			match {
				if request.path.eq("/") {
					fs::read_to_string(f!("{fs_prefix}/{home_file}"))
				} else {
					fs::read_to_string(&full_request_path)
				}
			} {
				Ok(e) => ReadResult::Text(e),
				Err(_) => match fs::read(&full_request_path) {
					Ok(e) => ReadResult::Binary(e),
					Err(_) => ReadResult::Text(
						fs::read_to_string(f!("{fs_prefix}/{error_404_file}")).unwrap(),
					),
				},
			}
		} else {
			ReadResult::Text(fs::read_to_string(f!("{fs_prefix}/{error_404_file}")).unwrap())
		}
	}
}
pub mod headers {}
pub mod body {}
