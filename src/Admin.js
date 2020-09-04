import React from 'react';
import logo from './logo.svg';
import './Admin.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";


export  class Admin extends React.Component{
    APIURL = "http://localhost:5000/"
    constructor(props)
    {
        super(props)
        this.state = {
            dbs: [],
            newPlayer: "",
            newGame: "",
            selectedRound :null
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleNewGame = this.handleNewGame.bind(this);
        
    }

    componentDidMount()
    {
        //get DBS
        
        //get game summary
        this.loadDBS();
    }

    loadDBS() {
        fetch(this.APIURL + "api/getDBS")
            .then(res => res.json())
            .then(json => {
                console.log(json);
                this.setState({ dbs: json });
                if(this.state.selectedRound != null) {
                    this.setState({selectedRound : json.filter(p => {return p.name == this.state.selectedRound.name})[0]})
                }
                return { players: json.players };
            })
            .catch(p => {
                return { players: [] };
            });
    }

    selectDB(d) {
        console.log(d)
        this.setState({selectedRound : d})
        console.log("clicked")
    }

    delPlayer(p) {
        console.log(p)
        var {selectedRound} = this.state;
        // http://localhost:5000/api/delPlayer?db=VG1R1&name=p2
        fetch(this.APIURL + "api/delPlayer?db=" + selectedRound.name + "&name=" + p.name)
        .then(res => res.text())
        .then(dta => {
            console.log(dta); 
            this.loadDBS();
            
        })
    }

    delBet(p) {
        console.log(p)
        var {selectedRound} = this.state;
        fetch(this.APIURL + "api/delBet?db=" + selectedRound.name + "&name=" + p.name + "&bet=" + p.bet)
        .then(res => res.text())
        .then(dta => {
            console.log(dta); 
            this.loadDBS();
            
        })
    }

    handleChange(event) {
        this.setState({newPlayer: event.target.value});
      }

    handleNewGame(event) {
        this.setState({newGame: event.target.value});
    }

    addPlayer(){
        console.log("ADD PLYAER" + this.state.newPlayer)
        var {selectedRound} = this.state;
        // http://localhost:5000/api/addPlayer?db=NNJAK&name=Lanmirk

        fetch(this.APIURL + "api/addPlayer?db=" + selectedRound.name + "&name=" + this.state.newPlayer)
        .then(res => res.text())
        .then(dta => {
            console.log(dta); 
            this.loadDBS();
            
        })
    }

    addGame(){
        console.log("ADD GAME" + this.state.newGame)
        // var {selectedRound} = this.state;
        //http://localhost:5000/api/newRound

        fetch(this.APIURL + "api/newRound?display=" + this.state.newGame)
        .then(res => res.json())
        .then(dta => {
            console.log(dta); 
            this.loadDBS();
            
        })
    }

    lockGame(d){
        console.log("LOCK GAME:" + d.name)
        
        fetch(this.APIURL + "api/lockGame?db=" + d.name)
        .then(res => res.text())
        .then(dta => {
            console.log(dta); 
            this.loadDBS();            
        })
    }    

    reloadBets(d) {
        console.log("LOADING BETS:" + d.name)

        this.loadDBS();  
    }
    render() {
        var {dbs,selectedRound} = this.state;
        var dbNames = dbs.map(d => <li key={d.name}><div onClick={this.selectDB.bind(this,d)} key={d.name} >{d.display} [{d.name}]</div></li>)
        var players = <div>No Players yet</div>
        var bets= <div>No Bets yet</div>
        if(selectedRound && selectedRound.players && selectedRound.players.length > 0)
        {
            players = selectedRound.players.map(p => <li key={p.name}>{p.name} <button onClick={this.delPlayer.bind(this,p)}>X</button></li>)
            if(selectedRound.state && selectedRound.state.bets)
            {
                bets = selectedRound.state.bets.map(p => <tr key={p.name + p.bet} ><td>{p.name} bets {p.amount} to {p.bet}</td> <td> <button onClick={this.delBet.bind(this,p)}>X</button></td></tr>)
            }    
        }
        
        return <div className="divAdmin">Admin Page
            <div>Games :</div>
            <ul>
                {dbNames}
            </ul>
            <div>
                Add new Game: 
                <div> <input type="text" value={this.state.newGame} onChange={this.handleNewGame} /></div>
                <div> <button onClick={this.addGame.bind(this)} >Add</button> </div>
            </div>
            {
                selectedRound != null &&
                <div>
                    <div className="divGame" >
                    Game: {selectedRound.display} &nbsp;
                    <a href={ "Game?db=" + selectedRound.name} >[{selectedRound.name}]</a>
                    </div>
                <div className="divPlayers">
                <div>Players:</div>
                <div>{players}</div>
                <div>
                    Add new Player: 
                    <div> <input type="text" value={this.state.newPlayer} onChange={this.handleChange} /></div>
                    <div> <button onClick={this.addPlayer.bind(this)} >Add</button> </div>
                </div>
                </div>

              
                <div className="divBets">
                    Bets: <button onClick={this.reloadBets.bind(this,selectedRound)}>Reload</button> <button onClick={this.lockGame.bind(this,selectedRound)} >Lock Game</button>
                    <table className="tblBets" cellSpacing="0">
                        {bets}
                    </table>
                    
                </div>

                </div>
            }
            <div></div>
        </div>
    }
}