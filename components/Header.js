import React from 'react';
import { Menu } from 'semantic-ui-react';
import Cookies from 'js-cookie';

export default props => {
	return (
		<div className="header">
			<style jsx>{`
				.header {
					z-index: 10;
				}
			`}</style>
			<Menu secondary style={{ maxHeight: '50px' }}>
				<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
				<Menu.Item
					name="Blockchain - Voting"
					style={{ color: 'rgb(98, 126, 234)',verticalAlign: 'middle', fontSize: '40px', paddingLeft: '30%', paddingTop: '4%' }}
				/>
				<Menu.Menu position="right">
					<Menu.Item icon="user" />
					<Menu.Item style={{ color: 'rgb(98, 126, 234)',paddingRight: '10px' }}>
						{Cookies.get('company_email') || Cookies.get('voter_email')}
					</Menu.Item>
				</Menu.Menu>
			</Menu>
			<hr />
			{props.children}
		</div>
	);
};
