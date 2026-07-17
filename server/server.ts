import * as jsonServer from 'json-server';
import { AddressInfo } from 'net';
import { loginUser } from './auth.route';

const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router(path.join(__dirname, 'db.json'));

server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);
server.route('/api/login').post(loginUser);
server.use('/api', router);

const httpServer = server.listen(9000, () => {
    const address = httpServer.address() as AddressInfo;
    console.log('HTTP REST API Server running at http://localhost:' + address.port);
});
