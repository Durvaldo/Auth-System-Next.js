import nookies from 'nookies'
import { tokenService } from "../../services/auth/tokenService"

export default async function HttpClient(fetchUrl, fetchOptions = {}) {
    const defaultHeaders = fetchOptions.headers || {}
    const options = {
        ...fetchOptions,
        headers: {
            'Content-Type': 'application/json',
            ...defaultHeaders,
        },
        body: fetchOptions.body ? JSON.stringify(fetchOptions.body): null
    }

    return fetch(fetchUrl, options)
        .then(async (respostaDoServidor) => {
            return {
                ok: respostaDoServidor.ok,
                status: respostaDoServidor.status,
                statsText: respostaDoServidor.statusText,
                body: await respostaDoServidor.json()
            }
        })
        .then(async (response) => {
            if(!fetchOptions.refresh) return response
            if(response.status !== 401) return response

            const isServer = Boolean(fetchOptions?.ctx)
            const currentRefreshToken = fetchOptions?.ctx?.req?.cookies['REFRESH_TOKEN_NAME'];

            console.log('Midware: rodar codigo para atualizar o token')
            // [Tentar atualizar os tokens]
            const refeshResponse = await HttpClient('http://localhost:3000/api/refresh', {
                method: isServer ? 'PUT' : 'GET',
                body: isServer ? { refresh_token: currentRefreshToken } : undefined
            })
            const newAccessToken = refeshResponse.body.data.access_token
            const newRefreshToken = refeshResponse.body.data.refresh_token

            //Criar tokenService para gerenciar criação
            // [Guarda os Tokens] 
            if(isServer) {
                nookies.set(fetchOptions?.ctx, 'REFRESH_TOKEN_NAME', newRefreshToken, {
                    httpOnly: true,
                    sameSite: 'lax',
                    path: '/'
                })
            }
            tokenService.save(newAccessToken)

            // [tentar rodar o request anterior]
            const retryResponse = await HttpClient(fetchUrl, {
                ...options,
                refresh: false,
                headers: {
                    'Authorization': `Bearer ${newAccessToken}`
                }
            
            })
            
            return retryResponse
        })
}