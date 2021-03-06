import React, {useState} from "react";
import {SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View} from "react-native";
import styles from "./styles";
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from "@react-native-firebase/firestore";
import Toast from "react-native-simple-toast";
import auth from "@react-native-firebase/auth";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";

const NewEventScreen = (props) => {
    const [date, setDate] = useState(new Date());
    const [eventDetails, setEventDetails] = useState({
        event_name: null,
        meet_up_point_name: '',
        destination_point_name: '',
        meetup: new firestore.GeoPoint(0, 0),
        destination: new firestore.GeoPoint(0, 0),
        members: [firestore().collection('users').doc(auth().currentUser.uid)],
        description: null,
        start_date_time: new firestore.Timestamp(0, 0)
    })
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        setEventDetails({
            ...eventDetails,
            start_date_time: new firestore.Timestamp(currentDate.getTime(), 0)
        });
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    return (
        <SafeAreaView style={styles.newEventContainer}>
            <StatusBar backgroundColor="white" barStyle="dark-content"/>
            <View style={styles.headerBar}>
                <Ionicons size={32} name='menu' onPress={() => props.navigation.openDrawer()}/>
                <Text style={styles.headerText}>New Event</Text>
            </View>
            <TextInput style={styles.destinationTextInput}
                       onChangeText={(eventName) => setEventDetails({...eventDetails, event_name: eventName})}
                       value={eventDetails.event_name} placeholder="Event Name"/>
            <TextInput style={styles.destinationTextInput}
                       onChangeText={(meetUpPointName) => setEventDetails({...eventDetails, meet_up_point_name: meetUpPointName})}
                       value={eventDetails.meet_up_point_name} placeholder="Meet Up Point Name"/>
            <TextInput style={styles.destinationTextInput}
                       onChangeText={(destinationPointName) => setEventDetails({...eventDetails, destination_point_name: destinationPointName})}
                       value={eventDetails.destination_point_name} placeholder="Destination Point Name"/>
            {/*<GooglePlacesAutocomplete*/}
            {/*    placeholder='Meet Up Place?'*/}
            {/*    onPress={(data, details = null) => {*/}
            {/*        setMeetUpPlace({data,details});*/}
            {/*    }}*/}
            {/*    styles={{textInput: styles.destinationTextInput}}*/}
            {/*    query={{*/}
            {/*        key: 'API_KEY',*/}
            {/*        language: 'en',*/}
            {/*    }}*/}
            {/*/>*/}
            {/*<GooglePlacesAutocomplete*/}
            {/*    placeholder='Destination?'*/}
            {/*    onPress={(data, details = null) => {*/}
            {/*        console.log("onPress")*/}
            {/*        setDestinationPlace({data,details});*/}
            {/*    }}*/}
            {/*    styles={{textInput: styles.destinationTextInput}}*/}
            {/*    query={{*/}
            {/*        key: 'API_KEY',*/}
            {/*        language: 'en',*/}
            {/*    }}*/}
            {/*/>*/}
            <TouchableOpacity style={styles.showDateTimePickerContainer} onPress={showDatepicker}>
                <Text style={styles.PlaceholderText}>{date.toDateString()}</Text>
                <MaterialIcons size={25} color={'#8e8a8a'} name={"date-range"}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.showDateTimePickerContainer} onPress={showTimepicker}>
                <Text style={styles.PlaceholderText}>{date.toTimeString()}</Text>
                <MaterialIcons size={25} color={'#8e8a8a'} name={"access-time"}/>
            </TouchableOpacity>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
            <TextInput style={styles.descriptionTextInput}
                       onChangeText={(description) => setEventDetails({...eventDetails, description: description})}
                       value={eventDetails.description} placeholder="Description"/>
            <View style={styles.buttonBox}>
                <TouchableOpacity style={styles.bottom} onPress={() => {
                    firestore()
                        .collection('events')
                        .add(eventDetails)
                        .then(() => {
                            Toast.show('Event added!');
                            props.navigation.navigate('EventsScreen');
                        });
                }}>
                    <Text style={{
                        color: '#fff',
                        alignContent: 'center',
                        padding: 10,
                        fontWeight: 'bold',
                        fontSize: 20
                    }}>Create</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default NewEventScreen;