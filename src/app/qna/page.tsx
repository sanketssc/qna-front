"use client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:8000/");
type Question = {
  ques: String;
  username: String;
  id: Number;
  upvotes: Number;
  upvoters: String[];
  answered: Boolean;
};

const Page = () => {
  const [ques, setQues] = useState("");
  const [username, setUsername] = useState("");
  const [questions, setQuestions] = useState<Array<Question>>();

  useEffect(() => {
    console.log(socket);
    socket.on("welcome", (data) => {
      console.log(data);
    });
    socket.on("questions", (data) => {
      setQuestions(data);
      console.log("x");
    });
  }, []);

  const handleForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (ques.trim() === "") return;

    socket.emit("ques", { ques, username });
    // setQues("");
  };

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <div className="flex flex-col w-full sm:w-4/5 mx-auto  gap-x-10 gap-y-5 max-h-[80vh] h-full overflow-y-auto p-2">
        {questions &&
          questions.map((que, idx) => {
            const disabled = que.upvoters.includes(socket.id);
            return (
              <div
                className=" border flex w-full sm:w-4/5 mx-auto  justify-between p-5"
                key={idx}
              >
                <div className="flex flex-col gap-2 relative w-full">
                  <div className=" flex  w-full">
                    <div className="text-xl font-bold self-start">
                      {que.username}
                    </div>
                    <div className="absolute bg-neutral-200 text-black px-2 py-1 right-2 sm:right-10">
                      {que.upvoters.length}
                    </div>
                  </div>
                  <div className="text-lg">Q: {que.ques}</div>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <button
                    disabled={disabled}
                    className="bg-blue-500 px-4 py-2 text-black disabled:bg-gray-600 border"
                    onClick={() => {
                      socket.emit("upvote", { id: que.id });
                    }}
                  >
                    Up
                  </button>
                </div>
              </div>
            );
          })}
      </div>
      <form
        className="flex justify-between sm:w-2/3 mx-auto mb-8"
        onSubmit={handleForm}
      >
        <div className=" flex flex-col w-4/5 mx-auto">
          User Name
          <input
            className="bg-black focus:outline-none border p-2"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          Question
          <input
            className="bg-black focus:outline-none border p-2"
            type="text"
            value={ques}
            onChange={(e) => setQues(e.target.value)}
          />
        </div>
        <input
          className="border px-8 py-10 m-3 rounded-xl self-center"
          type="submit"
        />
      </form>
    </div>
  );
};

export default Page;
