'use strict';

const fs = require('fs');
const readline = require('readline');

console.log("Categorias: ")
console.log("1. Categoria Master")
console.log("2. Categoria Sub-30 ")
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var data;
var numPlayers;
var categoria

rl.question("Digite o numero da categoria para o sorteio: ", (answer) => {
    switch(answer) {
        case "1": 
            data= fs.readFileSync('categoriaMaster.json', 'utf8');
            categoria = "MASTER"
        break
        case "2": 
            data= fs.readFileSync('categoriaSub30.json', 'utf8');   
            categoria = "SUB 30"
        break
    }
    rl.question("Digite o numero de jogadores por time: ", (answer) => {
   
        numPlayers = parseInt(answer);
        sortTeams(data)
        rl.close();
    });
});



function mountTeam(goalkeeper, players, teams) {
    let team = {
        nome: "Time " + (parseInt(teams.length) + 1),
        players: [] 
    }
    if (goalkeeper !== null) team.players.push(goalkeeper)
    
    var i;
    
    var numPlayersTmp = (goalkeeper !== null) ? (numPlayers-1) : numPlayers
    for(i=0;i < numPlayersTmp; i++) {
        var indexPlayer = Math.floor((Math.random() * (players.length)) + 0);
        if (players[indexPlayer] !== undefined) {
            team.players.push(players[indexPlayer])
            players.splice(indexPlayer, 1);
        }
    }
    teams.push(team)
}

function sort(goalkeepers, players, teams) {
    if (goalkeepers !== undefined && goalkeepers.length > 0 ) {
        for (let goalkeeper of goalkeepers) {
            mountTeam(goalkeeper, players,  teams)
        }
    }
    if (players !== undefined && players.length > 0) {
        var numRestTeams = Math.floor(players.length / numPlayers);
        var j;
        for(j=0; j < numRestTeams; j++) {
            mountTeam(null, players,  teams)
        }
    }
}

function sortTeams(data) {
    var championship = JSON.parse(data);
    var players = championship.players
    var goalkeepers = championship.goalkeepers


    console.log("Total de Jogadores: " + (players.length + goalkeepers.length))
    var teams = []
    sort(goalkeepers, players, teams)
   



    console.log("-----------------------------------")
    console.log("### I CAPEONATO DE FUTEBOL VIVACE ###")
    console.log("### " + categoria + " ###")

    for (let team of teams) {
        console.log("-----------------------------------")
        console.log("{{  " + team.nome + "  }}")
        var playerNum = 1;
        for(let player of team.players) {
            console.log("  "+playerNum+". " + player.nome) 
            playerNum++
        }
    }

    if (players.length > 0) {
        console.log("-----------------------------------")
        console.log("Jogadores que Sobraram: ( " +players.length+ " )");
        for(let player of players) {
            console.log(" - " + player.nome) 
            playerNum++
        }
    }

}