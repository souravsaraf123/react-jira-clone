import { Connection } from "typeorm";
import { Logger } from "typeorm";
import createDatabaseConnection from "./database/createConnection";

async function main()
{
	// Create a connection to the database
	let connection: Connection;
	try
	{
		connection = await createDatabaseConnection();
	}
	catch (error)
	{
		console.log(error);
		process.exit(1);
	}

	// Set the logger to true
	connection.setOptions({
		logging: true,
	});

	// Sync the database
	await connection.synchronize();

	// Close the connection
	await connection.close();
}

main();