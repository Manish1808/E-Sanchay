import React, { useState, useEffect } from "react";

const Learn = () => {
  const [selectedVideo, setSelectedVideo] = useState(
    "https://drive.google.com/file/d/19liUZIj1VrPheuOboBTPE_Ln76fNcIcF/preview"
  );
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(savedNotes);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Function to add a new note
  const addNote = () => {
    if (newNote.trim() !== "") {
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      setNewNote(""); // Clear input field after adding
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-300 p-4">
      {/* Sidebar for Chapters */}
      <div className="w-1/4 bg-gray-800 shadow-lg rounded-lg p-4">
        <h2 className="text-lg font-bold mb-3 text-gray-100">Chapters</h2>
        <ul>
          <li
            className="cursor-pointer hover:text-blue-400 py-2"
            onClick={() =>
              setSelectedVideo("https://drive.google.com/file/d/19liUZIj1VrPheuOboBTPE_Ln76fNcIcF/preview")
            }
          >
            Chapter 1 - संयोजन की शक्ति
          </li>
          <li
            className="cursor-pointer hover:text-blue-400 py-2"
            onClick={() =>
              setSelectedVideo("https://drive.google.com/file/d/183Lkyvg1u8LXcH0ZqFB3fm7Gil4n_MRw/preview")
            }
          >
            Chapter 2 - स्मार्ट बिजनेस
          </li>
          <li
            className="cursor-pointer hover:text-blue-400 py-2"
            onClick={() =>
              setSelectedVideo("https://drive.google.com/file/d/1Ap6ZaeuqgrWgq-LpnR7NS84WO1NPt8HY/preview")
            }
          >
            Chapter 3 - जैक मा की प्रेरणा
          </li>
          <li
            className="cursor-pointer hover:text-blue-400 py-2"
            onClick={() =>
              setSelectedVideo("https://drive.google.com/file/d/128fCjHoDvFurHuEEHV12v-RA5seI3zG2/preview")
            }
          >
            Chapter 4 - टर्म इंश्योरेंस क्या है
          </li>
          <li
            className="cursor-pointer hover:text-blue-400 py-2"
            onClick={() =>
              setSelectedVideo("https://drive.google.com/file/d/1DDrrsORT1_lQdHdFCUla0vVZGzcE4QNg/preview")
            }
          >
            Chapter 5 - KFC संस्थापक की कहानी
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 flex flex-col items-center">
        {/* Video Player */}
        <iframe
          className="w-full h-[500px] rounded-lg shadow-lg border border-gray-700"
          src={selectedVideo}
          title="Google Drive Video"
          allowFullScreen
        ></iframe>

        {/* Notes Section */}
        <div className="w-full mt-4 bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold text-gray-100 mb-2">Notes</h2>

          {/* Input for new note */}
          <div className="flex space-x-2">
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
              placeholder="Write a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={addNote}
            >
              Add
            </button>
          </div>

          {/* Display Notes */}
          <ul className="mt-4 space-y-2">
            {notes.length > 0 ? (
              notes.map((note, index) => (
                <li
                  key={index}
                  className="bg-gray-700 p-2 rounded text-gray-300 border border-gray-600"
                >
                  {note}
                </li>
              ))
            ) : (
              <p className="text-gray-400">No notes yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Learn;
