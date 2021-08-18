
window.onload = function() {
	generateQRCode();
};


function generateQRCode(){
	$("#qr-code").html("");

	let curURL = window.location.href;

	var qrcode = new QRCode("qr-code", {
	    text: curURL,
	    width: 256,
	    height: 256,
	    colorDark : "#000000",
	    colorLight : "#ffffff",
	    correctLevel : QRCode.CorrectLevel.H
	});
}

