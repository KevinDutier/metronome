import React from "react";
import { useState } from "react";
import './Search.css';

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Search() {
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [popup, setPopup] = useState(false);
  const [results, setResults] = useState([]);

  // sets artist name to text entered by user
  const inputHandlerArtist = (e) => {
    setArtist(e.target.value);
  };

  // sets song name to text entered by user
  const inputHandlerSong = (e) => {
    setSong(e.target.value);
  };

  const handleSearchClick = async () => {
    if (!song.trim()) {
      // if user has not typed in a song, do not proceed
      alert("You must type in a song");
      return;
    }

    // if user has at least typed in a song, proceed

    if (artist.trim() && song.trim()) {
      // user has typed in BOTH artist AND song
      const res = await fetch(
        `https://api.getsongbpm.com/search/?api_key=${process.env.REACT_APP_API_KEY}&type=both&lookup=song:${song} artist:${artist}&limit=15`
      );
      const response = await res.json();
      console.log(response);

    //   setResults()
    } else {
      // user has only typed in a song
      const res = await fetch(
        `https://api.getsongbpm.com/search/?api_key=${process.env.REACT_APP_API_KEY}&type=song&lookup=${song}&limit=15`
      );
      const response = await res.json();

    //   console.log(response.search[0].artist.name); // artist name
    //   console.log(response.search[0].artist.img); // artist img
    //   console.log(response.search[0].title); // song title
    //   console.log(response.search[0].id); // song id

    //   console.log(response.search.title);

      if (response) {
        setPopup(true); // opens popup once response has been received

        if (response.search.error) {
            // no results found
            setResults(<p>no results were found</p>);
            return;
        };

        setResults(
            response.search.map((song, i) => {
                return (
                    <div className="songCard" key={i}>
                        <div className="songData">
                            <img src={song.artist.img} className="artistImg"/>
                            <div className="artistAndSong">
                                <p>artist: {song.artist.name}</p>
                                <p>song: {song.title}</p>
                                {/* <p>id: {song.id}</p> */}
                            </div>
                        </div>
                    </div>
                )
            })
        )
      }
    }
  };

  return (
    <div className="searchContainer">
      <p>Search for a song BPM:</p>
      <input
        // className={styles.searchBar}
        type="text"
        onChange={inputHandlerArtist}
        placeholder="Artist"
        minLength="1"
        maxLength="28"
      />
      <input
        // className={styles.searchBar}
        type="text"
        onChange={inputHandlerSong}
        placeholder="Song"
        minLength="0"
        maxLength="28"
      />
      <button className="button" type="button" onClick={handleSearchClick}>
        search
      </button>

      {popup && (
        <div className="popup">
          {/* <div className="popup_inner">
            <h1>results</h1>
            <button onClick={() => setPopup(false)}>close me</button>
          </div> */}
          {results}
          <button onClick={() => setPopup(false)}>close</button>
        </div>
      )}

      {/* <Popup
        trigger={
          <button className="button" type="button" onClick={handleSearchClick}>
            search
          </button>
        }
        position="right center"
      >
        <div>Popup content here !!</div>
      </Popup> */}
    </div>
  );
}
