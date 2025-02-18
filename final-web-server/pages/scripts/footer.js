fetch("footer.html")
	.then(res => res.text())
	.then(res => {document.body.insertAdjacentHTML("afterend", res)})
	.catch(e => {console.log(e)})
