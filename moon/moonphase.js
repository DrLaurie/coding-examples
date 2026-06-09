"use strict";

var displayResult = function(degrees,month,day,year)
{	
	var phase,percent, displayValue;
	
	if (month < 10 ) 
	{
		month = "0" + month;
	};
	
	if (day < 10)
	{
		day = "0" + day;
	};
	
	if (degrees <= 5)
	{
		phase = "new";
	}
	else if (degrees <= 84)
	{
		phase = "waxing crescent";
	}
	else if (degrees <= 95)
	{
		phase = "first quarter";
	}
	else if (degrees <= 175)
	{
		phase = "waxing gibbous";
	}
	else if (degrees <= 185)
	{
		phase = "full";
	}
	else if (degrees <=265)
	{
		phase = "waning gibbous";
	}
	else if (degrees <= 275)
	{
		phase = "third quarter";
	}
	else if (degrees <= 355)
	{
		phase = "waning crescent";
	}
	else 
	{
		phase = "new";
	}
		
	percent = (100-(Math.abs((180-degrees)/180*100))).toFixed(1);
	
	displayValue = "<p>On " + month + "/" + day + "/" + year + ", ";
	displayValue += "the moon was " + percent + "% visible.</p>";
	
	displayValue += "<p>The moon phase was " + phase + ".</p>";
	
	document.getElementById("display").innerHTML = displayValue;
	
	
	
	
};


var calculate = function(month,day,year)
{	
	// This formula was taken from 
	// Volcanic Games For Your VIC 20
	// Authors: Hal Renko & Sam Edwards
	// Addison-Wesley Publishing, 1983
	
	if (month<3)
	{   
		// Account for lunar new year (?) 
		month+=12;
		year--;
	};
	
	
	// 06/09/2026 changed parseInt → Math.floor (fixes negative year calculations)
    var t = Math.floor(365.25*year) + Math.floor(30.6*(month+1)) + day - 694038;
    t = t/36525; 

	
	var la = 350.737486+1236*t*360;
	la=la+307*t+6*t/60;
	la=la+51.18*t/3600-5.17*t*t/3600;
	
	// 06/09/2026 changed to proper modulo to handle negative values correctly
    la = ((la % 360) + 360) % 360;
    
    // 06/09/2026 changed parseInt → Math.floor
    la = Math.floor(la + 0.5);

	return(la);
};

var inputDate = function()
{
	var date = document.getElementById("date").value;
	
	//break into components
	var year = parseInt(date.substr(0,4));
	var month = parseInt(date.substr(5,2));
	var day = parseInt(date.substr(8,2));
	
	// Validate user input
	if ( isNaN(month) || isNaN(day) || day<1 || day>31 || isNaN(year) )
		{
			alert("Please enter a valid date.");
			document.getElementById("month").focus();
			return;
		
			// Note, this does not check against nonexistent dates such as April 31st
		}

	var degrees = calculate(month,day,year);
	displayResult(degrees,month,day,year);
};

window.onload = function()
{
	document.getElementById("button").onclick = inputDate;
	document.getElementById("month").focus();
};
