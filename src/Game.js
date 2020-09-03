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
    constructor(props)
    {
        super(props);
        this.state = {
            dbid: null
        }
    }
    componentDidMount() {
        console.log(this.getQueryVariable('db'));
        var dbid = this.getQueryVariable('db');
        this.setState({dbid:dbid})

        //get game summary
        fetch("http://localhost:5000/api/getState?db=" + dbid)
        .then(res => res.json())
        .then(json => {
            console.log(json)
            return {players : json.players}
        })
        .catch(p => {
            return {players : []}
        }).finally(p => {
            console.log("PLAYERS")
            console.log(p)
        })
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
            if(pair[0] == variable){return pair[1];}
             }
             return(false);
    }

    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    render() {
        
        let {dbid} = this.state

        return (  
        <div>
            <h3>IDs: {dbid}</h3>
        </div>
        );
    }
  }
