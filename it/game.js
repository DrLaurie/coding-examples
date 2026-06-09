"use strict";

// Global variables
var IN=-1,MV=8,NR=0,RM=36,PO=1,LP=1,RL=0,LO=false,NW=0,RT=0,RR=0,TH,HL,C$,TP;

// Laurie's notes:
// 
// In BASIC, variable names were limited to two letters.
//
// IN = initialized
// MV = move
// NR
// RM = room
// PO = item carried? 
// LP = luck points?
// RL = remaining lantern power
// LO = lantern on/off
// NW = number of wounds
// TH = take here (is there an item to take here?)

var R=[],D$=[],M$=[],H=[],H$=[],T=[],T$=[],P=[],D=[];
// M$ = move
// T = item to take

for (var i = 1; i <= 36; i++)
{
	R[i] = [];
};
for (i = 1; i <=6; i++)
{
	H[i] = [];
};

var input = function()
{
	NR=0;
	MV=0;
	
	var C$ = document.getElementById("input").value;
	C$ = C$.toUpperCase();
	for (var i = 1; i <=14; i++)
	{
		if (M$[i].substring(0,C$.length)==C$)
		{
			MV = i;
			i = 14;
		};
	};
	if (MV==0) 
	{
		alert("I DON'T UNDERSTAND.");	
	}
	else if (MV<=6)
	{
		NR=R[RM][MV];
		if (NR<=0) 
		{   
			alert("THE WAY IS BARRED.");
		};
	
	};
	document.getElementById("input").value="";
	document.getElementById("input").focus();
	operations();
};

var output = function()
{
	// debugging section
	console.log("LOCATION: " + RM);
	var debugItems = "YOU ARE CARRYING:";
		
		for (var i = 1; i<=LP-1;i++)
		{
			debugItems += T$[P[i]];
			if (i!=LP-1) debugItems +=",";
		};
	console.log(debugItems);
	// end debugging items
	
	
	var output = "YOU'RE IN "+D$[RM]+".<br>";
	
	if (RM<25 && (!LO || T[1]>0 && T[1]!=RM) )
	{
		output +="IT'S VERY DARK HERE.<br>";
	}
	else 
	{
		for (var i = 1; i<=12; i++)
		{	
			if (T[i]==RM)
			{	
				output += "A "+ T$[i] +" IS HERE.<br>";
			};
		};
		if (LO && RL>120)
		{
			output += "YOUR LAMP HAS EXPIRED.<br>";
			LO = false;
		};
		if (LO && RL>100)
		{
			output += "YOUR  LAMP  BATTERIES ARE GETTING EXHAUSTED.<br>";
		};
	};
	output += "</p><p>";
	for (var i=1; i<=6; i++)
	{
		if (R[RM][i]>0)
		{
			output+= "YOU CAN GO "+ M$[i] +".<br>";
		};
	};
	output +="</p>";
	
	document.getElementById("output").innerHTML = output;
};

var operations = function()
{	
	document.getElementById("action").innerHTML = "";
	if (NW==6)
		{
			alert("CONGRATULATIONS! YOU  SUCCEEDED IN KILLING  YOURSELF!");
			IN=-1;
			initialize();
			document.location.reload();
		};
	if (NR!=0) RM=NR;
	TH=0;
	
	for (var i = 1; i <=12; i++)
	{
		if (T[i]==RM)
		{
			TH=i;
			i=12;
		};
	};
	HL=0;
	
	for (var i=1; i<=6; i++)
	{
		if (H[i][1] == RM)
		{
			HL=i;
			i=6;
		};
	};
	
	// General operations
	if (RM<12 && RR!=8) puzzle();
	if (LO) RL++; 
	
	// Personal operations
    if (MV>=7)
	{
		switch(MV-6)
		{
			case 1: kill();
					break;
			case 2: help();
					break;
			case 3: take();
					break;
			case 4: drop();
					break;
			case 5: inventory();
					break;
			case 6: bandage();
					break;
			case 7: lantern();
					break;
			case 8: read();
					break;
		};
	};	
	
	// Handlers
	
	switch(HL)
	{
		case 1: it();
				break;
		case 2: dragon();
				break;
		case 3: snake();
				break;
		case 4: hellhound();
				break;
		case 5: bomb();
				break;
		case 6: barbeque();
				break;
	};
	output();
};

