window.onload = initPage;

var url = new String(window.location);
var urlParts = url.split("?");

function initPage(){

	//Get the first form on the page, which should be the search form
	var searchForm = document.forms[0];
	var siteTab = document.getElementById("searchSiteTab");
	var catalogTab = document.getElementById("searchCatalogTab");
	var searchField = document.getElementById("edit-query");
	var searchBackground = document.getElementById("block-google_cse-0");
	
	var miniCalendarIsHidden = true;
	if(urlParts[1]){
		var variableName = urlParts[1].split("=");
	
		if(variableName[0] == "mini"){
			miniCalendarIsHidden = false;
			$("#showEventsOptions a").html("Hide Calendar");
			$("#eventsOptionsForm").show();
			$("#block-views-calendar-calendar_block_1").show();
		}
	}
	
	if(siteTab && catalogTab){
		siteTab.onclick = searchModeSelect;
		catalogTab.onclick = searchModeSelect;
	
		//If the user's browser is Safari or Chrome, convert the search field to the
		//"search" input type for a better looking search box
		if(navigator.userAgent.indexOf("Safari") > -1){
			searchField.type = "search";
			//Change the size of the field only in Safari
			if(navigator.userAgent.indexOf("Chrome") == -1){
				searchField.size = "30";
			}
		}
		
		//Run this function when the window loads to change the default to the catalog search
		var tabsInit = true; // Tell the searchModeSelect() function that the search tabs have not been initialized
		searchModeSelect();
	}
	
	
	document.getElementById("edit-query").size = "25";
	document.getElementById("quicktabs-tab-search_tabs-0").onclick = changeTabColor;
	document.getElementById("quicktabs-tab-search_tabs-1").onclick = changeTabColor;
	document.getElementById("Term").onclick = activateSearchBox;
	function changeTabColor(){
		if(this.id == "quicktabs-tab-search_tabs-1"){
			document.getElementById("quicktabs_container_search_tabs").style.backgroundColor = "#99CC33";
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
	
	function searchModeSelect(){
		//Determine which tab the user has clicked and run the appropriate script
		//Also, because this "if" statement needs to be true when the window loads,
		//we need to check the value tabsInit, which will be false if this function has already been run once
		if(this.id == "searchCatalogTab" || tabsInit ){
			searchBackground.style.backgroundColor = "#C3D7A4";
			catalogTab.style.marginTop = "-2px";
			catalogTab.style.paddingBottom = "5px";
			siteTab.style.marginTop = "0";
			siteTab.style.paddingBottom = "4px";
			
			//Change the action of the form and add hidden input elements to enable MCPL catalog search
			searchForm.action = "http://mcpl.monroe.lib.in.us/search/searchresults.aspx?ctx=1.1033.0.0.7";
			
			//Check to see if these inputs already exist before inserting them
			//(ie. the user has already clicked the "Catalog Search" tab)
			if(searchForm.innerHTML.indexOf("RELEVANCE") < -1){
				searchForm.innerHTML += "<input type=\"hidden\" name=\"sort\" value=\"RELEVANCE\" />";
				searchForm.innerHTML += "<input type=\"hidden\" name=\"limit\" value=\"TOM=*\" />";
				searchForm.innerHTML += "<input type=\"hidden\" name=\"page\" value=\"0\" />";
			}
			
			//Change the name of the input field for compatibility with MCPL catalog search
			document.getElementById("edit-query").name = "term";
			
			//Set default text and clear when user enters the search field
			document.getElementById("edit-query").style.background = "#fff";
			document.getElementById("edit-query").style.color = "silver";
			document.getElementById("edit-query").value = " Search Our Catalog";
			document.getElementById("edit-query").onfocus = activateSearchBox;
			document.getElementById("edit-query").onblur = deactivateSearchBox;
			
			//Tell this function that the tabs have been initialized
			tabsInit = false;
			
		} else if(this.id == "searchSiteTab"){
			searchBackground.style.backgroundColor = "#CCC";
			siteTab.style.marginTop = "-2px";
			siteTab.style.paddingBottom = "5px";
			catalogTab.style.marginTop = "0";
			catalogTab.style.paddingBottom = "4px";
			searchForm.action = "/search/google";
			document.getElementById("edit-query").value = " Search Our Site";
			document.getElementById("edit-query").name = "query";
		}
	}
	
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
	
	//get the drop down menu for limiting by event type
	var eventTypeMenu = document.getElementById("eventsOptionsList");
	var meetingsCheckbox = document.getElementById("meetingsCheckbox");
	//get each table cell of the mini calendar
	var calendarDays = $("table.mini td");
	//get every link in the calendar (the day numbers)
	var calendarLinks = $("table.mini a");
	
	if(eventTypeMenu){
		eventTypeMenu.onchange = limitByEventType;
		meetingsCheckbox.onclick = limitByEventType;
	}
	
	//Use the id of each link, which contains the entire date, to determine which month/day/year is being shown
	for(var i=0;i<calendarLinks.length;i++){
		var linkId = calendarLinks[i].id;
		//uses the 6th item in the array because the first item will be in the month previous to the one shown.
		var selYear = calendarDays[6].id.slice(9,13);
		var selMonth = calendarDays[6].id.slice(14,16);
		var selDay = calendarLinks[i].innerHTML;
		
		//make selDay a 2-digit number so that text comparisons will work properly
		if(selDay < 10){
			selDay = "0" + selDay;
		}
		
		//remove the links to the full events when the user clicks on a day	
		calendarLinks[i].href = "#";
		//when the user clicks on a calendar day, the events list should update accordingly
		//calendarLinks[i].onclick = updateEventsList;
	}
	
	//gets every event displayed in the upcoming events list as determined by the calendar view
	var allUpcomingEvents = $("#block-views-calendar-block_1 .content div.item-list li");
	
	//Hide the loading indicator
	if(document.getElementById("loadingIndicator")){
		document.getElementById("loadingIndicator").style.display = "none";
	}
			
	for(var j=0;j<allUpcomingEvents.length;j++){
		var eventHTML = allUpcomingEvents[j].innerHTML;
		//use the string "date-display-single" to get the position of the date in the html 
		//for each event (unfortunately, these events do not have their dates in anything 
		//other than the displayed text
		var dateIndex = eventHTML.indexOf("date-display-single");
		if(navigator.userAgent.indexOf("MSIE 8") > -1){
				dateIndex -= 1;
			}
		var eventMonth = eventHTML.slice((dateIndex + 21), dateIndex + 23);
		var eventDay = eventHTML.slice((dateIndex + 24), dateIndex + 26);
		var eventYear = eventHTML.slice((dateIndex + 27), dateIndex + 29);
		var dateToday = new Date();
		var typeIndex = eventHTML.indexOf("views-field-tid");
		if(navigator.userAgent.indexOf("MSIE 8") > -1){
				typeIndex -= 1;
			}
		var endIndex = eventHTML.indexOf("</span>", typeIndex);
			
		var eventType = eventHTML.slice((typeIndex + 62), endIndex);
		
		if(eventType.indexOf(", ") > -1){
			eventType = eventType.substring(0, eventType.indexOf(", "));
		}
		
		eventType = eventType.toUpperCase().replace(/ /g,"").replace(/'/g,"");
		
		if(eventType == ""){
			eventType = "OTHERPUBLICEVENT";
		}
		
		//hide all events whose year, month, and day do not match today's date
		if(	(eventYear != (dateToday.getFullYear() - 2000)) || //subtract 2000 to give a 2-digit year (i.e. 2011 - 2000 = 11)
			(eventMonth != dateToday.getMonth() + 1) || 
			(eventDay != dateToday.getDate()) ){
			
				allUpcomingEvents[j].style.display = "none";
		} else if(eventType == "MEETINGS" || eventType == "EXHIBITS"){
			allUpcomingEvents[j].style.display = "none";
		} else {
			allUpcomingEvents[j].style.display = "block";
		}
		
		//rather convoluted way of hiding the month/day/year element in the date field
		//we cannot remove the date entirely because it is the only way for the script to know
		//when a particular event in this view occurs
		allUpcomingEvents[j].innerHTML = allUpcomingEvents[j].innerHTML.replace(
			eventMonth + "/" + eventDay + "/" + eventYear,
			"<span style=\"display:none\">" + eventMonth + "/" + eventDay + "/" + eventYear + "</span>");
	}
/*
	
	function updateEventsList(){
		if(document.getElementById("empty_list_msg")){
			$("li#empty_list_msg").remove();
		}
		//get the date value that the user clicked on
		var dayClicked = this.innerHTML;
		//get the month value from the heading of the mini calendar (as word not number, i.e. "June" not "06").
		var currMonth = $(".date-heading a")[0].innerHTML;
		//the title of the upcoming events list
		var upcomingTitle = $("#block-block-6 h2.title");
		var meetingsCheckbox = document.getElementById("meetingsCheckbox");
		var selectedEventType = document.getElementById("eventsOptionsList").value.toUpperCase();
		
		//update the title of the upcoming events list to match the date chosen by the user
		//add 1 to the month value because month numbers are -based (i.e. "January" = 0)
		if(	 dateToday.getDate()       == dayClicked && 
			(dateToday.getMonth() + 1) == selMonth && 
			 dateToday.getFullYear()   == selYear){
				var dateHeading = "Today's";
		} else if(
			(dateToday.getDate() + 1)  == dayClicked && 
			(dateToday.getMonth() + 1) == selMonth && 
			 dateToday.getFullYear()   == selYear){
				var dateHeading = "Tomorrow's";
		} else if(
			(dateToday.getDate() - 1)  == dayClicked && 
			(dateToday.getMonth() + 1) == selMonth && 
			 dateToday.getFullYear()   == selYear){
				var dateHeading = "Yesterday's";
		} else {
			var dateHeading = currMonth + " " + dayClicked;
		}
		//assign the correct value to the upcoming events title
		upcomingTitle[0].innerHTML =  dateHeading + " Events";
		
		//make selDay a 2-digit number so that text comparisons will work properly
		if(dayClicked < 10){
			dayClicked = "0" + dayClicked;
		}
		
		//change the highlighted day from today's date to the user-chosen date
		$("table.mini td").removeClass("today");
		$(this).parent().parent().addClass("today");
		
		for(var k=0;k<allUpcomingEvents.length;k++){
			var eventHTML = allUpcomingEvents[k].innerHTML;
			//use the string "date-display-single" to get the position of the date in the html
			//for each event (unfortunately, these events do not have their dates in anything
			//other than the displayed text).
			//add 27 to compensate for the new <span> tag added when the page loaded (see line
			//just above this function)
			var dateIndex = eventHTML.indexOf("date-display-single") + 27; 
			//fix a bug for Firefox 3 & IE that causes slice() indexes to be off by 2 characters
			//after the page has loaded for some reason...
			if(navigator.userAgent.indexOf("MSIE 8") > -1){
				
			}
			
			//find the date values for each event
			var eventMonth = eventHTML.slice((dateIndex + 21), dateIndex + 23);
			var eventDay = eventHTML.slice((dateIndex + 24), dateIndex + 26);
			var eventYear = eventHTML.slice((dateIndex + 27), dateIndex + 29);

			var typeIndex = eventHTML.indexOf("views-field-tid");
			if(navigator.userAgent.indexOf("MSIE 8") > -1){
					typeIndex -= 20;
				}
			var endIndex = eventHTML.indexOf("</span>", typeIndex);
			if(navigator.userAgent.indexOf("MSIE 8") > -1){
				endIndex = eventHTML.indexOf("</SPAN>", typeIndex);
			}
				
			var eventType = eventHTML.slice((typeIndex + 62), endIndex);

			if(eventType.indexOf(", ") > -1){
				var eventTypeArray = eventType.split(", ");
				
				for(var thisEvent = 0; thisEvent < eventTypeArray.length; thisEvent++){
					eventType = eventTypeArray[thisEvent].toUpperCase().replace(/ /g,"").replace(/'/g,"");
					if(selectedEventType == eventType){
						break;
					}
				}
			} else {
				eventType = eventType.toUpperCase().replace(/ /g,"").replace(/'/g,"");
			}
			
			if(eventType == ""){
				eventType = "OTHERPUBLICEVENT";
			}
			
			//hide events whose date do not match the user-chosen date &
			//show events whose dates do match the user-chosen date
			if((eventYear != (selYear - 2000)) || //subtract 2000 to give a 2-digit year (i.e. 2011 - 2000 = 11)
			 (eventMonth != selMonth) || 
			 (eventDay != dayClicked)){
				allUpcomingEvents[k].style.display = "none";
				allUpcomingEvents[k].showMe = false;
			} else {
				if(selectedEventType == "ALL" || selectedEventType == "DEFAULT"){
					if(meetingsCheckbox.checked == true){
						allUpcomingEvents[k].style.display = "block";
						allUpcomingEvents[k].showMe = true;
					} else if(eventType == "MEETINGS" || eventType == "EXHIBITS"){
						allUpcomingEvents[k].style.display = "none";
						allUpcomingEvents[k].showMe = false;
					} else {
						allUpcomingEvents[k].style.display = "block";
						allUpcomingEvents[k].showMe = true;
					}
				} else {
					if(eventType == selectedEventType){
						allUpcomingEvents[k].style.display = "block";
						allUpcomingEvents[k].showMe = true;
					} else {
						allUpcomingEvents[k].style.display = "none";
						allUpcomingEvents[k].showMe = false;
					}
				}
			}
			
		}
		
		eventsShown = 0;
		
		for(var n=0;n<allUpcomingEvents.length;n++){
			if(allUpcomingEvents[n].showMe){
				eventsShown += 1;
			}
		}
		
		if(eventsShown == 0){
			optionsList = document.getElementById("eventsOptionsList");
			for(var p=0; p<optionsList.length; p++){
				if(p == optionsList.selectedIndex && p != 0){
					eventTypeChosen = optionsList[p].innerHTML;
				} else if (p == 0){
					eventTypeChosen = 0;
				}
			}			
			var textToPrint = "<li id=\"empty_list_msg\" class=\"views-row\">There are no <strong>" + eventTypeChosen + "</strong> at MCPL on<br /><strong>" + selMonth + "/" + dayClicked + "/" + selYear + "</strong>.";
			if(eventTypeChosen != 0){
				textToPrint += "<br />with the event type<br />";
			}
			textToPrint += ".</li>";
			
			$(".view-display-id-block_1 ul").append(textToPrint);
		}
		
		//make sure the link isn't followed
		return false; 
	}
	
*/
	function limitByEventType(){
		if(document.getElementById("empty_list_msg")){
			$("li#empty_list_msg").remove();
		}
	
		dayClicked = $("table.mini td.today a").html();
		if(dayClicked < 10){
			dayClicked = "0" + dayClicked;
		}
		
		if(this.id == "meetingsCheckbox" && this.checked == true){
			eventTypeMenu.selectedIndex = 11;
		} else if(this.id == "meetingsCheckbox" && this.checked == false){
			eventTypeMenu.selectedIndex = 1;
		}
		
		for(var m=0;m<allUpcomingEvents.length;m++){
			var eventHTML = allUpcomingEvents[m].innerHTML;
			//use the string "date-display-single" to get the position of the date in the html
			//for each event
			var dateIndex = eventHTML.indexOf("date-display-single") + 27; 
					
			//find the date values for each event
			var eventMonth = eventHTML.slice((dateIndex + 21), dateIndex + 23);
			var eventDay = eventHTML.slice((dateIndex + 24), dateIndex + 26);
			var eventYear = eventHTML.slice((dateIndex + 27), dateIndex + 29); 

			//hide events whose date do not match the user-chosen date &
			//show events whose dates do match the user-chosen date
			if((eventYear != (selYear - 2000)) || //subtract 2000 to give a 2-digit year (i.e. 2011 - 2000 = 11)
			 (eventMonth != selMonth) || 
			 (eventDay != dayClicked)){
				allUpcomingEvents[m].showMe = false;
			} else {
				allUpcomingEvents[m].showMe = true;
			}
		}
		
		var selectedEventType = this.value.toUpperCase();
		
		if(selectedEventType == "MEETINGS" || selectedEventType == "ALL"){
			meetingsCheckbox.checked = true;
		} else if(selectedEventType != "ON"){
			meetingsCheckbox.checked = false;
		}
		
		for(var l=0;l<allUpcomingEvents.length;l++){
			var eventHTML = allUpcomingEvents[l].innerHTML;
			var typeIndex = eventHTML.indexOf("views-field-tid");
			if(navigator.userAgent.indexOf("MSIE 8") > -1){
					typeIndex -= 20;
				}
			var endIndex = eventHTML.indexOf("</span>", typeIndex);
			if(	navigator.userAgent.indexOf("MSIE 8") > -1){
				endIndex = eventHTML.indexOf("</SPAN>", typeIndex);
			}
				
			var eventType = eventHTML.slice((typeIndex + 62), endIndex);
			
			if(eventType.indexOf(", ") > -1){
				var eventTypeArray = eventType.split(", ");
				
				for(var thisEvent = 0; thisEvent < eventTypeArray.length; thisEvent++){
					eventType = eventTypeArray[thisEvent].toUpperCase().replace(/ /g,"").replace(/'/g,"");
					if(selectedEventType == eventType){
						break;
					}
				}
			} else {
				eventType = eventType.toUpperCase().replace(/ /g,"").replace(/'/g,"");
			}			
			
			if(eventType == ""){
				eventType = "OTHERPUBLICEVENT";
			}
			
			if(this.id == "meetingsCheckbox" && this.checked == true){
				if(eventType == "MEETINGS" && allUpcomingEvents[l].showMe == true){
					allUpcomingEvents[l].style.display = "block";
				} else {
					allUpcomingEvents[l].style.display = "none";
				}
			} else if(this.id == "meetingsCheckbox" && this.checked == false){
				if(eventType == "MEETINGS"){
					allUpcomingEvents[l].style.display = "none";
					allUpcomingEvents[l].showMe = false;
				} else if(allUpcomingEvents[l].showMe == true){
					allUpcomingEvents[l].style.display = "block";
				}
			} else {
				if(eventType == selectedEventType && allUpcomingEvents[l].showMe == true){
					allUpcomingEvents[l].style.display = "block";
				} else if(selectedEventType == "ALL" && allUpcomingEvents[l].showMe == true){
					allUpcomingEvents[l].style.display = "block";
				} else if(selectedEventType == "DEFAULT" && allUpcomingEvents[l].showMe == true){
					if(eventType != "MEETINGS" && eventType != "EXHIBITS"){
						allUpcomingEvents[l].style.display = "block";
					} else {
						allUpcomingEvents[l].style.display = "none";
					}
				} else {
					allUpcomingEvents[l].style.display = "none";
					allUpcomingEvents[l].showMe = false;
				}
			}
		}
		
		eventsShown = 0;
		
		for(var n=0;n<allUpcomingEvents.length;n++){
			if(allUpcomingEvents[n].showMe){
				eventsShown += 1;
			}
		}
		
		if(eventsShown == 0){
			optionsList = document.getElementById("eventsOptionsList");
			for(var p=0; p<optionsList.length; p++){
				if(p == optionsList.selectedIndex && p != 0 && p != 1){
					var eventTypeChosen = optionsList[p].innerHTML;
				} else if (p == 0){
					var eventTypeChosen = 0;
				} else if (p == 1){
					var eventTypeChosen = 1;
				}
			}			
			var textToPrint = "";
			if(eventTypeChosen != 0 && eventTypeChosen != 1){
				textToPrint = "<li id=\"empty_list_msg\" class=\"views-row\">There are no<br><strong>" + eventTypeChosen + "</strong><br>at MCPL on<br /><strong>" + selMonth + "/" + dayClicked + "/" + selYear + "</strong>";
			} else if(eventTypeChosen == 1) {
				textToPrint = "<li id=\"empty_list_msg\" class=\"views-row\">There are no MCPL events at MCPL on<br /><strong>" + selMonth + "/" + dayClicked + "/" + selYear + "</strong>";
			} else {
				textToPrint = "<li id=\"empty_list_msg\" class=\"views-row\">There are no events at MCPL on<br /><strong>" + selMonth + "/" + dayClicked + "/" + selYear + "</strong>";
			}
			textToPrint += ".</li>";
			
			$(".view-display-id-block_1 ul").append(textToPrint);
		} 
		
		// Use this code to insert a down arrow if the scroll height of the events list is longer than the view
		//$(".region-upcoming-events").attr("id", "region-upcoming-events");
		//alert(document.getElementById("region-upcoming-events").scrollHeight);
		
		//$(".region-upcoming-events").wrapInner('<div id="region-upcoming-events-foreground">');
		//document.getElementById("region-upcoming-events-foreground").style.backgroundImage = "url(http://money.mcpl.info/sites/all/themes/mcpl/images/fader.png)";
		//document.getElementById("region-upcoming-events-foreground").style.backgroundPosition = "0 380px";
		//document.getElementById("region-upcoming-events-foreground").style.backgroundRepeat = "repeat-x";
		//document.getElementById("region-upcoming-events-foreground").style.zIndex = "100";
		
		/* Expansion of Event Items to Show Information */
		/*
			var eventStarted = new Array();
			allUpcomingEvents.mouseenter(function() {
				eventStarted.push(new Date().getTime());
				timeArrayLength = eventStarted.length;
				if(timeArrayLength == 1){
					$(this).children("div.views-field-tid").slideDown();
					$(this).children("div.views-field-field-event-date-value").slideDown();
					$(this).children("body.front span.date-display-singe").slideDown();
				} else if(eventStarted[timeArrayLength - 1] - eventStarted[timeArrayLength - 2] > 500){
					eventStarted.push(new Date().getTime());
					$(this).children("div.views-field-tid").slideDown();
					$(this).children("div.views-field-field-event-date-value").slideDown();
					$(this).children("body.front span.date-display-singe").slideDown();
				} else {
					eventStarted.pop();
				}
			}).mouseleave(function() {
				$(this).children("div.views-field-tid").slideUp();
				$(this).children("div.views-field-field-event-date-value").slideUp();
			});
		*/
	}
	
/*
	$(".region-sidebar-second").append("<div id=\"upcoming-events-scroll\"><table id=\"scroll-table\"><tr><td id=\"scroll-up\">&uarr;</td></tr><td id=\"scroll-down\">&darr;</td></tr></table></div>");
	document.getElementById("scroll-up").onclick = scrollList;
	document.getElementById("scroll-down").onclick = scrollList;
	
	function scrollList(){
		$(".region-upcoming-events").attr("id", "region-upcoming-events");
		if(this.id == "scroll-up"){
			document.getElementById("region-upcoming-events").scrollTop -= 100;
		} else {
			document.getElementById("region-upcoming-events").scrollTop += 100;
		}
		
	}
*/
	
	//Grow/shrink the item cover images in the "New Item" section on the front page when the user mouses over them
/*
	if($("body").hasClass("front")){	
		$(".xmlfeedimg, .staffpicks").mouseenter(function(){
			$(this).animate({
				width: '90px',
				height: '135px',
				marginLeft: '9px',
				marginRight: '9px',
				marginTop: '4px',
				marginBottom: '9px'
			},{duration: 50, queue: false});
		}).mouseleave(function(){
			$(this).animate({
				width: '80px',
				height: '115px',
				marginLeft: '14px',
				marginRight: '14px',
				marginTop: '14px',
				marginBottom: '14px'
			},{duration: 50, queue: false});
		});
	}
*/

	//Display title when the user hovers over a staff picks list item on the front page or the teens homepage
	if($("body").hasClass("front") || $("body").hasClass("page-teens-teens")){
		$(".xmlfeedimg, .staffpicks").mouseenter(function(){
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
		if(navigator.userAgent.indexOf("Safari") > -1){
			document.getElementById("searchPageBox").type = "search";
			//Change the size of the field only in Safari
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
				
				searchTerm = document.getElementById("searchPageBox").value.toUpperCase();
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
	if($("body").hasClass("front") || $("body").hasClass("page-teens-teens")){
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
	
	if($("body").hasClass("front")){
		var allPagerItems = $(".custom-pager-item-inner a");
		var allSlides = $("div.slide");
		
		for(var pager = 0; pager < allPagerItems.length; pager++){
			allPagerItems[pager].onclick = function(){
				if($(this).hasClass("redirectNow")){
					var pagerClasses = $(this).parents("div.custom-pager-item").attr("class");
					pagerIndex = pagerClasses.indexOf("item-");
					pagerIndex = pagerClasses.slice((pagerIndex + 5), (pagerIndex + 6));
					window.location = "http://mcpl.info" + $($(allSlides)[pagerIndex]).find("a").attr("href");
				} else {
					for(var p=0; p < allPagerItems.length; p++){
						$(allPagerItems[p]).removeClass("redirectNow");
					}
					$(this).addClass("redirectNow");
				}
			}
		}
	}
	
	
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

if(urlParts[1]){
	var variableName = urlParts[1].split("=");
	
	if(variableName[0] == "mini"){
		miniCalendarIsHidden = false;
	} else {
		miniCalendarIsHidden = true;
	}
} else {
	miniCalendarIsHidden = true;
}

function showEventsOptions(){
	if(miniCalendarIsHidden){
		$("#showEventsOptions a").html("Hide Calendar");
		$("#showFullCalendar").show();
		$("#block-views-calendar-calendar_block_1").slideDown('400');
		miniCalendarIsHidden = false;
	} else {
		$("#showEventsOptions a").html("Show Calendar");
		$("#block-views-calendar-calendar_block_1").slideUp('400',
			function() {
				$("#showFullCalendar").hide();
			});
		miniCalendarIsHidden = true;
	}
}

function translatePage(){
	var currentPage = window.location.href;

	window.location = 'http://translate.google.com/translate?sl=en&tl=es&u=' + currentPage;
}


