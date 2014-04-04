function fillDates(startDate, endDate, dayWidth){
	var startDate = parseInt(startDate);
	var endDate = parseInt(endDate);
	var	yearSpan = endDate - startDate;
	document.getElementById("dateBanner").innerHTML = "";
	for (b=0;b<(yearSpan + 1);b++) {
		var eachYear = "<div class='singleYear' style='left:" + (b * 365 * dayWidth) + "px'>" + (startDate + b) + "</div>";
		$("#dateBanner").append(eachYear);	
	}
}

function resolveDisplay(form){
	cat = form.cat.value;
	term = form.term.value;
	firstYear = parseInt(form.startYear.value);
	endYear = parseInt(form.endYear.value);
	var totalTime = endYear - firstYear;
	document.getElementById("content").innerHTML="";
	var x=xmlDoc.getElementsByTagName("Entry");
	var array = new Array();
	var dayWidth = 1;
	if (totalTime < 3){
		dayWidth = 10;
	}
	else if (totalTime < 6){
		dayWidth = 7;
	}
	else if (totalTime < 11){
		dayWidth = 5;
	}
	else if (totalTime < 26){
		dayWidth = 3;
	}
	var heightSpacer = 30;
	monthArray = window.monthArray;
	$('#content').css('width', '84000px');
	if (cat != "searchAll"){
		for (i=0;i<x.length;i++) {
			var testYear = parseInt(x[i].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue.substr(0, 4), 10);
			if (testYear >= firstYear && testYear <= endYear && x[i].getElementsByTagName(cat).length > 0){
			var forTest = x[i].getElementsByTagName(cat)[0].childNodes[0].nodeValue;
			var re=new RegExp(term,"i");
			var test=re.test(forTest);
			if (test){
				var time = x[i].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue;
				var datePieces = new Array();
				datePieces = time.split("-");
				var dateNum = (parseInt(datePieces[0])*dayWidth*365) + ((parseInt(datePieces[1], 10) - 1)*dayWidth*30) + ((parseInt(datePieces[2], 10) - 1)*dayWidth);
				var dateLeft = dateNum - (firstYear*dayWidth*365);
				var idName = "item" + i;
				if(x[i].getElementsByTagName("Event").length > 0)
      				{var evnt = "<p>" + x[i].getElementsByTagName("Event")[0].childNodes[0].nodeValue + "</p>";}
				else{var evnt = "";}
				var pp = "onclick=\"Popup.show('PopupDiv','" +idName+"','bottom left');return false;"; 
				var divHtml = '<div class="content-item" id="' + idName + '" style="left:' + dateLeft + 'px" ' + pp + '"><img src="sphere-jade.gif" height="12px" width="12px" style="margin-right: 5px;"/>'+x[i].getElementsByTagName("Brief_Description")[0].childNodes[0].nodeValue + '</div>';
				$("#content").append(divHtml);
				var widhold = "#" + idName;
				stringLen = ($(widhold).width() + 10);
				moveDown = collisionDetection(stringLen, dateLeft, array);
				var downSpace = moveDown * heightSpacer;
				var topOff = downSpace + "px";
				$(widhold).css('top', topOff);
			}
			}

		}
	}
	else {
		for (i=0;i<x.length;i++) {
			var testYear = parseInt(x[i].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue.substr(0, 4), 10);
			if (testYear >= firstYear && testYear <= endYear){
			var ed = x[i].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue;
			var dc = "";
				if (x[i].getElementsByTagName("Date_Check")[0]){dc = x[i].getElementsByTagName("Date_Check")[0].childNodes[0].nodeValue;}
			var bc = x[i].getElementsByTagName("Brief_Description")[0].childNodes[0].nodeValue;
			var ev = "";	
				if (x[i].getElementsByTagName("Event")[0]){ev = x[i].getElementsByTagName("Event")[0].childNodes[0].nodeValue;}
			var cv = "";	
				if (x[i].getElementsByTagName("Controlled_Vocabulary")[0]){cv = x[i].getElementsByTagName("Controlled_Vocabulary")[0].childNodes[0].nodeValue;}
			var tg  = "";	
				if (x[i].getElementsByTagName("Tags")[0]){tg = x[i].getElementsByTagName("Tags")[0].childNodes[0].nodeValue;}
			var	indx = "";	
				if (x[i].getElementsByTagName("Indexer")[0]){indx = x[i].getElementsByTagName("Indexer")[0].childNodes[0].nodeValue;}
			var ss = "";	
				if (x[i].getElementsByTagName("Source_Summary")[0]){ss = x[i].getElementsByTagName("Source_Summary")[0].childNodes[0].nodeValue;}
			var sf = "";	
				if (x[i].getElementsByTagName("Source_Full_Citation")[0]){sf = x[i].getElementsByTagName("Source_Full_Citation")[0].childNodes[0].nodeValue;}
			var forTest = ed + " " + dc + " " + bc + " " + ev + " " + cv + " " + tg + " " + indx + " " + ss + " " + sf;
			var re=new RegExp(term,"i");
			var test=re.test(forTest);
			if (test){
				var time = x[i].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue;
				var datePieces = new Array();
				datePieces = time.split("-");
				var dateNum = (parseInt(datePieces[0])*dayWidth*365) + ((parseInt(datePieces[1], 10) - 1)*dayWidth*30) + ((parseInt(datePieces[2], 10) - 1)*dayWidth);
				var dateLeft = dateNum - firstYear*dayWidth*365;
				var idName = "item" + i;
				if(x[i].getElementsByTagName("Event").length > 0)
      				{var evnt = "<p>" + x[i].getElementsByTagName("Event")[0].childNodes[0].nodeValue + "</p>";}
				else{var evnt = "";}
				var pp = "onclick=\"Popup.show('PopupDiv','" +idName+"','bottom left');return false;"; 
				var divHtml = '<div class="content-item" id="' + idName + '" style="left:' + dateLeft + 'px" ' + pp + '"><img src="sphere-jade.gif" height="12px" width="12px" style="margin-right: 5px;"/>'+x[i].getElementsByTagName("Brief_Description")[0].childNodes[0].nodeValue + '</div>';
				$("#content").append(divHtml);
				var widhold = "#" + idName;
				stringLen = ($(widhold).width() + 10);
				moveDown = collisionDetection(stringLen, dateLeft, array);
				var downSpace = moveDown * heightSpacer;
				var topOff = downSpace + "px";
				$(widhold).css('top', topOff);
			}
			}
		}
	}
	fillDates(firstYear, endYear, dayWidth);
	var fWidth = (365 * (totalTime + 1) * dayWidth) + 250;
	fWidth = fWidth + "px";
	$('#content').css('width', fWidth);
	mCustomScrollbars();
}

