import Router from 'koa-router';
import {domain} from "./serviceURL.js"
const router = new Router();
import {google} from 'googleapis'
import knex from "knex";


router.get('/', (ctx)=> {


	ctx.body = "asdf";
});

module.exports = router;
