import { tokenService } from "../../services/auth/tokenService"

export default async function HttpClient(fetchUrl, fetchOptions) {
    const options = {
        ...fetchOptions,
        headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
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
            console.log('Midware: rodar codigo para atualizar o token')
            // [Tentar atualizar os tokens]
            const refeshResponse = await HttpClient('http://localhost:3000/api/refresh', {
                method: 'GET'
            })
            console.log('Resposta do refresh get', refeshResponse)
            const newAccessToken = refeshResponse.body.data.access_token
            const newRefreshToken = refeshResponse.body.data.refresh_token
            // [Guarda os Tokens]
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