/*//////////////////////////////////////////
   Treehouse FSJS Techdegree Unit 3 Project
   Interactive Form
//////////////////////////////////////////*/

//Regex for required form fields checking for white spaces. 
const requiredFieldRegex = /[A-Za-z0-9-\s]$/;

//Regex for email  formatting validation. 
const emailFormatvalidRegex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;


const ValidationFromRegex = (regex, errorMessage) => {
	// Return a validator function taking an input parameter
	return $inputField => {
		// Test input against regex
		const validInput = regex.test($inputField.val());

		// Throw error with given error message if input is invalid
		if (!validInput )
			throw new Error(errorMessage);

	};
}

const ValidationObjects = () => [
   {
      // Selecting the input field name.
		inputField: "input#name",

		// Validating the name input field.
		validation: [
			ValidationFromRegex(requiredFieldRegex, "Name is required"),
		],
      
   },
   // console.log (ValidationObjects());

   {
		inputField: "input#mail",
		validation: [
			ValidationFromRegex(requiredFieldRegex, "Email is required"),
			ValidationFromRegex(emailFormatvalidRegex, "Provide a valid email address"),
		],
	},

   {
		// Selecting required elements.
		errorDisplay: $(".activities legend"),
		inputField: ".activities input[type='checkbox']",
		validation: [
			//validation for checkboxes
			$Checkboxes => {
				let checkatleastOneBox;

				$Checkboxes.each((index, activity) => {
					if (activity.checked) {
						checkatleastOneBox = true;
						return false;
					}
				});

				// if statement for when no box is checked. 
				if (!checkatleastOneBox) {
					throw new Error("Select at least one activity");
				}
			},
		],
   },
   
   {
		inputField: "select#payment",
		validation: [
			// creating validator to make sure valid payment method is selected
			$selectPayment => {
				if ($selectPayment.val() === "select_method")
					throw new Error("Please select one payment option.");
			},
		],
	},

   {
		inputField: "input#zip",
		validation: [
			ValidationFromRegex(requiredFieldRegex, "Zip code is required."),
			ValidationFromRegex(/^\d{5}$/, "Zip Code must be 5 digits."),
      ],
      //Validation is ran if the selected payment method is credit card.
		runIf: $("select#payment").val() === "credit card",
   },
   
   {
		inputField: "input#cc-num",
		validation: [
			ValidationFromRegex(requiredFieldRegex, " Card number is required."),
			ValidationFromRegex(/^[0-9]{13,16}$/, "Please provide a length of 13-16 digits"),	
		],
		// Validation is ran only if the selected payment method is credit card.
		runIf: $("select#payment").val() === "credit card",
   },
   

   {
		inputField: "input#cvv",
		validation: [
			ValidationFromRegex(requiredFieldRegex, "CVV is required."),
			ValidationFromRegex(/^\d{3}$/, "CVV must be 3 digits."),
      ],
      // Validation is ran only if the selected payment method is credit card.
		runIf: $("select#payment").val() === "credit card",
	},
	
   {
		inputField: "input#other-title",
		validation: [
			ValidationFromRegex(requiredFieldRegex, ""),
			
      ],
	  	//Validation for other field
		runIf: !$("input#other-title").hasClass("is-hidden"),
		
	},

	
			
];



// CALCULATING COST OF ALL CHEECKED ACTIVITIES 


const  ActivityCostSum = activities => {
	// Getting only the activities that have been checked and storing it in a constant activitiesChecked 
	const activitiesChecked = activities.filter(activity => activity.checked);

	// mapping the cost of each activity
   const activityCost = activitiesChecked.map(activity => 
      //think about adding and if else statement
		activity.name === "all" ? // If the activity is the main conference make cost $200
			200 :				  
			100);				  // if not make it $100

	// Add all of the activity costs together
	return activityCost.reduce(
			// Adds the current value to the running total
			(total, current) => total + current, 0); // Zero is the initial value if there are no checked checkboxes
}


//TOGGLING CONFLICTING ACTIVITES 


const togglesimilarActivity = activity => {
	// Declare variable for the name of activities in need of toggling
	let activityToToggle;

	// utilizing the switch statement to toggle a conflicting activity when the other is checked.
	switch (activity.name) {
		// Toggle express if js-frameworks was selected
		case "js-frameworks":
			activityToToggle = "express";
			break;

		// Toggle node.js if js-libs was selected
		case "js-libs":
			activityToToggle = "node";
			break;

		// Toggle js-frameworks is express was selected
		case "express":
			activityToToggle = "js-frameworks";
			break;

		// Toggle js-libs is node was selected
		case "node":
			activityToToggle = "js-libs";
			break;
	}

	// If we are to toggle on activity
	if (activityToToggle !== undefined) {
		// Getting  the toggled activity to toggle
		const $activityToToggle = $(activity)
			.parent()
			.siblings()
			.children(`input[name='${activityToToggle}']`);

		// Toggle disabled status
		if (activity.checked)
			$activityToToggle
				.prop("disabled", "disabled") // Disable checkbox
				.parent().addClass("is-disabled");	// Set the class is-disabled on parent label
		else
			$activityToToggle
				.prop("disabled", false)	// Enable checkbox
				.parent().removeClass("is-disabled");	// remove disabled class on parent label
	}
}


