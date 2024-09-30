function ValidateNumber(input)
{
	input.value = input.value.replace(/[^0-9]/g, '');
}