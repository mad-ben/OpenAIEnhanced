import './App.css';
import './normal.css';
import { useState, useEffect } from 'react';
import { ChatMessageComp } from './components';

function App() {

  //use effect as soon as app runs
  useEffect(() => {
    getEngines();
  }, [])

  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("text-davinci-003");
  const [chatLog, setChatLog] = useState([]);

  //Clear chats

function clearChat(){
  setChatLog([]);
}

function getEngines(){
  fetch("http://localhost:3080/models")
  .then(res => res.json())
  .then(data => {
    console.log(data.models)
    setModels(data.models)
  })
}

  async function handleSubmit(e){
    e.preventDefault();
    let chatLogNew = [...chatLog, {user: "me", message: `${input}`}]
    setInput("");
    setChatLog(chatLogNew)
    //console.log("submit")

    const messages = chatLogNew.map((message) => message.message).join("\n")
    const response = await fetch ("http://localhost:3080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: messages,
        currentModel,
      })
    });

    const data = await response.json();
    await setChatLog([...chatLogNew, {user: "gpt", message: `${data.message}`}])
    console.log(data.message);
  }

  return (
    <div className="App">
      <aside className="sidemenu">

        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
        
       
        <p className="advanced-settings">
          Advanced Settings
        </p>

        <div className="models">
          <p className="model-text">
            OpenAI Model List
          </p>
          <select onChange={(e) => {
              setCurrentModel(e.target.value)
            }} className="model-select">
              {models.map((model,index) => (
                <option key={model.id} value={model.id}>{model.id}</option>
              ))}
          </select>
        </div>      
      </aside>


      {/** Division between sidemenu and main chat */}


      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessageComp key={index} message={message}/>
          ))}
        </div>

        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              rows="1"
              value={input}
              onChange={(e)=> setInput(e.target.value)}
              className="chat-input-textarea"
              placeholder="Type your question..."
            >
            </input>
          </form>          
        </div>
      </section>
    </div>
  );
}

export default App;
