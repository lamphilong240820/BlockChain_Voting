import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from '../routes';
import {
	Button,
	Container,
	Divider,
	Grid,
	Header,
	Icon,
	Image,
	List,
	Menu,
	Responsive,
	Segment,
	Sidebar,
	Visibility,
} from 'semantic-ui-react';
import '../static/hometest.css';
import { Helmet } from 'react-helmet';
const HomepageHeading = ({ mobile }) => (
	<Container text className="cont">
		<Header
			as="h1"
			content="Hệ thống bầu cử dựa trên nền tảng Blockchain"
			inverted
			style={{
				fontSize: mobile ? '2em' : '3em',
				fontWeight: 'normal',
				marginBottom: 0,
				marginTop: mobile ? '1.5em' : '2em',
				color: 'black',
			}}
		/>
		<Header
			as="h4"
			content="Make your vote count!"
			inverted
			style={{
				fontSize: mobile ? '1.5em' : '1.7em',
				fontWeight: 'normal',
				marginTop: mobile ? '0.5em' : '1.5em',
				color: 'grey',
			}}
		/>
		<div style={{ float: 'left', marginTop: '10%' }}>
			<Header as="h4" style={{ color: 'grey' }}>
				Đăng ký/ Đăng nhập dành cho cơ quan
			</Header>
			<Link route="./company_login">
				<Button primary size="huge" style={{ color: 'white', backgroundColor: '#627eea' }}>
					<Icon name="left arrow" />
					Cơ quan
				</Button>
			</Link>
		</div>

		<div style={{ float: 'right', marginTop: '10%' }}>
			<Header as="h4" style={{ color: 'grey' }}>
				{' '}
				Đăng nhập dành cho cử tri!
			</Header>
			<Link route="/voter_login">
				<Button primary size="huge" style={{ color: 'white', backgroundColor: '#627eea' }}>
					Cử tri
					<Icon name="right arrow" />
				</Button>
			</Link>
		</div>
	</Container>
);

HomepageHeading.propTypes = {
	mobile: PropTypes.bool,
};

class DesktopContainer extends Component {
	state = {};

	hideFixedMenu = () => this.setState({ fixed: false });
	showFixedMenu = () => this.setState({ fixed: true });

	render() {
		const { children } = this.props;
		const { fixed } = this.state;

		return (
			<Responsive>
				<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
				<Helmet>
					<title>Trang chủ</title>
					<link rel="shortcut icon" type="image/x-icon" href="../../static/logo3.png" />
				</Helmet>
				<Visibility once={false} onBottomPassed={this.showFixedMenu} onBottomPassedReverse={this.hideFixedMenu}>
					<Segment inverted textAlign="center" style={{ minHeight: 700, padding: '1em 0em' }} vertical>
						<Menu
							fixed={fixed ? 'top' : null}
							inverted={!fixed}
							pointing={!fixed}
							secondary={!fixed}
							size="large"
							className="menu"
						>
							<Container>
								<h1
									style={{
										color: '#627eea',
										verticalAlign: 'middle',
										fontFamily: 'Freestyle Script',
										fontSize: '400%',
										paddingLeft: '42%',
									}}
								>
									BlockVotes
								</h1>
							</Container>
						</Menu>
						<HomepageHeading />
					</Segment>
				</Visibility>

				{children}
			</Responsive>
		);
	}
}

DesktopContainer.propTypes = {
	children: PropTypes.node,
};

const ResponsiveContainer = ({ children }) => (
	<div>
		<DesktopContainer>{children}</DesktopContainer>
	</div>
);

ResponsiveContainer.propTypes = {
	children: PropTypes.node,
};

const HomepageLayout = () => (
	<ResponsiveContainer>
		<Segment style={{ padding: '8em 0em' }} vertical>
			<Grid columns="equal" stackable>
				<Grid.Row textAlign="center">
					<Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
						<Header as="h3" style={{ fontSize: '2em' }}>
							Riêng tư
						</Header>
						<p style={{ fontSize: '1.33em' }}>
						Không cung cấp bất kỳ thông tin nào <br />
						liên quan đến dữ liệu cá nhân.
						</p>
						<Header as="h3" style={{ fontSize: '2em' }}>
						 Không có thời gian chết
						</Header>
						<p style={{ fontSize: '1.33em' }}>
						Ứng dụng được triển khai trên blockchain<br />luôn sẵn sàng phục vụ các ngừoi dùng.
						</p>
					</Grid.Column>
					<Image src="../static/ether2.png" width="216" height="256" style={{ paddingTop: '50px' }} />

					<Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
						<Header as="h3" style={{ fontSize: '2em' }}>
						Phi tập trung
						</Header>
						<p style={{ fontSize: '1.33em' }}>
						Công nghệ phi tập trung cung cấp cho bạn<br />
						sức mạnh để lưu trữ tài sản của bạn trong một mạng lưới.
						</p>
						<Header as="h3" style={{ fontSize: '2em' }}>
							Bất biến
						</Header>
						<p style={{ fontSize: '1.33em' }}>
							Các tác nhân xấu không thể sửa đổi hoặc làm sai lệch<br /> dữ liệu và giao dịch đã được lưu trên Blockchain.
						</p>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Segment>

		<Segment inverted vertical style={{ padding: '5em 0em', backgroundColor: '#627eea' }}>
			<Container>
				<Header as="h3" style={{ fontSize: '2em', color: 'white', textAlign: 'center' }}>
					A fascinating quote
				</Header>
				<p style={{ fontSize: '1.33em', textAlign: 'center', fontStyle: 'Italic' }}>
					"We have elected to put our money and faith in a mathematical framework that is free of politics and
					human error."
				</p>
				<Header as="h2" style={{ fontSize: '1.33em', color: 'white', textAlign: 'center' }}>
					Tyler Winklevoss
				</Header>
			</Container>
		</Segment>
	</ResponsiveContainer>
);
export default HomepageLayout;