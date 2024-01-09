import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/404.css";

const NotFound = () => {
  const navigate = useNavigate();
  const codeMarkup = {
    __html: `
        <span class="green">&lt;!</span><span>DOCTYPE html</span><span class="green">&gt;</span>
        <span class="orange">&lt;html&gt;</span>
                <span class="orange">&lt;style&gt;</span>
             * {
                                        <span class="green">everything</span>:<span class="blue">awesome</span>;
        }
                 <span class="orange">&lt;/style&gt;</span>
         <span class="orange">&lt;body&gt;</span> 
                                    ERROR 404!
                                        PAGE NOT FOUND!
                                        <span class="comment">&lt;!--The page you are looking for, 
                                                is not where you think it is.--&gt;
                        </span>
         <span class="orange"></span> 
                                    
        
        
        </div>
        <br />
        <span class="info">
        <br />
        
        <span class="orange">&nbsp;&lt;/body&gt;</span>
        
        <br/>
                    <span class="orange">&lt;/html&gt;</span>
                </code></pre>
            </div>
        </div>
        
        
        </span>
                `,
  };

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="parent">
      <div className="child">
        <div className="relative py-12 px-7 " onClick={handleClick}>
          <img
            className="h-22 w-auto "
            src="https://cdn.discordapp.com/attachments/1185665614086426674/1194230093527130162/WebDesk__2___1_-removebg-preview.png?ex=65af9872&is=659d2372&hm=b5514c628bb56612b2ad214dcb0efa6b97cb88f5f264d187f528d993b121eb1d&"
            alt=""
          />
        </div>
        <div className="error">
          <div className="wrap">
            <div className="404">
              <pre>
                <code dangerouslySetInnerHTML={codeMarkup}></code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
