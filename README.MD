## Access Token
- **Pra que serve?**
    <br>
    -Pegar qualquer tipo de informação
    <br>
    -Atualizar...
    <br>
    -Inserir...
    <br>
    -Deletar...
- **Duração**
    <br>
    -Dura pouco tempo/O minimo possivel
- **Risco se ele vazar**
    <br>
    -Quanto maior o tempo de vida dele, maior o estrago quem tiver o token pode fazer
Refresh Token

## Refresh Token
- **Pra que serve?**
    <br>
    -Literalmente, para não pedir a senha e o usuário para gerar um novo access_token
- **Duração**
    <br>
    -Duração dele é longa
    <br>
    -O refresh token a nivel de back end ta associado ao usuario de alguma forma
- **Risco se ele vazar**
    <br>
    -Se ele vazar, o usuario novo pode gerar tokens INFINITOS (access_token refresh_token)
    <br>
    -Precisa ter alguma forma de invalidar os refresh tokens


