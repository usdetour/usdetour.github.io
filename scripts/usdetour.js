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
				var when = elt.innerText.split("in ")[1]
				current.product.discovered = {
					who: elt.children[0].innerText,
					url: url[url.length-1],
					when: when.substr(0, when.indexOf('.') > -1? when.indexOf('.') : when.indexOf('?'))
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
			current.option.media.push(url.slice(url.length-3).join('/'))
		}
		else if (elt.tagName == 'VAR') {
			for (var j=0, len=elt.children.length; j<len; j++) {
				var merchant = { id: '', name: '', url: '', price: 0, logo: null }
				merchant.url = elt.children[j].href
				if (elt.children[j].className != 'direct') {
					merchant.id = elt.children[j].className
					var info = elt.children[j].children[elt.children[j].children.length-1]
					merchant.name = info.children[0].alt
					var logoUrl = info.children[0].src.split('/')
					merchant.logo = logoUrl.slice(logoUrl.length-3).join('/')
					var price = elt.children[j].innerText.substr(1).split(" via")[0]
				}
				else {
					merchant.id = current.product.producer.id
					merchant.name = current.product.producer.name
					var price = elt.children[j].innerText.substr(1)
				}
				if (price.indexOf('.') > -1) {
					merchant.price = price.split('.').join('') * 1
				}
				else {
					merchant.price = price * 100
				}
				current.option.merchants.push(merchant)
			}
			current.product.options.push(current.option)
		}
		// else if (elt.tagName == 'HR' && current.option) {
		// 	current.product.options.push(current.option)
		// }
	}
}

USDetour.view = {}

USDetour.view.list = function() {
	document.styleSheets[1].disabled = true
	document.styleSheets[2].media.deleteMedium('list')
	window.scrollTo(0, 0)
}

USDetour.view.catalog = function() {
	document.styleSheets[1].disabled = false
	document.styleSheets[2].media.appendMedium('list')
	window.scrollTo(0, 0)
}

USDetour.view.data = function() {
	USDetour.scrape()
	document.body.innerHTML = '<pre>' + JSON.stringify(USDetour.products, null, 2) + '</pre>'
}

