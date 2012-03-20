jQuery(document).ready(function($){
	var img = new Image(),
		canv = document.getElementById('canvas'),
		imgCanv = document.createElement('canvas'), // this will be the downloaded image
		userImg = new Image(),
		dragListener,
		dim = 18,
		ratio = 2,
		steps = 700,
		step = 0,
		movingImg,
		started = false,
		triangles,
		requestAnimationFrame = window.requestAnimationFrame 
					|| window.mozRequestAnimationFrame 
					||  window.webkitRequestAnimationFrame 
					|| window.msRequestAnimationFrame,
	  start = window.mozAnimationStartTime;  // Only supported in FF. Other browsers can use something like Date.now(). 
	
	triangles = [
		{},
		{ 
			x1: 98,
			y1: 128,
			x2: 58,
			y2: 196,
			x3: 136,
			y3: 196,
			animated: false
		},
		{ 
			x1: 58,
			y1: 203,
			x2: 136,
			y2: 203,
			x3: 97,
			y3: 270,
			animated: false
		},
		{ 
			x1: 104,
			y1: 270,
			x2: 181,
			y2: 270,
			x3: 143,
			y3: 205,
			animated: false
		},
		{ 
			x1: 229,
			y1: 129,
			x2: 306,
			y2: 129,
			x3: 268,
			y3: 196,
			animated: false
		},
		{ 
			x1: 223,
			y1: 129,
			x2: 183,
			y2: 196,
			x3: 262,
			y3: 196,
			animated: false
		},
		{ 
			x1: 183,
			y1: 203,
			x2: 262,
			y2: 203,
			x3: 222,
			y3: 271,
			animated: false
		},
		{ 
			x1: 268,
			y1: 204,
			x2: 229,
			y2: 270,
			x3: 306,
			y3: 270,
			animated: false
		},
		{ 
			x1: 313,
			y1: 270,
			x2: 273,
			y2: 203,
			x3: 351,
			y3: 203,
			animated: false
		},
		
	];

   	canv.width = window.innerWidth;
	canv.height = window.innerHeight;
	$(canv).data('w', canv.width)
			.data('h', canv.height);
	console.log('canvas width %s, height %s', $(canv).data('w'),
			$(canv).data('h'));
	$(userImg).data('x', 0)
			.data('y', 0);

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
			cont = canv.getContext("2d"),
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
				var x, y, w, h, portrait;
				aImg.src = e.target.result;
				console.log(aImg.width, aImg.height, window.innerWidth, window.innerHeight);
				cont.clearRect(0, 0, $(canv).data('w'), $(canv).data('h'));
				if(aImg.width / 2 <= $(canv).data('w') && aImg.height  / 2 <= $(canv).data('h')) {
					x =  $(canv).data('w') / 2 - aImg.width / 4;
					y = $(canv).data('h')  / 2 - aImg.height / 4;
					w = aImg.width / 2, h = aImg.height / 2;
					cont.drawImage(aImg,x, y, w, h);
				} else if(aImg.height / 2 >= $(canv).data('h')) {
					ratio = aImg.height / $(canv).data('h');
					w = aImg.width / ratio, h = $(canv).data('h');
					x = $(canv).data('w') / 2 - w / 2;
					y = 0;
				} else if(aImg.width / 2 >= $(canv).data('w')) {
					ratio = aImg.width / $(canv).data('w');
					w = aImg.width, h = aImg.height * ratio ;
					x =  0;
					y =  $(canv).data('h') / 2 - h / 2;
				} else {
					portrait = (aImg.width / aImg.height <= $(canv).data('w') / $(canv).data('h'));
					if(portrait) {
						ratio = aImg.height / $(canv).data('h');
						h = $(canv).data('h');
						w = aImg.width / ratio * 2;
					} else {
						ratio = aImg.width / $(canv).data('w');
						w = $(canv).data('w');
						h = aImg.height / ratio * 2;
					}
					x = $(canv).data('w') / 2 - w / 4;
					y = $(canv).data('h') / 2 - h / 4;
				}
				cont.drawImage(aImg, Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
				userImg = aImg;
				$(userImg)
					.data('x', Math.floor(x))
					.data('y', Math.floor(y))
					.data('w', Math.floor(w))
					.data('h', Math.floor(h));
				drawAnchors(canv, $(userImg));
				drawCover();
			}; 
		}) (newImg);
		reader.readAsDataURL(file);
		}
	}

	$(img).bind('load', function() {

		var cont = canv.getContext("2d"),
			x =  $(canv).width() / 2 - img.width / 4,
   			y = $(canv).height() / 2 - img.height / 4;
		cont.drawImage(img, x, y,
			img.width / 2, img.height / 2);
		console.log("test");
		$(img).data('x', x)
			.data('y', y);
		imgCanv.width = img.width;
		imgCanv.height = img.height;
	});
	img.src = "cover.png";

	$(window).resize(function(e) {
		var ow = $(canv).data('w'),
			oh = $(canv).data('h'),
			dx, dy; //how much we have to move the cover and the image.
		canv.width = window.innerWidth;
		canv.height = window.innerHeight;

		dw = (canv.width - ow) / 2;
		dh = (canv.height - oh) / 2;
		$(canv).data('w', canv.width).data('h', canv.height);

		console.log(dw, dh);

		if(userImg.src) {
			moveImage(dw, dh);
		} else {
			drawCover();
		}

	});

	//draws the cover and updates its' coordinates
	function drawCover() {

		var cont = canv.getContext("2d"), x, y;
			x = $(canv).width() / 2 - img.width / 4;
			y = $(canv).height() / 2 - img.height / 4;
		cont.drawImage(img, x, y, img.width / 2, img.height / 2);
		$(img).data('x', x).data('y', y);
	}
	
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

	//check to see if we clicked inside an anchor, and which one, if yes.
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

	//what it says it does
	function moveImage(x, y) {
		var con = canv.getContext("2d"),
			$i = $(userImg),
			w = $(userImg).data('w'), h = $(userImg).data('h');

		con.clearRect($i.data('x') - 1, $i.data('y') - 1, $i.data('w') + 3, $i.data('h') + 3);
		$i.data('x', $i.data('x') + x);
		$i.data('y', $i.data('y') + y);
		con.drawImage(userImg, $i.data('x'), $i.data('y'),
				$i.data('w'), $i.data('h'));
		drawAnchors(canv, $i);
		drawCover();
		console.log("userImg:", $i.data('x'), $i.data('y'), $i.data('w'), $i.data('h'));
		//startDrawingTriangles(1, canv, img);

	}

	function resizeImage(x, y, w, h) {
		var con = canv.getContext("2d"),
			$i = $(userImg);

		con.clearRect(0, 0, $(canv).width(), $(canv).height());
		con.drawImage(userImg, $i.data('x') + x, $i.data('y') + y,
					$i.data('w') + w, $i.data('h') + h);
		$i.data('w', $i.data('w') + w)
			.data('h', $i.data('h') + h)
			.data('x', $i.data('x') + x)
			.data('y', $i.data('y') + y);
		drawAnchors(canv, $i);
		drawCover();

	}

	//returns a number between 1 and 8 if the mouse moved between one of the triangles
	//or null otherwise
	function clickedInTriangles(e) {
		var con = canv.getContext("2d"),
			cov = img.jquery ? img : $(img),
			x, y;
		con.moveTo(cov.data('x') + 98, cov.data('y') + 128);
		con.lineTo(cov.data('x') + 58, cov.data('y') + 197);
		con.lineTo(cov.data('x') + 136, cov.data('y') + 197);

		
		//get canvas size and position;
		bb = canv.getBoundingClientRect();

		//convert global mouse coordinates to canvas coordinates;

		x = (e.clientX - bb.left) * (canv.width / bb.width);
		y = (e.clientY - bb.top) * (canv.height / bb.height);
		//console.log(x,y);

		if(con.isPointInPath(x, y)) {
			return 1;
		}
	}

	function startDrawingTriangles(no) {
		started = true;
		start = window.mozAnimationStartTime;
		requestAnimationFrame(drawTriangles);
	}

	function drawTriangles(timestamp) {
		var con = canv.getContext("2d"),
		progress = timestamp - start,
		cov = $(img),
		w = $(canv).data('w'),
		h = $(canv).data('h');
		

		
		if(progress < steps) {
			//con.clearRect(0, 0, $(canv).data('w'), $(canv).data('h'));
			if(userImg.src) {
				moveImage(0, 0);
			} else {
				con.clearRect(0, 0 , w, h);
				drawCover();
			}
			con.save();
			con.beginPath();
			con.fillStyle = "#fff";
			//con.globalCompositionOperation = "destination-atop";
			if( progress < steps / 4) {
				con.globalAlpha = (progress / steps) *3;
			} else {
				con.globalAlpha = (steps - progress) / steps;
			}
			
			con.moveTo(cov.data('x') + 98, cov.data('y') + 128);
			con.lineTo(cov.data('x') + 58, cov.data('y') + 197);
			con.lineTo(cov.data('x') + 136, cov.data('y') + 197);
			con.closePath();
			con.fill();
			con.restore();
			requestAnimationFrame(drawTriangles);
		} else {
			started = false;
		}
	}


	$(canv).bind("mousemove", function(e) {
		if(clickedInTriangles(e)) {
			if(!started) {
				startDrawingTriangles();
			}
		} else if(clickedInImage(e, canv, userImg)) {
			document.body.style.cursor = "pointer";
		}  else  if(document.body.style.cursor == "pointer") {
			document.body.style.cursor = "normal";
		}
	}).bind("mouseout", function(e) {
		document.body.style.cursor = "normal";
		//$(this).unbind("mousemove", movingImg);
	}).bind("mousedown", function(e) {
		var mouseX = e.clientX,
			mouseY = e.clientY,
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

			anchor = clickedInAnchors(e, canv, $i);
			if(anchor) {
				$(this).bind("mousemove", resizeListener);
			} else if(clickedInImage(e, canv, $i)) {
				$(this).bind("mousemove", dragListener);
			}
		}

		}).bind("mouseup", function(e) {

			$(this).unbind("mousemove", resizeListener);
			$(this).unbind("mousemove", dragListener);
	});

	$("#download").click(function(e) {
		e.stopPropagation();
		e.preventDefault();
		var con = imgCanv.getContext("2d"),
			w = $(userImg).data('w'), h = $(userImg).data('h'),
			imgX = $(userImg).data('x'), imgY = $(userImg).data('y'),
			wRatio = userImg.width / w,
			hRatio = userImg.height / h,
			covX = $(canv).width() / 2 - img.width / 4,
			covY = $(canv).height() / 2 - img.height / 4,
			covW = img.width / 2, covH = img.height / 2,
			dx, dy, dw, dh, sx, sy, sw, sh;

		
			
		console.log('image x %d, image y %d', imgX, imgY);
		console.log("wRatio:", wRatio, "hRatio:", hRatio);
		con.clearRect(0, 0, img.width, img.height);
		con.fillStyle = "#fff";
		con.fillRect(0, 0, img.width, img.height);

		//if the image is to the left of the cover
		if (imgX  < 0 || imgX - covX < 0) {
			sx = - (imgX - covX) * wRatio;
			dx = 0;

			//if it ends to the left too
			if ((imgX + w) < (covX + covW)) {

				dw = img.width - ((covW + covX) - (imgX + w)) * 2;
				sw = (covW - ((covX + covW) - (imgX + w))) * wRatio;
			} else {
				
				dw = img.width;
				sw = img.width * (wRatio / 2);
			}
		} else {

			sx = 0;
			dx = (imgX - covX) * 2;

			//if it ends to the left
			if ((imgX + w) < (covX + covW)) {

				dw = img.width - ((covW - w) * 2);
				sw = userImg.width;
			} else {
				dw = img.width - (imgX - covX) * 2;
				sw = (covW - (imgX - covX)) * wRatio;
			}

		}
		//if the image is above the cover
		if(imgY < 0 || imgY - covY < 0) {
			sy = - (imgY - covY) * hRatio;
			dy = 0;

			//if it ends above too
			if ((imgY + h) < (covY + covH)) {

				dh = img.height - ((covH + covY) - (imgY + h)) * 2;
				sh = (covH - ((covY + covH) - (imgY + h))) * hRatio; 

			} else {
				dh = img.height;
				sh = img.height * (hRatio / 2);
			}
		} else {
			console.log('starts below');
			sy = 0;
			dy = (imgY - covY) * 2;

			//if it ends above
			if ((imgY + h) < (covY + covH)) {
				dh = img.height - ((covH - h) * 2);
				sh = userImg.height;
			} else {
				dh = img.height - ((imgY - covY) * 2);
				sh = (covW - (imgY - covY)) * hRatio;
			}
		}
		console.log(sx, sy, sw, sh, dx, dy, dw, dh);
		con.drawImage(userImg, sx, sy, sw, sh, dx, dy, dw, dh);
		con.drawImage(img, 0, 0, img.width, img.height);
		Canvas2Image.saveAsJPEG(imgCanv);
	});

	$("#upload").click(function(e) {
		
		$("#upload-elem").click();

	});

	$("#upload-elem").change(function(e) {
		handleFiles(this.files);
	});



});
