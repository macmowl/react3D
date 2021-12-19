import React from 'react'


export default function ColorSelector(props) {
	let list = '';
	
	for(let i = 0; i < props.colors.length;i++) {
		list += `<li style="background-color: ${COLORS[i].stripes}" onClick=${props.getColor(i)}></li>`;
	}
	
	return (
		<div className="color">
			<ul className="color-list" dangerouslySetInnerHTML={{__html: list}}>
			</ul>
		</div>
	)
}
