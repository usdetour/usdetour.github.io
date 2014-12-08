function listView() {
	document.styleSheets[1].disabled = true;
	document.styleSheets[2].media.deleteMedium('list');
	window.scrollTo(0, 0);
}

function catalogView() {
	document.styleSheets[1].disabled = false;
	document.styleSheets[2].media.appendMedium('list');
	window.scrollTo(0, 0);
}
