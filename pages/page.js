import { useEffect, useState } from 'react';

export default function UserDetails({ id }) {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false); // To track editing state
  const [editUserId, setEditUserId] = useState(null); // ID of the user being edited

  useEffect(() => {
    // Assuming `id` is needed to fetch specific user data
    fetch(`/api/users/get/getUser?id=${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error('Error fetching user:', err));
  }, [id]);

  if (!user) return <p>Loading...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    // Send a POST request to create the user
    const res = await fetch('/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData), // Use formData directly
      
      
    });
    console.log('asdfasdf');
    if (res.ok) {
      const data = await res.json();
      setMessage(`User created: ${data.name} (${data.email})`);
    } else {
      setMessage('Failed to create user');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Update formData state
  };

  const handleDelete = async (e) => {
    const userId = e.target.value; // Get the user ID from the button's value
    console.log("Deleting user with ID:", userId);
  
    try {
      // Send DELETE request to your API
      const res = await fetch(`/api/users/delete/${userId}`, {
        method: 'DELETE',
      });
  
      if (res.ok) {
        // Remove the user from the UI by filtering it out
        if (Array.isArray(user)) {
          setUser(user.filter((data) => data.id !== userId));
        } else {
          setUser(null); // If it's a single user, set user to null
        }
        console.log("User deleted successfully");
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (userData) => {
    setFormData({
      name: userData.name,
      email: userData.email,
    });
    setEditUserId(userData.id); // Store the user ID being edited
    setIsEditing(true); // Show the edit form
  };
  
  // Handle the update submission
  const handleUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch(`/api/users/${editUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (res.ok) {
        const updatedUser = await res.json();
  
        // Update the user data in the UI
        if (Array.isArray(user)) {
          setUser(user.map((u) => (u.id === editUserId ? updatedUser : u)));
        } else {
          setUser(updatedUser); // Update the single user
        }
        
        setIsEditing(false); // Hide the edit form
        setEditUserId(null); // Reset edit user ID
        console.log('User updated successfully');
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  

  return (
    <div>
        <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Please enter your name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Please enter your email"
          value={formData.email}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>

      {/* Rendering user details */}
      {Array.isArray(user) ? (
      user.map((data) => (
        <div id={data.id} key={data.id}>
          <h1>{data.name}</h1>
          <h4>{data.email}</h4>
          <button onClick={() => handleEdit(data)}>Edit</button>
          <button value={data.id} onClick={handleDelete}>Delete</button>
        </div>
      ))
    ) : (
      <div id={user.id} key={user.id}>
        <h1>{user.name}</h1>
        <h4>{user.email}</h4>
        <button onClick={() => handleEdit(user)}>Edit</button>
        <button value={user.id} onClick={handleDelete}>Delete</button>
      </div>
    )}

// Edit Form for Updating User
{isEditing && (
  <form onSubmit={handleUpdate}>
    <input
      type="text"
      name="name"
      placeholder="Enter new name"
      value={formData.name}
      onChange={handleChange}
    />
    <input
      type="email"
      name="email"
      placeholder="Enter new email"
      value={formData.email}
      onChange={handleChange}
    />
    <button type="submit">Update</button>
    <button type="button" onClick={() => setIsEditing(false)}>
      Cancel
    </button>
  </form>
)}
    </div>
  );
}