function resolveDisplaySet(catx, termx, firstYearx, endYearx){
	document.getElementById("content").innerHTML="";
	cat = catx;
	term = termx;
	firstYear = parseInt(firstYearx);
	endYear = parseInt(endYearx);
	var x=xmlDoc.getElementsByTagName("Entry");
	var array = new Array();
	var heightSpacer = 30;
	var totalTime = endYear - firstYear;
	var dayWidth = 1;
	if (totalTime < 3){
		dayWidth = 10;
	}
	else if (totalTime < 6){
		dayWidth = 7;
	}
	else if (totalTime < 11){
		dayWidth = 5;
	}
	else if (totalTime < 26){
		dayWidth = 3;
	}
	var heightSpacer = 30;
	monthArray = window.monthArray;
	$('#content').css('width', '84000px');
	if (cat != "searchAll"){
		for (i=0;i<x.length;i++) {
			var testYear = parseInt(x[i].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue.substr(0, 4), 10);
			if (testYear >= firstYear && testYear <= endYear && x[i].getElementsByTagName(cat).length > 0){
			var forTest = x[i].getElementsByTagName(cat)[0].childNodes[0].nodeValue;
			var re=new RegExp(term,"i");
			var test=re.test(forTest);
			if (test){
				var time = x[i].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue;
				var datePieces = new Array();
				datePieces = time.split("-");
				var dateNum = (parseInt(datePieces[0])*dayWidth*365) + ((parseInt(datePieces[1], 10) - 1)*dayWidth*30) + ((parseInt(datePieces[2], 10) - 1)*dayWidth);
				var dateLeft = dateNum - firstYear*dayWidth*365;
				var idName = "item" + i;
				if(x[i].getElementsByTagName("Event").length > 0)
      				{var evnt = "<p>" + x[i].getElementsByTagName("Event")[0].childNodes[0].nodeValue + "</p>";}
				else{var evnt = "";}
				var pp = "onclick=\"Popup.show('PopupDiv','" +idName+"','bottom left');return false;"; 
				var divHtml = '<div class="content-item" id="' + idName + '" style="left:' + dateLeft + 'px" ' + pp + '"><img src="sphere-jade.gif" height="12px" width="12px" style="margin-right: 5px;"/>'+x[i].getElementsByTagName("Brief_Description")[0].childNodes[0].nodeValue + '</div>';
				$("#content").append(divHtml);
				var widhold = "#" + idName;
				stringLen = ($(widhold).width() + 10);
				moveDown = collisionDetection(stringLen, dateLeft, array);
				var downSpace = moveDown * heightSpacer;
				var topOff = downSpace + "px";
				$(widhold).css('top', topOff);
			}
			}

		}
	}
	else {
		for (i=0;i<x.length;i++) {
			var testYear = parseInt(x[i].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue.substr(0, 4), 10);
			if (testYear >= firstYear && testYear <= endYear){
			var ed = x[i].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue;
			var dc = "";
				if (x[i].getElementsByTagName("Date_Check")[0]){dc = x[i].getElementsByTagName("Date_Check")[0].childNodes[0].nodeValue;}
			var bc = x[i].getElementsByTagName("Brief_Description")[0].childNodes[0].nodeValue;
			var ev = "";	
				if (x[i].getElementsByTagName("Event")[0]){ev = x[i].getElementsByTagName("Event")[0].childNodes[0].nodeValue;}
			var cv = "";	
				if (x[i].getElementsByTagName("Controlled_Vocabulary")[0]){cv = x[i].getElementsByTagName("Controlled_Vocabulary")[0].childNodes[0].nodeValue;}
			var tg  = "";	
				if (x[i].getElementsByTagName("Tags")[0]){tg = x[i].getElementsByTagName("Tags")[0].childNodes[0].nodeValue;}
			var	indx = "";	
				if (x[i].getElementsByTagName("Indexer")[0]){indx = x[i].getElementsByTagName("Indexer")[0].childNodes[0].nodeValue;}
			var ss = "";	
				if (x[i].getElementsByTagName("Source_Summary")[0]){ss = x[i].getElementsByTagName("Source_Summary")[0].childNodes[0].nodeValue;}
			var sf = "";	
				if (x[i].getElementsByTagName("Source_Full_Citation")[0]){sf = x[i].getElementsByTagName("Source_Full_Citation")[0].childNodes[0].nodeValue;}
			var forTest = ed + " " + dc + " " + bc + " " + ev + " " + cv + " " + tg + " " + indx + " " + ss + " " + sf;
			var re=new RegExp(term,"i");
			var test=re.test(forTest);
			if (test){
				var time = x[i].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue;
				var datePieces = new Array();
				datePieces = time.split("-");
				var dateNum = (parseInt(datePieces[0])*dayWidth*365) + ((parseInt(datePieces[1], 10) - 1)*dayWidth*30) + ((parseInt(datePieces[2], 10) - 1)*dayWidth);
				var dateLeft = dateNum - firstYear*dayWidth*365;
				var idName = "item" + i;
				if(x[i].getElementsByTagName("Event").length > 0)
      				{var evnt = "<p>" + x[i].getElementsByTagName("Event")[0].childNodes[0].nodeValue + "</p>";}
				else{var evnt = "";}
				var pp = "onclick=\"Popup.show('PopupDiv','" +idName+"','bottom left');return false;"; 
				var divHtml = '<div class="content-item" id="' + idName + '" style="left:' + dateLeft + 'px" ' + pp + '"><img src="sphere-jade.gif" height="12px" width="12px" style="margin-right: 5px;"/>'+x[i].getElementsByTagName("Brief_Description")[0].childNodes[0].nodeValue + '</div>';
				$("#content").append(divHtml);
				var widhold = "#" + idName;
				stringLen = ($(widhold).width() + 10);
				moveDown = collisionDetection(stringLen, dateLeft, array);
				var downSpace = moveDown * heightSpacer;
				var topOff = downSpace + "px";
				$(widhold).css('top', topOff);
			}
			}
		}
	}
	fillDates(firstYear, endYear, dayWidth);
	var fWidth = (365 * (totalTime + 1) * dayWidth) + 250;
	fWidth = fWidth + "px";
	$('#content').css('width', fWidth);
	mCustomScrollbars();
}

