USDetour = {}

USDetour.products = []

USDetour.getElementName = function(elt) {
	var name = (elt.children.length? elt.children[0] : elt).textContent.trim()
	return name
}

USDetour.getElementId = function(elt) {
	return USDetour.getElementName(elt)
		.replace(/\s/g, '-')
		.replace(/&/g, 'and')
		.toLowerCase()
}

USDetour.scrape = function() {
	var elts = document.body.children
	var current = {
		product: null,
		option: null
	}
	for (var i=0, l=elts.length; i<l; i++) {
		var elt = elts[i]
		if (elt.tagName == 'H2') {
			current.department = {
				id: elt.id,
				name: USDetour.getElementName(elt)
			}
			current.aisle = null
		}
		else if (elt.tagName == 'H3') {
			current.aisle = {
				id: elt.id,
				name: USDetour.getElementName(elt)
			}
		}
		else if (elt.tagName == 'H4') {
			current.product = {
				department: current.department,
				aisle: current.aisle,
				id: elt.id,
				name: USDetour.getElementName(elt),
				producer: {},
				description: [],
				origin: {},
				discovered: {},
				options: []
			}
			USDetour.products.push(current.product)
		}
		else if (elt.tagName == 'H5') {
			current.product.producer = {
				id: USDetour.getElementId(elt),
				name: USDetour.getElementName(elt),
				url: elt.children[0].href
			}
		}
		else if (elt.tagName == 'P') {
			if (elt.className == 'description') {
				var desc = elt.innerHTML.substr(0, elt.innerHTML.length-1).trim().split('\n\t\t')
				current.product.description = desc
			}
			else if (elt.className == 'origin') {
				var local = null
				if (elt.children[0].children[0]) {
					var local = elt.children[0].children[0].title.split(',')[0]
				}
				current.product.origin = {
					state: elt.innerText.split("Made in ")[1],
					local: local
				}
			}
			else if (elt.className == 'discovered') {
				var url = elt.children[0].href.split('/')
				var date = elt.innerText.split("in ")[1]
				current.product.discovered = {
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
			url = url[url.length-1]
			current.option.media.push(url)
		}
		else if (elt.tagName == 'VAR') {
			for (var j=0, len=elt.children.length; j<len; j++) {
				var merchant = { id: '', name: '', url: '', price: 0, logo: null }
				if (elt.children[j].children[1]) {
					merchant.id = elt.children[j].className
					merchant.name = elt.children[j].children[1].children[0].alt
					var logoUrl = elt.children[j].children[1].children[0].src.split('/')
					logoUrl = logoUrl[logoUrl.length-1]
					merchant.logo = logoUrl
				}
				else {
					merchant.id = current.product.producer.id
					merchant.name = current.product.producer.name
				}
				merchant.url = elt.children[j].href
				merchant.price = elt.children[j].innerText.substr(1).split(" via")[0].split('.').join('') * 1
				current.option.merchants.push(merchant)
			}
		}
		else if (elt.tagName == 'HR') {
			current.product.options.push(current.option)
		}
	}
}

USDetour.show = function(x) {
	USDetour.scrape()
	return JSON.stringify(USDetour[x], null, 2)
}

USDetour.count = function(x) {
	USDetour.scrape()
	return Object.keys(USDetour[x]).length
}

USDetour.render = function() {
	for (var i=0, l=USDetour.products.length; i<l; i++) {
		var product = USDetour.products[i]
		// TODO
	}
}
