import Koa from 'koa';
const app = new Koa();
const PORT = 8080;
app.use(ctx => {
    ctx.body = 'hello koa@@';
});

app.listen(PORT, () => {
    console.log(`sori koa ${PORT}`);
});
