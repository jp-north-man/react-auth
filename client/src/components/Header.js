import React, { useContext } from "react";
import { AuthContext } from "../AuthProvider";

const Header = () => {
  const { auth, logout } = useContext(AuthContext);

  console.log('Header rendering', auth);

  const handleLoginClick = async () => {
    console.log('handleLoginClick', auth); 
    if (auth.isLoggedIn) {
      try {
        const response = await fetch('http://localhost:5000/logout', {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('ログアウトに失敗しました。');
        }

        logout();
      } catch (error) {
        console.error(error.message);
      }
    } else {
      window.location.href = '/login';
    }
  };

  const handleSignUpClick = () => {
    window.location.href = '/signup';
  };

  return (
    <header className="bg-white bg-opacity-50 text-black h-14 px-4 border-b border-gray-200 flex items-center justify-between">
      <h1>Header</h1>
      <div>
        {!auth.isLoggedIn && (
          <button onClick={handleSignUpClick} className="px-4 py-2 rounded bg-green-500 text-white mr-2">
            サインイン
          </button>
        )}
        <button onClick={handleLoginClick} className="px-4 py-2 rounded bg-blue-500 text-white">
          {auth.isLoggedIn ? "ログアウト" : "ログイン"}
        </button>
      </div>
      
    </header>
  );
};

export default Header;