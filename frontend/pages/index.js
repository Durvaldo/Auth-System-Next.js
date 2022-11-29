import React from "react";
import { useRouter } from "next/router";
import { authService } from "../src/services/auth/authService";

export default function HomeScreen() {
  const router = useRouter()
  const [values, setValues] = React.useState({
    usuario: 'omariosouto',
    senha: 'safepassword',
  })

  function handleChange(event) {
    const fildValue = event.target.value;
    const fildName = event.target.name;
    setValues((currentValues) => {
      return {
        ...currentValues,
        [fildName]: fildValue
      }
    })

  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={(event) => {
        // onSubmit -> Controller (Pega dados do usuario e passa para um serviço)
        // authService -> Serviço
        event.preventDefault()
        authService
          .login({
            username: values.usuario,
            password: values.senha,
          })
          .then(() => {
            router.push('/auth-page-static')
            // router.push('/auth-page-ssr')
          })
          .catch(() =>{
            alert('Usuario ou Senha estão inválidos')
          })
      }}>
        <input
          placeholder="Usuário" name="usuario"
          value={values.usuario} onChange={handleChange}
        />
        <input
          placeholder="Senha" name="senha" type="password"
          value={values.senha} onChange={handleChange}
        />
        <div>
          <button>
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}
