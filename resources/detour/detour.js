Detour = {}

// Extract data as UON from HTML
Detour.extract = function() {
	// TODO
}

// Lookup item price
Detour.priceCheck = function() {
	// TODO
	// Generate Amazon API request
	// modify object with response
}

// UON -> JSON
Detour.toJSON = function(str) {
	str = str || document.body.textContent
	var obj = { options: [] }
	var arr = str.split('\n')
	arr.pop()
	var options = 0
	for (var i in arr) {
		var field = arr[i].split('=')
		var key = field[0]
		var val = field[1] || ""
		var prop = key.split('-')
		var option_number = prop[1]
		// TODO Nested objects from prop
		if (prop[0] == 'option') {
			if (!obj.options[option_number]) {
				obj.options[option_number] = {}
			}
			var opt_key = prop.slice(2).join('-')
			obj.options[option_number][opt_key] = val
		}
		else if (key) {
			obj[key] = val
		}
	}
	return JSON.stringify(obj, null, 4)
}

// JSON -> HTML
Detour.toHTML = function(obj) {

	obj = obj || JSON.parse(Detour.toJSON())

	// TODO price check

	var elts = []

	var product = document.createElement('a')
	product.href = obj['product-link']
	var h4 = document.createElement('h4')
	h4.textContent = obj['product-line']
	product.appendChild(h4)
	elts.push(product)

	var h5 = document.createElement('h5')
	var manufacturer = document.createElement('a')
	manufacturer.href = obj['manufacturer-link']
	manufacturer.textContent = obj['manufacturer-name']
	h5.innerHTML = "by"
	h5.appendChild(manufacturer)
	elts.push(h5)

	var desc = document.createElement('p')
	desc.textContent = obj['features'] || ''
	desc.textContent += obj['materials'] || ''
	desc.textContent = desc.textContent.replace('.', '.\n')
	elts.push(desc)

	var made = document.createElement('p')
	made.textContent = ["Made in ", obj['made'] || "the United States", "."].join("")
	elts.push(made)

	elts.push(document.createElement('hr'))

	for (var i in obj.options) {
		var option = obj.options[i]
		if (option.name) {

			var h6 = document.createElement('h6')
			h6.className = option.color
			var name = document.createTextNode(option.name)
			var link = document.createElement('a')
			link.href = option.link
			h6.appendChild(name)
			h6.appendChild(document.createElement('br'))
			h6.appendChild(link)
			elts.push(h6)

			var pic = document.createElement('p')
			var img = document.createElement('img')
			img.src = ['resources', obj['manufacturer-id'], option.name.toLowerCase()+'.jpg'].join('/')
			pic.appendChild(img)
			elts.push(pic)

			var price = document.createElement('var')
			var link = document.createElement('a')
			link.href = 'http://amazon.com/dp/' + option['merchant-product-id'] // TODO hardcoded
			link.innerHTML = option['merchant-price'] + "&cent;"
			var merchantLogo = document.createElement('img')
			merchantLogo.src = 'resources/amazon/logo.png' // TODO hardcoded
			link.appendChild(merchantLogo)
			price.appendChild(link)
			elts.push(price)

		}
	}

	var html = ''
	for (var i in elts) {
		html += elts[i].outerHTML
	}
	return html

}