var kill = function()
{
	if (HL == 0 || HL > 4)
	{
		document.getElementById("action").innerHTML="TIME IS THE ONLY THING YOU CAN KILL HERE.";
		return;
	};
	
	PO = carried(7);
	if (PO == 0)
	{
		document.getElementById("action").innerHTML="ATTACK WITH YOUR BARE HANDS? THAT'S SUICIDE!";
		return;
	};
	
	var output = "YOU TRY TO  KILL  THE "+ H$[HL] + ".<br>";
	output += "YOU STRIKE WITH  YOUR SWORD,<br>";
	
	if (((HL==1 || H ==2) && (H[HL][2]==6 || H[HL][2]==5)) || (Math.random(0)>=0.5))
	{
		output += " AND  YOU  GIVE IT A TERRIBLE BLOW !";
		H[HL][3]=H[HL][3]-1;
	}
	else
	{
		output += " BUT  IT  MOVES AWAY QUICKLY...";
	};
	
	if (Math.random(0)<=.2)
	{
		output += "<br>THIS IS YOUR CHANCE!! YOU CAN HIT IT  AGAIN BEFORE IT RECOVERS.";
	}
	else if (H[HL][3]==1)
	{
		output += "<br>THE VICTIM IS BADLY   WOUNDED.";
	}
	else if (H[HL][3]<1)
	{
		output += "<br>YOU KILLED YOUR VICTIM.";
		H[HL][1]=0;
		T[HL+8]=RM;
		HL=0;
	};
	document.getElementById("action").innerHTML=output;	
};

var help = function()
{
	var help = "POSSIBLE COMMANDS:<br>";
	for (var i = 1; i<=14;i++)
	{
		help += M$[i];
		if (i!=14) help +=", ";
	};
	document.getElementById("action").innerHTML = help;
	
};

var take = function()
{
	if (T[1]==0 || T[1]==RM && LO || RM>24)
	{
		if (TH==0)
		{
			document.getElementById("action").innerHTML = "THERE IS  NOTHING  TO TAKE HERE.";
		}
		else
		{
			document.getElementById("action").innerHTML = "I TAKE THE "+T$[TH]+".";
			P[LP]=TH;
			LP=LP+1;
			T[TH]=0;
			TH=0;
		};
	}
	else
	{
		document.getElementById("action").innerHTML = "YOU  CAN'T  SEE  YOUR OWN FINGERS,LET ALONE SOMETHING  TO  TAKE!";
	};
};

var drop = function()
{
	var dropMessage,D$;
	if (LP==1)
	{
		dropMessage ="YOU OWN NOTHING !";
	}
	else
	{
		D$ = prompt("DROP WHAT?");
		D$ = D$.toUpperCase();
		TP=0;
		
		for (var i = 1; i <=12; i++)
		{
			if (T$[i].substring(0,D$.length)==D$)
			{
				TP=i;
				i=12;
			};
		};
		if (TP==0)
		{
			dropMessage ="I DON'T UNDERSTAND.";
		}
		else 
		{
			PO = carried(TP);
			if (PO==0)
			{
				dropMessage ="YOU'RE NOT CARRYING A "+ T$[TP] +".";
			}
			else
			{
				dropMessage ="I DROP THE "+ T$[TP] +".";
				TH=P[PO];
				T[TH]=RM;
				LP=LP-1;
				P[PO]=P[LP];
			};
		};
	};
	document.getElementById("action").innerHTML = dropMessage;
};// end function

