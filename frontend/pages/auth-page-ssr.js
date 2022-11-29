import { authService } from "../src/services/auth/authService";

function authPageSSR(props) {
   
    return (
        <div>
            <h1>
                Auth Page Server Side Render
            </h1>
            <pre>
                {JSON.stringify(props, null, 2)}
            </pre>
        </div>
    )
}

export default authPageSSR;

export async function getServerSideProps(ctx) {
    try {
        const session = await authService.getSession(ctx)
        return{
            props: {
                session,
            },
        }
    } catch(err) {
        return {
            redirect: {
                permanent: false,
                destination: '/?error=401'
            }
        }
    }
}