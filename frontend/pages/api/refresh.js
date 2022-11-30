import nookies from 'nookies'
import HttpClient from '../../src/infra/HttpClient/HttpClient'
import { tokenService } from "../../src/services/auth/tokenService"


const REFRESH_TOKEN = 'REFRESH_TOKEN_NAME'

const controllers = {
    async storeRefreshToken(req, res) {
            const ctx = { req, res }

            nookies.set(ctx, REFRESH_TOKEN, req.body.refresh_token, {
                httpOnly: true,
                sameSite: 'lax',
                path: '/'
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
        const refresh_token = cookies['REFRESH_TOKEN_NAME'] || req.body.refresh_token
        console.log("/api/refresh [Regenerete tokens]", refresh_token)

        const refreshResponse = await HttpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/refresh`, {
            method: 'POST',
            body: {
                refresh_token,
            }
        })

        if (refreshResponse.ok) {
            nookies.set(ctx, REFRESH_TOKEN, refreshResponse.body.data.refresh_token, {
                httpOnly: true,
                sameSite: 'lax',
                path: '/'
            })

            tokenService.save(refreshResponse.body.data.access_token, ctx)

            res.status(200).json({
                data: refreshResponse.body.data
            })
        } else {
            res.status(401).json({
                status: 401,
                message: 'Não autorizado'
            })
        }    

    }
}

const controlerBy = {
    POST: controllers.storeRefreshToken,
    GET: controllers.regenerateTokens,
    PUT: controllers.regenerateTokens,
    DELETE: (req, res) => {
        const ctx = { req, res }
        nookies.destroy(ctx, REFRESH_TOKEN, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/'
        })
        res.status(200).json({
            data: {
                message: 'deleted with success!'
            }
        })
    }
}

export default function handle( request, response ) {

    if(controlerBy[request.method]) return controlerBy[request.method](request, response)

    response.status(404).json({
        status: 404,
        message: 'Not Found'
    })
}