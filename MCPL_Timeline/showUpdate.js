function searchDisplay(form){
var x=xmlDoc.getElementsByTagName("cd");
var forshow="";
var c=0;
for (i=0;i<x.length;i++) {
var title=x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
var artist=x[i].getElementsByTagName("artist")[0].childNodes[0].nodeValue;
//var tags="";
//if (x[i].getElementsByTagName("TAGS")[0].childNodes[0].nodeValue){
//tags=x[i].getElementsByTagName("TAGS")[0].childNodes[0].nodeValue;}
//var summary=x[i].getElementsByTagName("SUMMARY")[0].childNodes[0].nodeValue;
//var author=x[i].getElementsByTagName("AUTHOR")[0].childNodes[0].nodeValue;
//var department=x[i].getElementsByTagName("DEPARTMENT")[0].childNodes[0].nodeValue;
//var categories=x[i].getElementsByTagName("categories")[0].childNodes[0].nodeValue;
//var comb=title+" "+teaser+" "+summary+" "+author+" "+department+" "+tags+" "+categories;
var comb=title+" "+artist;
var desired = form.inputbox.value;
var re=new RegExp(desired,"i");
var yearspacer = 100;
var test=re.test(comb);
if (test){
//var img=x[i].getElementsByTagName("IMAGE")[0].childNodes[0].nodeValue;
//var alt=x[i].getElementsByTagName("ALT")[0].childNodes[0].nodeValue;
//var homepage=x[i].getElementsByTagName("HOMEPAGE")[0].childNodes[0].nodeValue;
//var position=x[i].getElementsByTagName("POSITION")[0].childNodes[0].nodeValue;
//var campus=x[i].getElementsByTagName("CAMPUS")[0].childNodes[0].nodeValue;
//var podlink=x[i].getElementsByTagName("PODLINK")[0].childNodes[0].nodeValue;
//var report=x[i].getElementsByTagName("GRANTREPORT")[0].childNodes[0].nodeValue;
//var cats=parser(x[i].getElementsByTagName("categories")[0].childNodes[0].nodeValue);
  var y = ((parseInt(x[i].getElementsByTagName("year")[0].childNodes[0].nodeValue) - 1980) * yearspacer) - 5;
  var t = "'"+i+"'";
  var g = 'item' + c;
  var pp = "onclick=\"Popup.show('PopupDiv','" +g+"','bottom left',{'content':'" + x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +"','width':300,'height':200,'style':{'border':'1px solid black','backgroundColor':'white'},'offsetTop':200,'offsetLeft':20});return false;\"";
forshow = forshow + '<div class="c" id="' + g + '" style="left:' + y + 'px" ' + pp + '"><img src="sphere-jade.gif" height="12px" width="12px" style="margin-right: 5px;"/>'+x[i].getElementsByTagName("artist")[0].childNodes[0].nodeValue + "</div>";

c++;
};

}

//forshow = forshow.replace(/<div class='blueblock'><\/div>$/,"<br>");
if (forshow==""){
forshow="Sorry, no results matched your search.<br>"
}
document.getElementById("content").innerHTML=forshow;

var dvs = document.getElementById("content").getElementsByTagName("div");

if (dvs.length == 0) {
        return;
    }
else {
	for (i = 0; i < dvs.length; i++) {
	var foc = dvs[i];
	foc.setAttribute("class", "c");
	 
	var hold = "#item" + i;
  	var hit_list = $(hold).collision(".content-item");
  	while(hit_list.length > 0) {
	h = foc.offsetTop + 30;
	hTop = h + "px";
	foc.style.top = hTop; 
	hit_list = $(hold).collision(".content-item");
 	};
	 foc.setAttribute("class", "content-item");
}
}
}

/*
var hold = "#" + g;
  var hit_list = $(hold).collision(".content-item");
   alert(hit_list.length);
while(hit_list.length > 0) {
	var d = document.getElementById(g);
	h = d.offsetTop + 30;
	hTop = h + "px";
	d.style.top = hTop; 
	hit_list = $(hold).collision(".content-item");
}
*/