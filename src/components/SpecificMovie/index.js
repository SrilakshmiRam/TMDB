import {Component} from 'react'

import Loader from 'react-loader-spinner'

import MovieDetailsSection from '../MovieDetailsSection'
import CastDetailsSection from '../CastDetailsSection'
import Navbar from '../Navbar'

import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class SpecificMovie extends Component {
  state = {
    moviesData: {},
    castDetails: [],
    genresData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getSpecificMovieDetails()
    this.getMovieCastDetails()
  }

  getSpecificMovieDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=d30d2825974522dcd42d08d55d5e692e&language=en-US`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = {
        title: data.title,
        posterPath: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
        voteAverage: data.vote_average,
        duration: data.runtime,
        releaseDate: data.release_date,
        overview: data.overview,
        genres: data.genres.map(each => ({
          id: each.id,
          name: each.name,
        })),
      }

      this.setState({
        moviesData: updatedData,
        genresData: updatedData.genres,
        apiStatus: apiStatusConstants.success,
      })
    }
  }

  getMovieCastDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=d30d2825974522dcd42d08d55d5e692e&language=en-US`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = data.cast.map(eachCast => ({
        imageUrl: `https://image.tmdb.org/t/p/w500${eachCast.profile_path}`,
        originalName: eachCast.original_name,
        characterName: eachCast.character,
        id: eachCast.id,
      }))

      this.setState({
        castDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
  }

  renderSuccessView = () => {
    const {moviesData, castDetails, genresData} = this.state
    return (
      <div>
        <h1 className="heading">Movie Details</h1>
        <MovieDetailsSection moviesData={moviesData} genresData={genresData} />
        <h1 className="heading">Movie Cast Details</h1>
        <ul className="cast-details">
          {castDetails.map(each => (
            <CastDetailsSection castData={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container">
      <Loader type="Oval" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderMoviesDeatilsList = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="movies-details-container">
        <Navbar />
        {this.renderMoviesDeatilsList()}
      </div>
    )
  }
}

export default SpecificMovie
