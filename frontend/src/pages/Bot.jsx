import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Bot() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState(subject || "Mathematics");
  const [subjects, setSubjects] = useState(['Mathematics', 'Physics', 'Computer Science', 'English']);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('/api/forum/subjects');
        if (response.ok) {
          const data = await response.json();
          setSubjects(data.subjects);
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    if (subject) {
      const validSubject = subjects.find(
        s => s.toLowerCase() === subject.toLowerCase()
      );

      if (validSubject) {
        setSelectedSubject(validSubject);
      } else {
        navigate("/bot");
      }
    }
  }, [subject, subjects, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubjectChange = (event) => {
    const newSubject = event.target.value;
    setSelectedSubject(newSubject);
    navigate(`/bot/${newSubject}`);

    // Add a system message about the new subject
    setMessages(prev => [
      ...prev,
      {
        type: "system",
        content: `Switched to ${newSubject}. How can I help with your ${newSubject} questions?`
      }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    setMessages(prev => [ //chat mai message add karne ke liye
      ...prev,
      { type: "user", content: userMessage }
    ]);

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isAuthenticated && { 'Authorization': `Bearer ${localStorage.getItem('token')}` })
        },
        body: JSON.stringify({
          subject: selectedSubject,
          question: userMessage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        { type: "bot", content: data.answer }
      ]);
    } catch (err) {
      console.error('Error getting AI response:', err);
      setError('Failed to get a response. Please try again.');

      setMessages(prev => [
        ...prev,
        { type: "error", content: "Sorry, I couldn't process your question. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          type: "bot",
          content: `Welcome to the ${selectedSubject} bot! I can help answer your questions about ${selectedSubject}. What would you like to know?`
        }
      ]);
    }
  }, [selectedSubject]);

  return (
    <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            {selectedSubject} AI Assistant
          </h1>

          <div className="flex items-center space-x-2">
            <label htmlFor="subject-select" className="text-gray-700 font-medium">
              Subject:
            </label>
            <select
              id="subject-select"
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Messages Container */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 h-[500px] overflow-y-auto">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl p-4 ${message.type === "user"
                      ? "bg-blue-500 text-white"
                      : message.type === "error"
                        ? "bg-red-50 text-red-700"
                        : message.type === "system"
                          ? "bg-gray-100 text-gray-600 italic"
                          : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {message.type !== "user" && message.type !== "system" && message.type !== "error" && (
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm mr-2">
                        AI
                      </div>
                      <span className="font-semibold">{selectedSubject} Assistant</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input Form */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Ask a question about ${selectedSubject}...`}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="ml-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Send"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Bot;