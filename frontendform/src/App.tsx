import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

function Form() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [friends, setFriends] = useState([{ name: '' }]);
  const [teammates, setTeammates] = useState([{ name: '' }]);
  const navigate = useNavigate();

  const capitalizeFirstLetter = (string: string) => {
    return string.replace(/\b\w/g, (char) => char.toUpperCase());
  };

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

    const formattedName = capitalizeFirstLetter(name);
    const formattedLocation = capitalizeFirstLetter(location);
    const formattedFriends = friends.map(friend => ({
      ...friend,
      name: capitalizeFirstLetter(friend.name)
    }));
    const formattedTeammates = teammates.map(teammate => ({
      ...teammate,
      name: capitalizeFirstLetter(teammate.name)
    }));

    const data = {
      name: formattedName,
      location: formattedLocation,
      friends: formattedFriends,
      teammates: formattedTeammates,
    };

    try {
      const response = await fetch('http://localhost:3000/calhacks', {
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
      <h2>THE CALHACKS NETWORKING SURVEY</h2>
      <h4>For each item except location, please put full names!!</h4>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Full Name:
            <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            </div>
          </label>
        </div>
        <div>
          <label>
            Where you're from:
            <div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            </div>
          </label>
        </div>
        <div>
          <label>List all your friends at the event:</label>
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
          <label>List all your teammates at the event:</label>
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
      <p>(i am not responsible for any damages caused. this is unofficial)</p>
    </div>
  );
}

function ThankYou() {
  return (
    <div className="ThankYou">
      <h1>Thank You for Submitting!</h1>
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