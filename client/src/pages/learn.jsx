import React, { useState, useEffect } from "react";

const Learn = () => {
  const [language, setLanguage] = useState("hindi");
  const [selectedVideo, setSelectedVideo] = useState("");
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  const chapters = {
    hindi: [
      { title: "संयोजन की शक्ति", video: "https://drive.google.com/file/d/19liUZIj1VrPheuOboBTPE_Ln76fNcIcF/preview" },
      { title: "स्मार्ट बिजनेस", video: "https://drive.google.com/file/d/183Lkyvg1u8LXcH0ZqFB3fm7Gil4n_MRw/preview" },
      { title: "जैक मा की प्रेरणा", video: "https://drive.google.com/file/d/1Ap6ZaeuqgrWgq-LpnR7NS84WO1NPt8HY/preview" },
      { title: "टर्म इंश्योरेंस क्या है", video: "https://drive.google.com/file/d/128fCjHoDvFurHuEEHV12v-RA5seI3zG2/preview" },
      { title: "KFC संस्थापक की कहानी", video: "https://drive.google.com/file/d/1DDrrsORT1_lQdHdFCUla0vVZGzcE4QNg/preview" },
    ],
    telugu: [
      { title: "జాక్ మా యొక్క ప్రేరణ", video: "https://drive.google.com/file/d/1MivF3a0HBUxFi1Muu9YiHLzgMhZCL3jP/preview" },
      { title: "చాణక్య నీతులు", video: "https://drive.google.com/file/d/1tz1n_606lx5QZ2TgWUqVXim0q8HqpIOh/preview" },
      { title: "పొదుపు విలువ", video: "https://drive.google.com/file/d/1sFkY9lohYrJTqKT0-3bMQ6LVoIZ63OCM/preview" },
    ],
    english: [
      { title: "The Inspiring Journey of Jack Ma", video: "https://drive.google.com/file/d/1Jq190_q2lIxIRMLuvtjvQrd5O1_OfNEa/preview" },
      { title: "The Rise of BlackRock", video: "https://drive.google.com/file/d/1_2F02aR5KsXfG2z0fMAyfCsesDoR3FNr/preview" },
      { title: "How Savings Impact Your Financial Future", video: "https://drive.google.com/file/d/12kw53lrZrqyUyQL5dV0oMvX6GvXuIun_/preview" },
    ]
  };

  useEffect(() => {
    setSelectedVideo(chapters[language][0].video);
  }, [language]);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.trim() !== "") {
      setNotes([...notes, newNote]);
      setNewNote("");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-300 p-4">
      <div className="w-1/4 bg-gray-800 shadow-lg rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-100">Chapters</h2>
          <select
            className="bg-gray-700 text-white p-1 rounded hover:cursor-pointer"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="hindi">Hindi</option>
            <option value="english">English</option>
            <option value="telugu">Telugu</option>
          </select>
        </div>
        <ul>
          {chapters[language].map((chapter, index) => (
            <li
              key={index}
              className="cursor-pointer hover:text-blue-400 py-2"
              onClick={() => setSelectedVideo(chapter.video)}
            >
              {chapter.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 flex flex-col items-center">
        <iframe
          className="w-full h-[500px] rounded-lg shadow-lg border border-gray-700"
          src={selectedVideo}
          title="Google Drive Video"
          allowFullScreen
        ></iframe>

        <div className="w-full mt-4 bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold text-gray-100 mb-2">Notes</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
              placeholder="Write a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded hover:cursor-pointer"
              onClick={addNote}
            >
              Add
            </button>
          </div>
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
