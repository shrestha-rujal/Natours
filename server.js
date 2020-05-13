const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const PORT = 3000;

app.listen(process.env.PORT || PORT, () => {
  console.log(`SERVER LISTENING AT ${PORT}`);
});
