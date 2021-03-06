import React, { Component } from 'react';
import { Grid, Header, Button, Form, Input, Icon, Menu, Modal, Sidebar, Container, Card } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Cookies from 'js-cookie';
import {Link,Router} from '../../routes';
import Election from '../../Ethereum/election';
import {Helmet} from 'react-helmet';
class VotingList extends Component { 

    state = {
        election_address: Cookies.get('address'),
        election_name: '',
        election_description: '',
        emailArr: [],
        idArr: [],               
        item: [],
    }

    async componentDidMount() {        
        var http = new XMLHttpRequest();
        var url = '/voter/';        
        var params = 'election_address='+this.state.election_address;
        http.open("POST", url, true);
        let email=[];
        let id=[];
        let name=[];
        let phone=[];
        let id_number=[];
        let home_address=[];
        //Send the proper header information along with the request
        http.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        http.onreadystatechange = function() {
            //Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                var responseObj = JSON.parse(http.responseText);
                if(responseObj.status=="success") {
                  for (let voter of responseObj.data.voters) {
                        email.push(voter.email);
                        id.push(voter.id);    
                        name.push(voter.name); 
                        phone.push(voter.phone); 
                        id_number.push(voter.id_number); 
                        home_address.push(voter.home_address); 
                  } 
                }                
            }
        };
        http.send(params);
        this.state.emailArr.push(email);
        this.state.idArr.push(id);
       


