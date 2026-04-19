import * as React from 'react';
import { Container, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import './NavMenu.css';

interface INavMenuState {
    drawerOpen: boolean
}

interface INavMenuProps {

}

export class NavMenu extends React.Component<INavMenuProps, INavMenuState> {
  static displayName = NavMenu.name;

    constructor(props: INavMenuProps) {
    super(props);

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.state = {
      drawerOpen: false
    };
  }

  toggleDrawer () {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    });
  }

  closeDrawer () {
    this.setState({ drawerOpen: false });
  }

  render () {
    return (
      <header>
        <Navbar className="app-navbar navbar-expand-sm navbar-toggleable-sm navbar-light mb-3">
          <Container>
            <NavbarBrand tag={Link} to="/">Tipovačka EURO 2024</NavbarBrand>

            {/* Mobile hamburger */}
            <button className="hamburger-btn d-sm-none" onClick={this.toggleDrawer} aria-label="Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>

            {/* Desktop nav */}
            <div className="d-none d-sm-flex flex-sm-row-reverse flex-grow-1">
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} to="/tips">Sázky</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to="/rules">Pravidla</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to="/stats">Statistiky</NavLink>
                </NavItem>
                <LoginMenu>
                </LoginMenu>
              </ul>
            </div>
          </Container>
        </Navbar>

        {/* Mobile drawer overlay */}
        <div className={`drawer-overlay ${this.state.drawerOpen ? 'open' : ''}`} onClick={this.closeDrawer}></div>

        {/* Mobile drawer */}
        <nav className={`drawer ${this.state.drawerOpen ? 'open' : ''}`}>
          <Link to="/" className="drawer-brand" onClick={this.closeDrawer}>Tipovačka EURO 2024</Link>
          <ul className="drawer-nav">
            <li><Link to="/tips" onClick={this.closeDrawer}>Sázky</Link></li>
            <li><Link to="/rules" onClick={this.closeDrawer}>Pravidla</Link></li>
            <li><Link to="/stats" onClick={this.closeDrawer}>Statistiky</Link></li>
          </ul>
          <hr className="drawer-divider" />
          <ul className="drawer-nav">
            <LoginMenu>
            </LoginMenu>
          </ul>
        </nav>
      </header>
    );
  }
}
