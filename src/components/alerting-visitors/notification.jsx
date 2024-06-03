import React from 'react';
import Typed from 'typed.js';

export function Notification() {
  const el = React.useRef(null);

  React.useEffect(() => {
    const typed = new Typed(el.current, {
        strings: ['Currently, this page is under maintenance. Services for this page are not available now. Thank you!'],
        typeSpeed: 50,
        loop: true,
        backSpeed: 40,
        startDelay: 100,
        backDelay: 2500,
        showCursor: false,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div style={{height:"20px"}}>
      <span style={{color:"red",display:"flex",justifyContent:"center"}}ref={el}></span>
    </div>
  );
}
