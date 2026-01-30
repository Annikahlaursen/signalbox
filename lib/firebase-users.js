// Helper functions for user management in Firebase
export async function getUserByEmail(email) {
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/users.json?orderBy="mail"&equalTo="${email}"`;

  const response = await fetch(url);
  const userData = await response.json();

  if (Object.keys(userData).length === 0) return null;

  const user = { id: Object.keys(userData)[0], ...Object.values(userData)[0] };
  return user;
}

export async function createUser(userData) {
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/users.json`;
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      mail: userData.email,
      name: userData.name || "",
      image: userData.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.id}`,
      title: userData.title || "",
      createdAt: new Date().toISOString()
    })
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  const data = await response.json();
  return data.name; // Firebase returns {name: "generated-id"}
}

export async function updateUser(userId, userData) {
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/users/${userId}.json`;
  const response = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return await response.json();
}
