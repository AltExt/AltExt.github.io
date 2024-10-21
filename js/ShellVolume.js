let lastEditedField = "";
const ShellVolumeInput = "shellVolumeInput";
const ShellRadiusInput = "shellRadiusInput";
const ShellHeightInput = "shellHeightInput";

function VolumeRadioClicked()
{
	UpdateInputFields(ShellVolumeInput);
	UpdateFields();
}

function RadiusRadioClicked()
{
	UpdateInputFields(ShellRadiusInput);
	UpdateFields();
}

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

function FieldInputChanged(input)
{
	ValidateNumber(input);
	lastEditedField = input.id;
	UpdateFields();
}

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