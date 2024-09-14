"use client";

import { useEffect } from 'react';

const Comments = () => {
    useEffect(() => {
        const commentsDiv = document.getElementById('comments');
        if (!commentsDiv) {
            return;
        }

        const existingScript = document.querySelector('script[src="https://utteranc.es/client.js"]');
        if (existingScript) {
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://utteranc.es/client.js';
        script.async = true;
        script.setAttribute('repo', 'felixcarmona/felixcarmona.github.io');
        script.setAttribute('issue-term', 'pathname');
        script.setAttribute('theme', 'github-light');
        script.setAttribute('crossorigin', 'anonymous');

        commentsDiv.appendChild(script);
    }, []);

    return <div id="comments" />;
};

export default Comments;
