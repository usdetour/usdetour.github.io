function toggleLocations() {
	var states = document.getElementsByClassName('state')
	for (var i=0, l=states.length; i<l; i++) {
		states[i].onclick = function() {
			var localities = this.getElementsByTagName('b')
			for (var j=0, lj=localities.length; j<lj; j++) {
				var locale = localities[j]
				if (locale.title) {
					if (locale.innerText == locale.title) {
						locale.innerText = locale.name
					}
					else {
						locale.name = locale.innerText
						locale.innerText = locale.title
					}
				}
			}
		}
	}
}

var shownMenu = false

function toggleMenu(elt) {
	if (shownMenu) {
		var links = document.getElementById('top').children[0].getElementsByTagName('a')
		for (var i=1, l=links.length; i<l; i++) {
			if (links[i].className != 'toggle') links[i].style.display = 'none'
		}
		shownMenu = false
	}
	else {
		var links = document.getElementById('top').children[0].getElementsByTagName('a')
		for (var i=1, l=links.length; i<l; i++) {
			links[i].style.display = 'block'
		}
		shownMenu = true
	}
}

document.body.onload = function() {
	toggleLocations()
}
