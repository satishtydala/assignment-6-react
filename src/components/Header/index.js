import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props

    Cookies.remove('jwt_token')

    history.replace('/login')
  }

  return (
    <div className="header-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website-logo"
        />
      </Link>
      <ul className="header-icons-container">
        <Link to="/">
          <li className="list-type">
            <AiFillHome className="header-icon" />
          </li>
        </Link>
        <Link to="/jobs">
          <li className="list-type">
            <BsBriefcaseFill className="header-icon" />
          </li>
        </Link>
        <button type="button" onClick={onClickLogout} className="logout-icon">
          <li className="list-type">
            <FiLogOut className="header-icon" />
          </li>
        </button>
      </ul>
      <ul className="home-jobs-header-details">
        <Link to="/" className="path-link">
          <li className="list-type">
            <p className="jobs-details">Home</p>
          </li>
        </Link>
        <Link to="/jobs" className="path-link">
          <li className="list-type">
            <p className="jobs-details">Jobs</p>
          </li>
        </Link>
      </ul>
      <div>
        <button className="logout-button" type="button" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}
export default withRouter(Header)