// SHOWING APPROPRIATE PAYMENT METHOD BASED ON SELECTION

const showPaymentMethod = ChoiceofPayment => {
	// Replace spaces with hyphens when credit card)
	ChoiceofPayment = ChoiceofPayment.replace(" ", "-");

	// Show the information for the selected payment method
	$(`div#${ChoiceofPayment}`)
		.removeClass("is-hidden");

	// Declare variable for payment methods to hide
	let Hidepayment = [];

	// Consider selected payment method
	switch (ChoiceofPayment) {
		
		// Paypal and bitcoin are hidden if credit card is selected
		case "credit-card":
			Hidepayment = ["paypal", "bitcoin"];
			break;

		// Credit card and paypal if bitcoin is selected
		case "bitcoin":
			Hidepayment = ["credit-card", "paypal"];
			break;

		// Credit card and bitcoin if paypal is selected
		case "paypal":
			Hidepayment = ["credit-card", "bitcoin"];
			break;

		// if not hide all payment methods
		default :
			Hidepayment = ["credit-card", "paypal", "bitcoin"];
			break;
	}

	// Hidding each payment method until one is slected 
	Hidepayment.forEach(paymentMethod => {
		$(`div#${paymentMethod}`).addClass("is-hidden");
	});
}


//HIDDING COLOR SELECTION IF NO DESIGN IS SELECTED


const hideColorifnoDesign = () => {
	// If statement for hidding color if no design is selected. 
	if ($("select#design").prop("value") === "Select Theme") {
		
		$("select#color").addClass("is-hidden");

		// Create message instructing user to select a t-shirt theme
		$("<p></p>").text("Must select a t-shirt theme.").attr("id", "no-design-sel").insertAfter($("select#color"));
	} else { 
		// if not remove the warning message
		$("#no-design-sel").remove();

		// Show color choices
		$("select#color").removeClass("is-hidden");
	}
};


// MAKING COLOR SHOWN CORRESPOND WITH THE DESIGN CHOOSEN


const showDesignColors = () => {
	// calling the hidecolorifnoDesign function 
	hideColorifnoDesign();

	// selecting color choices and storing it in a constant colorSelect
	const $colorSelect = $("select#color");

	// selecting the design tag getting its value and storing it in a constant 
	const design = $("select#design").val();

		switch (design) {
			// If JS Puns design is selected
			case "js puns":
					// Get I heart JS colors and hide them
					$colorSelect.children(":not(:contains('Puns'))").addClass("is-hidden")
						// Get JS Puns colors and show them
						.siblings(":contains('Puns')").removeClass("is-hidden");
				break;

			// If I heart JS design is selected
			case "heart js":
				// Get JS Puns colors and hide them
				$colorSelect.children(":contains('Puns')").addClass("is-hidden")
					// Get I heart JS colors show them
					.siblings(":not(:contains('Puns'))").removeClass("is-hidden");
				break;
		}

		// Returning design
		return design;
	};



//CREATING VALIDATION FOR INPUTFIELDS


const runValidationForField = ($inputField, validation, $errorDisplay = undefined) => {
	const $inputfieldLabel = $inputField.parent().is("label") ?
		$inputField.parent() : 
		$(`label[for="${$inputField.attr("id")}"]`);

	// Try to do the following without errors
	try {
		// Run each validator on the field value
		validation.forEach(validation =>
			validation($inputField));
	} catch (error) { // If an error is thrown, the field is invalid 
		// Create error span
		const $errorSpan = $("<span></span>")
			.text(` ${error.message}`) // Set error message
			.addClass("validation-error") // Adding CSS class
			
		// Append error to error display element if it is defined
		if ($errorDisplay !== undefined)
			// If undefined, append to error display
			$errorSpan.appendTo($errorDisplay);
		else // If not go back to field
			$errorSpan.insertBefore($inputField)

		// Set classes for invalid field and label
		$inputField.addClass("is-invalid").removeClass("is-valid");

		$inputfieldLabel.addClass("is-invalid")
			.removeClass("is-valid");

		//stopping execution
		return;
	}
	

	// If not, remove the validation error if present
	if ($errorDisplay !== undefined)
		// Remove it after the error display if it is present
		if ($errorDisplay.children().last().is(".validation-error"))
		$errorDisplay
			.children()
			.last().remove();
	else
		// If not, remove it before the field
		if ($inputField.prev().is(".validation-error"))
			$inputField
				.prev().remove();

	// if not, set classes for valid field and label
	$inputField.addClass("is-valid")
					.removeClass("is-invalid");

	$inputfieldLabel.addClass("is-valid")
						.removeClass("is-invalid");
}


//VALIDATING THE FORM AND DETERMINING IF THE FORM IS INVALID

