import React from 'react';
import logo from './logo.svg';
import './Game.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";


export  class Game extends React.Component{
    APIURL = "https://duedit-api.herokuapp.com/"
    constructor(props)
    {
        super(props);
        this.state = {
            dbid: null,
            players: [],
            name:"",
            ign: "",
            bet: "",
            bets: [],
            player:null
        }

        this.handleign = this.handleign.bind(this);
        this.handlebet = this.handlebet.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }
    componentDidMount() {
        console.log(this.getQueryVariable('db'));
        var dbid = this.getQueryVariable('db');
        this.setState({dbid:dbid})

        //get game summary
        this.updateState(dbid);
    }

    updateState(dbid) {
        fetch(this.APIURL + "api/getState?db=" + dbid)
            .then(res => res.json())
            .then(json => {
                console.log(json);
                this.setState({ players: json.players });
                if(this.state.player == null)
                {
                    this.setState({ player: json.players[0].name });
                }                
                this.setState({ name: json.name });
                this.setState({ bets: json.bets });
            })
            .catch(p => {
            });
    }

    getQueryVariable(variable)
    {
        var query = window.location.search.substring(1);
        console.log(query)//"app=article&act=news_content&aid=160990"
        var vars = query.split("&");
        console.log(vars) //[ 'app=article', 'act=news_content', 'aid=160990' ]
        for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    console.log(pair)//[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ] 
        if(pair[0] == variable){
            return pair[1];}
        }
        return(false);
    }

    handleign(event)
    {
        this.setState({ign : event.target.value})
    }

    handlebet(event)
    {
        this.setState({bet : event.target.value})
    }

    handleSelect(event)
    {
        console.log(event.target.value)
        this.setState({player: event.target.value})
    }

    submitBet() {
        console.log("ADDING BET")
        console.log(this.APIURL + "api/add?db=" + this.state.dbid + "&name=" + this.state.ign + "&amt=" + this.state.bet + "&bet=" + this.state.player)
        // http://localhost:5000/api/add?db=R7GBZ&name=asa&amt=122&bet=A1
        fetch(this.APIURL + "api/add?db=" + this.state.dbid + "&name=" + this.state.ign + "&amt=" + this.state.bet + "&bet=" + this.state.player )
        .then(res => res.json())
        .then(json => console.log(json))
        .finally(p => {
            this.updateState(this.state.dbid);
        });


    }
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    render() {
        
        let {dbid,players, bets} = this.state
        let plist = []
        if(players)
        {
            plist = players.map(p=> <option key={p.name}>{p.name}</option>)
        } 

        var betsl = <div>No bets yet</div>;
        betsl = bets.map(p => <tr key={p.name + p.bet} ><td>{p.name} bets {p.amount} to {p.bet}</td></tr>)
        return (  
        <div className="divGame">
            <strong>Game: {dbid}</strong>
            <div>
                Your ingame name: 
                <div> <input type="text" value={this.state.ign} onChange={this.handleign} /></div>
            </div>
            <div>
                Select Player to bet on: 
                <div> 
                    <select onChange={this.handleSelect}>
                        {plist}
                    </select>
                </div>
            </div>
            <div>
                How much you want to bet: 
                <div> <input type="text" value={this.state.bet} onChange={this.handlebet} /></div>
            </div>
            <div> <button onClick={this.submitBet.bind(this)} >Submit</button> </div>

            <table className="tblBets">{betsl}</table>
        </div>
        );
    }
  }