var inventory = function()
{
	var inventoryItems;
	
	if (LP==1)
	{
		inventoryItems = "YOU OWN NOTHING AT ALL.";
	}
	else
	{
		inventoryItems = "YOU ARE CARRYING:";
		
		for (var i = 1; i<=LP-1;i++)
		{
			inventoryItems += T$[P[i]];
			if (i!=LP-1) inventoryItems +=", ";
		};
	};
	inventoryItems += "<br>YOU CAN SUFFER "+(5-NW)+" MORE WOUNDS.";
	
	document.getElementById("action").innerHTML = inventoryItems;
	
};

var bandage = function()
{
	var bandageMessage;
	PO = carried(6);
	if (PO==0)
	{
		bandageMessage = "YOU WON'T MANAGE THAT WITHOUT A BANDAGE.";
	}
	else
	{
		bandageMessage = "IT DOESN'T  LOOK VERY HOPEFUL.I'LL NEED ALL YOU HAVE.<br>";
		bandageMessage += "ALL RIGHT, IT'LL HOLD FOR A WHILE.";
		NW=0;
		LP=LP-1;
		P[PO]=P[LP];
	};
	document.getElementById("action").innerHTML = bandageMessage;
};

var lantern = function()
{
	var lanternMessage;
	if (T[1]>0 && T[1]!=RM) 
	{
		lanternMessage = "GET A LANTERN FIRST.";
		
	}
	else 
	{
		if (RL>120)
		{
			lanternMessage = "YOUR BATTERIES ARE FINISHED.";
		}
		else 
		{
			lanternMessage = "THE LANTERN IS NOW ";
			if (LO) 
			{
				LO = false;
				lanternMessage += "OFF.";
			}
			else
			{
				LO = true
				lanternMessage += "ON.";
			};
		};
	};
	document.getElementById("action").innerHTML = lanternMessage;
};

var read = function()
{
	var readMessage;
	PO = carried(4); 
	if (PO==0)
	{
		readMessage = "THERE IS NOTHING HERE TO READ.";
	}
	else if (!LO && RM<25)
	{
		readMessage = "IT'S TOO DARK TO READ.";
	}
	else
	{
		readMessage = decode("SGDQD HR Z QDBHOD ENQ ");
		readMessage += decode("BNNJHDR HM SGHR ANNJ. ");
		readMessage += decode("HS RZXR: ");
		readMessage += "<br>";
		readMessage += decode("SZJD  NMD   GDKKGNTMC ");
		readMessage += decode("ZMC Z OHMBG NE VGDZS. ");
		readMessage += "<br>";
		readMessage += decode("OTS HS NM Z AZQADBTD. ");
		readMessage += "<br>THAT'S ALL.";
	};
	document.getElementById("action").innerHTML = readMessage;
};

