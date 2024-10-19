import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

function Form() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [friends, setFriends] = useState([{ name: '' }]);
  const [teammates, setTeammates] = useState([{ name: '' }]);
  const navigate = useNavigate();

  const handleFriendChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newFriends = [...friends];
    newFriends[index].name = event.target.value;
    setFriends(newFriends);
  };

  const handleAddFriend = () => {
    setFriends([...friends, { name: '' }]);
  };

  const handleTeammateChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newTeammates = [...teammates];
    newTeammates[index].name = event.target.value;
    setTeammates(newTeammates);
  };

  const handleAddTeammate = () => {
    setTeammates([...teammates, { name: '' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name,
      location,
      friends,
      teammates,
    };

    try {
      const response = await fetch('https://calhacks11backend.vercel.app/calhacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigate('/thank-you');
      } else {
        console.error('Failed to submit data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>Submit Your Information</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Location:
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>Friends:</label>
          {friends.map((friend, index) => (
            <div key={index}>
              <input
                type="text"
                value={friend.name}
                onChange={(e) => handleFriendChange(index, e)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleAddFriend}>
            Add Friend
          </button>
        </div>
        <div>
          <label>Teammates:</label>
          {teammates.map((teammate, index) => (
            <div key={index}>
              <input
                type="text"
                value={teammate.name}
                onChange={(e) => handleTeammateChange(index, e)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleAddTeammate}>
            Add Teammate
          </button>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

function ThankYou() {
  return (
    <div className="ThankYou">
      <h1>Thanks for submitting!!</h1>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </Router>
  );
}

export default App;