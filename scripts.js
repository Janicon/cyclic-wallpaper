$(document).ready(function() {
	var DEFAULT_NSFW = true;
	var BASE_CHANCE = 30;
	var MIN_DELAY_NOCYCLE = 500;
	var MAX_DELAY_NOCYCLE = 1500;
	var MIN_DELAY_CYCLE = 5000;
	var MAX_DELAY_CYCLE = 10000;

	// Contains the file names to use as images, including the extension
	// e.g. "myImage.png"
	var safe_pics = [
	];

	// Contains the file names to use as images, including the extension
	// e.g. myImage.png
	var unsafe_pics = [
	];

	// Set default pics
	var images = unsafe_pics;
	if (!DEFAULT_NSFW) {
		images = safe_pics;
		$('#toggle-nsfw').css("filter", "grayscale(75%)");
	}

	// Logic variables
	var tiles = $("#background-container div img");
	var selected = [];
	var isNSFW = DEFAULT_NSFW;

	// Load images to background
	for (var i = 0; i < 8; i++)
		selected.push(getRandomImg());

	$("#toggle-nsfw").on("click", function() {
		if(isNSFW) {
			images = safe_pics;
			$(this).css("filter", "grayscale(75%)");
			$('#nsfw-icon').addClass("fa-regular fa-eye-slash");
			$('#nsfw-icon').removeClass("fa-solid fa-eye");
		}
		else {
			images = unsafe_pics;
			$(this).css("filter", "grayscale(0%)");
			$('#nsfw-icon').removeClass("fa-regular fa-eye-slash");
			$('#nsfw-icon').addClass("fa-solid fa-eye");
		}
		resetImages();
		isNSFW = !isNSFW
	})
	
	/*
	$("#toggle-<name>").on("click", function() {
		// custom actions here
	})
	*/

	// Wallpaper initialization
	setImages(selected);
	cycle(30);

	/* Functions */
	/* Replaces a random tile with a random image
		chance: base chance for a tile to cycle
		min_delay: 
	*/
	async function cycle(chance) {	
		var chance = BASE_CHANCE;
	
		while (true) {
			var delay = Math.round(Math.random() * MAX_DELAY_NOCYCLE) + MIN_DELAY_NOCYCLE;
			
			// If within the specified chance, set a longer wait time and reset cycle change
			if ((Math.random() * 100) <= chance) {
				delay = Math.round(Math.random() * MAX_DELAY_CYCLE) + MIN_DELAY_CYCLE;
				chance = 30;
			}
			else
				chance += 10;
			
			var tile = Math.floor(Math.random() * tiles.length);
			var img = getRandomImg();
			selected[tile] = img;
			setImage(tile, images[img]);
			
			await new Promise(r => setTimeout(r, delay));
		}
	}

	/* Reload wallpaper with imageset to use */
	function resetImages() {
		selected = [];

		for (var i = 0; i < 8; i++)
			selected.push(getRandomImg());
		
		setImages(selected);
	}

	/* Sets images for all image tiles */
	function setImages (selected) {
		for (var i in selected)
			$(tiles[i]).attr("src", "./images/" + images[selected[i]]);
	}
	
	/* Gets a random unselected image */
	function getRandomImg () {
		var index;
	
		// Get unselected image
		do {
			index = Math.floor(Math.random() * images.length);
		} while (selected.includes(index));
	
		return index;
	}
	
	/* Sets the image of the selected tile; transitions included */
	function setImage (index, filename) {
		$(tiles[index]).fadeTo(750, 0, function() {
			$(this).attr("src", "./images/" + filename);
			$(this).fadeTo(750, 1);
		})
	}
});