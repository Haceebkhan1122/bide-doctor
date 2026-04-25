import { useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import HeaderLogo from "../../uiComponents/logos/HeaderLogo";
// import StickyMenu from '../stickyMenu/StickyMenu';
import { URL } from "../../constants/index";
import "./_header.scss";

function Header() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="header">
      <Navbar
        expand="lg"
        expanded={expanded}
      >
        <Container>
          <Link to="/">
            <HeaderLogo />
          </Link>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="x navbar-toggle"
            onClick={() => setExpanded(expanded ? false : "expanded")}
          >
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavLink
                // activeClassName="linkactive"
                to={URL.login}
                onClick={() => setExpanded(false)}
                exact
              >
                <Button variant="outline-dark">LOG IN</Button>
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </section>
  );
}

export default Header;
