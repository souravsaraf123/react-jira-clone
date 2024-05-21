const app = require('../api/index');

app.listen(process.env.PORT || 3000, () => {
	console.log('Api started on port 3000 ...');
});
