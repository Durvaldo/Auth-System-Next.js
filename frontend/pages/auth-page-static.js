import { withSessionHOC } from "../src/services/auth/session";

function authPageStatic(props) {
    return (
        <div>
            <h1>
                Auth Page Static
            </h1>
            <p>
                <a href="/logout">Logout</a>
            </p>
            <pre>
                {JSON.stringify(props, null, 2)}
            </pre>
        </div>
    )
}

export default withSessionHOC(authPageStatic);