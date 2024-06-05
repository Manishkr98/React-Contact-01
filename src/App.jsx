import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);


  // call the Api

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setContacts(response.data);
      })
      .catch(error => {
        console.error('Error fetching contacts:', error);
      });
  }, []);

  // add a new contact 
  const addContact = () => {
    axios.post('https://jsonplaceholder.typicode.com/users', newContact)
      .then(response => {
        setContacts([...contacts, response.data]);
        setNewContact({ name: '', email: '', phone: '' });
      })
      .catch(error => {
        console.error('Error adding contact:', error);
      });
  };

  // Editing
  const startEditing = (contact) => {
    setIsEditing(true);
    setCurrentId(contact.id);
    setNewContact({ name: contact.name, email: contact.email, phone: contact.phone });
  };

  // update the Contact
  const updateContact = () => {
    axios.put(`https://jsonplaceholder.typicode.com/users/${currentId}`, newContact)
      .then(response => {
        setContacts(contacts.map(contact => contact.id === currentId ? response.data : contact));
        setIsEditing(false);
        setCurrentId(null);
        setNewContact({ name: '', email: '', phone: '' });
      })
      .catch(error => {
        console.error('Error updating contact:', error);
      });
  };

  // deleteContact from list
  const deleteContact = (id) => {
    axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(() => {
        setContacts(contacts.filter(contact => contact.id !== id));
        alert("You've deleted a contact!")
      })
      .catch(error => {
        console.error('Error deleting contact:', error);
      });
  };

  // handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateContact();
      alert("Your contacts have been updated!")
    } else {
      alert("A new contact has been added!")
      addContact();
    }
  };

  return (
    <div className="container">
      <h1>Contact Manager</h1>
      {/* contact form  */}
      <div>
        <h2>{isEditing ? 'Edit Contact' : 'Add New Contact'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={newContact.name}
            onChange={e => setNewContact({ ...newContact, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newContact.email}
            onChange={e => setNewContact({ ...newContact, email: e.target.value })}
          />
          <input
            type="phone"
            placeholder="Phone"
            value={newContact.phone}
            onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
          />
          <button type="submit">{isEditing ? 'Update Contact' : 'Add Contact'}</button>
        </form>
      </div>
      <h2>Contact List</h2>
      <ul>
        {/* using map all data display  */}
        {contacts.map(contact => (
          <li key={contact.id}>
            <div>
              {contact.name} - {contact.email} - {contact.phone}
            </div>
            <div>
              <button onClick={() => startEditing(contact)}>Update</button>
              <button className="delete" onClick={() => deleteContact(contact.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
