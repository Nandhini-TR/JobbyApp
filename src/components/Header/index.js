import {Link, withRouter} from 'react-router-dom'
import Cookie from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookie.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <Link to="/" className="link-element">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="nav-logo"
        />
      </Link>
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/" className="link-element">
            <h1 className="nav-heading">Home</h1>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/jobs" className="link-element">
            <h1 className="nav-heading">Jobs</h1>
          </Link>
        </li>
        <li className="nav-item">
          <button
            className="logout-button"
            type="button"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
