import "../styles/pagebar.css"

const PageBar = ({ title, children }) => {
    return (
        <div className="page-bar">
            <div className="page-bar-title">
                <h2>{ title }</h2>
            </div>
            <div className="page-bar-options">
                { children }  
            </div>
        </div>
    );
};

export default PageBar;