var it = function()
{	
	var itMessage=document.getElementById("action").innerHTML+"<p>";
	
	if (TH==3)
	{
		H[1][2]=3;
		T[TH]=0;
		TH=0;
	};

	switch(H[1][2])
	{
		case 1:
				itMessage += "*** I.T. ***<br>";
				itMessage += "THE INTRA-TERRESTRIAL IS HERE.<br>";
				itMessage += "HE'S TALKING URGENTLY,   BUT   YOU "
				itMessage += "CAN'T UNDERSTAND HIM.";
				H[1][2]=2;
				break;
		case 2:
				itMessage += decode("H.S. FDRSTQDR SGZS GD HR  UDQX  SGHQRSX. GD KNNJR CDRODQZSD.");	
				break;
		case 3:
				itMessage += decode(" H.S. CQHMJR ZR HE GD ");
				itMessage += decode("MDDCDC HS UDQX AZCKX. ");
				itMessage += decode("ZESDQ  Z   VGHKD   GD ");
				itMessage += decode("RSZQSR SZKJHMF ZFZHM; ");
				itMessage += decode("ZMC XNT  QDZKHYD  XNT ");
				itMessage += decode("BZM  TMCDQRSZMC  GHL!");
				itMessage += "<br><br>";
				itMessage += decode("   GD RZXR: OKDZRD FN ");
				itMessage += decode("CNVM EHMC SGD MTKKHSX ");
				itMessage += decode("ANLA.    RNLD   BQZYX ");
				itMessage += decode("OQNEDRRNQ  VZMSR   SN ");
				itMessage += decode("CDRSQNX ZKK KHED VHSG HS! ");
				itMessage += decode("   H GZC Z EHFGS VHSG SGD   LNMRSDQ    SGZS ");
				itMessage += decode("OQNSDBSR HS, ATS MNV H ");
				itMessage += decode("ZL DWGZTRSDC, RN HS'R TO SN XNT SN RZUD SGD DZQSG! ");
				itMessage += "<br>SUDDENLY I.T.COLLAPSES.";
				H[1][2]=4;
				break;
		case 4:
				itMessage += "IT LOOKS LIKE I.T. IS ";
				itMessage += "IN A COMA. NOW YOU'LL ";
				itMessage += "HAVE  TO  DO  IT  ALL ";
				itMessage += "ALONE...  GOOD LUCK!";
				H[1][2]=5;
				break;
		case 5:
				itMessage += "I.T. IS HERE.<br>";
				itMessage += "HE IS IN A COMA";	
				break;				
	};
	document.getElementById("action").innerHTML = itMessage;
};

var dragon = function()
{
	var dragonMessage=document.getElementById("action").innerHTML+"<p>";
	
	if (TH==8)
	{
		H[2][2]=5;
		T[TH]=0;
		TH=0;
	};
	
	switch(H[2][2])
	{
		case 1:
				dragonMessage += "THERE IS  AN ENORMOUS ";
				dragonMessage += "MONSTER  HERE.   IT'S ";
				dragonMessage += "EYES   ARE   ROLLING. ";
				dragonMessage += "IT YELLS: ";
				dragonMessage += "<br>ARE YOU A COOKIE ?!";
				H[2][2] = 2; 
				break;
		case 2:
				dragonMessage += "THE  MONSTER  YELLS ";
				dragonMessage += "LOUDER AND LOUDER: ";
				dragonMessage += "<br>ARE YOU A COOKIE?!!";
				H[2][2] = 3; 
				break;
		case 3:
				dragonMessage += "THE   MONSTER   KEEPS ";
				dragonMessage += "YELLING, AND IT  GETS ";
				dragonMessage += "RATHER AGGRESSIVE.";
				H[2][2] = 4; 
				break;
		case 4:
				dragonMessage += "THE MONSTER GIVES YOU ";
				dragonMessage += "A TERRIBLE BLOW. YOUR ";
				dragonMessage += "HEAD IS SPINNING.";
				NW=NW+1; 
				H[2][2]=(Math.ceil(3*Math.random(0)+1));
				break;
		case 5:
				dragonMessage += "THE   MONSTER    SAYS ";
				dragonMessage += "SURPRISED: COOKIES ? ";
				dragonMessage += "AND STARTS TO EAT  AT ";
				dragonMessage += "ONCE.   AN   ENORMOUS <br>";
				dragonMessage += "   ! ! B O N G ! ! <br>";
				dragonMessage += "AND IT FALLS ASLEEP. ";
				R[16][6]=1; 
				H[2][2]=6;
				break;
		case 6:
				dragonMessage += "THE MONSTER IS ASLEEP.";
				break; 
	};
	document.getElementById("action").innerHTML = dragonMessage;
};

