/* ========= Model ========= */ 

var model = {
	currentCat: null,
	adminShow: false, // hides the admin display area
	cats: [
		{

	 		"name" : "Eliza",
	 		"imgSrc" : "images/cat-image.jpg",
	 		"clickCount" : 0
	 	},
	 	{
	    	"name" : "Lily",
		 	"imgSrc" : "images/cat-image-2.jpg",
		 	"clickCount" : 0
		},
		{
		 	"name" : "Shuang",
		 	"imgSrc" : "images/cat-image-3.jpg",
		 	"clickCount" : 0
		},
		{
		 	"name" : "May",
		 	"imgSrc" : "images/cat-image-4.jpg",
		 	"clickCount" : 0
		},
		{
		 	"name" : "Joey",
		 	"imgSrc" : "images/cat-image-5.jpg",
		 	"clickCount" : 0
		}
	]
};

/* ========= Octopus ========= */

var octopus = {
	// init method to start off the entire application 
	init: function() {
		// Set out current cat to the first one on the list
		model.currentCat = model.cats[0];

		// tell our views to initialize
		catListView.init();
		catView.init();
		adminView.init();
		adminView.hide();
	},

	getCurrentCat: function() {
		return model.currentCat;
	},

	getCats: function() {
		return model.cats;
	},

	// set the currently-selected cat to the object passed in
	setCurrentCat: function(cat) {
		model.currentCat = cat;
		// console.log(cat);
	},

	// increments the counter for the currently-selected cat
	incrementCounter: function() {
		model.currentCat.clickCount++;
		catView.render();
	},

	// function runs when 'Admin' button is clicked.
	adminDisplay: function() {
		if (model.adminShow === false) {
			model.adminShow = true;
			adminView.show(); // display the admin input boxes and buttons
		} else if(model.adminShow === true) {
			model.adminShow = false;
			adminView.hide(); // hides the admin input boxes and buttons
		}
	},


    // hides admin display and saves new cat data when save button is clicked.
	adminSave: function() {
		model.currentCat.name = adminCatName.value;
		model.currentCat.imgSrc = adminCatUrl.value;
		model.currentCat.clickCount = adminCatClick.value;
		catView.render();
        catListView.render();
        adminView.hide();
	}

};

/* ========= View ========= */
// catView object has a init & render function. 
var catView = {
	// init method only called once 
	init: function() {
		// store pointers to our DOM elements for easy access later
		this.catElem = document.getElementById('display-cat');
		this.catNameElem = document.getElementById('cat-name');
		this.catImageElem = document.getElementById('cat-img');
		this.countElem = document.getElementById('cat-count');

		// add an event event listener (on click), increment the current cat's counter
		this.catImageElem.addEventListener('click', function() {
			octopus.incrementCounter(); // incrementCounter() from octopus object
		}); 
	},	

	render: function() {
		// update the DOM elements with values from the current cat
		var currentCat = octopus.getCurrentCat();
		this.countElem.textContent = currentCat.clickCount;
		this.catNameElem.textContent = currentCat.name;
		this.catImageElem.src = currentCat.imgSrc;
	}
};

var catListView = {
	init: function() {
		// store the DOM element for easy access later
		this.catListElem = document.getElementById('list-group');

		// render this view (update the DOM elements with the right values)
		this.render();
	},

	render: function() {
		var cat, elem, i;
		// get the cats we'll be rendering from the octopus
		var cats = octopus.getCats();

		// empty the cat list
		this.catListElem.innerHTML = '';

		// loop over the cats
		for (i = 0; i < cats.length; i++) {
			// this is the cat we're currently looping over
			cat = cats[i];

			// make a new cat list item and set its class and text
			elem = document.createElement('li');
			elem.setAttribute("class", "list-group-item");
			elem.textContent = cat.name;

			// on click, setCurrentCat and render the catView
            // (this uses our closure-in-a-loop trick to connect the value
            //  of the cat variable to the click event function)
            elem.addEventListener('click', (function(catCopy) {
                return function() {
                    octopus.setCurrentCat(catCopy);
                    catView.render();
                };
            })(cat));

            // finally, add the element to the list
            this.catListElem.appendChild(elem);
		}
	}	
};

var adminView = {
	init: function() {
		this.adminCatName = document.getElementById('adminCatName');
		this.adminCatUrl = document.getElementById('adminCatUrl');
		this.adminCatClick = document.getElementById('adminCatClick');

		this.adminButtonElem = document.getElementById('admin-button');
		this.adminFormElem = document.getElementById('admin-form');		
		this.adminSubmitElem = document.getElementById('admin-submit');
		this.adminCancelElem = document.getElementById('admin-cancel');

		this.adminButtonElem.addEventListener('click', function() {
			octopus.adminDisplay();
			adminView.render();
		});

		this.adminSubmitElem.addEventListener('click', function() { //hides the admin display and saves new cat data.
			event.preventDefault();  // don't submit form data till the adminSave() is run
			octopus.adminSave();
		});

		this.adminCancelElem.addEventListener('click', function() { //hides the admin display without saving any new cat data.
			adminView.hide();
		});

		this.render();

	},

	render: function() {
		var currentCat = octopus.getCurrentCat(); //calls current cat
		// Render current value
       	adminCatName.value = currentCat.name;
        adminCatUrl.value = currentCat.imgSrc;
        adminCatClick.value = currentCat.clickCount;

	},	

	show: function() {
		$('#admin-form').show();
	},

	hide: function() {
		$('#admin-form').hide();
	}
}

// make it go!
octopus.init();