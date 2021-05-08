import { Component } from 'react';
import './Snowman.css';
import axios from './../../node_modules/axios';

class Snowman extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mistake: 0,
            guessed: new Set(["-"]),
            answer: "hello",
            category: "got"
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.resetGame()
    }

    getName() {
        let url = ''
        if (this.state.category === "got") {
            let num = Math.floor(Math.random() * 2137 + 1);
            url = 'https://anapioficeandfire.com/api/characters/' + num;
        } else if (this.state.category === "starwars") {
            let num = Math.floor(Math.random() * 87 + 1);
            url = 'https://akabab.github.io/starwars-api/api/id/' + num + '.json';
        } else if (this.state.category === "office") {
            url = 'https://www.officeapi.dev/api/characters/random';
            axios.get(url)
                .then(json => this.setState({ answer: json.data.data.firstname.replace(/\s+/g, '-').toLowerCase() }))
                .catch(err => console.log(err.message));
            return;
        } else if (this.state.category === "mario") {
            let num = Math.floor(Math.random() * 78 + 1);
            url = 'https://api.kuroganehammer.com/api/characters/' + num;
            axios.get(url)
                .then(json => this.setState({ answer: json.data.DisplayName.replace(/\s+/g, '-').toLowerCase() }))
                .catch(err => console.log(err.message));
            return;
        } else if (this.state.category === "poke") {
            let num = Math.floor(Math.random() * 897 + 1);
            url = 'https://pokeapi.co/api/v2/pokemon/' + num;
            axios.get(url)
                .then(json => this.setState({ answer: json.data.forms[0].name.replace(/\s+/g, '-').toLowerCase() }))
                .catch(err => console.log(err.message));
            return;
        }
        axios.get(url)
            .then(json => this.setState({ answer: json.data.name.replace(/\s+/g, '-').toLowerCase() }))
            .catch(err => console.log(err.message));
    }

    handleGuess = e => {
        let letter = e.target.value;
        this.setState(st => ({
            guessed: st.guessed.add(letter),
            mistake: st.mistake + (st.answer.includes(letter) ? 0 : 1)
        }));
    }

    guessedWord() {
        return this.state.answer.split("").map(letter => (!(this.state.guessed.has(letter)) ? " _ " : (letter === "-" ? "-" : letter)))
    }

    generateButtons() {
        return "abcdefghijklmnopqrstuvwxyz0123456789é".split("").map(letter => (
            <button
                className="btn btn-lg btn-primary m-2"
                key={letter}
                value={letter}
                onClick={this.handleGuess}
                disabled={this.state.guessed.has(letter)}
            >{letter}</button>
        ));
    }

    // checkName() {
    //     let alph = "abcdefghijklmnopqrstuvwxyz-";
    //     for (let i = 0; i < this.state.answer.length; i++) {
    //         let found = false;
    //         for (let j = 0; j < alph.length; j++) {
    //             if (this.state.answer.charAt(i) === alph.charAt(j)) {
    //                 found = true;
    //             }
    //         }
    //         if (!found) {
    //             console.log(this.state.answer)
    //             //this.resetGame();
    //             return false;
    //         }
    //     }
    //     return true;
    // }

    nameCheck() {
        let alph = "abcdefghijklmnopqrstuvwxyz-";
        for (let i = 0; i < this.state.answer.length; i++) {
            if (!alph.includes(this.state.answer[i])) {
                //console.log("bad answer")
                return false;
            }
        }
    }

    resetGame = () => {
        this.getName();
        //if (this.nameCheck() === false) {
        //console.log("NAME CHANGE")
        //this.getName()
        //}
        // let alph = "abcdefghijklmnopqrstuvwxyz-";
        // for (let i = 0; i < this.state.answer.length; i++) {
        //     let found = false;
        //     for (let j = 0; j < alph.length; j++) {
        //         if (this.state.answer.charAt(i) === alph.charAt(j)) {
        //             found = true;
        //         }
        //     }
        //     if (!found) {
        //         console.log(this.state.answer)
        //         //this.resetGame();
        //     }
        // }
        this.setState({
            mistake: 0,
            guessed: new Set(["-"]),
            answer: "character"
        });
    }

    handleChange(event) {
        this.setState({ category: event.target.value });
        //console.log(this.state.category);
    }

    handleSubmit(event) {
        //alert('Your favorite flavor is: ' + this.state.category);
        event.preventDefault();
        this.resetGame();
    }

    render() {
        const gameOver = this.state.mistake >= 6;
        const isWinner = this.guessedWord().join("") === this.state.answer;
        let gameStat = this.generateButtons();

        if (gameOver) {
            gameStat = "You lost :(";
        }

        if (isWinner) {
            gameStat = "You won!";
        }

        return (
            <div className="snowman container">
                <h1>Character Guesser</h1>
                <div className="text-center">
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Choose a category:
                            <select className="form-control" value={this.state.value} onChange={this.handleChange}>
                                <option value="got">Game of Thrones</option>
                                <option value="starwars">Star Wars</option>
                                <option value="office">The Office</option>
                                <option value="mario">Smash Bros</option>
                                <option value="poke">Pokemon</option>
                            </select>
                        </label>
                        <br />
                        <input className="btn btn-info" type="submit" value="Submit" />
                    </form>
                    <p>Use the letters (and possibly numbers) below to guess the character!</p>
                    <p>*Numbers and a special character are provided mostly for the Star Wars category.</p>
                    <h1>{!gameOver ? this.guessedWord() : this.state.answer}</h1>
                    <p>{gameStat}</p>
                    <p>Wrong Guesses: {this.state.mistake} of 6</p>

                    <button className="btn btn-info" onClick={this.resetGame}>Reset</button>
                </div>
            </div >
        )
    }
}
//<p>{this.state.answer}</p>
export default Snowman;