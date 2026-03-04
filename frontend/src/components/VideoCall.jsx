import React, { useEffect, useRef } from 'react';

const VideoCall = ({ roomName, userName }) => {
    const jitsiContainerRef = useRef(null);

    useEffect(() => {
        // Load the Jitsi External API script dynamically
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const domain = 'meet.jit.si';
            const options = {
                roomName: `MedCare-Consult-${roomName}`,
                width: '100%',
                height: '100%',
                parentNode: jitsiContainerRef.current,
                userInfo: {
                    displayName: userName
                },
                configOverwrite: {
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                    disableThirdPartyRequests: true,
                    prejoinPageEnabled: false, // Skips the Jitsi prejoin screen for a cleaner feel
                },
                interfaceConfigOverwrite: {
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                        'security'
                    ],
                }
            };

            const api = new window.JitsiMeetExternalAPI(domain, options);

            // Cleanup when component unmounts
            return () => api.dispose();
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [roomName, userName]);

    return (
        <div 
            ref={jitsiContainerRef} 
            className="w-full h-full bg-slate-900"
        />
    );
};

export default VideoCall;