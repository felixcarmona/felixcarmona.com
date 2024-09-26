"use client";
import React, { useEffect } from 'react';

const MailchimpForm = () => {
    useEffect(() => {
        const link = document.createElement('link');
        link.href = "//cdn-images.mailchimp.com/embedcode/classic-061523.css";
        link.rel = "stylesheet";
        link.type = "text/css";
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = "//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js";
        script.type = "text/javascript";
        document.body.appendChild(script);

        script.onload = function () {
            window.fnames = new Array();
            window.ftypes = new Array();
            window.fnames[0] = 'EMAIL'; window.ftypes[0] = 'email';
            window.$mcj = jQuery.noConflict(true);
        };

        return () => {
            document.head.removeChild(link);
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div id="mc_embed_signup">
            <form action="https://felixcarmona.us12.list-manage.com/subscribe/post?u=a532b6dc5217eb06b673499cf&amp;id=7b04358b59&amp;f_id=003864e9f0" method="post" style={{'margin': '0'}} id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank">
                <div id="mc_embed_signup_scroll">
                    <h2>Get updates on new posts</h2>
                    <div className="mc-field-group" style={{'width': '100%'}}>
                        <label htmlFor="mce-EMAIL">Email Address <span className="asterisk">*</span></label>
                        <input type="email" name="EMAIL" className="required email" id="mce-EMAIL" required />
                    </div>
                    <div id="mce-responses" className="clear foot">
                        <div className="response" id="mce-error-response" style={{ display: 'none' }}></div>
                        <div className="response" id="mce-success-response" style={{ display: 'none' }}></div>
                    </div>
                    <div aria-hidden="true" style={{ position: 'absolute', left: '-5000px' }}>
                        <input type="text" name="b_a532b6dc5217eb06b673499cf_7b04358b59" tabIndex="-1" defaultValue="" />
                    </div>
                    <div className="optionalParent">
                        <div className="clear foot">
                            <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default MailchimpForm;
