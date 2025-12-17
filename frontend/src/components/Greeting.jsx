import React, { useEffect, useState } from "react";

function Greeting() {
  const [greeting, setGreeting] = useState("");
  const [emoji, setEmoji] = useState("");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
      setEmoji("🌞");
    } else if (hours < 18) {
      setGreeting("Good Afternoon");
      setEmoji("🌤️");
    } else {
      setGreeting("Good Evening");
      setEmoji("🌙");
    }
  }, []);

  return (
    <div className="text-lg font-semibold text-emerald-400 mt-2 text-center animate-fadeIn">
      {greeting}, <span className="text-white">Subh</span> {emoji}
    </div>
  );
}

export default Greeting;
