import React,{useState, useEffect} from 'react';
import axios from '../axios';
import './Row.css'
import YouTube from 'react-youtube'
import movieTrailer from 'movie-trailer'

const baseImgUrl = "https://image.tmdb.org/t/p/original";
const Row = ({ title, fetchUrl, isLargeRow }) => {
    
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");
    

    useEffect(() => {

        //if [] runs once when the row loads, dont run again
        //if[movies] run every single time movies changes
        //movies are a piece of state so that could be change time 2 time
        //every time it change it will run if [movies]

        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results)

            // return request;
        } 

        fetchData();
    }, [fetchUrl])


    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    };

    const handleClick = async (movie) => {
        if (trailerUrl) {
            setTrailerUrl("");
        } else {
            // movieTrailer(movie?.name || "")
            //     .then((url) => {
            //         const urlParams = new URLSearchParams(new URL(url).search);
            //         setTrailerUrl(urlParams.get("v"));
            //     })
            //     .catch((error) => console.log(error));


            //change the function to async
            let trailerurl = await axios.get(
                `/movie/${movie.id}/videos?api_key=b68d2229103463d24d20eb17f36b5bef`
            );
            setTrailerUrl(trailerurl.data.results[0]?.key);
        }
    }
    
    
    return (
        <div className="row">
            <h2>{title}</h2>
            <div className = {"row__posters"}>
                {movies.map((movie) => {
                    return <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                        src={`${baseImgUrl}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                        // src={baseImgUrl + isLargeRow ? movie.poster_path : movie.backdrop_path}
                        alt={movie.name} />   
                   //return <img src={`${baseImgUrl}${movie.backdrop_path}`} alt = {movie.name} />
                    //console.log(`${movie.name}`);
                    //console.log(baseImgUrl+movie.backdrop_path);
                    
                })}
            </div>
            { trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    );
};

export default Row;