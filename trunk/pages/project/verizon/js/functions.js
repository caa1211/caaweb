// JavaScript Document
//Popup function
function popUp(URL) {
	day = new Date();
	id = day.getTime();
	eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=820,height=538');");
}

//show/hide steps
function showHideSteps(hideThis, showThis){
	var hideThis = document.getElementById(hideThis);
	var showThis =document.getElementById(showThis);
	hideThis.style.display ='none';
	showThis.style.display ='block';
}

var unsafeString = "\"<>%\\^[]`\+\$\,'#&";
function isUnsafe(compareChar)
{
   if ( unsafeString.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) > 32
        && compareChar.charCodeAt(0) < 123 )
      return false; // found no unsafe chars, return false
   else
      return true;
}

function encodeUrl(val)
{
   var len     = val.length;
   var i       = 0;
   var newStr  = "";
   var original = val;

   for ( i = 0; i < len; i++ ) {
      if ( val.substring(i,i+1).charCodeAt(0) < 255 ) {
         /* hack to eliminate the rest of unicode from this  */
         if (isUnsafe(val.substring(i,i+1)) == false)
            newStr = newStr + val.substring(i,i+1);
         else
            newStr = newStr + convert(val.substring(i,i+1));
      } else {
         /* woopsie! restore.  */
         alert ("Found a non-ISO-8859-1 character at position: " + (i+1) + ",\nPlease eliminate before continuing.");
         newStr = original;
         /* short-circuit the loop and exit */
         i = len;
      }
   }

   return newStr;
}

var MonthName = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function timeStrFormat(str,iLen,space)   
{   
	if(str.length<iLen)   
	{   
		for(iIndex=0;iIndex<iLen-str.length;iIndex++)   
		{
		  if ( space==true ) {
				str="&nbsp;"+str;
			}
			else {
				str="0"+str;
			}
		}   
		return str;   
	}   
	else {
		return str;
	}
}

function hourStrFormat(hour,APM)   
{
	var str = "";
	if ( hour >= 12 ) {
		if ( APM == true ) {
			str = "PM";
		}
		else if ( hour == 12 ) {
			str = "12";
		} else {
			str += hour-12;
		}
	}
	else {
		if ( APM == true ) {
			str = "AM";
		}
		else {
			str += hour;
		}
	}
	return str;
}

function timestampToFullStr ( timestamp ) {
	var now = new Date(timestamp*1000);
	var days = timeStrFormat(now.getDate().toString(),2,true);
	var years = now.getFullYear();
	var months = now.getMonth();
	var hr = now.getHours();
	var min = timeStrFormat(now.getMinutes().toString(),2,false);
	return MonthName[months]+"&nbsp;"+days+",&nbsp;"+years+"&nbsp;-&nbsp;"+ timeStrFormat(hourStrFormat(hr,false),2,true) + ":" + min + " " + hourStrFormat(hr,true);
}

function timestampToStr ( timestamp ) {
	var result="";
	var now = new Date(timestamp*1000);
	var now2 = new Date(0);

	var months = now.getMonth()-now2.getMonth();
	if ( months > 0 )	{
		if ( months > 1 ) {
			result = months+" Months ";
		}
		else {
			result = months+" Month ";
		}
	}
	var days = now.getDate()-now2.getDate();
	if ( days > 0 )	{
		if ( days > 1 ) {
			result += days+" days ";
		}
		else {
			result += days+" day ";
		}
	}
	var hr = now.getHours()-now2.getHours();
	if ( hr > 0 )	{
		if ( hr > 1 ) {
			result += hr+" hrs ";
		}
		else {
			result += hr+" hr ";
		}
	}
	var min = now.getMinutes()-now2.getMinutes();
	if ( min > 0 )	{
		if ( min > 1 ) {
			result += min+" mins ";
		}
		else {
			result += min+" min ";
		}
	}
	var sec = now.getSeconds()-now2.getSeconds();
	if ( sec > 0 )	{
		if ( sec > 1 ) {
			result += sec+" secs";
		}
		else {
			result += sec+" sec";
		}
	}
	return result;
}
