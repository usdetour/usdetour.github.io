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
		product: null
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
			// TODO
		}
		else if (elt.tagName == 'H6') {
			// TODO
		}
		else if (elt.tagName == 'VAR') {
			// TODO
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
