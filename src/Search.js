import React from "react";
import { useState } from "react";
import "./Search.css";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Search(props) {
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

  // called when user clicks on "search"
  // searches for songs in the API's db using user input
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
              <div
                className="songCard"
                key={i}
                onClick={() => {
                  handleSongClick(song.song_id);
                }}
              >
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
        `${process.env.REACT_APP_API_ADDRESS}/search/?api_key=${process.env.REACT_APP_API_KEY}&type=song&lookup=${song}&limit=15`
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
              <div
                className="songCard"
                key={i}
                onClick={() => {
                  handleSongClick(song.id);
                }}
              >
                <div className="songData">
                  <img src={song.artist.img} className="artistImg" />
                  <div className="artistAndSong">
                    <p>artist: {song.artist.name}</p>
                    <p>song: {song.title}</p>
                  </div>
                </div>
              </div>
            );
          })
        );
      }
    }
  };

  // called when user clicks on the song they chose
  // fetches the song's bpm using the API's db
  const handleSongClick = async (song_id) => {
    const res = await fetch(
      `${process.env.REACT_APP_API_ADDRESS}/song/?api_key=${process.env.REACT_APP_API_KEY}&id=${song_id}`
    );
    const response = await res.json();

    // console.log(response.song.tempo);
    // console.log(response.song.time_sig);

    props.onClickSong(response.song.tempo, response.song.time_sig)
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
