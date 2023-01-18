import React from "react";
import { useState } from "react";
import "./Search.css";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Search() {
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [popup, setPopup] = useState(false);
  const [results, setResults] = useState([]);

  // sets artist name to the text entered by user
  const inputHandlerArtist = (e) => {
    setArtist(e.target.value);
  };

  // sets song name to the text entered by user
  const inputHandlerSong = (e) => {
    setSong(e.target.value);
  };

  const handleSongClick = (song_id) => {
    console.log(song_id)
  }

  // called when user clicks on "search"
  const handleSearchClick = async () => {
    if (!song.trim()) {
      // if user has not typed in a song, do not proceed
      alert("You must type in a song");
      return;
    }

    // if user has at least typed in a song, proceed

    if (artist.trim() && song.trim()) {
      // user has typed in BOTH artist AND song
      // search for song 
      const res = await fetch(
        `${process.env.REACT_APP_API_ADDRESS}/search/?api_key=${process.env.REACT_APP_API_KEY}&type=both&lookup=song:${song} artist:${artist}&limit=15`
      );
      const response = await res.json();

      if (response) {
        setPopup(true); // opens popup once response has been received

        if (response.search.error) {
          // no results found
          setResults(<p>no results were found</p>);
          return;
        }

        setResults(
          response.search.map((song, i) => {
            return (
              <div className="songCard" key={i} onClick={() => {handleSongClick(song.song_id)}}>
                <div className="songData">
                  <img src={song.artist.img} className="artistImg" />
                  <div className="artistAndSong">
                    <p>artist: {song.artist.name}</p>
                    <p>song: {song.song_title}</p>
                  </div>
                </div>
              </div>
            );
          })
        );
      }
    } else {
      // user has only typed in a song
      const res = await fetch(
        `https://api.getsongbpm.com/search/?api_key=${process.env.REACT_APP_API_KEY}&type=song&lookup=${song}&limit=15`
      );
      const response = await res.json();

      if (response) {
        setPopup(true); // opens popup once response has been received

        if (response.search.error) {
          // no results found
          setResults(<p>no results were found</p>);
          return;
        }

        setResults(
          response.search.map((song, i) => {
            return (
              <div className="songCard" key={i} onClick={() => {handleSongClick()}}>
                <div className="songData">
                  <img src={song.artist.img} className="artistImg" />
                  <div className="artistAndSong">
                    <p>artist: {song.artist.name}</p>
                    <p>song: {song.title}</p>
                    {/* <p>id: {song.id}</p> */}
                  </div>
                </div>
              </div>
            );
          })
        );
      }
    }
  };

  return (
    <div className="searchContainer">
      <p>Search for a song's BPM:</p>
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
          {results}
          <button onClick={() => setPopup(false)}>close</button>
        </div>
      )}
    </div>
  );
}
