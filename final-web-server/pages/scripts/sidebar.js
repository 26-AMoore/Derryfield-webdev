fetch("sidebar.html")
	.then(res => res.text())
	.then(res => {document.body.insertAdjacentHTML("afterend", res)})
	.catch(e => {console.log(e)})
/*
	let burger;

if (burger == null) {

	burger = document.createElement("div");

	burger.id = "burger";
	burger.className = "burger";
	burger.style.borderRadius = "10%";
	burger.style.width = "50px";
	burger.style.height = "50px";
	burger.style.background = "green";
	burger.style.position = "fixed";
	burger.style.top = "5%";
	burger.style.left = "5%";

	document.body.appendChild(burger);

	burger.addEventListener("mousedown", function (event) {
		console.log("clicked");
	})
}
	*/
