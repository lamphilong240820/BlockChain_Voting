import React, { Component } from 'react';
import { Grid, Step, Icon, Menu, Sidebar, Container, Modal, Card, Header, Button, Item } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';
import Election from '../../Ethereum/election';
import Cookies from 'js-cookie';
import web3 from '../../Ethereum/web3';
import { Link, Router } from '../../routes';
import { Helmet } from 'react-helmet';

var b = 0;
let cand = [];
let graphEmail = [];
let graphVotes = [];

const options = {
	maintainAspectRatio: true,
	responsive: true,
	scales: {
		yAxes: [
			{
				height: '500px',
				stacked: true,
				gridLines: {
					display: true,
					color: 'rgba(255,99,132,0.2)',
				},
			},
		],
		xAxes: [
			{
				width: '500px',
				gridLines: {
					display: false,
				},
			},
		],
	},
};

const data = {
	labels: graphEmail,
	datasets: [
		{
			label: 'Thống kê phiếu bầu',
			backgroundColor: 'rgb(98, 126, 234)',
			borderColor: 'rgb(98, 126, 234)',
			borderWidth: 2,
			hoverBackgroundColor: 'rgba(255,99,132,0.4)',
			hoverBorderColor: 'rgba(255,99,132,1)',
			data: graphVotes,
		},
	],
};

class ContainerExampleContainer extends Component {
	state = {
		election_address: Cookies.get('address'),
		election_name: '',
		election_desc: '',
		voters: 0,
		candidates: 0,
		visible: false,
		loading: false,
		b: 0,
	};
	async componentDidMount() {
		var http = new XMLHttpRequest();
		var url = '/voter/';
		var params = 'election_address=' + Cookies.get('address');
		http.open('POST', url, true);
		//Send the proper header information along with the request
		http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		http.onreadystatechange = function () {
			//Call a function when the state changes.
			if (http.readyState == 4 && http.status == 200) {
				var responseObj = JSON.parse(http.responseText);
				if (responseObj.status == 'success') {
					b = responseObj.count;
				}
			}
		};
		http.send(params);
		try {
			const add = Cookies.get('address');
			const election = Election(add);
			const summary = await election.methods.getElectionDetails().call();
			const v = await election.methods.getNumOfVoters().call();
			this.setState({ voters: v });
			const c = await election.methods.getNumOfCandidates().call();
			this.setState({ candidates: c });
			this.setState({
				election_name: summary[0],
				election_desc: summary[1],
			});

			for (let i = 0; i < c; i++) {
				const tp = await election.methods.getCandidate(i).call();
				graphEmail.push(tp[0]);
				graphVotes.push(tp[3]);
			}
			this.returnGraph();
		} catch (err) {
			console.log(err.message);
			alert('Đang chuyển hướng về trang đăng nhập');
			Router.pushRoute('/company_login');
		}
		this.setState({ b: b });
	}