var snake = function()
{
	var snakeMessage=document.getElementById("action").innerHTML+"<p>";
	
	snakeMessage += "THERE IS A SNEAKY ";
	snakeMessage += "SNAKE HERE.";
	
	if (Math.random(0)>=.4)
	{
		if (LP!=1 || Math.random(0)>=.5)
		{
			var RN=parseInt((LP-1)*Math.round(0));
			T[P[RN]]=12+parseInt(12*Math.round(0));
			LP=LP-1;
			P[RN]=P[LP];
			snakeMessage += "WITH A QUICK MOVE  IT ";
			snakeMessage += "SNATCHES   SOMETHING, ";
			snakeMessage += "AND ";
		};
		snakeMessage += "IT SNEAKS AWAY."
		H[3][1]=H[3][1]+3;
		if (H[3][1]>24)	
		{
			H[3][1]=H[3][1]-8;
		};
	};
	document.getElementById("action").innerHTML = snakeMessage;
};

var hellhound = function()
{
	var hellhoundMessage=document.getElementById("action").innerHTML+"<p>";
	
	switch(H[4][2])
	{
		case 1:
				hellhoundMessage += "THERE  IS   A   GIANT ";
				hellhoundMessage += "HELLHOUND  HERE.   IT ";
				hellhoundMessage += "LOOKS LIKE  IT  WANTS ";
				hellhoundMessage += "YOU FOR DINNER. ";
				H[4][2]=2;
				break;;
		case 2:
				hellhoundMessage += "THE HELLHOUND ATTACKS ";
				hellhoundMessage += "YOU  AND  BITES   YOU ";
				hellhoundMessage += "VIOLENTLY. ";
				NW=NW+1;
				H[4][2]=3;
				break;
		case 3:
				hellhoundMessage += "THE HELLHOUND  GROWLS ";
				hellhoundMessage += "AND SEEMS TO  PREPARE ";
				hellhoundMessage += "FOR ANOTHER ATTACK. ";
				H[4][2]=1+Math.ceil(2*Math.random(0));
				break;
	};
	document.getElementById("action").innerHTML = hellhoundMessage;
};

var bomb = function()
{
	var bombMessage;
	
	alert("THE NULLITY  BOMB  IS HERE. THERE ARE THREE WIRES CONNECTING  THE BOMB AND THE  TIMING MECHANISM:\n\t- A GREEN  ONE (G)\n\t- A YELLOW ONE (Y)\n\t- A RED ONE (R)\nYOU  MUST  DISCONNECT TWO TO MAKE IT STOP.");
	
	var X$ = prompt("WHICH ONE FIRST? (G,Y, OR R)");
	var Y$ = prompt("AND SECOND? (G,Y, OR R)");
	
	X$ = X$.toUpperCase();
	Y$ = Y$.toUpperCase();
	
	if (X$.charCodeAt(0)*Y$.charCodeAt(0) != 6319)
	{
		bombMessage = "ENORMOUS EXPLOSION! MUSHROOM CLOUD!\n";
		bombMessage += "YOU TRIED BRAVELY, BUT ALAS ! !\n";
		bombMessage += "YOU DIDN'T SUCCEED...\n";
		bombMessage += "\n\nYOU LOSE.";
	}
	else 
	{
		bombMessage = "** CONGRATULATIONS **\n\n";
		bombMessage += "YOU SUCCEEDED WHERE ";
		bombMessage += "EVERYONE ELSE FAILED!";
		bombMessage += "\n\nYOU WIN!";
	}	
	alert(bombMessage);
	IN=-1;
	initialize();
	document.location.reload();
};

