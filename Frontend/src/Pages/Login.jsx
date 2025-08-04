export default function Login() {
  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-br  bg-black">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back!</h1>
        <p className="text-gray-500 mb-6">Sign in to manage your notes</p>
        <button
          onClick={handleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}
