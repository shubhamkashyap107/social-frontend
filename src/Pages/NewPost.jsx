import { useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const NewPost = () => {
  const [caption, setCaption] = useState("");
  const [postImg, setPostImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const nav = useNavigate();

  async function createPost() {
    if (!postImg) {
      toast.error("Image is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", postImg);
      formData.append("upload_preset", "Socially");

      const cloudinaryRes = await axios.post(
        "https://api.cloudinary.com/v1_1/derddgaed/image/upload",
        formData
      );

      const imageUrl = cloudinaryRes.data.secure_url;
      console.log(imageUrl);

      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/post/create",
        {
          caption,
          imageUrl,
        },
        {
          withCredentials: true,
        }
      );

      console.log(res.data);

      toast.success("Post created successfully");

      setCaption("");
      setPostImg(null);
      setPreviewUrl("");

      nav("/profile");
    } catch (error) {
      console.log(error);
      toast.error("Post create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="w-3xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Create New Post
              </h1>

              <p className="text-gray-500 mb-6">
                Share something new with your followers.
              </p>

              <input
                id="postImg"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (!file) return;

                  setPostImg(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }}
              />

              <label
                htmlFor="postImg"
                className="w-full h-[300px] border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition overflow-hidden"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Post Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <i className="fa-regular fa-image text-6xl text-gray-400"></i>

                    <h2 className="text-lg font-semibold text-gray-700 mt-4">
                      Upload Image
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Click here to select an image
                    </p>

                    <button
                      type="button"
                      className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                    >
                      Select Image
                    </button>
                  </div>
                )}
              </label>

              {/* Caption */}
              <div className="mt-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Caption
                </label>

                <textarea
                  value={caption}
                  onChange={(e) => {
                    setCaption(e.target.value);
                  }}
                  rows={5}
                  maxLength={300}
                  placeholder="Write a caption..."
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none resize-none focus:border-indigo-500 text-gray-700"
                ></textarea>

                <p className="text-right text-sm text-gray-400 mt-1">
                  {caption.length}/300
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    nav("/home");
                  }}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    createPost();
                  }}
                  disabled={loading}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                >
                  {loading ? "Creating..." : "Create Post"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewPost;