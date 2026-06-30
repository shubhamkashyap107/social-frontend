import { useState } from "react"
import { useSelector } from "react-redux"
import Navbar from "../Components/Navbar"
import Sidebar from "../Components/Sidebar"

const Chats = () => {
  const currentUser = useSelector((store) => store.user)
  const following = currentUser?.following || []

  const [selectedUser, setSelectedUser] = useState(null)

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex bg-gradient-to-br from-indigo-950 via-slate-900 to-black overflow-hidden">
          {/* Left: following users list */}
          <div className="w-full sm:w-80 border-r border-white/10 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h1 className="text-white text-lg font-semibold">Chats</h1>
            </div>

            <div className="flex-1 overflow-y-auto">
              {following.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <i className="fa-solid fa-comments text-3xl text-gray-600 mb-3"></i>
                  <p className="text-gray-400 text-sm">
                    You're not following anyone yet.
                  </p>
                </div>
              ) : (
                following.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 transition text-left
                      hover:bg-white/5
                      ${selectedUser?._id === user._id ? "bg-white/10" : ""}
                    `}
                  >
                    <img
                      src={
                        user.displayPicture ||
                        "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                      }
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        @{user.username}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right: selected user's profile / placeholder */}
          <div className="hidden sm:flex flex-1 items-center justify-center">
            {!selectedUser ? (
              <div className="text-center">
                <i className="fa-regular fa-comment-dots text-5xl text-gray-700 mb-4 block"></i>
                <p className="text-gray-400">
                  Select someone to view their profile
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center px-8">
                <img
                  src={
                    selectedUser.displayPicture ||
                    "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                  }
                  alt={selectedUser.username}
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-xl mb-5"
                />
                <h2 className="text-2xl font-bold text-white">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h2>
                <span className="text-indigo-400 text-lg">
                  @{selectedUser.username}
                </span>

                <p className="text-gray-500 text-sm mt-6">
                  Chat messages will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chats