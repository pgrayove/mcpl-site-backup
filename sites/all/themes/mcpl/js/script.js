window.onload = initPage;
function initPage(){
	//Get the first form on the page, which should be the search form
	var searchField = document.getElementById("edit-query");
	var searchBackground = document.getElementById("block-google_cse-0");
	
	document.getElementById("edit-query").size = "25";
	document.getElementById("quicktabs-tab-search_tabs-0").onclick = changeTabColor;
	document.getElementById("quicktabs-tab-search_tabs-1").onclick = changeTabColor;
	document.getElementById("Term").onclick = activateSearchBox;
	document.getElementById("Term").onblur = deactivateSearchBox;
	
	function changeTabColor(){
		if(this.id == "quicktabs-tab-search_tabs-1"){
			document.getElementById("quicktabs_container_search_tabs").style.backgroundColor = "#99CC33"; //Color of the search site tab
			document.getElementById("edit-query").style.color = "silver";
			document.getElementById("edit-query").value = "Search Our Site";
			document.getElementById("edit-query").onfocus = activateSearchBox;
			document.getElementById("edit-query").onblur = deactivateSearchBox;
		} else {
			document.getElementById("quicktabs_container_search_tabs").style.backgroundColor = "#FFF"; //Color of the search catalog tab
			document.getElementById("Term").style.color = "silver";
			document.getElementById("Term").value = "Search Our Catalog";
			document.getElementById("Term").onfocus = activateSearchBox;
			document.getElementById("Term").onblur = deactivateSearchBox;
		}
		return true;
	}

	//the following 2 functions control the behavior of the search boxes when the user clicks in and out of them (remove default text, etc.)
	function activateSearchBox(){
		if(this.value == "Search Our Site" || this.value == "Search Our Catalog"){
			this.value = "";
		}
		this.style.color = "#000";
	}	
	function deactivateSearchBox(){
		if(this.name == "query" && this.value == ""){
			this.value = "Search Our Site";
			this.style.color = "silver";
		} else if(this.value == ""){
			this.value = "Search Our Catalog";
			this.style.color = "silver";
		}
	}
	
	/* BEGIN CODE FOR THE FRONT PAGE UPCOMING EVENTS LIST & CALENDAR */
	// get the drop down menu for limiting by event type
	var eventTypeMenu = document.getElementById("eventsOptionsList");
    
	if(eventTypeMenu){ 
		eventTypeMenu.onchange = limitByEventType;
		eventTypeMenu.onchange();
	}

	function limitByEventType(){
	        var eventTypeChosen = eventTypeMenu.value;
	        var eventsShown = 0;
        
		if(document.getElementById("empty_list_msg"))
			$("li#empty_list_msg").remove();

        /* The following scans each event in the list and determines whether or not it should be
         * displayed. The criteria are as follows, display the event if:
         *   1. The user wants to see all events (event_type_all) OR
         *   2. The user wants to see events at MCPL and the event in question is neither a meeting nor an exhibit OR
         *   3. The user specifically asks to see that event type
         */
        
		var eventList = $('#block-views-calendar-block_1 div.item-list li');
		var curEvent, showThisEvent;

	        for(var eventIndex = 0; eventIndex < eventList.length; eventIndex ++) {
			curEvent = $(eventList[eventIndex]);

			showThisEvent = false;
			switch(eventTypeChosen) {
				case "event_type_all":
					showThisEvent = true;
					break;
				case "event_type_mcpl":
					showThisEvent =
					  !(curEvent.hasClass("event_type_5") || curEvent.hasClass("event_type_6"));
					break;
				default:
					showThisEvent = curEvent.hasClass(eventTypeChosen);
					break;
			}
			if(showThisEvent) {
		                curEvent.show();
		                eventsShown += 1;
			}
			else curEvent.hide();
	        }
	        
	        if(!eventsShown) {
			var textToPrint = "";

			switch(eventTypeChosen) {
				case "event_type_all":
					textToPrint = "There are no events scheduled for today.";
					break;
				case "event_type_mcpl":
					textToPrint = "There are no MCPL events scheduled for today.";
					break;
				default:
					textToPrint =
					  "No " +
					  eventTypeMenu.options[eventTypeMenu.options.selectedIndex].text +
					  " scheduled for today.";
					break;
			}
			$(".view-display-id-block_1 ul").append("<li id='empty_list_msg' class='views-row'> " + textToPrint + "</li>");
		} 
	}
	
	//Hide the loading indicator
	if(document.getElementById("loadingIndicator")){
		document.getElementById("loadingIndicator").style.display = "none";
	}
			
	//Display title when the user hovers over a staff picks list item on the front page or the teens homepage
	if($("body").hasClass("front") || $("body").hasClass("page-teens") || $("body").hasClass("page-geninfo-disability-services")){
		$(".xmlfeedimg, .staffpicks").mouseenter(function(){
				var itemTitle = this.alt;
				$(this).parents("div.block-views").append("<p class=\"hover-title\">" + itemTitle + "</p>");
			}).mouseleave(function(){
				$(".hover-title").remove();
			}
		)
	}

	//Display title when the user hovers over a new arrivals list item 
	if($("body").hasClass("page-fiction-test-new-arrivals") || $("body").hasClass("page-fiction-new-arrivals")){
		$(".xmlfeedimg").mouseenter(function(){
				var itemTitle = this.alt;
				$(this).parents("div.block-views").append("<p class=\"hover-title\">" + itemTitle + "</p>");
			}).mouseleave(function(){
				$(".hover-title").remove();
			}
		)
	}


	// Search Within Page
	if(document.getElementById("searchPageForm")){
		//If the user's browser is Safari or Chrome, convert the search field to the
		//"search" input type for a better looking search box
		if(navigator.userAgent.indexOf("Safari") > -1){ //Change the size of the field only in Safari
			document.getElementById("searchPageBox").type = "search";	
		}
		document.getElementById("searchPageBox").onclick = function(){
			this.value = "";
		}
		document.getElementById("searchPageBox").onkeyup = function(){
			if(document.getElementById("all_community_orgs")){
				var allListItems = $("tr");
				var allListHeaders = $("td.orgName a");
				var displayStyle = "table-row";
			} else  {
				var allListItems = $("li.views-row");
				var allListHeaders = $("li.views-row .views-field-name a, li.views-row .views-field-title a, li.views-row .views-field-field-list-assignment-value a");
				var displayStyle = "list-item";
			}
				var searchTerm = document.getElementById("searchPageBox").value.toUpperCase();
				for(v = 0; v < allListItems.length; v++){
					if(searchTerm == ""){
						allListItems[v].style.display = displayStyle;
					} else if(allListHeaders[v].innerHTML.toUpperCase().indexOf(searchTerm) == -1){
						allListItems[v].style.display = "none";
					} else {
						allListItems[v].style.display = displayStyle;
					}
				}
		}
	}
	
	// Scripts for pathfinder pages
	if(document.getElementById("pathfinder_sections")){
		// Create a list of pathfinder sections in the sidebar of pathfinder pages
		var headers3 = $(".view-pathfinders h3");
		
		for(var s = 0; s < headers3.length; s++){
			headers3[s].id = "section-" + s;
			$("#pathfinder_sections").append("<li><a href=\"#" + s + "\">" + headers3[s].innerHTML + "</a></li>");
			$("#section-" + s).prepend("<a name=\"" + s + "\"></a>");
		}
		
		// Remove image if Content Cafe can't find a cover and returns a 1x1 pixel
		var coverImages = $("img.pathfinder_img");
		
		for(var t = 0; t < coverImages.length; t++){
			var imageSize = coverImages[t].height;
			
			if(imageSize <= 1){
				$(coverImages[t]).remove();
			}
		}
		
		// Remove link to catalog around local resources titles
		var localResources = $(".type-Pathfinder.Local.Resources");	
		var localResourcesLinks = $(".type-Pathfinder.Local.Resources a");
		
		for(u = 0; u < localResourcesLinks.length; u++){
			linkText = localResourcesLinks[u].innerHTML;
			localResources[u].removeChild(localResourcesLinks[u]);
			$(localResources[u]).append("<p>" + linkText + "</p>");
		}
	} 
	
	// Replace views image field in events (field-field-event-image) which contains only the source link with an actual image tag
	if($("div#event-node div.field-field-event-image")){
		var imageSrc = $("div#event-node div.field-field-event-image a").html();
		if(imageSrc != null){
			$("div#event-node div.field-field-event-image .field-item").html("<img src='" + imageSrc + "' class='event_img' />");
		} else {
			$("div#event-node div.field-field-event-image").hide();
		}
		
	}
	
	//Checks to see if any of the staff picks cover images are missing, and removes that image from the list
	//Also sets the width and height of the remaining images
	if($("body").hasClass("front") || $("body").hasClass("page-teens") || $("body").hasClass("page-fiction-new-arrivals") || $("body").hasClass("page-geninfo-disability-services")) {
		var allImages = document.images;
		for(eachImage = 0; eachImage < allImages.length; eachImage++){
			if(allImages[eachImage].clientWidth == 1){
				allImages[eachImage].style.display = "none";
			} else {
				if(allImages[eachImage].className == "staffpicks"){
					allImages[eachImage].style.width = "80px";
					allImages[eachImage].style.height = "115px";
				}
			}
		}
	}
	
	//Staff Picks Scripts
	if($("body").hasClass("section-staff-picks")){
		//Removes the border around book covers in the staff picks screen if there is no image available
		var allImages = document.images;
		for(eachImage = 0; eachImage < allImages.length; eachImage++){
			if(allImages[eachImage].clientWidth == 1){
				allImages[eachImage].style.border = "none";
			}
		}
		
		// Remove link to catalog around the list title
		var descriptionLinks = $("a.type-Staff.Picks.Description");
		
		for(u = 0; u < descriptionLinks.length; u++){
			linkText = descriptionLinks[u].innerHTML;
			$(descriptionLinks[u]).empty();
			$(descriptionLinks[u]).parent().append("<h3 style='font-size:26px;margin-bottom:0;'>" + linkText + "</h3>");
		}
	}

	
	//Accordion effect on How Do I? Question Pages
	if(document.getElementById("quicktabs_container_how_do_i_page")){
		var allQuestions = $("#quicktabs_container_how_do_i_page li.views-row");
		var allQuestionTexts = $("#quicktabs_container_how_do_i_page li.views-row .views-field-field-howdoi-question-value");
		
		for(var thisQ = 0; thisQ < allQuestions.length; thisQ++){
			$(allQuestions[thisQ]).find("div.views-field-body .field-content").addClass("hidden");
			allQuestionTexts[thisQ].onclick = function(){
				if($(this).parent().find("div.views-field-body .field-content").hasClass("hidden")){
					$(this).parent().find("div.views-field-body .field-content").removeClass("hidden");
					$(this).parent().find("div.views-field-body .field-content").children().slideDown('slow');
				} else {
					$(this).parent().find("div.views-field-body .field-content").addClass("hidden");
					$(this).parent().find("div.views-field-body .field-content").children().slideUp('slow');
				}			
			}
		}
	}


	//Make sure that the primary links in the megamenus are not followed when clicked on
	var allPrimaryLinks = $("ul#megamenu-primary-links h2.megamenu-parent-title a");
	for(var thisLink = 0; thisLink < allPrimaryLinks.length; thisLink++){
		allPrimaryLinks[thisLink].onclick = function(){
			return false;
		}
	}
	
	//Adds an attribute to every iframe so that the mega menus do not appear behind YouTube videos.
	$("iframe").each(function(){
      var ifr_source = $(this).attr('src');
      var wmode = "wmode=transparent";
      if(ifr_source.indexOf('?') != -1) $(this).attr('src',ifr_source+'&'+wmode);
      else $(this).attr('src',ifr_source+'?'+wmode);
	});
	
	// Adds up the amounts on the Friends donation form and puts the total in the "Total amount" box
	if($("body").hasClass("page-friends-donate-friends-library")){
		var donationForm = $("#webform-client-form-23338");
		var totalDonation;
		var allBoxes = $("#webform-client-form-23338 input");
		
		for(var box = 0; box <= 5; box++){
			allBoxes[box].onclick = function(){ this.value = ""; }
			allBoxes[box].onblur = function(){
				totalDonation = 0;
				for(var thisBox = 0; thisBox <= 5; thisBox++){
					if(allBoxes[thisBox].value != ""){
						var thisAmount = parseFloat(allBoxes[thisBox].value);
						allBoxes[thisBox].value = thisAmount.toFixed(2);
						totalDonation += thisAmount;
					} else {
						allBoxes[thisBox].value = "0.00";
					}
				}
				allBoxes[6].value = totalDonation.toFixed(2);
			}
		}
	}
}

//function to redirect whatever URL the patron is currently viewing to the Google Translate version of that page
//change "langCode" variable to change the language that the "Translate" link redirects to (currently set to Spanish).
function translatePage(){
	var currentPage = window.location.href;
	var langCode = "es";
	window.location = 'http://translate.google.com/translate?sl=en&tl=' + langCode + '&u=' + currentPage;
}

//function for toggle new arrivals

function Toggle(user_id)
{
//alert ("testing");
    var e = document.getElementById('toggleUser_'+user_id);
	var a = document.getElementById('displayUser_'+user_id);
	if (e.style.display == "block") 
	{
		e.style.display = "none";
	}
	else 
	{
		e.style.display = "block";
	}
}
