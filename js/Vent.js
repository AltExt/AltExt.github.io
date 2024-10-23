// global variables to track the mesh location
let meshLocation = 0;
const NO_MESH = 0;
const R4_MESH = 1;
const H3_MESH = 2;

// This multiplies the initial area by 4%, to ensure that airflow through the vent is not going to be obstructed
const AREA_MULTIPLIER = 1.04; 

// some get / set functions for reading and writing data on the page
// I prefer this method of accessing data - have the ID string in only one location
function GetInputR1() {	return parseFloat(document.getElementById("innerRadiusInput").value); }

function GetT() { return parseFloat(document.getElementById("thicknessInput").value); }
function GetR1() { return parseFloat(document.getElementById("R1output").value); }
function GetR2() { return parseFloat(document.getElementById("R2output").value); }
function GetR3() { return parseFloat(document.getElementById("R3output").value); }
function GetMeshPercentage() { return parseFloat(document.getElementById("meshPercentageInput").value); }

function SetR1(num) { document.getElementById("R1output").value = ToString(num); }
function SetR2(num) { document.getElementById("R2output").value = ToString(num); }
function SetR3(num) { document.getElementById("R3output").value = ToString(num); }
function SetR4(num) { document.getElementById("R4output").value = ToString(num); }
function SetH1(num) { document.getElementById("H1output").value = ToString(num); }
function SetH2(num) { document.getElementById("H2output").value = ToString(num); }
function SetH3(num) { document.getElementById("H3output").value = ToString(num); }

// Resets the mesh input fields to default
function NoMesh()
{
	document.getElementById("noMeshRadio").checked = true;
	document.getElementById("meshR4Radio").checked = false;
	document.getElementById("meshH3Radio").checked = false;

	meshLocation = NO_MESH;

	document.getElementById("meshPercentageInput").disabled = true;
}

function Test(input)
{
	console.log(input);
}

// Triggered by "Mesh on R4" or "Mesh on H3" radio
// Sets mesh location to R4 or H3 and allows mesh percentage input
function SetMeshLocation(location)
{
	document.getElementById("noMeshRadio").checked = false;

	meshLocation = location;

	document.getElementById("meshPercentageInput").disabled = false;
}

// Resets all input fields to blank, calls NoMesh to reset mesh input
function ClearAll()
{
	document.getElementById("innerRadiusInput").value = "";
	document.getElementById("thicknessInput").value = "";
	
	SetR1("");
	SetR2("");
	SetR3("");
	SetR4("");

	SetH1("");
	SetH2("");
	SetH3("");

	document.getElementById("R2output").disabled = true;
	document.getElementById("R3output").disabled = true;
	document.getElementById("R4output").disabled = true;
	
	NoMesh();
}

