import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import LoadingIndicator from '../components/loadinginicator/LoadingIndicator';

class EntryPoint extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        if(this.props.entryPoint === 'SelectScene'){
            Actions.replace('selectScreen');
        } else if(this.props.entryPoint === 'BooksScene'){
            Actions.replace('booksList');
        } else if(this.props.entryPoint === 'WhispersScene'){
            Actions.replace('whispersList');
        } else if(this.props.entryPoint === 'WhispersOfTheDayScene'){
            Actions.replace('whispersOfTheDay');
        } else {
            Actions.replace('searchScreen');
        }
    }

    render() {
        return <LoadingIndicator size='large' height={80}/>;
    }
}

const mapStateToProps = state => {
    return state.entryPoint;
}

export default connect(mapStateToProps)(EntryPoint);