import React, { Component } from 'react';
import { Grid, Table, Button, Form, Image, Header, Icon, Menu, Modal, Sidebar, Container, Card } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../Ethereum/web3';
import Cookies from 'js-cookie';
import {Link,Router} from '../../routes';
import Election from '../../Ethereum/election';
import ipfs from '../../ipfs';
import {Helmet} from 'react-helmet';
class VotingList extends Component { 

    state = {
        election_address: Cookies.get('address'),
        election_name: '',
        election_description: '',
        item: [],
        cand_name: '',
        cand_desc: '',
        buffer: '',
        ipfsHash: null,
        loading: false
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

    captureFile = (event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)
    };
    
    convertToBuffer = async(reader) => {
        //file is converted to a buffer for upload to IPFS
        const buffer = await Buffer.from(reader.result);
        //set this buffer -using es6 syntax
        this.setState({buffer});
    };
    
    onSubmit = async (event) => {
        let status= Cookies.get('status');
        if( status != "false") {
        
        
		const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const id_number = document.getElementById('id_number').value;
    const descpription = document.getElementById('descpription').value;
    const home_address = document.getElementById('home_address').value;
        
        event.preventDefault();
        this.setState({loading: true});
        const accounts = await web3.eth.getAccounts();
         //ajax script below
         var http = new XMLHttpRequest();
         var url = "/candidate/registerCandidate";
         var params = "email=" + email+"&name=" + name+"&phone=" + phone+"&home_address=" + home_address+"&id_number=" + id_number+"&descpription="+descpription+"&election_name=" + this.state.election_name+"&election_address=" + this.state.election_address;
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
                   alert(responseObj.message);
                   try {
                     await ipfs.add(this.state.buffer, (err, ipfsHash) => {
                        this.setState({ ipfsHash: ipfsHash[0].hash });
                                
                        const add = Cookies.get('address');
                        const election = Election(add);
            
                        election.methods.addCandidate(this.state.cand_name,this.state.cand_desc,this.state.ipfsHash,document.getElementById('email').value,id_number,home_address).send({
                            from: accounts[0]}, (error, transactionHash) => {}
                        );       
                    })
                        alert("Thêm thông tin ứng cử viên thành công!");
                    } catch (err) {
                        alert("Bạn hãy thêm một hình ảnh đại diện cho ứng viên");
                    }
                 }
                 else {
                   alert(responseObj.message);

                 }
             }
         };
         http.send(params);
         this.setState({loading: false});      
       
          }
          else{
            alert("Cuộc bầu cử đã kết thúc, không thể thêm thông tin ứng viên mới ");
          }
    };
    
    GridExampleGrid = () => <Grid>{columns}</Grid>
    SidebarExampleVisible = () => (
        <Sidebar.Pushable>
          <Sidebar as={Menu} animation='overlay' icon='labeled' inverted vertical visible width='thin' style={{ backgroundColor: 'white', borderWidth: "10px" }}>
          <Menu.Item as='a' style={{ color: 'rgb(98, 126, 234)' }}>
          <h2>MENU</h2><hr/>
          </Menu.Item>      
          <Link route={`/election/${Cookies.get('address')}/company_dashboard`}>
          <a>
            <Menu.Item style={{ color: 'rgb(98, 126, 234)' }}>
              <Icon name='dashboard'/>
              Trang chủ
            </Menu.Item>
            </a>
            </Link>
            <Link route={`/election/${Cookies.get('address')}/candidate_list`}>
            <a>
            <Menu.Item as='a' style={{ color: 'rgb(98, 126, 234)' }}>
              <Icon name='user outline' />
              Ứng viên
            </Menu.Item>
            </a>
            </Link>
            <Link route={`/election/${Cookies.get('address')}/voting_list`}>
            <a>
            <Menu.Item as='a' style={{ color: 'rgb(98, 126, 234)' }}>
              <Icon name='list' />
              Cử tri
            </Menu.Item>
            </a>
            </Link>
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
          Cookies.remove('company_email');
          Cookies.remove('company_id');
          alert("Đang đăng xuất");
          Router.pushRoute('/homepage');
      }
  

  render() {
      // const {Body, Row, HeaderCell, Header} = Table;
    return (
      <div>
          <Helmet >
            <title >Danh sách ứng viên!</title>
            <link rel="shortcut icon" type="image/x-icon" href="../../static/logo3.png" />
          </Helmet>
        <Grid>
          <Grid.Row>
            <Grid.Column width={2}>
              {this.SidebarExampleVisible()}
            </Grid.Column>
            <Layout>
                {this.getElectionDetails()}                      
              <br />
              <br />
              <Grid.Column width={14} style={{ minHeight: '630px' }}>
                <Grid.Column style={{ float: 'left', width: '60%' }}>
                  <Header as='h2' color= 'blue'>
                  Danh sách ứng viên
              </Header>
                  <Container>                      
                      <table>
                      {/* <td>asdjaskjsda</td>
                      <td>asldla</td>
                      <td>sada</td> */}
                       {this.renderTable()}
                      </table>                                        
                  </Container>
                </Grid.Column>
                <Grid.Column style={{ float: 'right', width: '30%' }}>
                <Container style={{marginLeft:'50px'}}>                      
                <Header as='h2' color='blue' textAlign='center'>                 
                        Thêm ứng cử viên
                       </Header>
                       <Card style={{width: '125%'}}>      
                       
                       <Form.Group size='large'style={{marginLeft: '5%',marginRight: '5%',color: 'rgb(98, 126, 234)',}} >                       
                       <br/>
                       <p style={{fontSize:'15px'}}>Họ và tên:</p>
                       <Form.Input
                        fluid  
                        required                                       
                        style={{fontSize:'15px'}}
                        id='name'
                        icon='user circle'
                        placeholder='Nhập họ và tên của ứng viên'
                        onChange={event => this.setState({ cand_name: event.target.value })}
                        textAlign='center'
                       
                    />     
                        
                        <p>Hình ảnh:</p>
                       
                        
                        <div class="ui fluid" style={{ borderWidth: '0px', marginRight: '20%' }}>
                          <input type="file" class="inputfile" id="embedpollfileinput"                           
                            onChange={this.captureFile}
                            style={{ maxWidth: '0.1px', maxHeight: '0.1px', zIndex: '-1', overflow: 'hidden', position: 'absolute' }} 
                          />
                          <label for="embedpollfileinput" class="ui huge blue right floated button" style={{ fontSize: '15px', marginRight: '30%' }} >
                            <i class="ui upload icon"></i>
                            Thêm hình ảnh
                          </label>
                        </div><br /><br /><br />
                       
                        <p style={{fontSize:'15px'}}>Mô tả sơ lược:</p>
                        <Form.Input as='TextArea'
                         fluid
                         required
                         icon="file"
                         id='descpription'
                         label='Description:'
                         placeholder='Nhập mô tả sơ lược về ứng viên'
                         style={{width: '100%', height: '50%', fontSize:'15px'}}
                         centered={true}
                         onChange={event => this.setState({ cand_desc: event.target.value })}
                          />
                       <Form.Input fluid
                         id="email"
                         icon='envelope'
                         label='Email:'
                         style={{fontSize:'15px'}}
                         placeholder="Nhập địa chỉ e-mail"
                       />
                       <Form.Input
						style={{marginTop: '10px'}}
                          fluid
                          id='phone'  
                         icon='phone'
                          label='Số điện thoại:'
                          placeholder='Nhập số điện thoại của cử tri'
                          textAlign='center'
                        />
                        <Form.Input
						style={{marginTop: '10px'}}
                          fluid
                          id='id_number' 
                         icon='address card outline'
                          label='Chứng minh nhân dân:'
                          placeholder='Nhập CMND của cử tri'
                          textAlign='center'
                        />
                        <Form.Input
						style={{marginTop: '10px'}}
                          fluid
                          required
                          id='home_address'
                          icon="home" 
                          label='Địa chỉ thường trú:'
                          placeholder='Nhập địa chỉ thường trú của cử tri'
                          textAlign='center'
                        />

                       <br/>
                       <Button primary onClick={this.onSubmit} loading={this.state.loading} style={{Bottom: '10px',marginBottom: '20px'}}>Đăng ký</Button>
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