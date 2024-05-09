import React from "react";

const Button = ({ text, onClick }) => {
    return (
        <button onClick={onClick} style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
            {text}
        </button>
    );
};

export default Button;