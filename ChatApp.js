import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

const bot = {
				_id: 2,
				name: 'GALAXY',
				avatar: 'http://apodapp.com/images/icon_googleplay.png',
			}; 

export default class App extends React.Component {

	static navigationOptions = {
		header: null
	};

	state = {
		messages: [],
		currentConnections: {}
	};

	componentWillMount() {
		this.setState({

			messages: [
				{
					_id: 1,
					text: 'search for a topic to learn about, then say "GALAXY" to explore the topic',
					createdAt: new Date(),
					user: bot,
				},
			],

		});
	}

	async gotonext() {
		this.props.navigation.navigate('GraphApp', {connections: this.state.currentConnections, buttonClicked:text=>this.newmessage(text)})
	}

	onSend(messages = []) {
		this.setState((previousState) => ({
			messages: GiftedChat.append(previousState.messages, messages),
		}));

		if (messages[0].text == "GALAXY") {
			this.gotonext()
			return
		}

		try {
			responseText = this.sendtoserver(messages[0].text); 
		} catch (error) {
			console.log(error); 
		}
	}

	async sendtoserver(text) {
		// const response = await fetch("http://localhost:8080/messages/" + encodeURI(text)); 
		const response = await fetch("https://backgalaxy.crumb33.hasura-app.io/messages/" + encodeURI(text)); 
		const data = await response.json(); 

		var numofmessages = this.state.messages.length; 

		var message = {
			_id: numofmessages+1,
			text: data.message,
			createdAt: new Date(),
				user: bot,
		}

		this.setState((previousState) => ({
			messages: GiftedChat.append(previousState.messages, message),
			currentConnections: data.explore_terms
		}));

		// console.log("chatapp curr conn \n" + JSON.stringify(this.state.currentConnections)); 
	}

	newmessage(text) {
		var numofmessages = this.state.messages.length; 
		var message = {
			_id: numofmessages+1,
			text: text,
			createdAt: new Date(),
			user: { _id: 1, },
		}

		this.setState((previousState) => ({
			messages: GiftedChat.append(previousState.messages, message),
		}));

		this.sendtoserver(text)
	}


	render() {
		return (
			<GiftedChat
				messages={this.state.messages}
				onSend={(messages) => this.onSend(messages)}
				user={{
					_id: 1,
				}}
			/>
		);
	}
}