const validationForm = () => {
	// Remove all validation errors from previous runs
	$(".validation-error").remove();

	// Get the validator objects
	const valObjects = ValidationObjects();

	// Iterate over each validator object
	valObjects.forEach( valObject => {
		// If there is no runIf condition, or if there is and it is met,
		if ( valObject.runIf === undefined ||  valObject.runIf)
		runValidationForField(
				$(valObject.inputField),
				valObject.validation,
				valObject.errorDisplay
			);
		
	});

	// Returning whether any form inputfield is invalid
	return $("input, select").is(".is-invalid");
};


	// VALIDATING INPUTFIELDS USING SELECTORS

	
	const validationforField = (inputField, valObjects) => {
		// If there is a validation error from previous run, remove it
		if ($(inputField).prev().is(".validation-error"))
			$(inputField).prev().remove();

		// Get the selector for finding the proper validators
		const selector = `${inputField.tagName.toLowerCase()}#${inputField.id}`;

		// Find the proper validators
		const validationObj = valObjects.find(val => val.inputField === selector);

		// If there are validators for this field, and its running conditions don't exist or are met, run them
		if (validationObj !== undefined && (validationObj.runIf === undefined || validationObj.runIf))
		runValidationForField ($(selector), validationObj.validation, validationObj.errorDisplay);
	};



// Function to run when page finishes loading



const onPageLoad = () => {
	
		$("form").attr("novalidate", true);

		// Activity checkbox inputs
		const $Checkboxes = $(".activities input[type='checkbox']");

		// Set initial total event cost to sum of checked checkboxes
		let totalActivityCost = ActivityCostSum(
			$Checkboxes.get());

		// Create paragraph element to store running total
		const $activityTotal = $("<p></p>").text(`Total: $${totalActivityCost}`).attr("id", "activity-total").appendTo($(".activities"));

		// Set status of conflicting activities
		$Checkboxes.each((index, checkbox) => 
		togglesimilarActivity(checkbox))

		// Hide it if all activities are unchecked
		if (totalActivityCost === 0)
			$activityTotal.addClass("is-hidden");

		// Get job role input field
		const $jobRoleInput = $("input#other-title");

		// Hide it if job role is not set to "Other"
		if ($("select#title").val() !== "other")
			$jobRoleInput.addClass("is-hidden");

		// Select select_method by default
		if ($("select#payment").val() === "select_method")
			$("select#payment option[value='credit card']").prop("selected", "selected");

		showPaymentMethod($("select#payment").val());

		showDesignColors();

		// Set focus on username field
		$("input#name").trigger("focus");

		// Add change event listener for job title select
		$("select#title").on("change", event => {
			// If the new value is other,
			if (event.target.value === "other")
				// Show the job role field
				$jobRoleInput.removeClass("is-hidden");
			else  
				// if not hide it 
				$jobRoleInput.addClass("is-hidden");
		});

			
		
		//STATEMENT FOR WHEN A T-SHIRT IS SELECTED


			$("select#design").on("change", event => {
				showDesignColors();

				// Get colors
				const $colorSelect = $("select#color");

				// Consider design choice, selecting the first option from either design
				switch (event.target.value) {
					// If JS Puns design  was selected,
					case "js puns":
						// Get JS Puns colors
						$colorSelect.children(":contains('Puns')")
							// Get the first JS Puns color
							.first()
							// Select it
							.prop("selected", "selected");
						break;

					// If I heart JS design was selected,
					case "heart js":
						// Get I heart JS colors
						$colorSelect.children(":not(:contains('Puns'))")
							// Get the first I heart JS color
							.first()
							// Select it
							.prop("selected", "selected");
						break;
				}
			});



		// SHOWING APPROPRIATE PAYMENT INFORMATION BASED ON SELECTION


		$("select#payment").on("change", event => 
		showPaymentMethod(event.target.value));

		// When a activity checkbox is checked/unchecked,
		$Checkboxes.on("change", event => {
		// Define selector for finding proper validators
		const selector = ".activities input[type='checkbox']";

		// Find proper validators
		const validationObj = ValidationObjects().find(val => val.inputField === selector);

		
		runValidationForField($Checkboxes, validationObj.validation, validationObj.errorDisplay);

		// Recalculate total cost
		totalActivityCost =  ActivityCostSum($Checkboxes.get())

		// If total cost is greater than 0 (at least one checkbox is checked)
		if (totalActivityCost > 0)
			// Show running total with total cost
			$("#activity-total").removeClass("is-hidden")
				.text(`Total: $${totalActivityCost}`);
		else 
			// Hide running total
			$("#activity-total").addClass("is-hidden")
				.text("Total: $0");

				togglesimilarActivity(event.target);
		});		


	// On form submission,
	$("form").on("submit", event => {
		// Validate the form and check its validity
		const formIsInvalid = validationForm();

		// Stop submission if form is invalid
		if (formIsInvalid)
			event.preventDefault();
	})

	// Validate all other fields when changed
	$("input:not([type='checkbox']").on("keyup change", event => validationforField(event.target, ValidationObjects()));
	$("select").on("change", event => validationforField(event.target,ValidationObjects()));


}


// Run onPageLoad function when page finishes loading
$(onPageLoad);
