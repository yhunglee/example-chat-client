import React from "react";
type MsgProps = {
  name: string;
  message: string;
};
export const ChatMessage: React.FC<MsgProps> = ({ name, message }) => (
  <p>
    <strong>{name}</strong> <em>{message}</em>
  </p>
);
