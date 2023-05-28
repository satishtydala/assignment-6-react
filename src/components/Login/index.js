import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErrorMsg: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccessView = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})

    history.replace('/')
  }

  onSubmitFailureView = errorMessage => {
    this.setState({showErrorMsg: true, errorMsg: errorMessage})
  }

  onSubmitButton = async event => {
    const {username, password} = this.state
    event.preventDefault()
    const userDetails = {username, password}

    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginUrl, options)
    const data = await response.json()
    console.log(data)

    if (response.ok === true) {
      this.onSubmitSuccessView(data.jwt_token)
    } else {
      this.onSubmitFailureView(data.error_msg)
    }
  }

  render() {
    const {username, password, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form className="login-card-details" onSubmit={this.onSubmitButton}>
          <div className="login-image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="login-page-image"
            />
          </div>

          <div className="input-container">
            <label htmlFor="username" className="label-input">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              className="input-element"
              placeholder="Username"
              onChange={this.onChangeUsername}
              value={username}
            />
          </div>

          <div className="input-container">
            <label htmlFor="password" className="label-input">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              className="input-element"
              placeholder="Password"
              onChange={this.onChangePassword}
              value={password}
            />
          </div>
          <div>
            <button type="submit" className="login-button">
              Login
            </button>
          </div>
          <p className="error-msg">{errorMsg}</p>
        </form>
      </div>
    )
  }
}

export default Login
