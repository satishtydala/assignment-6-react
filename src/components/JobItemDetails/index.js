import {Component} from 'react'
import Cookies from 'js-cookie'
import {HiStar, HiExternalLink} from 'react-icons/hi'
import {FaMapMarkerAlt} from 'react-icons/fa'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    specificJob: {},
    similarJobsList: [],
    lifeAtCompanyObject: {},
    specificSkillsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItem()
  }

  getJobItem = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()

    const jobDetails = data.job_details

    const LifeAtCompany = jobDetails.life_at_company

    const skillsList = jobDetails.skills

    const similarJob = data.similar_jobs

    const updatedSimilarJobs = similarJob.map(eachJobItem => ({
      companyLogoUrl: eachJobItem.company_logo_url,
      jobDescription: eachJobItem.job_description,
      employmentType: eachJobItem.employment_type,
      location: eachJobItem.location,
      rating: eachJobItem.rating,
      title: eachJobItem.title,
      id: eachJobItem.id,
    }))

    const updatedData = {
      companyLogoUrl: jobDetails.company_logo_url,
      companyWebsiteUrl: jobDetails.company_website_url,
      employmentType: jobDetails.employment_type,
      id: jobDetails.id,
      jobDescription: jobDetails.job_description,
      location: jobDetails.location,
      packagePerAnnum: jobDetails.package_per_annum,
      rating: jobDetails.rating,
      title: jobDetails.title,
    }

    const updatedLifeAtCompany = {
      imageUrl: LifeAtCompany.image_url,
      description: LifeAtCompany.description,
    }

    const fetchedData = skillsList.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    }))

    if (response.ok === true) {
      this.setState({
        apiStatus: apiStatusConstants.success,
        specificJob: updatedData,
        lifeAtCompanyObject: updatedLifeAtCompany,
        specificSkillsList: fetchedData,
        similarJobsList: updatedSimilarJobs,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobItemDetailsFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-button">
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemDetailsSuccessView = () => {
    const {
      specificJob,
      lifeAtCompanyObject,
      specificSkillsList,
      similarJobsList,
    } = this.state
    console.log(specificJob)
    console.log(lifeAtCompanyObject)
    console.log(specificSkillsList)
    console.log(similarJobsList)

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      title,
      rating,
      packagePerAnnum,
    } = specificJob
    return (
      <div>
        <div className="specific-card-details">
          <div className="company-logo-title-rating-details">
            <div>
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
            </div>
            <div>
              <h1 className="title">{title}</h1>
              <div className="rating-container">
                <HiStar className="star-icon" />
                <p className="rating-text">{rating}</p>
              </div>
            </div>
          </div>

          <div className="location-salary-employment-container">
            <div className="location-salary-details">
              <div className="card">
                <FaMapMarkerAlt className="text-details" />
                <p className="text-details">{location}</p>
              </div>
              <div className="card">
                <BsFillBriefcaseFill className="text-details" />
                <p className="text-details">{employmentType}</p>
              </div>
            </div>
            <p className="text-details">{packagePerAnnum}</p>
          </div>

          <hr />
          <div className="description-title-visit-link-details">
            <h1 className="job-item-description-heading">Description</h1>
            <div className="visit-link-container">
              <a href={companyWebsiteUrl} className="visit-link">
                Visit
              </a>
              <HiExternalLink className="visit-link-icon" />
            </div>
          </div>
          <p className="job-description">{jobDescription}</p>

          <div>
            <h1 className="skills-heading">Skills</h1>
            <ul className="unordered-skill-list">
              {specificSkillsList.map(eachSkillItem => (
                <li className="list-item-skills" key={eachSkillItem.name}>
                  <img
                    src={eachSkillItem.imageUrl}
                    alt={eachSkillItem.name}
                    className="skill-image"
                  />
                  <h1 className="skill-name">{eachSkillItem.name}</h1>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h1 className="life-at-company-heading">Life at Company</h1>
            <div className="life-at-company-details">
              <p className="life-company-description">
                {lifeAtCompanyObject.description}
              </p>
              <img
                src={lifeAtCompanyObject.imageUrl}
                alt="life at company"
                className="life-at-company-image"
              />
            </div>
          </div>
        </div>

        <div>
          <h1 className="similar-job-heading">Similar Jobs</h1>
          <ul className="unordered-list-items">
            {similarJobsList.map(eachJobDetails => (
              <li className="list-items" key={eachJobDetails.id}>
                <div className="container">
                  <img
                    src={eachJobDetails.companyLogoUrl}
                    alt="company logo"
                    className="company-logo"
                  />

                  <div>
                    <h1 className="title">{eachJobDetails.title}</h1>
                    <div className="rating-container">
                      <HiStar className="star-icon" />
                      <p className="rating-text">{eachJobDetails.rating}</p>
                    </div>
                  </div>
                </div>

                <h1 className="description">Description</h1>
                <p className="description-text">
                  {eachJobDetails.jobDescription}
                </p>
                <div className="location-rating-details">
                  <div className="card">
                    <FaMapMarkerAlt className="text-details" />
                    <p className="text-details">{location}</p>
                  </div>
                  <div className="card">
                    <BsFillBriefcaseFill className="text-details" />
                    <p className="text-details">{employmentType}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFinalResult = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobItemDetailsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="specific-job-container">
          <div>{this.renderFinalResult()}</div>
        </div>
      </div>
    )
  }
}

export default JobItemDetails
