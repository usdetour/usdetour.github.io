function toggleLocations() {
	var states = document.getElementsByClassName('state')
	for (var i=0, l=states.length; i<l; i++) {
		states[i].onclick = function() {
			var locales = this.getElementsByTagName('b')
			for (var j=0, lj=locales.length; j<lj; j++) {
				var locale = locales[j]
				if (locale.title) {
					if (locale.innerHTML == locale.title) {
						locale.innerHTML = locale.name
					}
					else {
						locale.name = locale.innerHTML
						locale.innerHTML = locale.title
					}
				}
			}
		}
	}
}

window.onload = function() {
	toggleLocations()
}