	getElectionDetails = () => {
		const { election_name, election_desc } = this.state;

		return (
			<div style={{ marginLeft: '30%', marginBottom: '2%', marginTop: '2%', float: 'left' }}>
				<Header as="h2">
					<Icon name="university" />
					<Header.Content>
						{election_name}
						<Header.Subheader>{election_desc}</Header.Subheader>
					</Header.Content>
				</Header>
			</div>
		);
	};
	CardExampleGroupProps = () => <Card.Group></Card.Group>;
	GridExampleGrid = () => <Grid>{columns}</Grid>;
	SidebarExampleVisible = () => (
		<Sidebar.Pushable>
			<Sidebar
				as={Menu}
				animation="overlay"
				icon="labeled"
				inverted
				vertical
				visible
				width="thin"
				style={{ backgroundColor: 'white', borderWidth: '10px' }}
			>
				<Menu.Item as="a" style={{ color: 'rgb(98, 126, 234)' }}>
					<h2>MENU</h2>
					<hr />
				</Menu.Item>
				<Link route={`/election/${Cookies.get('address')}/company_dashboard`}>
					<a>
						<Menu.Item style={{ color: 'rgb(98, 126, 234)', fontColor: '#8B4513' }}>
							<Icon name="dashboard" />
							Trang chủ
						</Menu.Item>
					</a>
				</Link>
				<Link route={`/election/${Cookies.get('address')}/candidate_list`}>
					<a>
						<Menu.Item as="a" style={{ color: 'rgb(98, 126, 234)' }}>
							<Icon name="user outline" />
							Ứng viên
						</Menu.Item>
					</a>
				</Link>
				<Link route={`/election/${Cookies.get('address')}/voting_list`}>
					<a>
						<Menu.Item as="a" style={{ color: 'rgb(98, 126, 234)' }}>
							<Icon name="list" />
							Cử tri
						</Menu.Item>
					</a>
				</Link>
				<hr />
				<Button onClick={this.signOut} style={{ backgroundColor: 'white' }}>
					<Menu.Item as="a" style={{ color: 'rgb(98, 126, 234)' }}>
						<Icon name="sign out" />
						Đăng xuất
					</Menu.Item>
				</Button>
			</Sidebar>
		</Sidebar.Pushable>
	);
	signOut() {
		Cookies.remove('address');
		Cookies.remove('company_email');
		Cookies.remove('company_id');
		alert('Đang đăng xuất...');
		Router.pushRoute('/homepage');
	}
	endElection = async event => {
		let status= "true";
		const email=Cookies.get('company_email');
		// alert(email);
		var http = new XMLHttpRequest();
    	var url = "/company/endelection";
		var params = 'email='+email;
    	http.open('POST', url, true);
		// alert(email);

    	//Send the proper header information along with the request
		http.setRequestHeader(
			"Content-type",
			"application/x-www-form-urlencoded"
		  );

		

		http.onreadystatechange = function() {//Call a function when the state changes.

        if(http.readyState == 4 && http.status == 200) {

            var responseObj = JSON.parse(http.responseText)
            if(responseObj.status=="success") {  
				// alert(responseObj.data.email);  
				Cookies.set('status', 'false');					
                alert(responseObj.message); 
            }
            else {
				Cookies.set('status', 'false');	
                alert(responseObj.message);
            }
        }
		};		
		http.send(params);
		status= Cookies.get('status');
		if (status == undefined) status ="true";

		// alert(status);
		if(status == "true"){
		// alert("test");
		Cookies.set('status', 'false');		
		status= Cookies.get('status');
		// let candidate = 0;
		try {
			this.setState({ loading: true });
			const add = Cookies.get('address');
			const election = Election(add);
			// alert("candidate");
            const c = await election.methods.getNumOfCandidates().call();
			// alert(c);

			let candidates=[];           
            for(let i=0 ; i<c; i++) {
                candidates.push(await election.methods.getCandidate(i).call());
                // alert(candidates[i]);
            }
			let largestVotes = candidates[0][3];
			let candidateID=0;
			for(let i=1 ; i<c; i++) {
				if(largestVotes < candidates[i][3]) {
					largestVotes = tmp;
					candidateID = i;
				}
                // alert(candidates[i][3]);
                // alert(candidates[i]);
            }
			
			cand = await election.methods.getCandidate(candidateID).call();
			var http = new XMLHttpRequest();
			var url = '/voter/resultMail';
			var params =
				'election_address=' +
				Cookies.get('address') +
				'&election_name=' +
				this.state.election_name +
				'&candidate_email=' +
				cand[4] +
				'&winner_candidate=' +
				cand[0];
			http.open('POST', url, true);
			//Send the proper header information along with the request
			http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			http.onreadystatechange = function () {
				//Call a function when the state changes.
				if (http.readyState == 4 && http.status == 200) {
					var responseObj = JSON.parse(http.responseText);
					if (responseObj.status == 'success') {
						alert('Gửi mail thông báo đến cử tri và ứng viên thành công!');
					} else {
						alert(responseObj.message);
					}
				}
			};
			this.setState({ loading: true });
			http.send(params);
		} catch (err) {
			console.log(err.message);
		}
	}
	};

	returnModal = () => <h1>I won the election</h1>;

	returnGraph = () => <Bar data={data} width={120} height={50} options={options} />;

	render() {
		return (
			<div>
				<Helmet>
					<title>Trang chủ</title>
					<link rel="shortcut icon" type="image/x-icon" href="../../static/logo3.png" />
				</Helmet>
				<Grid>
					<Grid.Row>
						<Grid.Column width={2}>{this.SidebarExampleVisible()}</Grid.Column>

						<Layout>
							<Grid.Column width={16}>
								{this.getElectionDetails()}
								<Button
									negative
									style={{ float: 'right', marginTop: '2%' }}
									onClick={this.endElection}
									loading={this.state.loading}
								>
									Kết thúc
								</Button>
								<Step.Group style={{ minWidth: 1130, minHeight: 90 }}>
									<Step icon="users" style={{color: 'rgb(98, 126, 234)'}} title="Cử tri" description={this.state.b} />
									<Step icon="user outline" style={{color: 'rgb(98, 126, 234)'}} title="Ứng cử viên" description={this.state.candidates} />
									<Step
										style={{color: 'rgb(98, 126, 234)'}}
										icon="chart bar outline"
										title="Tổng số phiếu bầu"
										description={this.state.voters}
									/>
								</Step.Group>
								{this.CardExampleGroupProps()}

								<Grid.Column>
									<br />
									<div className="he">
										<style jsx>{`
											.he {
												height: 50%;
												max-width: 100%;
											}
										`}</style>
										{this.returnGraph()}
									</div>
								</Grid.Column>
							</Grid.Column>
						</Layout>
					</Grid.Row>
				</Grid>
			</div>
		);
	}
}

export default ContainerExampleContainer;