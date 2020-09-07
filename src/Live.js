import React from 'react';
import logo from './logo.svg';
import './Live.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";


export  class Live extends React.Component{
    // APIURL = "https://duedit-api.herokuapp.com/"
    APIURL = "http://localhost:5000/"

    constructor(props){
        super(props)

        this.state = {
            dbid: null,
            db: {locked:false},
            bets: [],
            players: []
        }
    }

    componentDidMount(){
        console.log(this.getQueryVariable('db'));
        var dbid = this.getQueryVariable('db');
        this.setState({dbid:dbid})

        //get game summary
        this.updateState(dbid);
        setInterval(() => {this.updateState(dbid)}, 3000);
        
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
                this.setState({db: json})
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

    reloadBets(d) {
        const {dbid} = this.state;
        console.log("LOADING BETS:" + d.name)

        
    }


    render() {

        const {db,bets,players} = this.state;
        var lbets= <div>No Bets yet</div>
        lbets = bets.map(p => <tr key={p.name + p.bet} ><td>{p.name} bets {p.amount} to {p.bet}</td> <td></td></tr>)
        var lSummary = players.map(p => <tr key={p.name} className={p.win ? "win": "lose"}>
            <td>
                {p.name}
            </td>
            <td>
                {bets.filter(b => b.bet == p.name).map(x => x.name).join(", ")}                
            </td>
        </tr>)
        return <div><div>Live</div>
        
        <div className="divBets">
            Bets: <button onClick={this.reloadBets.bind(this,db)}>Reload</button> 
            {db.locked ? <span className="locked">Locked</span> : <span></span>}
            <table className="tblBets" cellSpacing="0">
                 <tbody>
                    {lbets}
                </tbody>
            </table>
            
        </div>

        <div className="divTable">
            <table>
                <thead><th><td>Players</td></th></thead>
                <tbody>
                {lSummary}
                </tbody>
            </table>
        </div>
        </div> 
    }
}
