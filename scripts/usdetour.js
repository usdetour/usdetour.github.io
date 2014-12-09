USDetour = {
	departments: {},
	aisles: {},
	products: {},
	producers: {},
	merchants: {}
}

USDetour.getElementName = function(elt) {
	var name = (elt.children.length? elt.children[0] : elt).textContent.trim()
	return name
}

USDetour.getElementId = function(elt) {
	return USDetour.getElementName(elt)
		.replace(/\s/g, '_')
		.replace(/&/g, 'and')
		.toLowerCase()
}

USDetour.parse = function() {
	var elts = document.body.children
	var current = {
		department: null,
		aisle: null,
		product: null,
		option: null
	}
	for (var i=0, l=elts.length; i<l; i++) {
		var elt = elts[i]
		if (elt.tagName == 'H2') {
			current.department = USDetour.getElementId(elt)
			current.aisle = null
			USDetour.departments[current.department] = {
				name: USDetour.getElementName(elt)
			}
		}
		else if (elt.tagName == 'H3') {
			current.aisle = USDetour.getElementId(elt)
			USDetour.aisles[current.aisle] = {
				name: USDetour.getElementName(elt),
				department: current.department
			}
		}
		else if (elt.tagName == 'H4') {
			current.product = USDetour.getElementId(elt)
			USDetour.products[current.product] = {
				department: current.department,
				aisle: current.aisle,
				name: USDetour.getElementName(elt)
			}
		}
		else if (elt.tagName == 'H5') {
			var name = USDetour.getElementName(elt)
			current.producer = USDetour.getElementId(elt)
			USDetour.producers[current.producer] = {
				name: name
			}
			USDetour.products[current.product].producer = USDetour.getElementId(elt)
		}
		else if (elt.tagName == 'P') {
			if (elt.className == 'description') {
				USDetour.products[current.product].description = elt.innerText.substr(0, elt.innerText.length-1).trim().split('. ')
			}
			else if (elt.className == 'origin') {
				var local = null
				if (elt.children[0].children[0]) {
					var local = elt.children[0].children[0].title.split(',')[0]
				}
				USDetour.products[current.product].origin = {
					state: elt.innerText.split("Made in ")[1],
					local: local
				}
			}
			else if (elt.className == 'discovered') {
				var url = elt.children[0].href.split('/')
				var date = elt.innerText.split("in ")[1]
				USDetour.products[current.product].discovered = {
					person: elt.children[0].innerText,
					address: url[url.length-1],
					date: date.substr(0, date.indexOf('.') > -1? date.indexOf('.') : date.indexOf('?'))
				}
			}
		}
		else if (elt.tagName == 'H6') {
			current.option = {
				id: elt.id,
				color: elt.className,
				title: elt.children[0].innerText,
				subtitle: elt.children[1].innerText,
				model: elt.children[2].innerText,
				media: [],
				merchants: []
			}
		}
		else if (elt.tagName == 'IMG') {
			var url = elt.src.split('/')
			current.option.media.push(url[url.length-1])
		}
		else if (elt.tagName == 'VAR') {
			var merchant = {}
		}
		else if (elt.tagname == 'HR') {
			USDetour.products[current.product].options.push(current.option)
			current.product = null
		}
	}
}

USDetour.show = function(x) {
	USDetour.parse()
	return JSON.stringify(USDetour[x], null, 2)
}

USDetour.count = function(x) {
	USDetour.parse()
	return Object.keys(USDetour[x]).length
}
