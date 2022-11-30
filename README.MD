# Sobre os tokens do projeto
## Access Token
- **Pra que serve?**
    * Pegar qualquer tipo de informação
    * Atualizar...
    * Inserir...
    * Deletar...
- **Duração**
    * Dura pouco tempo/O minimo possivel
- **Risco se ele vazar**
    * Quanto maior o tempo de vida dele, maior o estrago quem tiver o token pode fazer
Refresh Token

## Refresh Token
- **Pra que serve?**
    * Literalmente, para não pedir a senha e o usuário para gerar um novo access_token
- **Duração**
    * Duração dele é longa
    * O refresh token a nivel de back end ta associado ao usuario de alguma forma
- **Risco se ele vazar**
    * Se ele vazar, o usuario novo pode gerar tokens INFINITOS (access_token refresh_token)
    * Precisa ter alguma forma de invalidar os refresh tokens


