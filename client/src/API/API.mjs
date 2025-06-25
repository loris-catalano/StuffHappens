const SERVER_URL = "http://localhost:3001";

const login = async (credentials) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    return data.user;
  } catch (error) {
    throw error;
  }
}

const logout = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/v1/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    return data.message;
  } catch (error) {
    throw error;
  }
}

const getUser = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/v1/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return null; 
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    throw error;
  }
}

const getUserHistory = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/v1/user/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

const startGame = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/v1/game/startGame`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

const checkPosition = async (cardPositionId) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/v1/game/checkPosition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ cardPositionId }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

const newRound = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/v1/game/newRound`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

const API = {
  login,
  logout,
  getUser,
  getUserHistory,
  startGame,
  checkPosition,
  newRound
};

export default API;