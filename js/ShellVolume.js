let lastEditedField = "";
const ShellVolumeInput = "shellVolumeInput";
const ShellRadiusInput = "shellRadiusInput";
const ShellHeightInput = "shellHeightInput";

function VolumeRadioClicked()
{
	UpdateInputFields(ShellVolumeInput, ShellRadiusInput, ShellHeightInput);
	UpdateFields();
}

function RadiusRadioClicked()
{
	UpdateInputFields(ShellRadiusInput, ShellVolumeInput, ShellHeightInput);
	UpdateFields();
}

function HeightRadioClicked()
{
	UpdateInputFields(ShellHeightInput, ShellVolumeInput, ShellRadiusInput);
	UpdateFields();
}

function UpdateInputFields(enabledID, disabledID_1, disabledID_2)
{
	document.getElementById(enabledID).disabled = true;
	document.getElementById(disabledID_1).disabled = false;
	document.getElementById(disabledID_2).disabled = false;
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
	document.getElementById(ShellVolumeInput).value = (Math.PI * radius * radius * height);
}

function UpdateRadius(volume, height)
{
	document.getElementById(ShellRadiusInput).value = Math.sqrt( volume / (Math.PI * height) ) * 1000;
}

function UpdateHeight(volume, radius)
{
	document.getElementById(ShellHeightInput).value = volume / (Math.PI * radius * radius) * 1000;
}

function UpdateSurfaceArea(radius, height)
{
	document.getElementById("shellSurfaceArea").value = 2 * Math.PI * radius * height;
}

function UpdateCircumference(radius)
{
	document.getElementById("shellCircumference").value = 2 * Math.PI * radius * 1000;
}