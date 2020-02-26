import React from "react";
import ChatInput from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

const URL = "ws://localhost:3030";
type MyState = {
  name: string;
  messages: MessageType[];
};
type MessageType = {
  name: string;
  message: string;
};
class Chat extends React.Component {
  state: MyState = {
    name: "Bob",
    messages: []
  };

  ws = new WebSocket(URL);

  componentDidMount() {
    this.ws.onopen = () => {
      // on conneting, do nothing but log it to the console
      console.log("connected");
    };

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data);
      this.addMessage(message);
    };

    this.ws.onclose = () => {
      console.log("disconnected");
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL)
      });
    };
  }

  addMessage = (message: object) =>
    this.setState((state: MyState) => ({
      messages: [message, ...state.messages]
    }));

  submitMessage = (messageString: string) => {
    // on submitting the ChatInput form, send the message, add it to the list and reset the input
    const message = { name: this.state.name, message: messageString };
    this.ws.send(JSON.stringify(message));
    this.addMessage(message);
  };

  render() {
    return (
      <div>
        <label htmlFor="name">
          Name:&nbsp;
          <input
            type="text"
            id={"name"}
            placeholder={"Enter your name..."}
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
          />
        </label>

        <ChatInput
          ws={this.ws}
          onSubmitMessage={(messageString: string) =>
            this.submitMessage(messageString)
          }
        />
        {this.state.messages.map((message: MessageType, index) => (
          <ChatMessage
            key={index}
            message={message.message}
            name={message.name}
          />
        ))}
      </div>
    );
  }
}

export default Chat;
