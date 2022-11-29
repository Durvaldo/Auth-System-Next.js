import nookies from 'nookies'
import HttpClient from '../../src/infra/HttpClient/HttpClient'

const REFRESH_TOKEN = 'REFRESH_TOKEN_NAME'

const controllers = {
    async storeRefreshToken(req, res) {
            const ctx = { req, res }

            nookies.set(ctx, REFRESH_TOKEN, req.body.refresh_token, {
                httpOnly: true,
                sameSite: 'lax'
            })

            res.json({
                data: {
                    message: 'Stored with success!'
                }
           })
    },
    async regenerateTokens(req, res) {
        const ctx = { req, res }
        const cookies = nookies.get(ctx)
        const refresh_token = cookies['REFRESH_TOKEN_NAME']

        const refreshResponse = await HttpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/refresh`, {
            method: 'POST',
            body: {
                refresh_token,
            }
        })

        nookies.set(ctx, REFRESH_TOKEN, refreshResponse.body.data.refresh_token, {
            httpOnly: true,
            sameSite: 'lax'
        })

        res.json({
            refreshResponse
        })
    }
}

const controlerBy = {
    POST: controllers.storeRefreshToken,
    GET: controllers.regenerateTokens
}

export default function handle( request, response ) {

    if(controlerBy[request.method]) return controlerBy[request.method](request, response)

    response.status(404).json({
        status: 404,
        message: 'Not Found'
    })
}