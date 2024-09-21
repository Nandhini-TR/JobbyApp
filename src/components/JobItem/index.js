import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {MdWork} from 'react-icons/md'
import Loader from 'react-loader-spinner' // Loader for spinner
import './index.css'

class JobItemDetails extends Component {
  state = {
    jobDetails: null,
    similarJobs: [],
    isLoading: true,
    isError: false,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({isLoading: true, isError: false}) // reset states

    const {match} = this.props
    const {id} = match.params // getting job id from route params
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const jobDetails = {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          jobDescription: data.job_details.job_description,
          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,
          title: data.job_details.title,
          skills: data.job_details.skills.map(eachSkill => ({
            imageUrl: eachSkill.image_url,
            name: eachSkill.name,
          })),
          lifeAtCompany: data.job_details.life_at_company,
        }
        const similarJobs = data.similar_jobs.map(job => ({
          id: job.id,
          title: job.title,
          companyLogoUrl: job.company_logo_url,
          location: job.location,
          employmentType: job.employment_type,
          rating: job.rating,
          jobDescription: job.job_description,
        }))
        this.setState({
          jobDetails,
          similarJobs,
          isLoading: false,
        })
      } else {
        this.setState({isLoading: false, isError: true})
      }
    } catch {
      this.setState({isLoading: false, isError: true})
    }
  }

  onRetry = () => {
    this.getJobDetails()
  }

  renderLoader = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="error-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt=" failure view"
        className="failure-view-image"
      />
      <h1 className="no-jobs-message">Oops! Something Went Wrong</h1>
      <p className="no-job-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderJobDetails = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      skills,
      lifeAtCompany,
    } = jobDetails

    return (
      <div className="job-details-container">
        <div className="job-info">
          <div className="company-logo-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="title-container">
              <h1 className="title">{title}</h1>
              <div className="rating-container">
                <FaStar className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-lpa-container">
            <div className="location-container">
              <IoLocationSharp className="location-icon" />
              <p className="location">{location}</p>
              <MdWork className="location-icon" />
              <p className="location">{employmentType}</p>
            </div>
            <p className="lpa">{packagePerAnnum}</p>
          </div>
          <div className="description-container">
            <div className="visit-container">
              <h1 className="description-heading">Description</h1>
              <a
                href={companyWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="visit-link"
              >
                Visit
              </a>
            </div>
            <p className="description">{jobDescription}</p>
          </div>
          <div className="skills-container">
            <h1 className="section-heading">Skills</h1>
            <ul className="skills-list">
              {skills.map(skill => (
                <li key={skill.name} className="skill-item">
                  <img
                    src={skill.imageUrl}
                    alt={skill.name}
                    className="skill-icon"
                  />
                  <p className="skill-name">{skill.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="life-at-company">
            <div className="life-at-company-content">
              <h1 className="section-heading">Life at Company</h1>
              <p className="company-description">{lifeAtCompany.description}</p>
            </div>
            <img
              src={lifeAtCompany.image_url}
              alt="life at company"
              className="life-image"
            />
          </div>
        </div>
      </div>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobs} = this.state
    return (
      <div className="similar-jobs-container">
        <h1 className="section-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobs.map(job => (
            <li key={job.id} className="similar-job-item">
              <div className="company-logo-container">
                <img
                  src={job.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <div className="title-container">
                  <h1 className="title">{job.title}</h1>
                  <div className="rating-container">
                    <FaStar className="star-icon" />
                    <p className="rating">{job.rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-lpa-container">
                <div className="location-container">
                  <IoLocationSharp className="location-icon" />
                  <p className="location">{job.location}</p>
                  <MdWork className="location-icon" />
                  <p className="location">{job.employmentType}</p>
                </div>
                <p className="lpa">{job.packagePerAnnum}</p>
              </div>
              <div className="description-container">
                <h1 className="description-heading">Description</h1>
                <p className="description">{job.jobDescription}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {isLoading, isError, jobDetails} = this.state

    let content
    switch (true) {
      case isLoading:
        content = this.renderLoader()
        break
      case isError:
        content = this.renderFailureView()
        break
      case jobDetails !== null:
        content = (
          <div className="job-item-container">
            {this.renderJobDetails()}
            {this.renderSimilarJobs()}
          </div>
        )
        break
      default:
        content = null
    }

    return <div className="job-item-details-route">{content}</div>
  }
}

export default JobItemDetails
