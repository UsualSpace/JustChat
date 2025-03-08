import { useState } from "react"

const PopUp = ({ button_label, children }) => {
    const [is_open, SetIsOpen] = useState(false);

    return (
        <>
            <button onClick={() => SetIsOpen(true)}>{button_label}</button>

            {is_open && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <div className="popup-close">
                            <button className="btn-destructive" onClick={() => SetIsOpen(false)}>Close</button>
                        </div>
                        { children }
                    </div>
                </div>
            )}
        </>
    );
};

export default PopUp;