var barbeque = function()
{
	var barbequeMessage=document.getElementById("action").innerHTML+"<p>";
	
	if (T[2]==RM && T[12]==RM)
	{
		TH=8;
		T[TH]=RM;
		T[2]=0;
		T[12]=0;
		H[6][2]=2;
	};
	switch (H[6][2])
	{
		case 1:
				barbequeMessage += " THERE  IS  A  GIANT ";
				barbequeMessage += "BARBECUE HERE, WITH A ";
				barbequeMessage += "LARGE FIRE UNDER IT.";
				break;
		case 2:
				barbequeMessage += "  AN  ENORMOUS  FLASH ";
				barbequeMessage += "LIGHTENS  THE  PLACE, ";
				barbequeMessage += "AND   A   PENETRATING ";
				barbequeMessage += "SMELL FILLS YOUR NOSE. ";
				H[6][2]=3;
				break;
		case 3:
				barbequeMessage += "EVERYTHING  IS  QUIET ";
				barbequeMessage += "NOW; EVEN THE TERRIBLE ";
				barbequeMessage += "SMELL HAS FADED. ";
				H[6][2]=1;
				break;		
	};
	document.getElementById("action").innerHTML = barbequeMessage;
};

var decode = function(x)
{
	var newString = "";
	for (var i = 0; i < x.length; i++)
	{
		var charCode = x.charCodeAt(i);
		if (charCode == 90)
		{
			charCode = 65;
		} 
		else if (charCode >= 65 && charCode <= 90)
		{
			charCode++;
		};
		newString += String.fromCharCode(charCode);
	};
	return newString;
};

var carried = function (TP)
{
	PO=0;
	for (var i =1; i<=LP-1; i++)
	{
		if (P[i]==TP)
		{
			PO=i;
			i=LP-1;
		};
	};
	return PO;
};

var puzzle = function()
{
	var puzzleMessage=document.getElementById("action").innerHTML+"<p>";
	RT++;
	
	if(RM==D[RT]) RR++;
	
	if (RT>=8)
	{
		if (RR!=8)
		{
			puzzleMessage += "AN ABSOLUTE  DARKNESS ";
			puzzleMessage += "COVERS  YOU  AND   IT ";
			puzzleMessage += "FEELS AS IF SOMETHING ";
			puzzleMessage += "IS  LIFTING  YOU.<br>";
			puzzleMessage += "FOR A MOMENT YOU  ARE ";
			puzzleMessage += "UNCONCIOUS.";
			RT=1;
			RR=1;
			RM=1;
		}
		else
		{
			puzzleMessage += "YOU  HEAR  A  STRANGE ";
			puzzleMessage += "SOUND,AS IF SOMETHING ";
			puzzleMessage += "IS BEING PUSHED AWAY. <br><br>";
			puzzleMessage += "NOW IT HAS STOPPED."
			R[2][1]=3;
		};
	};
	document.getElementById("action").innerHTML = puzzleMessage;
};


