
function init() {
	var img = new Image(),
		canv = document.getElementById('canvas'),
		imgCanv = document.getElementById('extra-canvas');
	
	imgCanv.width = window.innerWidth + 200;
	imgCanv.height = window.innerHeight + 200;




	function handleFiles(files) {
		for (var i = 0; i < files.length; i++) {  
			var file = files[i];  
			var imageType = /image.*/;  
			if (!file.type.match(imageType)) {  
			  continue;  
			}  
			  
			 console.log(file.name); 
			var newImg = new Image(),
				cont = imgCanv.getContext("2d");
			newImg.file = file;

		var reader = new FileReader();
		reader.onload = (function(aImg) {return function(e) {
				aImg.src = e.target.result;
				cont.globalCompositeOperation = "copy";
				cont.drawImage(aImg, 0, 0, aImg.width, aImg.height);
				//cont.globalCompositeOperation = "source-over";
				//cont.drawImage(img, 0, 0);
			}; 
		}) (newImg);
		reader.readAsDataURL(file);
		}
	}
	img.onload = function() {

		var cont = canv.getContext("2d");
		cont.drawImage(img, 0, 0);
		cont.globalCompositeOperation = "copy";
		console.log("test");
	};

	canv.addEventListener("dragenter", function(e) {
		e.stopPropagation();
		e.preventDefault();
	});

	canv.addEventListener("dragover", function(e) {
		e.stopPropagation();
		e.preventDefault();
	});

	canv.ondrop = function(e) {
		e.stopPropagation();
		e.preventDefault();

		var dt = e.dataTransfer;
		var files = dt.files;
		
		handleFiles(files);
	};
	img.src = "cov.png";


}
