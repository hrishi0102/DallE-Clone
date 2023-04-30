import React from "react";
import { useState } from "react";
import Modal from "./components/Modal";

const App = () => {
  const [images, setImages] = useState(null);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const surpriseOptions = [
    "A serene underwater scene with a coral reef teeming with colorful fish and other marine life.",
    "A futuristic cityscape at night with flying cars zipping through neon-lit skyscrapers.",
    "A mystical forest with towering trees draped in glowing moss, and a faint trail leading into the unknown.",
    "An abandoned space station floating in the void of space, with flickering lights and mysterious shadows.",
    "A post-apocalyptic wasteland with crumbling skyscrapers, overgrown vegetation, and remnants of technology from a bygone era.",
    "An image of an underwater world with vibrant coral reefs, schools of fish, and hidden treasure.",
    "Generate an image of a squirrel riding a unicycle while juggling acorns.",
  ];

  const surpriseMe = () => {
    setImages(null);
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const getImages = async () => {
    setImages(null);
    if (value === null) {
      setError("Error! Please enter a prompt");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value,
        }),
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/images", options);
      const data = await response.json();
      console.log(data);
      setImages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const uploadImage = async (e) => {
    console.log(e.target.files[0]);

    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    setModalOpen(true);
    setSelectedImage(e.target.files[0]);
    e.target.value = null;

    try {
      const options = {
        method: "POST",
        body: formData,
      };
      const response = await fetch("http://localhost:8000/upload", options);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const generateVariations = async () => {
    setImages(null);
    if (selectedImage === null) {
      setError("Error! Must have an exisiting image");
      setModalOpen(false);
      return;
    }
    try {
      const options = {
        method: "POST",
      };
      const response = await fetch("http://localhost:8000/variations", options);
      const data = await response.json();
      console.log(data);
      setImages(data);
      setError(null);
      setModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="app">
      <section className="search-section">
        <p>
          Start a detailed description
          <span className="surprise" onClick={surpriseMe}>
            surprise me
          </span>
        </p>
        <div className="input-container">
          <input
            value={value}
            placeholder="An impressionist oil painting of apple..."
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={getImages}>Generate</button>
        </div>
        <p className="extra-info">
          Or,
          <span>
            <label className="upload-img" htmlFor="files">
              {" "}
              upload an image{" "}
            </label>
            <input
              onChange={uploadImage}
              id="files"
              accept="image/*"
              type="file"
              hidden
            />
          </span>
          to edit.
        </p>
        {error && <p>{error}</p>}
        {modalOpen && (
          <div className="overlay">
            <Modal
              setModalOpen={setModalOpen}
              setSelectedImage={setSelectedImage}
              selectedImage={selectedImage}
              generateVariations={generateVariations}
            />
          </div>
        )}
      </section>
      <section className="image-section">
        {images?.map((image, _index) => (
          <img
            key={_index}
            src={image.url}
            alt={`Generated image of ${value}`}
          />
        ))}
      </section>
    </div>
  );
};

export default App;