function collisionDetection(strLen, offset, array){
//loop1:

	for (a = 0; a < array.length; a++){
		if (offset > array[a]){
//			break loop1;}
			break;}
	}
	array[a] = offset + strLen;
	return a;
}


function printF(){
	cat = window.cat;
	term = window.term;
	monthArray = window.monthArray;
	firstYear = parseInt(window.firstYear);
	endYear = parseInt(window.endYear);
	
	var x=xmlDoc.getElementsByTagName("Entry");
	var searchAll = "any";
	var array = new Array();
	var dayWidth = 1;
	var heightSpacer = 30;
	var printCon = "";
	//alert(firstYear + " " + endYear + " " + x[1].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue.substr(0, 4));

	if (cat != "searchAll"){
		for (i=0;i<x.length;i++) {
			var testYear = parseInt(x[i].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue.substr(0, 4));
			if (testYear >= firstYear && testYear <= endYear){
			var forTest = x[i].getElementsByTagName(cat)[0].childNodes[0].nodeValue;
			var re=new RegExp(term,"i");
			var test=re.test(forTest);
			if (test){
				var monthNum = parseInt(x[i].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue.substr(5, 6), 10);
				var month = monthArray[monthNum];
				var day = parseInt(x[i].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue.substr(8, 9), 10);
				var head = "<h3><center>" + month + " " + day + ", " + testYear + ": " + x[i].getElementsByTagName("Brief_Description")[0].childNodes[0].nodeValue + "</center></h3>";
				var des = "";
				if(x[i].getElementsByTagName("Event").length > 0)
					{des = "<p>" + x[i].getElementsByTagName("Event")[0].childNodes[0].nodeValue + "</p>";}	
				var link = "";
				if(x[i].getElementsByTagName("File_Link").length > 0)
					{link = "<p>link to resource: <a href='" + x[i].getElementsByTagName("File_Link")[0].childNodes[0].nodeValue + "' target='_blank' >" + x[i].getElementsByTagName("File_Link")[0].childNodes[0].nodeValue + "</a></p>";}
				var source ="";
				if(x[i].getElementsByTagName("Source_Summary").length > 0)
					{source = "<p><i>Source: </i>" + x[i].getElementsByTagName("Source_Summary")[0].childNodes[0].nodeValue + "</p>";}
				var tags = "";
			//	if(x[i].getElementsByTagName("Tags").length > 0)
			//		{tags = "<p>Tags: " + x[i].getElementsByTagName("Tags")[0].childNodes[0].nodeValue + "</p>";}
				var printCon = printCon + head + des + link + source + tags + "<br /> <hr> <br />";

			}
		}	
				
		}
		myWindow=window.open()
		myWindow.document.write(printCon)
		myWindow.focus()
	}

	else {
		for (i=0;i<x.length;i++) {
			var testYear = parseInt(x[i].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue.substr(0, 4), 10);
			if (testYear >= firstYear && testYear <= endYear){
			var ed = x[i].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue;
			var dc = "";
				if (x[i].getElementsByTagName("Date_Check")[0]){dc = x[i].getElementsByTagName("Date_Check")[0].childNodes[0].nodeValue;}
			var bc = x[i].getElementsByTagName("Brief_Description")[0].childNodes[0].nodeValue;
			var ev = "";	
				if (x[i].getElementsByTagName("Event")[0]){ev = x[i].getElementsByTagName("Event")[0].childNodes[0].nodeValue;}
			var cv = "";	
				if (x[i].getElementsByTagName("Controlled_Vocabulary")[0]){cv = x[i].getElementsByTagName("Controlled_Vocabulary")[0].childNodes[0].nodeValue;}
			var tg  = "";	
				if (x[i].getElementsByTagName("Tags")[0]){tg = x[i].getElementsByTagName("Tags")[0].childNodes[0].nodeValue;}
			var	indx = "";	
				if (x[i].getElementsByTagName("Indexer")[0]){indx = x[i].getElementsByTagName("Indexer")[0].childNodes[0].nodeValue;}
			var ss = "";	
				if (x[i].getElementsByTagName("Source_Summary")[0]){ss = x[i].getElementsByTagName("Source_Summary")[0].childNodes[0].nodeValue;}
			var sf = "";	
				if (x[i].getElementsByTagName("Source_Full_Citation")[0]){sf = x[i].getElementsByTagName("Source_Full_Citation")[0].childNodes[0].nodeValue;}
			var forTest = ed + " " + dc + " " + bc + " " + ev + " " + cv + " " + tg + " " + indx + " " + ss + " " + sf;
			var re=new RegExp(term,"i");
			var test=re.test(forTest);
			if (test){
				var monthNum = parseInt(x[i].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue.substr(5, 6), 10);
				var month = monthArray[monthNum];
				var day = parseInt(x[i].getElementsByTagName("Event_Date")[0].childNodes[0].nodeValue.substr(8, 9), 10);
				var head = "<h3><center>" + month + " " + day + ", " + testYear + ": " + x[i].getElementsByTagName("Brief_Description")[0].childNodes[0].nodeValue + "</center></h3>";
				var des = "";
				if(x[i].getElementsByTagName("Event").length > 0)
					{des = "<p>" + x[i].getElementsByTagName("Event")[0].childNodes[0].nodeValue + "</p>";}	
				var link = "";
				if(x[i].getElementsByTagName("File_Link").length > 0)
					{link = "<p>link to resource: <a href='" + x[i].getElementsByTagName("File_Link")[0].childNodes[0].nodeValue + "' target='_blank' >" + x[i].getElementsByTagName("File_Link")[0].childNodes[0].nodeValue + "</a></p>";}
				var source ="";
				if(x[i].getElementsByTagName("Source_Summary").length > 0)
					{source = "<p><i>Source: </i>" + x[i].getElementsByTagName("Source_Summary")[0].childNodes[0].nodeValue + "</p>";}
				var tags = "";
			//	if(x[i].getElementsByTagName("Tags").length > 0)
			//		{tags = "<p>Tags: " + x[i].getElementsByTagName("Tags")[0].childNodes[0].nodeValue + "</p>";}
				var printCon = printCon + head + des + link + source + tags + "<br /> <hr> <br />";

			}
		}	
				
		}
		myWindow=window.open()
		myWindow.document.write(printCon)
		myWindow.focus()
	}
	
}
	
