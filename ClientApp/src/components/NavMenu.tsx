import * as React from 'react';
import { Container, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import authService from './api-authorization/AuthorizeService';
import './NavMenu.css';

interface INavMenuState {
    drawerOpen: boolean;
    isAdmin: boolean;
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
      drawerOpen: false,
      isAdmin: false
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

  componentDidMount() {
    this._subscription = authService.subscribe(() => this.updateAdminState());
    this.updateAdminState();
  }

  componentWillUnmount() {
    authService.unsubscribe(this._subscription);
  }

  async updateAdminState() {
    const isAdmin = await authService.isInRole('Admin');
    this.setState({ isAdmin });
  }

  private _subscription: number = 0;

  render () {
    return (
      <header>
        <Navbar className="app-navbar navbar-expand-sm navbar-toggleable-sm navbar-light mb-3">
          <Container>
            <NavbarBrand tag={Link} to="/">Tipovačka MS 2026</NavbarBrand>

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
                {this.state.isAdmin && (
                  <NavItem>
                    <NavLink tag={Link} to="/admin">Admin</NavLink>
                  </NavItem>
                )}
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
          <Link to="/" className="drawer-brand" onClick={this.closeDrawer}>Tipovačka MS 2026</Link>
          <ul className="drawer-nav">
            <li><Link to="/tips" onClick={this.closeDrawer}>Sázky</Link></li>
            <li><Link to="/rules" onClick={this.closeDrawer}>Pravidla</Link></li>
            <li><Link to="/stats" onClick={this.closeDrawer}>Statistiky</Link></li>
            {this.state.isAdmin && (
              <li><Link to="/admin" onClick={this.closeDrawer}>Admin</Link></li>
            )}
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
