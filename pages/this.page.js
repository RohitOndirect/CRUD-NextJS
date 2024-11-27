import { useEffect, useState } from 'react';

export default function UserDetails({ id }) {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch user data based on ID (assuming `id` is passed as a prop)
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

  return (
    <div>
      {/* Form to submit name and email */}
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

      {/* Show message after form submission */}
      {message && <p>{message}</p>}

      {/* Rendering user details */}
      {user && !Array.isArray(user) && (
        <div id={user.id} key={user.id}>
          <h1>{user.name}</h1>
          <h4>{user.email}</h4>
        </div>
      )}
    </div>
  );
}
