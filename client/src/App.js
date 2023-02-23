import "./App.css";
import "./normal.css";
import { useState, useEffect } from "react";
import { ChatMessageComp } from "./components";

function App() {
  //use effect as soon as app runs
  useEffect(() => {
    getEngines();
  }, []);

  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("text-davinci-003");
  const [responceLeng, setResponceLeng] = useState("100");
  const [temp, setTemp] = useState("0");
  const [chatLog, setChatLog] = useState([]);

  //Clear chats

  function clearChat() {
    setChatLog([]);
  }

  function resetDefaults() {
    setCurrentModel("text-davinci-003");
    setResponceLeng("100");
    setTemp("0.5");
  }

  function getEngines() {
    fetch("http://localhost:3080/models")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.models);
        setModels(data.models);
      });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "me", message: `${input}` }];
    setInput("");
    setChatLog(chatLogNew);
    //console.log("submit")

    const messages = chatLogNew.map((message) => message.message).join("\n");
    const response = await fetch("http://localhost:3080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages,
        currentModel,
        responceLeng,
        temp,
      }),
    });

    const data = await response.json();
    await setChatLog([
      ...chatLogNew,
      { user: "gpt", message: `${data.message}` },
    ]);
    console.log(data.message);
  }

  return (
    <div className="App">
      <aside className="sidemenu">
        <h2>JERICHO Enhanced Chat</h2>
        <hr class="rounded"></hr>
        <div>
          <div className="side-menu-button" onClick={clearChat}>
            New Chat
          </div>
          <div className="side-menu-button" onClick={resetDefaults}>
            Reset Values
          </div>
          <a href="https://jericho-project.vercel.app/">
            <div className="side-menu-button">Home</div>
          </a>
        </div>
        <div className="advanced-menu">
          <hr class="rounded"></hr>

          <p className="advanced-settings">Advanced Settings</p>

          <div>
            <p className="model-text">OpenAI Model List</p>
            <p className="instruction-text">
              The OpenAI API is powered by a family of models with different
              capabilities.
            </p>
            <select
              onChange={(e) => {
                setCurrentModel(e.target.value);
              }}
              className="model-select"
            >
              {models.map((model, index) => (
                <option key={model.id} value={model.id}>
                  {model.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="model-text">Response length</p>

            <input
              type="text"
              placeholder="100"
              className="number-select"
              onChange={(e) => {
                setResponceLeng(e.target.value);
              }}
            ></input>

            <p className="desc-text">
              Insert maximum amount of words to display <br /> (Min 1 - Max
              2000)
            </p>
          </div>

          <div>
            <p className="model-text">Temperature</p>
            <p className="instruction-text">
              Randomness of the response. 0 means deterministic and repetitive
              while 1 is random and creative.
            </p>

            <input
              type="text"
              placeholder="0.5"
              className="number-select"
              onChange={(e) => {
                setTemp(e.target.value);
              }}
            ></input>
            <p className="desc-text">(Min 0 - Max 1)</p>
            <hr class="rounded"></hr>
          </div>
        </div>
      </aside>

      {/** Division between sidemenu and main chat */}

      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessageComp key={index} message={message} />
          ))}
        </div>

        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="chat-input-textarea"
              placeholder="Type your question..."
            ></input>
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;