var initialize = function()
{
	// set initial arrays
	console.log("Initializing...");
	for (var i = 1; i <= 36; i++)
	{
		R[i][1] = i+1;
		R[i][2] = i-1;
		R[i][3] = i+4;
		R[i][4] = i-4;
		R[i][5] = 0;  
		R[i][6] = 0;  
	};
	
	for (var i = 0; i<= 24; i += 12)
	{
		for (var j = 1; j <= 9; j += 4)
		{
			R[i+j+3][1] = 0;
			R[i+j][2] = 0;
		};
		
		for (var j = 1; j <= 4; j++)
		{
			R[i+j+8][3] = 0;
			R[i+j][4] = 0;
		};
	};
	
	R[1][5] = 16;
	R[7][5] = 15;
	R[32][6] = 13;
	R[13][5] = 32;
	R[35][6] = 18;
	R[18][5] =35;
	R[21][1] = 0;
	R[22][2] = 0;
	R[22][1] = 0;
	R[23][2] = 0;
	R[18][1] = 0;
	R[19][2] = 0;
	R[16][3] = 0;
	R[20][4] = 0;
	R[11][1] = 0;
	R[12][2] = 0;
	R[7][1] = 0;
	R[8][2] = 0;
	R[7][4] = 0;
	R[3][3] = 0;
	R[2][1] = 0;
	
	H[1][1] = 34;
	H[1][2] = 1;
	H[1][3] = 2;
	H[2][1] = 16;
	H[2][2] = 1;
	H[2][3] = 15;
	H[3][1] = 17;
	H[3][2] = 1;
	H[3][3] = 4;
	H[4][1] = 29;
	H[4][2] = 1;
	H[4][3] = 2;
	H[5][1] = 8;
	H[5][2] = 1;
	H[5][3] = 1;
	H[6][1] = 25;
	H[6][2] = 1;
	H[6][3] = 1;
	
	
	// fill arrays
	
	var dataString = "xxx,EAST,WEST,NORTH,SOUTH,UP,DOWN,KILL,HELP,TAKE,DROP,INVENTORY,BANDAGE,LANTERN,READ";
	M$ = dataString.split(",");
	delete M$[0];

	dataString = "xxx,KZMSDQM,VGDZSOHKD,VZSDQRZBJ,BNNJANNJ,KDZEKDS,AZMCZFD,RVNQC,BNNJHD,ANCX NE H.S.,FHZMS BNQORD,RKHBDC RMZFD,CDZC GNTMC";
	var Tcode$ = dataString.split(",");
	
	for (var i = 1; i < Tcode$.length; i++)
	{
		T$[i] = decode(Tcode$[i]);
	};

	dataString = "xxx,H.S.,LNMRSDQ,RMZJD,GDKKGNTMC,AZQADBTD,ANLA";
	var Hcode$ = dataString.split(",");
	
	for (var i = 1; i <Hcode$.length; i++)
	{
		H$[i] = decode(Hcode$[i]);
	};
	
	dataString = "xxx,QDRDS BZUD,S-BZUD,RDBQDS BNQQHCNQ,BNMSQNK QNNL,N-BZUD,H-BZUD,ROZBD-BZUD,";
	dataString += "AKZBJ QNNL,O-BZUD,D-BZUD,M-BZUD,DLOSHMDRR,";
	dataString += "RLZKK BZUD,QNBJX BZUD,RLDKKX BZUD,CQZFNM BZUD,RMZJD BZUD,XDKKNV BZUD,";
	dataString += "RSQDZL AZMJ,RSHMJX OKZBD,ENNC BZUD,EHMZK BZUD,";
	dataString += "BNKNQDC BZUD,HBD BZUD,NODM OKZBD,VNNCR,VNNCR,VNNCR,VNNCR,VNNCR,VNNCR,";
	dataString += "VNNCR,VNNCR,VNNCR,VNNCR,VNNCR";
	
	var Dcode$ = dataString.split(",");
	
	for (var i = 1; i <Dcode$.length; i++)
	{
		D$[i] = decode(Dcode$[i]);
	};
	
	T = [0,34,30,28,21,14,15,13,0,0,0,0,0];
	delete T[0];
	
	D = [0,1,5,9,10,11,7,6,2];
	delete D[0];
	
	IN = 0;
	
};

var toggleLink = function()
{   
	if (document.getElementById("hidden").firstElementChild.nextElementSibling.className == "show")
	{
		document.getElementById("hidden").firstElementChild.nextElementSibling.classList.remove("show");
	}
	else
	{
	document.getElementById("hidden").firstElementChild.nextElementSibling.className = "show";
	};
};



window.onload = function()
{
	if (IN!=0) initialize();
	output();
	document.getElementById("input").focus();
	document.getElementById("button").onclick = input;
	
	// Disable normal click action of link
	document.getElementById("link").addEventListener("click", function(event){
		event.preventDefault();
	});
	document.getElementById("link").onclick = toggleLink;
	
	// Disable normal click action of link
	document.getElementById("close").addEventListener("click", function(event){
		event.preventDefault();
	});
	document.getElementById("close").onclick = toggleLink;
	
	// Code below allows the user to submit using the Enter key rather than the button. Not gonna lie, this part was brutal.
	
	document.getElementById("input").addEventListener("keypress", function(event) { 
		
		if (event.keyCode == 13) {
			event.preventDefault();
			document.getElementById("button").click();
		}
	});
 
	
};