jQuery(document).ready(function($){
	var img = new Image(),
		canv = document.getElementById('canvas'),
		imgCanv = document.getElementById('extra-canvas'),
		userImg = new Image(),
		dragListener;
	
	imgCanv.width = window.innerWidth + 200;
	imgCanv.height = window.innerHeight + 200;
	userImg.x = 0;
	userImg.y = 0;

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
				//cont.globalCompositeOperation = "copy";
				cont.drawImage(aImg, 0, 0, aImg.width, aImg.height);
				userImg = aImg;
				userImg.x = 0;
				userImg.y = 0;
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


	function moveImage(x, y) {
		var cont = imgCanv.getContext("2d");
		cont.clearRect(userImg.x - 1, userImg.y - 1, userImg.width + 1, userImg.height + 1);
		userImg.x = userImg.x + x;
		userImg.y = userImg.y + y;
		cont.drawImage(userImg, userImg.x, userImg.y);
		console.log("userImg:", userImg.x, userImg.y);

	}

	imgCanv.addEventListener("mouseover", function(e) {
		document.body.style.cursor = "pointer";
	});

	imgCanv.addEventListener("mouseout", function(e) {
		document.body.style.cursor = "normal";
	});

	imgCanv.addEventListener("mousedown", function(e) {
		var mouseX = e.screenX,
			mouseY = e.screenY;

		function dragListener(e) {

			console.log(e.screenX - mouseX, e.screenY - mouseY);
			moveImage(e.screenX - mouseX, e.screenY - mouseY);
			mouseX = e.screenX;
			mouseY = e.screenY;
		}

		console.log(mouseX, mouseY);
		if(e.button == 0) {
			dragListener = imgCanv.addEventListener("mousemove", dragListener);
		}

		imgCanv.addEventListener("mouseup", function(e) {

			imgCanv.addEventListener("mousemove", null);
			console.log("werking");
		});
	});



});
