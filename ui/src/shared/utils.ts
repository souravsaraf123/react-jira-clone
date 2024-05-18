import { AxiosError } from "axios";

export async function delay(ms: number)
{
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function handleApiError(error: any)
{
	let finalError = error;
	// handle axios error
	if (error instanceof AxiosError)
	{
		if (error.response)
		{
			finalError = error.response.data?.error || error.response.data
			console.error('Error in api response : ', finalError);
			throw finalError;
		}
	}
	console.error('Error in api response : ', finalError);
	throw finalError;
}