import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Navbar from '../Navbar'
import Popular from '../Popular'
import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class Home extends Component {
  state = {popularMovies: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getPopularMovies()
  }

  getPopularMovies = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const url =
      'https://api.themoviedb.org/3/movie/popular?api_key=d30d2825974522dcd42d08d55d5e692e&language=en-US&page=1'
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = {
        totalPages: data.total_pages,
        totalResults: data.total_results,
        results: data.results.map(each => ({
          id: each.id,
          title: each.title,
          releaseDate: each.release_date,
          posterPath: `https://image.tmdb.org/t/p/w500${each.poster_path}`,
          voteAverage: each.vote_average,
          voteCount: each.vote_count,
        })),
      }

      this.setState({
        popularMovies: updatedData.results,
        apiStatus: apiStatusConstants.success,
      })
    }
  }

  renderSuccessView = () => {
    const {popularMovies} = this.state
    return (
      <ul className="popularmovies-list">
        {popularMovies.map(eachMovie => (
          <Popular movieDetails={eachMovie} key={eachMovie.id} />
        ))}
      </ul>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container">
      <Loader type="Oval" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderMoviesList = () => {
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
      <div className="popular-movies-container">
        <Navbar />
        {this.renderMoviesList()}
      </div>
    )
  }
}

export default Home
