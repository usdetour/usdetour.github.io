// document.getElementById('logo').onClick = function() {
// 	var x = document.getElementById('menu').children.getElementsByTagName('a')
// 	console.log(x)
// }

var shown = false

function toggleMenu(elt) {
	if (shown) {
		var links = document.getElementById('top').children[0].getElementsByTagName('a')
		for (var i=1, l=links.length; i<l; i++) {
			if (links[i].className != 'toggle') links[i].style.display = 'none'
		}
		shown = false
	}
	else {
		var links = document.getElementById('top').children[0].getElementsByTagName('a')
		for (var i=1, l=links.length; i<l; i++) {
			links[i].style.display = 'block'
		}
		shown = true	
	}
}