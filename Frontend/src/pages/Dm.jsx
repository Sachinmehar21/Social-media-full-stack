import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import socket from '../api';
import { API_URL } from '../api';

const Dm = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Fetch current user info
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/feed`, { withCredentials: true });
        setCurrentUser(response.data.user);
      } catch (error) {
        navigate('/login');
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    // Fetch all users except current user
    const fetchUsers = async () => {
      if (!currentUser?._id) return;
      try {
        const response = await axios.get(`${API_URL}/users`, { withCredentials: true });
        setUsers(response.data.users.filter(u => u._id !== currentUser._id));
      } catch (error) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?._id) {
      socket.emit('join', currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    socket.on('dm', ({ fromUserId, message }) => {
      setChat((prev) => [...prev, { from: fromUserId, text: message }]);
    });
    return () => {
      socket.off('dm');
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  useEffect(() => {
    const fetchChat = async () => {
      if (!selectedUser || !currentUser) return;
      try {
        const res = await axios.get(`${API_URL}/messages/${currentUser._id}/${selectedUser._id}`);
        setChat(res.data.messages.map(m => ({ from: m.from, text: m.text })));
      } catch (err) {
        setChat([]);
      }
    };
    fetchChat();
    setStatus('');
    setMessage('');
  }, [selectedUser, currentUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedUser || !message) return;
    try {
      socket.emit('dm', {
        toUserId: selectedUser._id,
        fromUserId: currentUser._id,
        message,
      });
      setChat((prev) => [...prev, { from: currentUser._id, text: message }]);
      setMessage('');
      setStatus('');
    } catch (err) {
      setStatus('Message failed');
    }
  };

  return (
    <div className="dm-root">
      <h2 className="dm-title">Direct Messages</h2>
      <div className="dm-main">
        {/* User List */}
        <aside className="dm-sidebar">
          <div className="dm-sidebar-header">Users</div>
          <div className="dm-user-list">
            {users.length === 0 && <div className="dm-no-users">No users found</div>}
            {users.map(user => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`dm-user-item${selectedUser?._id === user._id ? ' selected' : ''}`}
              >
                <img src={user.profilepicture || '/default-profile.png'} alt={user.username} className="dm-user-avatar" />
                <span className="dm-user-name">{user.username}</span>
              </div>
            ))}
          </div>
        </aside>
        {/* Chat Window */}
        <section className="dm-chat-section">
          {!selectedUser ? (
            <div className="dm-select-user">Select a user to start chatting</div>
          ) : (
            <>
              <div className="dm-chat-header">
                <img src={selectedUser.profilepicture || '/default-profile.png'} alt={selectedUser.username} className="dm-chat-avatar" />
                <span className="dm-chat-username">{selectedUser.username}</span>
              </div>
              <div className="dm-chat-messages" id="dm-chat-messages">
                {chat.map((msg, idx) => (
                  <div key={idx} className={`dm-message-row${msg.from === currentUser?._id ? ' self' : ''}`}>
                    <span className="dm-message-bubble">{msg.text}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSend} className="dm-chat-input-row">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="dm-chat-input"
                  disabled={!selectedUser}
                />
                <button type="submit" className="dm-send-btn" disabled={!selectedUser || !message}>Send</button>
              </form>
              {status && <div className="dm-status-error">{status}</div>}
            </>
          )}
        </section>
      </div>
      <Link to="/" className="dm-home-link">Go back home</Link>
      <style>{`
        .dm-root {
          min-height: 100vh;
          background: #111;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 24px;
        }
        .dm-title {
          margin-bottom: 12px;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .dm-main {
          display: flex;
          width: 90vw;
          max-width: 900px;
          min-height: 70vh;
          background: #222;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px #0007;
        }
        .dm-sidebar {
          width: 240px;
          background: #181818;
          border-right: 1px solid #333;
          display: flex;
          flex-direction: column;
        }
        .dm-sidebar-header {
          padding: 18px 16px 12px 16px;
          border-bottom: 1px solid #333;
          font-weight: 600;
          font-size: 1.1rem;
          letter-spacing: 0.5px;
        }
        .dm-user-list {
          flex: 1;
          overflow-y: auto;
        }
        .dm-no-users {
          padding: 16px;
          color: #aaa;
        }
        .dm-user-item {
          padding: 12px 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #232323;
          transition: background 0.2s, color 0.2s;
        }
        .dm-user-item.selected {
          background: #333;
          color: #4caf50;
        }
        .dm-user-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          margin-right: 12px;
          object-fit: cover;
        }
        .dm-user-name {
          font-size: 1rem;
          font-weight: 500;
        }
        .dm-chat-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #232323;
          min-width: 0;
        }
        .dm-select-user {
          color: #aaa;
          text-align: center;
          margin-top: 120px;
          font-size: 1.1rem;
        }
        .dm-chat-header {
          display: flex;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #333;
          background: #181818;
        }
        .dm-chat-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          margin-right: 12px;
        }
        .dm-chat-username {
          font-weight: 600;
          font-size: 1.1rem;
        }
        .dm-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 18px 12px 8px 12px;
          display: flex;
          flex-direction: column;
        }
        .dm-message-row {
          display: flex;
          margin-bottom: 10px;
        }
        .dm-message-row.self {
          justify-content: flex-end;
        }
        .dm-message-bubble {
          background: #333;
          color: #fff;
          padding: 10px 18px;
          border-radius: 18px;
          font-size: 1rem;
          max-width: 70vw;
          word-break: break-word;
          box-shadow: 0 1px 4px #0003;
        }
        .dm-message-row.self .dm-message-bubble {
          background: #4caf50;
          color: #fff;
        }
        .dm-chat-input-row {
          display: flex;
          gap: 8px;
          padding: 14px 16px;
          background: #181818;
          border-top: 1px solid #333;
        }
        .dm-chat-input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 20px;
          border: none;
          font-size: 1rem;
          background: #292929;
          color: #fff;
          outline: none;
        }
        .dm-send-btn {
          padding: 10px 22px;
          border-radius: 20px;
          border: none;
          background: #4caf50;
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .dm-send-btn:disabled {
          background: #333;
          color: #aaa;
          cursor: not-allowed;
        }
        .dm-status-error {
          color: #ff5252;
          margin: 8px 0 0 16px;
        }
        .dm-home-link {
          color: #4caf50;
          text-decoration: underline;
          margin-top: 24px;
          font-size: 1.1rem;
        }
        /* Responsive styles */
        @media (max-width: 700px) {
          .dm-main {
            flex-direction: column;
            width: 98vw;
            min-height: 80vh;
            max-width: 99vw;
          }
          .dm-sidebar {
            width: 100vw;
            border-right: none;
            border-bottom: 1px solid #333;
            flex-direction: row;
            overflow-x: auto;
            overflow-y: hidden;
            min-height: 70px;
            max-height: 70px;
          }
          .dm-sidebar-header {
            display: none;
          }
          .dm-user-list {
            display: flex;
            flex-direction: row;
            overflow-x: auto;
            overflow-y: hidden;
            width: 100vw;
            max-height: 70px;
          }
          .dm-user-item {
            border-bottom: none;
            border-right: 1px solid #232323;
            padding: 10px 8px;
            min-width: 80px;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .dm-user-avatar {
            width: 32px;
            height: 32px;
            margin: 0 0 4px 0;
          }
          .dm-user-name {
            font-size: 0.95rem;
          }
          .dm-chat-section {
            min-height: 300px;
          }
        }
        @media (max-width: 500px) {
          .dm-title {
            font-size: 1.2rem;
          }
          .dm-main {
            min-height: 60vh;
          }
          .dm-chat-header {
            padding: 10px;
          }
          .dm-chat-messages {
            padding: 8px 2px 4px 2px;
          }
          .dm-chat-input-row {
            padding: 8px 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dm;