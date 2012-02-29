jQuery(document).ready(function($){
	var img = new Image(),
		canv = document.getElementById('canvas'),
		imgCanv = document.getElementById('extra-canvas'),
		userImg = new Image(),
		dragListener,
		dim = 18;
	
	imgCanv.width = window.innerWidth;
	imgCanv.height = window.innerHeight;
	$(userImg).data('x', 0).data('y', 0);

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

	function handleFiles(files) {
		var newImg = new Image(),
			cont = imgCanv.getContext("2d"),
			reader = new FileReader(),
			imageType = /image.*/,
			file, i;
		
		//we check that the dropped files are images;
		for (i = 0; i < files.length; i++) {  
			file = files[i];  
			if (!file.type.match(imageType)) {  
			  continue;  
			}  
			  
			console.log(file.name, file.type);
			newImg.file = file;

		reader.onload = (function(aImg) {return function(e) {
				aImg.src = e.target.result;
				cont.drawImage(aImg, 0, 0, aImg.width, aImg.height);
				userImg = aImg;
				$(userImg)
					.data('x',0)
					.data('y',0)
					.data('w', userImg.width)
					.data('h', userImg.height);
				drawAnchors(imgCanv, $(userImg));
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

	img.src = "cov.png";


	
	//draw resize anchors on image corners;
	function drawAnchors(canvas, img) {
		var con = canvas.getContext("2d");
			img = img.jquery ? img : $(img);
		con.fillStyle = "hsla(0, 0%, 60%, 0.6)";
		con.fillRect(img.data("x"), img.data("y"), dim, dim);
		con.fillRect(img.data("x") + img.data('w') - dim, img.data("y"), dim, dim);
		con.fillRect(img.data("x") + img.data('w') - dim, img.data("y")
			   	+ img.data('h') - dim, dim, dim);
		con.fillRect(img.data("x"), img.data("y") + img.data('h') - dim, dim, dim);
		
	}

	//checks if the current mouse event happened inside the image area;
	function clickedInImage(e, canvas, img) {
		var con = canvas.getContext("2d"),
			img = img.jquery ? img : $(img),
			x, y;

		//start "drawing" the coordinates of the image, to see if we clicked
		//inside it;
		con.beginPath();
		con.moveTo(img.data("x"), img.data("y"));
		con.lineTo(img.data("x") + img.data('w'), img.data("y"));
		con.lineTo(img.data("x") + img.data('w'), img.data("y") + img.data('h'));
		con.lineTo(img.data("x"), img.data("y") + img.data('h'));
		
		//get canvas size and position;
		bb = canvas.getBoundingClientRect();

		//convert global moues coordinates to canvas coordinates;

		x = (e.clientX - bb.left) * (canvas.width / bb.width);
		y = (e.clientY - bb.top) * (canvas.height / bb.height);
		return con.isPointInPath(x, y);
	}

	function clickedInAnchors(e, canvas, img) {

		var con = canvas.getContext("2d"),
			img = img.jquery ? img : $(img),
			x, y;

		
		//get canvas size and position;
		bb = canvas.getBoundingClientRect();

		//convert global moues coordinates to canvas coordinates;

		x = (e.clientX - bb.left) * (canvas.width / bb.width);
		y = (e.clientY - bb.top) * (canvas.height / bb.height);

		//draw top-left anchor
		con.beginPath();
		con.moveTo(img.data("x"), img.data("y"));
		con.lineTo(img.data("x") + dim, img.data("y"));
		con.lineTo(img.data("x") + dim, img.data("y") + dim);
		con.lineTo(img.data("x"), img.data("y") + dim);
		if(con.isPointInPath(x, y)) {
			return "top-left";
		}

		//draw top-right anchor
		con.beginPath();
		con.moveTo(img.data("x") + img.data("w") - dim, img.data("y"));
		con.lineTo(img.data("x") + img.data("w"), img.data("y"));
		con.lineTo(img.data("x") + img.data("w"), img.data("y") + dim);
		con.lineTo(img.data("x") + img.data("w") - dim, img.data("y") + dim);
		if(con.isPointInPath(x, y)) {
			return "top-right";
		}

		//draw bottom-left anchor
		con.beginPath();
		con.moveTo(img.data("x"), img.data("y") + img.data("h") - dim);
		con.lineTo(img.data("x") + dim, img.data("y") + img.data("h") - dim);
		con.lineTo(img.data("x") + dim, img.data("y") + img.data("h"));
		con.lineTo(img.data("x"), img.data("y") + img.data("h"));
		if(con.isPointInPath(x, y)) {
			return "bottom-left";
		}

		//draw bottom-right anchor
		con.beginPath();
		con.moveTo(img.data("x") + img.data("w") - dim, img.data("y") + img.data("h") - dim);
		con.lineTo(img.data("x") + img.data("w"), img.data("y") + img.data("h") - dim);
		con.lineTo(img.data("x") + img.data("w"), img.data("y") + img.data("h"));
		con.lineTo(img.data("x") + img.data("w") - dim, img.data("y") + img.data("h"));
		if(con.isPointInPath(x, y)) {
			return "bottom-right";
		}
		return null;
	}

	function moveImage(x, y) {
		var con = imgCanv.getContext("2d"),
			$i = $(userImg);
		con.clearRect($i.data('x') - 1, $i.data('y') - 1, $i.data('w') + 1, $i.data('h') + 1);
		$i.data('x', $i.data('x') + x);
		$i.data('y', $i.data('y') + y);
		con.drawImage(userImg, $i.data('x'), $i.data('y'),
				$i.data('w'), $i.data('h'));
		drawAnchors(imgCanv, $i);
		console.log("userImg:", $i.data('x'), $i.data('y'));

	}

	function resizeImage(x, y, w, h) {
		var con = imgCanv.getContext("2d"),
			$i = $(userImg);

		con.clearRect(0, 0, $(imgCanv).width(), $(imgCanv).height());
		con.drawImage(userImg, $i.data('x') + x, $i.data('y') + y,
					$i.data('w') + w, $i.data('h') + h);
		$i.data('w', $i.data('w') + w)
			.data('h', $i.data('h') + h)
			.data('x', $i.data('x') + x)
			.data('y', $i.data('y') + y);
		drawAnchors(imgCanv, $i);

	}

	$(imgCanv).bind("mouseover", function(e) {
		if(clickedInImage(e, $(imgCanv)[0], userImg)) {
			document.body.style.cursor = "pointer";
		}
	}).bind("mouseout", function(e) {
		document.body.style.cursor = "normal";
		$(this).unbind("mousemove", null);
	}).bind("mousedown", function(e) {
		var mouseX = e.clientX,
			mouseY = e.clientY,
			can = $(this)[0],
			$i = $(userImg),
			anchor;

		function dragListener(e) {

			console.log(e.clientX - mouseX, e.clientY - mouseY);
			moveImage(e.clientX - mouseX, e.clientY - mouseY);
			mouseX = e.clientX;
			mouseY = e.clientY;
		}

		function resizeListener(e) {
			var dx = e.clientX - mouseX,
				dy = e.clientY - mouseY;

			if(e.shiftKey) {
				if (anchor == "top-left" || anchor == "bottom-right") {
					dy = dx;
				} else {
					dy = -dx;
				}
			}

			console.log(dx, dy);
			switch (anchor) {
				case "top-left":
					resizeImage(dx, dy, -dx, -dy);
					break;
				case "bottom-left":
					resizeImage(dx, 0, -dx, dy);
					break;
				case "top-right":
					resizeImage(0, dy, dx, -dy);
					break;
				case "bottom-right":
					resizeImage(0, 0, dx, dy);

			}
			mouseX = e.clientX;
			mouseY = e.clientY;
		}

		if(e.button == 0) {

			anchor = clickedInAnchors(e, can, $i);
			if(anchor) {
				$(this).bind("mousemove", resizeListener);
			} else if(clickedInImage(e, can, $i)) {
				$(this).bind("mousemove", dragListener);
			}
		}

		}).bind("mouseup", function(e) {

			$(this).unbind("mousemove", null);
	});



});
