import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch, BsFillBriefcaseFill} from 'react-icons/bs'
import {HiStar} from 'react-icons/hi'
import {FaMapMarkerAlt} from 'react-icons/fa'
import './index.css'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileObject: {},
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  changeSearchInput = searchInput => {
    this.setState({searchInput})
  }

  enterSearchInput = () => {
    this.getJobsDetails()
  }

  updateSearchInput = event => {
    this.changeSearchInput(event.target.value)
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.enterSearchInput()
    }
  }

  renderProfileFailure = () => (
    <div>
      <button type="button" className="retry-button">
        Retry
      </button>
    </div>
  )

  renderProfileDataSuccessView = () => {
    const {profileObject} = this.state
    const {name, profileImageUrl, shortBio} = profileObject

    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }

  renderJobsSuccessView = () => {
    const {jobsList} = this.state
    console.log(jobsList)
    return jobsList.map(job => (
      <ul>
        <Link to={`/jobs/${job.id}`}>
          <li className="jobs-success-view-container" key={job.id}>
            <div className="company-logo-title-rating-details">
              <img
                src={job.companyLogoUrl}
                alt="company logo"
                className="company-logo"
              />
              <div>
                <h1 className="job-title">{job.title}</h1>
                <div className="rating-container">
                  <HiStar className="rating-star" />{' '}
                  <p className="rating">{job.rating}</p>
                </div>
              </div>
            </div>
            <div className="location-salary-employment-container">
              <div className="location-salary-details">
                <div className="card">
                  <FaMapMarkerAlt className="text-details" />
                  <p className="text-details">{job.location}</p>
                </div>
                <div className="card">
                  <BsFillBriefcaseFill className="text-details" />
                  <p className="text-details">{job.employmentType}</p>
                </div>
              </div>
              <p className="text-details">{job.packagePerAnnum}</p>
            </div>
            <hr />
            <h1 className="description-heading">Description</h1>
            <p className="job-description">{job.jobDescription}</p>
          </li>
        </Link>
      </ul>
    ))
  }

  renderJobsFailedView = () => (
    <div className="job-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-image"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="job-failure-text">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button">
        Retry
      </button>
    </div>
  )

  renderNoJobsView = () => (
    <div className="job-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="jobs-failure-image"
      />
      <h1 className="jobs-failure-heading">No Jobs Found</h1>
      <p className="job-failure-text">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getJobsDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jobsUrl = 'https://apis.ccbp.in/jobs'
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsUrl, options)
    const jobsData = await response.json()
    const fetchedData = jobsData.jobs
    console.log(fetchedData)

    const updatedJobList = fetchedData.map(eachJobDescription => ({
      companyLogoUrl: eachJobDescription.company_logo_url,
      employmentType: eachJobDescription.employment_type,
      jobDescription: eachJobDescription.job_description,
      packagePerAnnum: eachJobDescription.package_per_annum,
      location: eachJobDescription.location,
      rating: eachJobDescription.rating,
      title: eachJobDescription.title,
      id: eachJobDescription.id,
    }))
    const input = updatedJobList.map(eachJob => eachJob.title.toLowerCase())
    console.log(input)

    if (response.ok === true) {
      this.setState({
        jobsList: updatedJobList,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(profileUrl, options)
    const data = await response.json()

    const updatedData = {
      name: data.profile_details.name,
      profileImageUrl: data.profile_details.profile_image_url,
      shortBio: data.profile_details.short_bio,
    }

    if (response.ok === true) {
      this.setState({
        profileObject: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    return this.setState({apiStatus: apiStatusConstants.failure})
  }

  renderProfileDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileDataSuccessView()
      case apiStatusConstants.failure:
        return this.renderProfileFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderJobDetailsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobsFailedView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return this.renderNoJobsView()
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <div>
        <Header />

        <div className="job-details-container">
          <div className="profile-employment-salary-container">
            <div>
              {this.renderProfileDetails()}
              <hr />
            </div>

            <div>
              <h1 className="employment-heading">Type of Employment</h1>
              <ul>
                {employmentTypesList.map(eachSalary => (
                  <li className="list-item" key={eachSalary.salaryRangeId}>
                    <input type="checkbox" id="salary" />
                    <label className="each-employment-type" htmlFor="salary">
                      {eachSalary.label}
                    </label>
                  </li>
                ))}
              </ul>
              <hr />
            </div>

            <div>
              <h1 className="employment-heading">Salary Range</h1>
              <ul>
                {salaryRangesList.map(eachEmployment => (
                  <li
                    className="list-item"
                    key={eachEmployment.employmentTypeId}
                  >
                    <input type="radio" id="employment" />
                    <label
                      className="each-employment-type"
                      htmlFor="employment"
                    >
                      {eachEmployment.label}
                    </label>
                  </li>
                ))}
              </ul>
              <hr />
            </div>
          </div>

          <div className="container-2">
            <div className="search-input-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                onChange={this.updateSearchInput}
                onKeyDown={this.onEnterSearchInput}
                value={searchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.onClickSearchInput}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div>{this.renderJobDetailsView()}</div>
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
