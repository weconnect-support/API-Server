import Koa from 'koa';
const app = new Koa();
import Router from 'koa-router';
const PORT = 8080;
const cors = require('@koa/cors');

let corsOptions = {
	origin: "http://localhost:3000",
	credentials: true,
}
app.use(cors(corsOptions)); 
const router = new Router();
import index from './routes/index.js';
import bodyParser from 'koa-bodyparser';
app.use(bodyParser());
router.use(index.routes());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
    console.log(`ssangsnag API Server START : PORT - ${PORT}`);
});
