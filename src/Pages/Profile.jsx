import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addUserData } from "../Utils/UserSlice";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const Profile = () => {
  const {
    username,
    firstName,
    lastName,
    displayPicture,
    bio,
    followers = [],
    following = [],
    posts = [],
  } = useSelector((store) => store.user);

  const [myPosts, setMyPosts] = useState([]);
  const [uploadedImg, setUploadedImg] = useState(null);

  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(() => {
    async function getMyPosts() {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/post/my-posts",
          {
            withCredentials: true,
          }
        );

        setMyPosts(res.data.posts || []);
      } catch (error) {
        console.log(error);
      }
    }

    getMyPosts();
  }, []);

  useEffect(() => {
    if (!uploadedImg) return;

    const formData = new FormData();
    formData.append("file", uploadedImg);
    formData.append("upload_preset", "Socially");

    async function uploadImg() {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/derddgaed/image/upload",
        formData
      );

      const res2 = await axios.patch(
        import.meta.env.VITE_BACKEND_URL + "/profile/edit/dp",
        {
          displayPicture: res.data.url,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(addUserData(res2.data.data));
    }

    uploadImg();
  }, [uploadedImg, dispatch]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <img
                  onClick={() => {
                    document.getElementById("dp").click();
                  }}
                  src={
                    displayPicture ||
                    "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                  }
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover border-4 border-gray-200 shadow cursor-pointer"
                />

                <input
                  onChange={(e) => {
                    setUploadedImg(e.target.files[0]);
                  }}
                  id="dp"
                  type="file"
                  className="hidden"
                />

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {firstName} {lastName}
                  </h2>

                  <span className="text-gray-500 text-lg">@{username}</span>

                  <p className="text-gray-700 mt-4">
                    {bio || "No bio added yet."}
                  </p>
                </div>

                <div className="flex flex-col gap-3 self-start md:self-center w-full md:w-auto">
                  <button
                    onClick={() => {
                      nav("/profile/edit");
                    }}
                    className="px-5 py-2.5 bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-800 rounded-xl transition"
                  >
                    <i className="fa-regular fa-pen-to-square mr-2"></i>
                    Edit Profile
                  </button>

                  <button
                    onClick={() => {
                      nav("/post/new");
                    }}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition"
                  >
                    <i className="fa-solid fa-plus mr-2"></i>
                    Add Post
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-10">
                <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {followers.length || 0}
                  </h2>
                  <p className="text-gray-500">Followers</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {following.length || 0}
                  </h2>
                  <p className="text-gray-500">Following</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {myPosts.length || 0}
                  </h2>
                  <p className="text-gray-500">Posts</p>
                </div>
              </div>

              {/* Posts */}
              <div className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Posts
                </h2>

                {myPosts.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
                    <h1 className="text-gray-500 text-xl">
                      No posts yet...
                    </h1>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myPosts.map((post) => {
                      return (
                        <div
                          key={post._id}
                          className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
                        >
                          <img
                            src={post.imageUrl}
                            alt="Post"
                            className="w-full h-64 object-cover"
                          />

                          <div className="p-4">
                            <p className="text-gray-800">{post.caption}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;