const PageBar = ({ title, children }) => {
    return (
        <div className="page-bar">
            <div className="page-bar-title">
                <h1>{ title }</h1>
            </div>
            <div className="page-bar-options">
                { children }  
            </div>
        </div>
    );
};

export default PageBar;