jQuery(document).ready(function($){
	var img = new Image(),
		canv = document.getElementById('canvas'),
		imgCanv = document.getElementById('extra-canvas'),
		userImg = new Image(),
		dragListener;
	
	imgCanv.width = window.innerWidth + 200;
	imgCanv.height = window.innerHeight + 200;
	$(userImg).data('x', 0).data('y', 0);

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
				$(userImg).data('x',0).data('y',0);
			}; 
		}) (newImg);
		reader.readAsDataURL(file);
		}
	}

	$(img).bind('load', function() {

		var cont = canv.getContext("2d");
		cont.drawImage(img, 0, 0);
		cont.globalCompositeOperation = "copy";
		console.log("test");
	});

	$(canv).bind("dragenter", function(e) {
		e.stopPropagation();
		e.preventDefault();
	}).bind("dragover", function(e) {
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
		var cont = imgCanv.getContext("2d"),
			$i = $(userImg);
		cont.clearRect($i.data('x') - 1, $i.data('y') - 1, userImg.width + 1, userImg.height + 1);
		$i.data('x', $i.data('x') + x);
		$i.data('y', $i.data('y') + y);
		cont.drawImage(userImg, $i.data('x'), $i.data('y'));
		console.log("userImg:", $i.data('x'), $i.data('y'));

	}

	$(imgCanv).bind("mouseover", function(e) {
		document.body.style.cursor = "pointer";
	}).bind("mouseout", function(e) {
		document.body.style.cursor = "normal";
	}).bind("mousedown", function(e) {
		var mouseX = e.screenX,
			mouseY = e.screenY;

		function dragListener(e) {

			console.log(e.screenX - mouseX, e.screenY - mouseY);
			moveImage(e.screenX - mouseX, e.screenY - mouseY);
			mouseX = e.screenX;
			mouseY = e.screenY;
		}

		if(e.button == 0) {
			 $(this).bind("mousemove", dragListener);
		}

		}).bind("mouseup", function(e) {

			$(this).unbind("mousemove", null);
	});



});
