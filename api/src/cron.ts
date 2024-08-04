export default async function handler(req, res) {
	console.log('Cron started');
  let apiResponse = await fetch("https://api-ss-jira.vercel.app/seedData", {
    method: "POST",
  });
  console.log(await apiResponse.json());
  res.status(200).end("Cron finished");
}
