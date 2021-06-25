import React from 'react';
import styled from 'styled-components/macro';

let Chat = styled.div({
  borderBottom: '1px solid',
  padding: '0.5em',
  cursor: 'pointer',
});

export function Chats(props) {
  return <ul>
    {props.chats.map(chat => {
      return <Chat key={chat.id} onClick={() => props.onSelectChat(chat.id)}>
        {chat.title} ({chat.id})
      </Chat>
    })}
  </ul>
}