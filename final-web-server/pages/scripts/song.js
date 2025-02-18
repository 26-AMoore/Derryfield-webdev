let fsPrefix = "media/songs/";
let trackName = "NeverGonna";

let player = document.createElement("a");
let playPause = document.createElement("div");
let cover = document.createElement("div");
let track = new Audio(fsPrefix + trackName + ".mp3");
let playing = false;
let songName = trackName;

track.autoplay = false
//track.play();
cover.className = "cover"
player.innerHTML += songName;
playPause.className = "play-pause"
// yk what it works so idc //playPause.innerHTML = "<svg class=\"pause\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 512\"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d=\"M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z\"/></svg>"

playPause.appendChild(track)
player.appendChild(cover)
player.appendChild(playPause)
player.className = "player"

playPause.addEventListener("mousedown", function () {
	playing = !playing;
	console.log("playing: ", playing)
	if (playing) {
		playPause.innerHTML = "<svg class=\"pause\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 512\"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d=\"M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z\"/></svg>"
		track.play()
	} else {
		playPause.innerHTML = "<svg class=\"play\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 384 512\"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d=\"M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z\"/></svg>"
		track.pause()
	}
})
document.body.appendChild(player)
