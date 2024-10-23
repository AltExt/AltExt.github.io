// global variable to track the field that is currently being edited
let lastEditedField = "";

// because there are only 3 fields and I need to do comparisons eith their IDs I'm storing them globally here
const ShellVolumeInput = "shellVolumeInput";
const ShellRadiusInput = "shellRadiusInput";
const ShellHeightInput = "shellHeightInput";

// This tool is used when calculating the dimensions of a tank.
// The user can "pin" one dimension that then won't change, and edit one of the 2 other dimensions
// The dimension that wasn't pinned or edited will then be updated to maintain that tank size

// Pins Volume
function VolumeRadioClicked()
{
	UpdateInputFields(ShellVolumeInput);
	UpdateFields();
}

// Pins Radius
function RadiusRadioClicked()
{
	UpdateInputFields(ShellRadiusInput);
	UpdateFields();
}

// Pins Height
function HeightRadioClicked()
{
	UpdateInputFields(ShellHeightInput);
	UpdateFields();
}

function UpdateInputFields(enabledID)
{
	document.getElementById(ShellVolumeInput).disabled = false;
	document.getElementById(ShellRadiusInput).disabled = false;
	document.getElementById(ShellHeightInput).disabled = false;

	document.getElementById(enabledID).disabled = true;
}

// Tracks the last edited field
function FieldInputChanged(input)
{
	ValidateNumber(input);
	lastEditedField = input.id;
	UpdateFields();
}

// called each time any field in the tool is changed
// determines which of the three was pinned, which was edited and then calculated a new value for the last dimension
function UpdateFields()
{
	if (lastEditedField == "") return;

	let volume = document.getElementById(ShellVolumeInput).value; // is in meters cubed
	let radius = document.getElementById(ShellRadiusInput).value / 1000; // convert mm to meters
	let height = document.getElementById(ShellHeightInput).value / 1000; // convert mm to meters

	console.log(volume);
	console.log(radius);
	console.log(height);

	/**/ if (lastEditedField == ShellVolumeInput)
	{
		// changed the volume
		if (document.getElementById(ShellRadiusInput).disabled)
		{
			// radius is pinned, calc new height
			UpdateHeight(volume, radius);
		}
		else 
		{
			// height is pinned, calc new radius
			UpdateRadius(volume, height);
		}
	}
	else if (lastEditedField == ShellRadiusInput)
	{
		// changed the radius

		if (document.getElementById(ShellVolumeInput).disabled)
		{
			// volume is pinned, calc new height
			UpdateHeight(volume, radius);
		}
		else
		{
			// height is pinned, calc new volume
			UpdateVolume(radius, height);
		}
	}
	else if (lastEditedField == ShellHeightInput)
	{
		// changed the height

		if (document.getElementById(ShellVolumeInput).disabled)
		{
			// volume is pinned, calc new radius
			UpdateRadius(volume, height);
		}
		else 
		{
			// radius is pinned, calc new volume
			UpdateVolume(radius, height);
		}
	}

	volume = document.getElementById(ShellVolumeInput).value; // is in meters cubed
	radius = document.getElementById(ShellRadiusInput).value / 1000; // convert mm to meters
	height = document.getElementById(ShellHeightInput).value / 1000; // convert mm to meters

	UpdateCircumference(radius);
	UpdateSurfaceArea(radius, height);
}

// update functions calculate the new dimension from 2 inputs and write to the html
// also have calculations for shell surface area and shell circumference for ease
function UpdateVolume(radius, height)
{
	document.getElementById(ShellVolumeInput).value = ToString(Math.PI * radius * radius * height);
}

function UpdateRadius(volume, height)
{
	document.getElementById(ShellRadiusInput).value = ToString(Math.sqrt( volume / (Math.PI * height) ) * 1000);
}

function UpdateHeight(volume, radius)
{
	document.getElementById(ShellHeightInput).value = ToString(volume / (Math.PI * radius * radius) * 1000);
}

function UpdateSurfaceArea(radius, height)
{
	document.getElementById("shellSurfaceArea").value = ToString(2 * Math.PI * radius * height);
}

function UpdateCircumference(radius)
{
	document.getElementById("shellCircumference").value = ToString(2 * Math.PI * radius * 1000);
}