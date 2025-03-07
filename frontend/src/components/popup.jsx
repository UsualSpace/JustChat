import { useState } from "react"

const PopUp = ({ button_label, children }) => {
    const [is_open, SetIsOpen] = useState(false);

    return (
        <div>
            <button onClick={() => SetIsOpen(true)}>{button_label}</button>

            {is_open && (
                <div className="popup-overlay" onClick={() => SetIsOpen(false)}>
                    <div className="popup-content" onClick={(event) => event.stopPropagation()}>
                        <div className="popup-close">
                            <button className="btn-destructive" onClick={() => SetIsOpen(false)}></button>
                        </div>
                        { children }
                    </div>
                </div>
            )}
        </div>
    );
};

export default PopUp;