import { useEffect, useState } from 'react';

export default function UserDetails({ id }) {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch the user details by ID
    fetch(`/api/users/get/getUser?id=${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error('Error fetching user:', err));
  }, [id]);

  if (!user) return <p>Loading...</p>;

  // Handle form submission for updating user
  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      setUser(updatedUser);
      setMessage('User updated successfully!');
      setIsEditing(false);
    } else {
      setMessage('Failed to update user');
    }
  };

  // Handle user deletion
  const handleDelete = async () => {
    const res = await fetch(`/api/users/delete/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setMessage('User deleted successfully');
      setUser(null);
    } else {
      setMessage('Failed to delete user');
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      {message && <p>{message}</p>}

      {/* Display user details */}
      {user && !isEditing && (
        <div>
          <h1>{user.name}</h1>
          <h4>{user.email}</h4>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}

      {/* Editing form */}
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

      {/* If the user is deleted */}
      {!user && <p>User has been deleted.</p>}
    </div>
  );
}