// Called by the "Sumbit" button
// Attemts to perform the neccessary calculations, will return before setting any values if an error occurs
function AttemptVentCalc()
{
	/*
	 Calculate the radii increasing outward
	 This is hard to explain in text

		¦===================|
		¦<    R2   >|		|
		¦			|		|
		¦		|###|	|	|
		¦<  R1 >|		|	
		¦=======|=======|	¦
		¦<      R3     >¦	¦
		¦		|			¦
		¦<      | R4       >¦
		¦		|
	
	... This ascii image is not helping. Basically R1 is the inside diameter of the pipe, T is the thickness of the pipe. Both are inputs from the user
	The airflow in the section marked with #### between R1 and R2 must have an equal area to the area of the circle formed by R1 
	In order to calculate the radius r2:
		Area of circle R1 = AR1 (r1)
		Area of circle R2 = AR2 (r2)
		Area of circlt R1+t = AR1T (rt = r1 + t)
		AR2 - AR1T == AR1
		(PI * r2 * r2) - (PI * rt * rt) = (PI * r1 * r1)
			divide across by PI
		r2^2 - rt^2 = r1^2
		r2^2 = r1^2 + rt^2
		r2 = sqrt( r1^2 + rt^2 )

	because of math magic:
		r1 = sqrt(r1^2 + (r1+t)^2)
		r3 = sqrt(r1^2 + (r2+t)^2)
		r4 = sqrt(r1^2 + (r3+t)^2)

		¦===================|
		¦		x	|	x	|
		¦	 h1 x	|h3 x	|
		¦		|	|	|	|
		¦		|h2 x	|	
		¦=======|=======|
		¦		|
		¦		|
		¦		|
		¦		|

	... return of the bad ascii art
	airflow through regions marked with x's above must also be equal to airflow through the area of circle formed by r1
	now its equating the surface area of a cylinder to the area of a circle
	PI*2*r*h = PI*r*r*h
	I wont do the full derivation for this one
		h1 = r1^2 / (2 * r1)
		h2 = r1^2 / (2 * r2)
		h3 = r1^2 / (2 * r3)

	*/
	

	const R1 = GetInputR1();
	const T = GetT();

	if (isNaN(R1) || isNaN(T))
	{
		if (isNaN(R1)) console.log("R1 was NaN");
		if (isNaN(T)) console.log("T was NaN");
		console.log("Aborting the calculations");
		return;
	}

	const TARGET_AREA = R1 * R1 * AREA_MULTIPLIER;


	let R2 = Math.sqrt( Math.pow(R1 + T, 2) + TARGET_AREA );
	let R3 = Math.sqrt( Math.pow(R2 + T, 2) + TARGET_AREA );
	let R4 = Math.sqrt( Math.pow(R3 + T, 2) + TARGET_AREA );

	let H1 = TARGET_AREA / (2 * R1);
	let H2 = TARGET_AREA / (2 * R2);
	let H3 = TARGET_AREA / (2 * R3);

	// Now, if there is a mesh present on the vent to stop insects etc, this becomes complicated
	if (meshLocation != NO_MESH)
	{
		// The mesh will take up a certain percentage of the area, either on the vertical part of H3 or the horizontal part of R4
		// because the airflow must remain the same even with the mesh present, this means that one of those dimensions must grow
		// we do this by scaling the target area and re doing the calc for that dimension
		const MESH_INPUT = GetMeshPercentage();

		if (isNaN(MESH_INPUT))
		{
			console.log("Mesh percentage input was Nan");
			console.log("Aborting the calculations");
			return;
		}

		const MESH_PERCENTAGE = MESH_INPUT / 100;
		const MESH_SCALE = 1 / MESH_PERCENTAGE;
		if (meshLocation == R4_MESH)
		{	// radius (R4)
			R4 = Math.sqrt( Math.pow(R3 + T, 2) + (TARGET_AREA * MESH_SCALE) );
		}
		else 
		{	// height (H3)
			H3 = (TARGET_AREA * MESH_SCALE) / (2 * R3);
		}
	}

	// data out
	SetR1(R1);
	SetR2(R2);
	SetR3(R3);
	SetR4(R4);

	SetH1(H1);
	SetH2(H2);
	SetH3(H3);

	document.getElementById("R2output").disabled = false;
	document.getElementById("R3output").disabled = false;
	document.getElementById("R4output").disabled = false;
}

// Once the initial calculation has been complete, the user can then edit the values in R2, R3 and R4 output boxes
// This allows them to select more round values (75 vs. 73.13548)
// If this happened the values must be re calculated from that point
function ReCalcFromR2(input)
{
	ValidateNumber(input);

	const R1 = GetInputR1();
	const T = GetT();
	let newR2 = GetR2();

	if (isNaN(R1) || isNaN(T) || isNaN(newR2))
	{
		if (isNaN(R1)) console.log("R1 was NaN");
		if (isNaN(T)) console.log("T was NaN");
		if (isNaN(newR2)) console.log("newR2 was NaN");
		console.log("Aborting the calculations");
		return;
	}

	const TARGET_AREA = R1 * R1 * AREA_MULTIPLIER;

	let R3 = Math.sqrt( Math.pow(newR2 + T, 2) + TARGET_AREA );
	let R4 = Math.sqrt( Math.pow(R3 + T, 2) + TARGET_AREA );

	SetR3(R3);
	SetR4(R4);
}

function ReCalcFromR3(input)
{	ValidateNumber(input);

	const R1 = GetInputR1();
	const T = GetT();
	let newR3 = GetR2();

	if (isNaN(R1) || isNaN(T) || isNaN(newR3))
	{
		if (isNaN(R1)) console.log("R1 was NaN");
		if (isNaN(T)) console.log("T was NaN");
		if (isNaN(newR3)) console.log("newR3 was NaN");
		console.log("Aborting the calculations");
		return;
	}

	const TARGET_AREA = R1 * R1 * AREA_MULTIPLIER;

	let R4 = Math.sqrt( Math.pow(newR3 + T, 2) + TARGET_AREA );
	
	SetR4(R4);
}