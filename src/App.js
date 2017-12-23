import React, {Component} from 'react';
import './components/App.css';
import firebase from 'firebase'
import YoutubePlayer from './components/youtube-player/youtube-player'
import config from './config'
import ClapAdapter from "./components/clap/clap";
import Clicker from "./components/clicker/clicker";

require("firebase/firestore");

var wtfApp = firebase.initializeApp(config);

// // You can retrieve services via the defaultApp variable...
// var defaultStorage = wtfApp.storage();
// var defaultDatabase = wtfApp.database();
//
// // ... or you can use the equivalent shorthand notation
// defaultStorage = firebase.storage();
// defaultDatabase = firebase.database();
//
// // Initialize Cloud Firestore through Firebase
// var db = firebase.firestore();

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            video: {},
            dataIndex: 0,
            wtfCount: 0,
            videoMode: false
        };
        this.onNextButtonClick = this.onNextButtonClick.bind(this);
        this.onWtfButtonClick = this.onWtfButtonClick.bind(this);
        this._onEnd = this._onEnd.bind(this);
        this._onPause = this._onPause.bind(this);
        this.incrementIndex = this.incrementIndex.bind(this);
        this._onReady = this._onReady.bind(this);
        this._mouseDownNext = this._mouseDownNext.bind(this);
    }

    onNextButtonClick() {
        this.incrementIndex();
    }

    _onEnd() {
        this.incrementIndex();
    }

    _onPause(event) {
        this.incrementIndex();
    }

    incrementIndex() {
        let index = this.state.dataIndex;
        if ((++index) === this.state.data.length) index = 0;
        this.setState({dataIndex: index, wtfCount: this.state.data[index].wtfCount});
    }

    onWtfButtonClick() {
        const wtfCount = this.state.wtfCount;
        this.setState({wtfCount: wtfCount + 1});
    }

    componentWillMount() {
        var db = firebase.firestore();
        //console.log(db);
        db.collection("videos").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log("doc.data(): ", doc.data());
                let docData = doc.data();
                this.setState({data: [...this.state.data, docData]});
            });
        });
    }

    _onReady() {
        console.log("_onReady");
        const index = this.state.dataIndex;
        const length = this.state.data.length;
        let randomIndex = Math.floor(Math.random() * length);
        //this.state.data[randomIndex].wtfCount
        this.setState({videoMode: true, dataIndex: randomIndex, wtfCount: 11})
    }

    openingContent = () => {
        return (
            <div>
                <h1 className="App-title">WHAT THE FUCK DID I JUST WATCH</h1>
            </div>
        )
    };

    render() {
        let data = this.state.data[this.state.dataIndex] ? this.state.data[this.state.dataIndex] : undefined;
        return (
            <div>
                <div className="App">
                    <header className="App-header">
                        {!this.state.videoMode && this.openingContent()}
                        {data && <YoutubePlayer videoId={data.url} onEnd={this._onEnd}
                                                onPause={this._onPause} onReady={this._onReady}/>}
                        {this.state.videoMode && <Clicker mouseDownNext={this._mouseDownNext}
                                                          mouseUpNext={this._mouseUpNext}/>}
                    </header>
                </div>
            </div>
        );
    }

    _mouseDownNext() {
        this.incrementIndex()
    }

    _mouseUpNext() {
        /*no op*/
    }
}

export default App;
