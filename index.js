require('dotenv').config();
const http = require('http');
const app=require('./app');
const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log('API running on http://localhost:5000');
})



