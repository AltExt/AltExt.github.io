
function DefaultRadioClicked() 
{
	document.getElementById("conePitch_customValue").disabled = true;
}

function OtherRadioClicked()
{
	document.getElementById("conePitch_customValue").disabled = false;
}

function ValidateNumber(input)
{
	input.value = input.value.replace(/[^0-9]/g, '');
}

function GetConePitch()
{
	/* */if ( document.getElementById("conePitch_5").enabled ) return 5;
	else if ( document.getElementById("conePitch_10").enabled ) return 5;
	else if ( document.getElementById("conePitch_15").enabled ) return 5;
	else if ( document.getElementById("conePitch_20").enabled ) return 5;
	else if ( document.getElementById("conePitch_25").enabled ) return 5;
	else if ( document.getElementById("conePitch_30").enabled ) return 5;
	else
	{
		let str = document.getElementById("conePitch_customValue").value;
		return Number(str);
	}
}

function GetShellRadius()
{
	let str = document.getElementById("tankRadiusInput").value;
	return Number(str);
}

function GetKnuckleValue()
{
	let str = document.getElementById("knuckleValueInput").value;
	return Number(str);
}

function AttemptOutput()
{
	let Pitch = GetConePitch();
	let Radius = GetShellRadius();
	let AVal = GetKnuckleValue();

	if (Pitch == 0 || Radius == 0 || AVal == 0) return;

	console.log("Pitch: " + Pitch);
	console.log("Radius: " + Radius);
	console.log("AVal: " + AVal);
}