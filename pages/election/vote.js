import React, { Component } from 'react';
import { Grid, Button, Header, Icon, Image, Menu, Sidebar, Container, Card } from 'semantic-ui-react';
import Layout from '../../components/Layout_voter'; 
import web3 from '../../Ethereum/web3';
import Election from '../../Ethereum/election';
import Cookies from 'js-cookie';
import {Helmet} from 'react-helmet';
import {Link,Router} from '../../routes';

class VotingList extends Component {

    state = {
        numCand: '',
        election_address: Cookies.get('address'),
        election_name: '',
        election_description: '',
        item: [],
        cand_name: '',
        cand_desc: '',
        buffer: '',
        ipfsHash: null,
        loading: false
    };
    GridExampleGrid = () => <Grid>{columns}</Grid>
    SidebarExampleVisible = () => (
  
      <Sidebar.Pushable>
        <Sidebar as={Menu} animation='overlay' icon='labeled' inverted vertical visible width='thin' style={{ backgroundColor: 'white', borderWidth: "10px" , color: 'rgb(98, 126, 234)' }}>
        <Menu.Item as='a' style={{ color: 'rgb(98, 126, 234)' }} >
        <h2>MENU</h2><hr/>
        </Menu.Item>
          <Menu.Item as='a' style={{  color: 'rgb(98, 126, 234)' }} >
            <Icon name='dashboard' />
            Trang chủ
            </Menu.Item>
          <hr/>
          <Button onClick={this.signOut} style={{backgroundColor: 'white'}}>
          <Menu.Item as='a' style={{ color: 'rgb(98, 126, 234)' }}>
            <Icon name='sign out' />
            Đăng xuất
          </Menu.Item>
            </Button>
        </Sidebar>
      </Sidebar.Pushable>
    )

    signOut() {
          Cookies.remove('address');
          Cookies.remove('voter_email');
          alert("Đang đăng xuất");
          Router.pushRoute('/homepage');
    }

    async componentDidMount() {
      try {
          const add = Cookies.get('address');
          const election = Election(add);
          const summary = await election.methods.getElectionDetails().call();
        
          this.setState({
              election_name: summary[0],
              election_description: summary[1]
          });      
    
          const c = await election.methods.getNumOfCandidates().call();

          if(c == 0)
              alert("Hãy thêm một ứng viên mới!");
           let candidates=[];
          // candidates.push(await election.methods.getCandidate(0).call());
          // let candidates = await election.methods.getCandidate(1).call();
          for(let i=0 ; i<c; i++) {
              candidates.push(await election.methods.getCandidate(i).call());
              // alert(candidates[i]);
          }
          // console.log("candidates: ", this.state.candidates);

      let i=-1;
      // alert(candidates[1]);

      const items = candidates.map(candidate => {
        i++;
        let temp=candidate[4];
        const divStyle1 = {
          color: 'DarkSlateGray	',
        };
        const divStyle2 = {
          color: 'blue	',
        };
        

        return {
          header:(
            <div>
              <Icon name='user circle' iconPostion='left'/> Tên: {candidate[0].toString()}
            </div>
          ),
          description: (
            <>
            <div>
              <Icon name='file archive' iconPostion='left'/> Mô tả sơ lược: {candidate[1].toString()}
            </div>
            <div style={divStyle1}>
              <Icon name='home' iconPostion='left'/>Địa chỉ thường trú:{' '}{' '} {candidate[6].toString()}  
            </div>
           
            
          </>
          ),              
          image: (
              <Image id={i} src={`https://ipfs.io/ipfs/${candidate[2]}`} style={{maxWidth: '100%',maxHeight:'190px'}}/>
            ),
          extra:(
            <div style={divStyle2}>
            <Icon name='inbox' iconPostion='left'/> Số phiếu bầu: {' '} {candidate[3].toString()}  
            <Button id={i} style={{float: 'right'}} onClick={this.vote} primary>Vote!</Button>
          </div>
          )              
        };
        
    });


      this.setState({item: items}); 


      } catch(err) {
          // console.log(err.message);
          alert("Đang chuyển hướng về trang đăng nhập...");
          // // Router.pushRoute('/company_login');
      }
  }
    getElectionDetails = () => {
        const {
            election_name,
            election_description
        } = this.state;
    
        return (
          <div style={{marginLeft: '30%',marginBottom: '2%',marginTop: '2%'}}>
            <Header as="h2">
              <Icon name="university" />
              <Header.Content>
                {election_name}
                <Header.Subheader>{election_description}</Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        );
      }

    renderTable = () => {
        return (<Card.Group items={this.state.item}/>)
    } 

    vote = async event => {
        const e = parseInt(event.currentTarget.id,10);
        const accounts = await web3.eth.getAccounts();
        const add = Cookies.get('address');
        const voter_email = Cookies.get('voter_email');
        const election = Election(add);
        
        //ajax script below
        var http = new XMLHttpRequest();
        var url = "/voter/castVote";
        var params = "email=" + voter_email +"&election_address=" + this.state.election_address;
        http.open("POST", url, true);
        //Send the proper header information along with the request
        http.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        http.onreadystatechange = async () => {
            //Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                var responseObj = JSON.parse(http.responseText);
                if(responseObj.status=="success") {
                  // alert(responseObj.message);
                  try{
                    await election.methods.vote(e,responseObj.data.id).send({from: accounts[0]});      
                  }catch (err) {
                }                              
                }
                else {
                  alert(responseObj.message);

                }
            }
        };
        http.send(params);
    }
  
    render() {
      return (
        <div> 
            <Helmet>
            <title>Vote</title>
            <link rel="shortcut icon" type="image/x-icon" href="../../static/logo3.png" />
          </Helmet>
          <Grid>
            <Grid.Row>
              <Grid.Column width={2}>
                {this.SidebarExampleVisible()}
              </Grid.Column>
              <Layout>                                   
              {this.getElectionDetails()}
              <Grid.Column style={{minHeight: '77vh',marginLeft: '2%'}}>
              <Header as='h2' color= 'blue'>
                  Danh sách ứng viên
              </Header>
              <Container>
                       {this.renderTable()}
                    </Container>
              </Grid.Column>      
              </Layout>
            </Grid.Row>
          </Grid>
        </div>
      );
    }
  }
  

export default VotingList