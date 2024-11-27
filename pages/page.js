import { useEffect, useState } from "react";

export default function UserDetails() {
  const [users, setUsers] = useState([]); // Manage the list of users
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false); // To track editing state
  const [editUserId, setEditUserId] = useState(null); // ID of the user being edited

  // Fetch users only once when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users/get/getUser");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const newUser = await res.json();
        setUsers((prevUsers) => [...prevUsers, newUser]); // Add to the local state
        setMessage(`User created: ${newUser.name}`);
        setFormData({ name: "", email: "" }); // Clear the form
      } else {
        setMessage("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const res = await fetch(`/api/users/delete/${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        console.log("User deleted successfully");
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email });
    setEditUserId(user.id);
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/${editUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === editUserId ? updatedUser : user))
        );
        setIsEditing(false);
        setEditUserId(null);
        console.log("User updated successfully");
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <button type="submit">{isEditing ? "Update" : "Submit"}</button>
        {isEditing && (
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        )}
      </form>

      <div>
        {users.map((user) => (
          <div key={user.id}>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </div>
        ))}
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}