export default function Login() {
  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="flex h-screen justify-center items-center bg-black">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm text-center border border-gray-100">
        <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
        👋
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back!</h1>
        <p className="text-gray-500 mb-8">Sign in to manage your notes</p>
        
        <button
          onClick={handleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg shadow-md transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
        >
          <span>Login with Google</span>
        </button>
      </div>
    </div>
  );
}