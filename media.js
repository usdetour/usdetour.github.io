function print() {
	document.styleSheets[1].disabled = true;
	document.styleSheets[2].media.deleteMedium('print');
	window.scrollTo(0, 0);
}

function screen() {
	document.styleSheets[1].disabled = false;
	document.styleSheets[2].media.appendMedium('print');
	window.scrollTo(0, 0);
}
