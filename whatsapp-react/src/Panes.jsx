import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/macro';

export let Panes = styled.main({
  display: 'flex',
  width: '100vw',
  height: '100vh'
});

let Header = styled.header({
  backgroundColor: 'lightgray',
  padding: '0.5em'
});

let Body = styled.div({
  overflow: 'auto'
});

let Container = styled.div(props => ({
  display: 'flex',
  flexDirection: 'column',
  ...props
}));

let Footer = styled.div({});

export function Pane({width, minWidth, header, body, footer, lastScroll}) {

  let ref = useRef(null);

  useEffect(() => {
    ref.current.scrollTo(0, ref.current.scrollHeight);
  }, [lastScroll])

  return <Container {...{width, minWidth}}>
    <Header>{header}</Header>
    <Body ref={ref}>{body}</Body>
    {footer && <Footer>{footer}</Footer>}
  </Container>
}