        try {
            const add = Cookies.get('address');
            const election = Election(add);
            const summary = await election.methods.getElectionDetails().call();
            this.setState({
                election_name: summary[0],
                election_description: summary[1]
            });

        } catch(err) {
            console.log(err.message);
            alert("??ang chuy???n h?????ng v??? trang ????ng nh???p...");
            Router.pushRoute('/company_login');
        }
        let ea = [];
        ea = this.state.emailArr[0];
        let ia = [];
        ia = this.state.idArr[0];            
               
        
        let i=-1;
        const items = ia.map(ia => {
            i++;
            const divStyle = {
              color: 'DarkSlateGray	',
            };
            
            return {
              header: email[i],
              meta:(
              <div style={divStyle}>
                <br/>
                <Icon name='user circle' iconPostion='left'/> H??? v?? t??n: {name[i].toString()}
              </div>),
              description:
              (
                <>
                <br/>
                  <div style={divStyle}>
                  <Icon name='address card outline' iconPostion='left'/>CMND: {' '} {id_number[i].toString()}  
                  </div>
                  <br/>
                  <div style={divStyle}>
                  <Icon name='home' iconPostion='left'/> ?????a ch??? th?????ng tr??:{' '}{' '} {home_address[i].toString()}  
                  </div>
                </>
              ),              
              extra: (
                <div>       
                  <Modal size={"tiny"} trigger={
                      <Button basic id={ia} color="green">                        
                        Edit
                      </Button>
                    }closeIcon
                  >
                    <Modal.Header>Edit E-mail ID</Modal.Header>
                    <center>
                      <Modal.Content>
                        <Input id={`EmailVal${ia}`} placeholder='E-mail ID' style={{marginBottom: '5%',marginTop: '5%'}}/>
                      </Modal.Content>
                      <Modal.Actions>
                        <Button
                          positive
                          icon="checkmark"
                          labelPosition="right"
                          content="Yes"
                          padding="30"
                          style={{ marginBottom: "10px" }}
                          onClick={this.updateEmail}
                          id={ia} 
                        />
                        <Button negative>No</Button>
                      </Modal.Actions>
                    </center>
                  </Modal>
                  <Button negative basic id={ia} value={ia} onClick={this.deleteEmail}>Delete</Button>
                </div>
              )
            };
        });
        this.setState({item: items});
    }

    updateEmail = event => {
        
        const d = event.currentTarget.id;
        const st = 'EmailVal'+event.currentTarget.id;
        const a = document.getElementById(st).value;
        const b = this.state.election_name;
        const c = this.state.election_description;
        //further proceed
        const election_address=Cookies.get('address');
        // alert(election_address);
        var http = new XMLHttpRequest();
        var url = '/voter/'+d;
        // alert(url);
        var params = 'email='+a+'&election_name='+b+'&election_description='+c+'&election_address='+election_address;
        http.open("PUT", url, true);
        //Send the proper header information along with the request
        http.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        http.onreadystatechange = function() {
            //Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                var responseObj = JSON.parse(http.responseText);
                if(responseObj.status=="success") {
                  alert(responseObj.message);
                }
            }
        };
        http.send(params);
    }

    deleteEmail = event => {
        //further proceed

        var http = new XMLHttpRequest();
        var url = '/voter/'+event.currentTarget.value;        
        http.open("DELETE", url, true);
        //Send the proper header information along with the request
        http.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        http.onreadystatechange = function() {
            //Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                var responseObj = JSON.parse(http.responseText);
                if(responseObj.status=="success") {
                  alert(responseObj.message);
                }                
            }
        };
        http.send();
    }

    renderTable = () => {
        return (<Card.Group items={this.state.item}/>)
    } 

    GridExampleGrid = () => <Grid>{columns}</Grid>
    SidebarExampleVisible = () => (
      <Sidebar.Pushable>
        <Sidebar as={Menu} animation='overlay' icon='labeled' inverted vertical visible width='thin' style={{ backgroundColor: 'white', borderWidth: "10px" }}>
        <Menu.Item as='a' style={{ color: 'rgb(98, 126, 234)' }} >
        <h2>MENU</h2><hr/>
        </Menu.Item>      
        <Link route={`/election/${Cookies.get('address')}/company_dashboard`}>
        <a>
          <Menu.Item style={{ color: 'rgb(98, 126, 234)', fontColor: 'grey' }}>
            <Icon name='dashboard'/>
            Trang ch???
          </Menu.Item>
          </a>
          </Link>
          <Link route={`/election/${Cookies.get('address')}/candidate_list`}>
          <a>
          <Menu.Item as='a' style={{ color: 'rgb(98, 126, 234)' }}>
            <Icon name='user outline' />
            ???ng c??? vi??n
          </Menu.Item>
          </a>
          </Link>
          <Link route={`/election/${Cookies.get('address')}/voting_list`}>
          <a>
          <Menu.Item as='a' style={{ color: 'rgb(98, 126, 234)' }}>
            <Icon name='list' />
            C??? tri
          </Menu.Item>
          </a>
          </Link>
          <hr/>
          <Button onClick={this.signOut} style={{backgroundColor: 'white'}}>
          <Menu.Item as='a' style={{ color: 'rgb(98, 126, 234)' }}>
            <Icon name='sign out' />
            ????ng xu???t
          </Menu.Item>       
          </Button>  
        </Sidebar>
      </Sidebar.Pushable>
    )
    signOut() {
        Cookies.remove('address');
        Cookies.remove('company_email');
        Cookies.remove('company_id');
        alert("??ang ????ng xu???t.");
        Router.pushRoute('/homepage');
    }

    register = event => {
    let status= Cookies.get('status');
    if( status != "false") {


		const email = document.getElementById('register_voter_email').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const id_number = document.getElementById('id_number').value;
    const home_address = document.getElementById('home_address').value;
    // // alert(name);
    // alert(phone);
    // // alert(home_address);
    // alert(id_number);


    

		var http = new XMLHttpRequest();
        var url = "/voter/register";
        var params = "email=" + email+ "&name=" + name+"&phone=" + phone+"&home_address=" + home_address+"&id_number=" + id_number+"&election_address=" + this.state.election_address+ "&election_name=" + this.state.election_name + "&election_description=" + this.state.election_description;
        http.open("POST", url, true);
        //Send the proper header information along with the request
        http.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        http.onreadystatechange = function() {
            //Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                var responseObj = JSON.parse(http.responseText);
                if(responseObj.status=="success") {
                  alert(responseObj.message);                  
                }
                else {
                  alert(responseObj.message);
                }
            }
        };
    	http.send(params);
    }
    else{
      alert("Cu???c b???u c??? ???? k???t th??c, kh??ng th??? th??m th??ng tin c??? tri m???i ");
    }
	}
	
  render(){      
    return (
      <div>
          <Helmet>
            <title>Voting list</title>
            <link rel="shortcut icon" type="image/x-icon" href="../../static/logo3.png" />
          </Helmet>
        <Grid>
          <Grid.Row>
            <Grid.Column width={2}>
              {this.SidebarExampleVisible()}
            </Grid.Column>
            <Layout>                      
              <br />
              <br />
              <Grid.Column width={14} style={{ minHeight: '630px' }}>
                <Grid.Column style={{ float: 'left', width: '60%' }}>
                  <Header as='h2' color='blue'>
                  Danh s??ch c??? tri
              </Header>
                  <Container>                      
                      <table>
                      {this.renderTable()}
                      </table>                                        
                  </Container>
                </Grid.Column>
                <Grid.Column style={{ float: 'right', width: '30%' }}>
                  <Container style={{}}>
                    <Header as='h2' color='blue'>
                      Th??m c??? tri
                       </Header>
                    <Card style={{ width: '100%' }}>
                      <br/>
                      <Form.Group size='large' style={{marginLeft: '5%',marginRight: '5%',color: 'rgb(98, 126, 234)',}} >
                      <Form.Input
						style={{marginTop: '10px'}}
                          fluid
                          id='name'
                        icon='user circle'
                          label='H??? v?? t??n:'
                          placeholder='Nh???p h??? v?? t??n c??? tri'
                          textAlign='center'
                        />
                        <Form.Input
						style={{marginTop: '10px'}}
                          fluid
                          id='register_voter_email'
                         icon='envelope'                          
                          label='Email:'
                          placeholder='Nh???p ?????a ch??? e-mail'
                          textAlign='center'
                        />
                         
                        <Form.Input
						style={{marginTop: '10px'}}
                          fluid
                          id='home_address' 
                          icon="home" 
                          label='?????a ch??? th?????ng tr??:'
                          placeholder='Nh???p ?????a ch??? th?????ng tr?? c???a c??? tri'
                          textAlign='center'
                        />
                        <Form.Input
						style={{marginTop: '10px'}}
                          fluid
                          id='phone' 
                          icon="phone" 
                          label='S??? ??i???n tho???i:'
                          placeholder='Nh???p s??? ??i???n tho???i c???a c??? tri'
                          textAlign='center'
                        />
                        <Form.Input
						style={{marginTop: '10px'}}
                          fluid
                          id='id_number'
                         icon='address card outline'
                          label='Ch???ng minh nh??n d??n:'
                          placeholder='Nh???p CMND c???a c??? tri'
                          textAlign='center'
                        />

                        <br /><br />
                        <Button primary style={{ Bottom: '10px', marginBottom: '15px' }} onClick={this.register}>????ng k??</Button>
                      </Form.Group>
                    </Card>
                  </Container>
                </Grid.Column>                
              </Grid.Column>
            </Layout>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}


export default VotingList