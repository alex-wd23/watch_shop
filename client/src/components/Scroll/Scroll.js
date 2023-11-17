import React, {component} from "react";

const Scroll = (props) => {
	return (
		<div style={{ overflowY: 'scroll',  height:'100vh'}}>
		{props.children}
		</div>
	);
};

export default Scroll