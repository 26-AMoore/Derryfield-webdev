let circle;
let trueX, trueY;

let selected = false;
let onSelector = false;
let onSurroundingElement = false;

let clickTime = 0;
const maxLen = 10;
const debounce = 200;
const selectorSize = 200;
const petals = ["/", "how-this-was-made", "what-i-got-done", "what-i-hoped-to-do", "dne"];

document.addEventListener("mousedown", function(event) {
	let onClickable =event.target.closest("div") || event.target.closest("a") || event.target.closest("button") || event.target.closest(".sidebar") ||
		event.target.closest("svg");
	console.log(onClickable)

	if (event.button == 0 && document.getElementById("selector") == null && !onClickable) {
		circle = document.createElement("div");
		document.body.style.userSelect = "none";

		circle.id = "selector";
		onSelector = true;

		trueX = event.clientX;
		trueY = event.clientY;
		circle.className = "selector";
		circle.style.borderRadius = "50%";
		circle.style.position = "fixed";
		circle.style.left = trueX - selectorSize / 2 + "px";
		circle.style.top = trueY - selectorSize / 2 + "px";
		circle.style.width = selectorSize + "px";
		circle.style.height = selectorSize + "px";
		circle.style.display = "words";
		circle.style.opacity = "10%";
		circle.style.pointerEvents = "bounding-box";

		document.body.appendChild(circle);

		createSurroundingElements(petals, event);
		addCenter(event);

		circle.addEventListener("mouseleave", function(event) { // hackey but works
			onSelector = false;
			left(event);
		})

		circle.addEventListener("mouseup", function() {
			console.log("mousedown mid")
			if (clickTime > debounce) {
				clean();
			}
			clickTime = debounce + 1; //hackey but works :D
		})

	}
});

function left(event) {
	let diffX = Math.abs(event.clientX - trueX);
	let diffY = Math.abs(event.clientY - trueY);
	if (diffX + diffY > selectorSize / 2) {
		clean();
	}
}

function clean() {

	if (circle) {
		circle.remove();
		circle = null;
		document.body.style.userSelect = "";
		document.querySelectorAll('.selector-links').forEach(element => element.remove());
		document.querySelectorAll(".center").forEach(element => element.remove());
	}
}

function addCenter(event) {
	mouseDown = true;
	const size = 0.21 * selectorSize;

	clickTime = 0;

	let id = setInterval(() => {clickTime++; if (clickTime > debounce) {clearInterval(id)}}, 1); //TODO! make this better

	const center = document.createElement("div");
	center.className = "center";
	center.style.position = "fixed";
	center.style.width = size + "px";
	center.style.height = size + "px";
	center.style.textAlign = "center";
	center.style.textDecoration = "none";
	center.style.borderRadius = "50%"
	center.style.background = "yellow";

	center.addEventListener("mouseenter", function() {
		onSurroundingElement = true;
	})

	center.addEventListener("mouseup", function() {
		console.log("mousedown mid")
		if (clickTime > debounce) {
			clean();
		}
		clickTime = debounce + 1; //hackey but works :D
	})

	center.style.left = trueX - size / 2 + "px";
	center.style.top = trueY - size / 2 + "px";

	document.body.appendChild(center);
}

function createSurroundingElements(labels, event) {
	const surroundingElements = labels.length;
	const radius = selectorSize / 3;
	const elemHeight = selectorSize / surroundingElements * 1.5;
	const elemWidth = selectorSize / 3;

	for (let i = 0; i < surroundingElements; i++) {
		const angle = (i / surroundingElements) * 2.0 * Math.PI;
		const offsetX = Math.cos(angle) * radius;
		const offsetY = Math.sin(angle) * radius;


		const surroundingElement = document.createElement("a");
		surroundingElement.className = "selector-links";
		surroundingElement.style.position = "fixed";
		surroundingElement.style.width = elemWidth * 1.5 + "px";
		surroundingElement.style.height = elemHeight + "px";
		surroundingElement.style.textAlign = "center";
		surroundingElement.style.lineHeight = elemHeight + "px";
		surroundingElement.style.textDecoration = "none";
		surroundingElement.style.opacity = "90%";
		surroundingElement.style.transform = "rotate(" + angle + "rad)";
		surroundingElement.href = labels[i];

		surroundingElement.addEventListener("mousedown", function() {
			console.log(labels[i]);
		})
		surroundingElement.addEventListener("mouseenter", function() {
			onSurroundingElement = true;
		})
		surroundingElement.addEventListener("mouseleave", function() {
			onSurroundingElement = false;
			left(event);
		})

		surroundingElement.textContent = labels[i] //labels[i].slice(0, maxLen);

		surroundingElement.style.left = trueX - elemWidth * 1.5 / 2 + offsetX + "px";
		surroundingElement.style.top = trueY - elemHeight / 2 + offsetY + "px";

		document.body.appendChild(surroundingElement);
	}
}
