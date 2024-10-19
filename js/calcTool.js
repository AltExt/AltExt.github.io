function ValidateNumber(input)
{
	// takes html element input, ensures number is in format 0123456789.0123456789
	// only alows digits 1-9, and up to one decimal point
	input.value = input.value.replace(/[^0-9.]/g, '');
	
	if ((input.value.match(/\./g) || []).length > 1) 
	{
	    input.value = input.value.slice(0, -1); 
	}
}

function ToString(input)
{
	// takes in number input, returns a string that contains that input rounded to 4 digits of float, or xx.00 if integer
	let output = "" + input;
	let decimalIndex = output.indexOf('.');
	if (decimalIndex == -1) return output + ".00";
	else return output.substring(0, decimalIndex + 1 /*precision value: */ + 4);
}