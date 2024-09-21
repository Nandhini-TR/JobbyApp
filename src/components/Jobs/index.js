import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {MdWork} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

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
    profileDetails: {},
    employmentType: '',
    jobDetails: [],
    isLoading: true,
    isJobError: false,
    isProfileError: false,
    salaryRange: '',
    search: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const url = 'https://apis.ccbp.in/profile'

    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const profileDetails = {
          name: data.profile_details.name,
          profileImageUrl: data.profile_details.profile_image_url,
          shortBio: data.profile_details.short_bio,
        }
        this.setState({profileDetails, isLoading: false})
      } else {
        this.setState({isLoading: false, isProfileError: true})
      }
    } catch {
      this.setState({isLoading: false, isProfileError: true})
    }
  }

  getJobDetails = async () => {
    const {employmentType, salaryRange, search} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryRange}&search=${search}`

    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const updatedJobs = data.jobs.map(eachJob => ({
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          id: eachJob.id,
          jobDescription: eachJob.job_description,
          location: eachJob.location,
          packagePerAnnum: eachJob.package_per_annum,
          rating: eachJob.rating,
          title: eachJob.title,
        }))
        this.setState({
          jobDetails: updatedJobs,
          isLoading: false,
          isJobError: false,
        })
      } else {
        this.setState({isLoading: false, isJobError: true})
      }
    } catch {
      this.setState({isLoading: false, isJobError: true})
    }
  }

  onChangeEmploymentType = event => {
    this.setState({employmentType: event.target.value}, this.getJobDetails)
  }

  onChangeSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobDetails)
    console.log(event.target.value)
  }

  onChangeSearchInput = event => {
    this.setState({search: event.target.value})
  }

  onSearch = () => {
    this.getJobDetails()
  }

  onRetryProfile = () => {
    this.setState(
      {isLoading: true, isProfileError: false},
      this.getProfileDetails,
    )
  }

  onRetryJobs = () => {
    this.setState({isLoading: true, isJobError: false}, this.getJobDetails)
  }

  renderProfileDetails = () => {
    const {profileDetails, isProfileError} = this.state
    if (isProfileError) {
      return (
        <button
          type="button"
          className="retry-button"
          onClick={this.onRetryProfile}
        >
          Retry
        </button>
      )
    }
    if (Object.keys(profileDetails).length > 0) {
      return (
        <div className="profile-card">
          <img
            src={profileDetails.profileImageUrl}
            alt="profile"
            className="profile-image"
          />
          <h1 className="name">{profileDetails.name}</h1>
          <p className="short-bio">{profileDetails.shortBio}</p>
        </div>
      )
    }
    return null
  }

  renderJobDetails = () => {
    const {jobDetails, isJobError} = this.state
    if (isJobError) {
      return (
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
          <button
            type="button"
            className="retry-button"
            onClick={this.onRetryJobs}
          >
            Retry
          </button>
        </div>
      )
    }
    if (jobDetails.length === 0) {
      return (
        <div className="no-jobs-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-image"
          />
          <h1 className="no-jobs-message">No Jobs Found</h1>
          <p className="no-job-description">
            We could not find any jobs. Try other filters
          </p>
        </div>
      )
    }

    return (
      <ul className="ul-list">
        {jobDetails.map(eachJob => (
          <li
            className="job-list"
            key={eachJob.id}
            onClick={() => this.onClickJob(eachJob.id)}
          >
            <div className="company-logo-container">
              <img
                src={eachJob.companyLogoUrl}
                alt="company logo"
                className="company-logo"
              />
              <div className="title-container">
                <h1 className="title">{eachJob.title}</h1>
                <div className="rating-container">
                  <FaStar className="star-icon" />
                  <p className="rating">{eachJob.rating}</p>
                </div>
              </div>
            </div>
            <div className="location-lpa-container">
              <div className="location-container">
                <IoLocationSharp className="location-icon" />
                <p className="location">{eachJob.location}</p>
                <MdWork className="location-icon" />
                <p className="location">{eachJob.employmentType}</p>
              </div>
              <p className="lpa">{eachJob.packagePerAnnum}</p>
            </div>
            <div className="description-container">
              <h1 className="description-heading">Description</h1>
              <p className="description">{eachJob.jobDescription}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  onClickJob = jobId => {
    const {history} = this.props
    history.push(`/jobs/${jobId}`)
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {isLoading} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="profile-container">
            {isLoading ? this.renderLoader() : this.renderProfileDetails()}
            <ul className="employment-type-container">
              <h1 className="employment-heading">Type of Empolyment</h1>
              {employmentTypesList.map(eachDetails => (
                <li
                  className="details-container"
                  key={eachDetails.employmentTypeId}
                >
                  <input
                    type="checkbox"
                    id={eachDetails.label}
                    name={eachDetails.label}
                    value={eachDetails.employmentTypeId}
                    onChange={this.onChangeEmploymentType}
                  />
                  <label
                    htmlFor={eachDetails.label}
                    className="employment-type-details"
                  >
                    {eachDetails.label}
                  </label>
                </li>
              ))}
            </ul>
            <ul className="employment-type-container">
              <h1 className="employment-heading">Salary Range</h1>
              {salaryRangesList.map(eachSalary => (
                <li
                  className="details-container"
                  key={eachSalary.salaryRangeId}
                >
                  <input
                    type="radio"
                    id={eachSalary.salaryRangeId}
                    name="salaryRange"
                    value={eachSalary.salaryRangeId}
                    onChange={this.onChangeSalaryRange}
                  />
                  <label
                    htmlFor={eachSalary.salaryRangeId}
                    className="employment-type-details"
                  >
                    {eachSalary.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="jobs-page-container">
            <div className="search-container">
              <input
                type="search"
                id="search"
                name="search"
                className="search-input"
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.onSearch}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div className="employment-job-details">
              {isLoading ? this.renderLoader() : this.renderJobDetails()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
