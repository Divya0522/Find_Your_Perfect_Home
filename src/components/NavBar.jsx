import { useContext } from "react";
import {Container,Nav,Navbar,Stack} from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notification from "./chat/Notification";
const NavBar = () => {
    const {user,logoutUser}=useContext(AuthContext);
    return <Navbar bg="dark" className="mb-4" style={{height:"3.75rem"}}>
        <Container>
            <h2>
                <Link to="/" className="link-light text-decoration-none">Messaging</Link>
            </h2>
            {user && <span className="text-warning">Logged in as {user?.name}</span>}
            <Nav>
                <Stack direction="horizontal"gap={3}>
                {user && ( <>
                <Notification/>
                            <Link
                                onClick={() => logoutUser()}
                                to="/signin"
                                className="link-light text-decoration-none"
                            >
                                Logout
                            </Link>
                            </>
                        ) }
                        {!user &&   (<>
                            <Link to="/signin" className="link-light text-decoration-none">Login</Link>
                            <Link to="/signup" className="link-light text-decoration-none">Register</Link>
                        
                         </>)}
            
                </Stack>
            </Nav>
        </Container>
    </Navbar>;
}
 
export default NavBar;