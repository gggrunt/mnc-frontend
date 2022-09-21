import { createProxyMiddleware } from 'http-proxy-middleware'
const proxy = {
    target: 'https://toxic-api-production.gggrunt16.workers.dev',
    changeOrigin: true,
}
export default function (app) {
    app.use('/placement', createProxyMiddleware(proxy))
    app.use('/stats', createProxyMiddleware(proxy))
    app.use('/mmr', createProxyMiddleware(proxy))
}
