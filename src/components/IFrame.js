import React, {  useEffect, useRef } from "react";
import Frame from 'react-frame-component';
function IFrame(props) {
    const iframeRef = useRef();
    useEffect(() => {
        iframeRef.current.focus()
    }, [])
    return (
        <Frame height={props.height} width={props.width} ref={iframeRef}  >         
            <iframe src={props.src} height={props.height} width={props.width} frameborder={props.frameborder} title={props.title} allowfullscreen={props.allowfullscreen} />
        </Frame>
    )

};
export default IFrame;