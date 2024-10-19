let meshLocation = 0;

function NoMesh()
{
	document.getElementById("noMeshRadio").checked = true;
	document.getElementById("meshR4Radio").checked = false;
	document.getElementById("meshH3Radio").checked = false;

	meshLocation = 0;

	document.getElementById("meshPercentageInput").disabled = true;
}

function RadiusMesh()
{
	document.getElementById("noMeshRadio").checked = false;

	meshLocation = 1;

	document.getElementById("meshPercentageInput").disabled = false;
}

function HeightMesh()
{
	document.getElementById("noMeshRadio").checked = false;

	meshLocation = 2;

	document.getElementById("meshPercentageInput").disabled = false;
}

function ClearAll()
{
	document.getElementById("innerRadiusInput").value = "";
	document.getElementById("thicknessInput").value = "";
	NoMesh();
}

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


	// This multiplies the initial area by 4%, to ensure that airflow through the vent is not going to be obstructed
	// Not sure why 4% was chosen, but that's what I have in the original code and I can't find my notes on it and I didn't believe in comments back then apparently
	const AREA_MULTIPLIER = 1.04; 

	// Grab values from hmtl
	const R1 = parseFloat(document.getElementById("innerRadiusInput").value);
	const T = parseFloat(document.getElementById("thicknessInput").value);

	// Calc target area used in all future calcs
	const TARGET_AREA = R1 * R1 * AREA_MULTIPLIER;

	let R2 = Math.sqrt( Math.pow(R1 + T, 2) + TARGET_AREA );
	let R3 = Math.sqrt( Math.pow(R2 + T, 2) + TARGET_AREA );
	let R4 = Math.sqrt( Math.pow(R3 + T, 2) + TARGET_AREA );

	let H1 = TARGET_AREA / (2 * R1);
	let H2 = TARGET_AREA / (2 * R2);
	let H3 = TARGET_AREA / (2 * R3);

	// Now, if there is a mesh present on the vent to stop insects etc, this becomes complicated
	if (meshLocation != 0)
	{
		// The mesh will take up a certain percentage of the area, either on the vertical part of H3 or the horizontal part of R4
		// because the airflow must remain the same even with the mesh present, this means that one of those dimensions must grow
		// we do this by scaling the target area and re doing the calc for that dimension

		const MESH_PERCENTAGE = parseFloat(document.getElementById("meshPercentageInput").value) / 100;
		const MESH_SCALE = 1 / MESH_PERCENTAGE;
		if (meshLocation == 1)
		{	// radius (R4)
			R4 = Math.sqrt( Math.pow(R3 + T, 2) + (TARGET_AREA * MESH_SCALE) );
		}
		else 
		{	// height (H3)
			H3 = (TARGET_AREA * MESH_SCALE) / (2 * R3);
		}
	}

	// data out
	document.getElementById("R1output").value = ToString(R1);
	document.getElementById("R2output").value = ToString(R2);
	document.getElementById("R3output").value = ToString(R3);
	document.getElementById("R4output").value = ToString(R4);

	document.getElementById("H1output").value = ToString(H1);
	document.getElementById("H2output").value = ToString(H2);
	document.getElementById("H3output").value = ToString(H3);

	// from here need to add functionallity to allow user to edit each number from R2 and have remaining radii and heights recalculate
}