USDetour.render = function() {

	function header() {
		var a = document.createElement('a')
		var h1 = document.createElement('h1')
		var img = document.createElement('img')
		img.src = 'logo.png'
		img.alt = "U.S. Detour"
		h1.appendChild(img)
		h1.innerHTML += " U.S. Detour"
		var p = document.createElement('p')
		p.innerHTML = "America&rsquo;s Best Stuff"
		h1.appendChild(p)
		a.appendChild(h1)
		return a
	}

	function footer() {
		var address = document.createElement('address')
		var p = document.createElement('p')
		p.className = 'media'
		var list = document.createElement('a')
		list.className = 'list'
		list.setAttribute('onclick', 'USDetour.view.list()')
		list.innerHTML = "List View"
		p.appendChild(list)
		var catalog = document.createElement('a')
		catalog.className = 'catalog'
		catalog.setAttribute('onclick', 'USDetour.view.catalog()')
		catalog.innerHTML = "Catalog View"
		p.appendChild(catalog)
		address.appendChild(p)
		var a = document.createElement('a')
		a.href = 'mailto:detour@usa.com'
		a.innerHTML = "detour@usa.com"
		address.appendChild(a)
		address.innerHTML += " &copy; MMXIV"
	}

	var states = {
		"Colorado": "CO",
		"Florida": "FL",
		"Georgia": "GA",
		"Illinois": "IL",
		"Louisiana": "LA",
		"Maine": "ME",
		"Massachusetts": "MA",
		"New York": "NY",
		"North Carolina": "NC",
		"Ohio": "OH",
		"Pennsylvania": "PA",
		"Tennessee": "TN",
		"Texas": "TX",
		"Vermont": "VT",
		"Wisconsin": "WI"
	}

	USDetour.scrape()
	var departments = []
	var aisles = []
	var page = document.createElement('div')
	page.appendChild(pageTitle())

	for (var i=0, l=USDetour.products.length; i<l; i++) {
		var product = USDetour.products[i]

		// Department
		if (departments.indexOf(product.department.id) == -1) {
			departments.push(product.department.id)
			var h2 = document.createElement('h2')
			h2.id = product.department.id
			var a = document.createElement('a')
			a.href = 'contents.html#' + product.department.id
			a.innerText = product.department.name
			h2.appendChild(a)
			page.appendChild(h2)

			// Aisle
			// TODO Allow dup aisle names in diff depts
			if (product.aisle && aisles.indexOf(product.aisle.id) == -1) {
				aisles.push(product.aisle.id)
				var h3 = document.createElement('h3')
				h3.id = product.aisle.id
				var a = document.createElement('a')
				a.href = 'contents.html#' + product.aisle.id
				a.innerText = product.aisle.name
				h3.appendChild(a)
				page.appendChild(h3)
			}

		}

		// Divider
		else {
			var hr = document.createElement('hr')
			hr.className = 'divider'
			page.appendChild(hr)
		}

		// Product
		var h4 = document.createElement('h4')
		h4.id = product.id
		var a = document.createElement('a')
		a.href = 'contents.html#' + product.id
		a.innerHTML = product.name
		h4.appendChild(a)
		page.appendChild(h4)

		// Producer
		var h5 = document.createElement('h5')
		h5.id = product.id
		var a = document.createElement('a')
		a.href = product.producer.url // TODO 'producers.html#' + product.producer.id
		a.innerHTML = product.producer.name
		h5.innerHTML = "by "
		h5.appendChild(a)
		page.appendChild(h5)

		// Description
		var p = document.createElement('p')
		p.className = 'description'
		p.innerHTML = product.description.join(" ")
		page.appendChild(p)

		// Origin
		var p = document.createElement('p')
		p.className = 'origin'
		var strong = document.createElement('strong')
		strong.innerHTML = "Made in "
		if (product.origin.local) {
			var span = document.createElement('span')
			span.title = product.origin.local // TODO Lookup state abbr
			span.innerHTML = product.origin.state
			strong.appendChild(span)
		}
		else {
			strong.innerHTML += product.origin.state
		}
		p.appendChild(strong)
		page.appendChild(p)

		// Discovered
		var p = document.createElement('p')
		p.className = 'discovered'
		p.innerHTML = "Discovered by "
		var a = document.createElement('a')
		a.href = product.discovered.url
		a.innerHTML = product.discovered.who
		p.appendChild(a)
		p.innerHTML += [" in ", product.discovered.when, "."].join('')
		page.appendChild(p)

		var hr = document.createElement('hr')
		page.appendChild(hr)

		// Options
		for (var j=0, len=product.options.length; j<len; j++) {

			var option = product.options[j]

			if (j) {
				var hr = document.createElement('hr')
				page.appendChild(hr)
			}

			// Details
			var h6 = document.createElement('h6')
			h6.id = option.id
			h6.className = option.color
			var title = document.createElement('a')
			// title.href = 'contents.html#' + option.id
			title.innerHTML = option.title
			h6.appendChild(title)
			var subtitle = document.createElement('em')
			subtitle.innerHTML = option.subtitle
			h6.appendChild(subtitle)
			if (option.model) {
				var model = document.createElement('code')
				model.innerHTML = option.model
				h6.appendChild(model)
			}
			page.appendChild(h6)

			// Image
			var img = document.createElement('img')
			img.src = option.media[0] // TODO Support multiple media
			img.alt = option.title
			page.appendChild(img)

			// Merchants
			var merchants = document.createElement('var')
			for (var k=0, kl=option.merchants.length; k<kl; k++) {
				var merchant = option.merchants[k]
				var a = document.createElement('a')
				a.href = merchant.url
				var price = merchant.price + ""
				var dollars = price.substr(0, price.length-2)
				var cents = price.substr(price.length-2)
				if (cents != "00") {
					a.innerHTML = ["$", dollars, "<sup>.", cents, "</sup> "].join('')	
				}
				else {
					a.innerHTML = "$" + dollars
				}
				if (merchant.logo) {
					a.className = merchant.id
					var strong = document.createElement('strong')
					strong.innerHTML = "via " + merchant.name
					var img = document.createElement('img')
					img.src = merchant.logo
					img.alt = merchant.name
					strong.appendChild(img)
					a.appendChild(strong)
				}
				else {
					a.className = "direct"
				}
				merchants.appendChild(a)
			}
			page.appendChild(merchants)

		}

	}

	page.appendChild(footer())

	document.body.innerHTML = page.innerHTML

}

USDetour.contents = function() {
	// TODO
}

USDetour.states = function() {
	// TODO
}

USDetour.producers = function() {
	// TODO
}
