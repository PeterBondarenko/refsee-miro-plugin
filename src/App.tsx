import React, { EventHandler, FormEvent, useEffect, useState } from "react";
import ReactDOM from "react-dom";

import type { DropEvent } from "@mirohq/websdk-types";
import { Event } from "typescript/lib/protocol";

const { board } = miro;

function App() {
  // Register the drop event handler once.

  const [searchRequest, setRequest] = useState("")
  const [requestLink, setRequestLink] = useState("https://refsee.com/?utm_source=miro&utm_medium=plugin&utm_campaign=collab&utm_content=morebutton")
  const [buttonCaption, setbuttonCaption] = useState("Go to Refsee")
  const [images, setImages] = useState([
    'https://refsee.com/static/img/home/family.jpg',
    'https://refsee.com/static/img/home/fashion.jpg',
    'https://refsee.com/images/thumb/1H3YK-MGcOMiPiZm7pXqoFO6rwtGiHcrR.jpg',
    'https://refsee.com/images/thumb/18NdhjFzY0quLz8eHG5LSVHMZFrIKom7C.jpg',
    'https://refsee.com/images/thumb/1WcWIV8M3ZkAI9xeJGKs2HVbN3C6kNn8i.jpg',
    'https://refsee.com/images/thumb/1fs5OkrSkETJrNgG4ZBbUlXaOAjN2eI_a.jpg',
    'https://refsee.com/images/thumb/1T8zOE_zCiIJOFC0q0iNuGIpT53zHkQAp.jpg',
    'https://refsee.com/images/thumb/1o1gxGQVlfduxzpgMxXTg_X4wFSSBUG5T.jpg',
    'https://refsee.com/images/thumb/1BG-gorYIxjoHaV5NMBuRxJ1tT93F-n1C.jpg',
    'https://refsee.com/images/thumb/12LJuIdn9nx6dwBarVzzOTdr-J8vjXxFl.jpg'
  ])
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    board.ui.on("drop", drop);
  }, []);

  const drop = async (e: DropEvent) => {
    const { x, y, target } = e;

    if (target instanceof HTMLImageElement) {
      const image = await board.createImage({ x, y, url: target.src });
      // const image = await board.createPreview({x, y, url: "https://refsee.com/image?imgs=1031679%2C+1031673&req_type=&active=1"})
      // const image = await board.createEmbed({url: "https://vimeo.com/650005370", previewUrl: target.src, mode: 'modal', x: x, y: y})
      // await board.viewport.zoomTo(image);
    }
  };

  function handleChange(e: any) {
    setRequest(e.target.value);
    setRequestLink("https://refsee.com/search?sreq=" + e.target.value + "&utm_source=miro&utm_medium=plugin&utm_campaign=collab&utm_content=morebutton");
  }

  function displayLoader() {
    setLoader(true)
  };

  function hideLoader() {
    setLoader(false)
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setImages([]);
    displayLoader();
    fetch("https://refsee.com/api/smena/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Basic c21lbmFfYXBpOnRFZFUzZ0ZAMkhqRGItY2p6Sk03UV94LUwuQnVIIUct" },
      body: JSON.stringify({ "search_query": searchRequest })
    })
    .then(response => response.json().then(data => ({
          data: data,
          status: response.status
        })
      ).then(res => {
        if (res.status == 200) {
          hideLoader();
          setImages(res.data.frame_urls)
          setbuttonCaption("More References")
          useEffect(() => {
            board.ui.on("drop", drop);
          });
        } else {
          console.log("Request to Refsee failed :(")
        }
      }));
    };

  function generateClassName(i: any) {
    if (i % 2 == 0) {
      return "miro-draggable draggable-item cs7 ce12"
    } else {
      return "miro-draggable draggable-item cs1 ce6"
    }
  }


  return (
    <div className="main">
      <a href={requestLink} target="_blank"><img className="refsee-logo" src="/src/assets/refsee_logo.svg" alt="" /></a>
      <div className="headline">
            <p>AI-based video search engine</p>
      </div>
      <form onSubmit={handleSubmit} className="input-form">
      <div className="grid">
          <div className="cs1 ce10">
          <input type="text" className="input" placeholder="Any object, mood, color etc." id="search_req" name="req" value={searchRequest} onChange={handleChange}/>
          </div>
          <div className="cs11 ce12 search-button-col">
            {/* <button type="submit" className="button-icon icon-search"></button> */}
            {/* <button type="submit" className="search-button button-primary"><div className="icon icon-search search-icon"></div></button> */}
            <button type="submit" className="search-button button-primary"><img className="search-icon" src="/src/assets/search.svg"/></button>
          </div>
          </div>
      </form>
      <div className="grid results" id="refseeResult">
      <div className="lds-ring" style={{display: loader ? 'block' : 'none' }}>
      <div></div><div></div><div></div><div></div></div>
      
      {images.map((image, index) => {
        return (
          <img
            src={image}
            draggable={false}
            className={generateClassName(index+1)}
            key={index+1}
          />
        );
      })}
      </div>

      <div className="sticky-bottom">

      <div className="logline">
        <div style={{display: loader ? 'block' : 'none' }}>Over 1 000 000 Video References</div>
      </div>

      <a className="button goto-button" href={requestLink} target="_blank">{buttonCaption}</a>
      
      <div className="logline">
        <p className="p-small">All images and videos are copyrighted</p>
      </div>
      </div>

    </div>
  );
}


// Render App
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
