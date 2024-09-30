function CheckInput(input)
{
	ValidateNumber(input);
	AttemptConeCutoutOutput();
}

function DefaultRadioClicked() 
{
	document.getElementById("conePitch_customValue").disabled = true;
	AttemptConeCutoutOutput();
}

function OtherRadioClicked()
{
	document.getElementById("conePitch_customValue").disabled = false;
	AttemptConeCutoutOutput();
}

function GetConePitch()
{
	/* */if ( document.getElementById("conePitch_5").checked ) return 5;
	else if ( document.getElementById("conePitch_10").checked ) return 10;
	else if ( document.getElementById("conePitch_15").checked ) return 15;
	else if ( document.getElementById("conePitch_20").checked ) return 20;
	else if ( document.getElementById("conePitch_25").checked ) return 25;
	else if ( document.getElementById("conePitch_30").checked ) return 30;
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

function AttemptConeCutoutOutput()
{
	const Pitch = GetConePitch() * Math.PI / 180;
	const Radius = GetShellRadius();
	const AVal = GetKnuckleValue();

	if (Pitch == 0 || Radius == 0 || AVal == 0) return;

	const PI = Math.PI;

	const R2 = (Radius / Math.cos(Pitch)) + AVal;
	const R1 = R2 * Math.cos(Pitch);
	const Circumference = (2 * PI * R2);
	const CutoutLength = Circumference - (2 * PI * R1);

	const CutoutRatio = CutoutLength / Circumference;
	const TotalArea = (PI * R2 * R2);
	const CoutoutSurfaceaArea = TotalArea * (1 - CutoutRatio);

	const H = Math.sqrt( (R2*R2) - (R1*R1) );
	const Volume = (PI * R1 * R1 * H) / 3

	document.getElementById("coneTotalRadius").value = R2;
	document.getElementById("coneCutoutLength").value = CutoutLength;
	document.getElementById("coneSurfaceArea").value = CoutoutSurfaceaArea / (1000 * 1000); // convert to m^2
	document.getElementById("coneVolume").value = Volume / (1000 * 1000 * 1000); // convert to m^3
}

function ClearAll()
{
	document.getElementById("conePitch_30").checked = true;

	document.getElementById("conePitch_5").checked = false;
	document.getElementById("conePitch_10").checked = false;
	document.getElementById("conePitch_15").checked = false;
	document.getElementById("conePitch_20").checked = false;
	document.getElementById("conePitch_25").checked = false;

	document.getElementById("conePitch_custom").checked = false;
	document.getElementById("conePitch_customValue").value = "";

	document.getElementById("tankRadiusInput").value = "";
	document.getElementById("knuckleValueInput").value = "";
	
	document.getElementById("coneTotalRadius").value = "";
	document.getElementById("coneCutoutLength").value = "";
	document.getElementById("coneSurfaceArea").value = "";
	document.getElementById("coneVolume").value = "";
}