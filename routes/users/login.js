import Router from 'koa-router';
import {client_id, client_secret} from "./naverAppInfo.js";
import {domain} from "./serviceURL.js"
const router = new Router();

var state = "RANDOM_STATE";
var redirectURI = encodeURI(domain+"/users/login/naver");
var api_url = "";

router.get('/', (ctx)=> {
	api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
  // res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
   ctx.body = "<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>";
 });

module.exports = router;
