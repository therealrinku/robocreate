import { useState } from "react";
import { useLogin } from "react-facebook";
import { FaFacebook } from "react-icons/fa";

export default function FbHandler() {
  const { login, status, isLoading, error } = useLogin();
  const [resp, setResp] = useState();

  const [postText, setPostText] = useState("");

  async function handleLogin() {
    try {
      const response = await login({
        scope: "pages_manage_posts",
        // scope: `pages_manage_engagement,
        // pages_manage_posts,
        // pages_read_engagement,
        // pages_read_user_engagement`,
      });

      //@ts-expect-error
      setResp(response.authResponse);
      console.log(response, "RESPONSE____LOG");
    } catch (error: any) {
      console.log(error.message);
    }
  }

  function sendREQ() {
    //@ts-expect-error
    const apiUrl = `https://graph.facebook.com/v19.0/${resp.userID}/feed`;
    // const futureDate = new Date("2024-02-15T12:00:00"); // Replace with your desired future date and time
    // const futureTimestamp = Math.floor(futureDate.getTime() / 1000);

    const postData = {
      message: postText,
      // link: "your_url",
      //publish immediately
      published: true,
      // scheduled_publish_time: futureTimestamp,
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //@ts-expect-error
        Authorization: `Bearer ${resp.accessToken}`,
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "POST_SUCCESS_RESPONSE");
        alert("Posted!! Wohoo!!");
      })
      .catch((error) => {
        console.log(error, "POST_FAIL");
        alert("Something went horribly wrong here!");
      });
  }

  if (resp) {
    return (
      <main className="flex flex-col gap-3">
        <p>Horray! You are In, let's schedule your first post!!</p>
        <div className="flex items-center gap-3">
          <input
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="border bg-inherit p-2 outline-none"
          />
          <button onClick={sendREQ}>POST</button>
        </div>
      </main>
    );
  }

  return (
    <button onClick={handleLogin} className="mt-5 flex items-center gap-2 text-sm  py-2 px-5 hover:text-red-200">
      <FaFacebook />
      Connect Facebook Page
    </button>
  );
}
