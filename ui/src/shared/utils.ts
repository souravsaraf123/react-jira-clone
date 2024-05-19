import { AxiosError } from "axios";

export async function delay(ms: number)
{
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function handleApiError(error: any)
{
	let finalError = error;
	let tokenRelatedErrorCodes = [
		"TOKEN_EXPIRED",
		"INVALID_TOKEN",
	];
	// handle axios error
	if (error instanceof AxiosError)
	{
		if (error.response)
		{
			finalError = error.response.data?.error || error.response.data
			console.error('Error in api response : ', finalError);

			// handle token expired or invalid error
			if (tokenRelatedErrorCodes.includes(finalError.code))
			{
				alert('Session expired. Logging again ...');
				localStorage.clear();
				window.location.reload();
				return;
			}

			// show backend error message
			throw finalError;
		}
	}
	console.error('Error in api response : ', finalError);
	throw finalError;
}