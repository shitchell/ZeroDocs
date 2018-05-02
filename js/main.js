var lastChangeTime = new Date();
var thisChangeTime = lastChangeTime;
var autosaveTimeoutID = null;
var autosaveDelay = 1000; // milliseconds. null or 0 to disable autosaving
var autosaveMessageSaved = "Autosaved";
var autosaveMessageSaving = "Saving...";

// Groups of options are placed in a list. Groups are separated by a horizontal line and padding in the toolbar
var toolbarOptions = [
		[{ 'font': [] }],
		[{ 'size': ['small', false, 'large', 'huge'] }],
		['bold', 'italic', 'underline', 'color', 'background'],
		['link', 'blockquote', 'code-block'],
		[{ 'script': 'sub'}, { 'script': 'super' }],
		[{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
		[{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
		['clean']
];

// Function to resize an html tag to fit its content
function resizeInput(el)
{
	el.style.width = el.value.length + 2 + "ch";
}

// Save changes made to the quill editor
function saveChanges(quill) {
	thisChangeTime = new Date();

	if (autosaveDelay && (thisChangeTime - lastChangeTime > autosaveDelay)) {
		displaySaveMessage(autosaveMessageSaving);
		localStorage.quill = JSON.stringify(quill.getContents());
		/*
		Send partial changes
		$.post('/your-endpoint', {
			partial: JSON.stringify(change)
		});

		Send entire document
		$.post('/your-endpoint', {
			doc: JSON.stringify(quill.getContents())
		});
		*/
		lastChangeTime = thisChangeTime;
		displaySaveMessage(autosaveMessageSaved);
	}
}

// Display save status
function displaySaveMessage(message)
{
	document.getElementById("save-status").innerHTML = message;
}

// Restore function
function restoreSavedEditor(quill) {
	if (localStorage.quill)
	{
		quill.setContents(JSON.parse(localStorage.quill));
	}
}

// Check for unsaved data before closing window
window.onbeforeunload = function() {
	if (change.length() > 0) {
		return 'There are unsaved changes. Are you sure you want to leave?';
	}
}

function hideMenu() {
	if ($("#nav-menu").hasClass("visible"))
	{
		$("#nav-menu").removeClass("visible");
	}
}

function showMenu() {
	$("#nav-menu").addClass("visible");
}

$(document).ready(function() {
	// Initialize the quill editor
	var quill = new Quill('#editor', {
			modules: {
					toolbar: '#toolbar'
			},
			theme: 'snow'
	});

	// Attempt to load any saved document data
	restoreSavedEditor(quill);

	// Store accumulated changes
	quill.on('text-change', function(delta) {
		// Clear any old autosave check
		if (autosaveTimeoutID)
		{
			clearTimeout(autosaveTimeoutID);
		}

		// Start an autosave check
		autosaveTimeoutID = setTimeout(function() {saveChanges(quill)}, autosaveDelay);
	})

	$("html").click(hideMenu);
	$("#navicon").click(showMenu);
	$("#nav-menu").click(function(event) { event.stopPropogation(); })

//	// Set the size of the input field
//	resizeInput($("#title"));
//
//	// Resize document title name
//	$("#title").on("propertychange change click keyup input paste", function() {
//		resizeInput(this);
//  })
});