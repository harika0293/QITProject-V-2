import {
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  Layout,
  Text,
  Icon,
  Button,
  Divider,
  ButtonGroup,
  Modal,
  Input,
  Spinner,
} from '@ui-kitten/components';
import {BarChart, LineChart} from 'react-native-gifted-charts';
import {useNavigation} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import moment from 'moment';
import axios from 'axios';
import {auth, db} from '../../firebase';
import {PageLoader} from '../PScreen/PageLoader';
import {VictoryScatter, VictoryChart, VictoryTheme} from 'victory-native';
const ClockIcon = props => <Icon {...props} name="clock-outline" />;
const CalendarIcon = props => <Icon {...props} name="calendar" />;
const DFilter = ({route}) => {
  const {width, height} = Dimensions.get('window');
  const {patient} = route.params;
  const [description, setDescription] = useState('');
  const [text, setText] = React.useState('');
  const [tab, setTab] = React.useState('');
  const navigation = useNavigation();
  const [chartData, setChartData] = React.useState([]);
  const [date, setDate] = useState(new Date(Date.now()));
  const [open, setOpen] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [notes, SetNotes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const barData1 = [
    {value: 250, label: 'M'},
    {value: 500, label: 'T', frontColor: '#177AD5'},
    {value: 745, label: 'W', frontColor: '#177AD5'},
    {value: 320, label: 'T'},
    {value: 600, label: 'F', frontColor: '#177AD5'},
  ];
  const handleAlert = () => {
    db.collection('usersCollections')
      .doc(patient.index)
      .collection('alerts')
      .add({
        title: 'Alert',
        body: 'Alert Sent',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      })
      .then(() => {
        Alert.alert('Alert Sent');
      });
  };
  const handleNotes = () => {
    db.collection('usersCollections')
      .doc(patient.index)
      .collection('notes')
      .add({
        description: description,
        date: moment().format('YYYY-MM-DD'),
      })
      .then(() => {
        Alert.alert('Notes Added');
        setVisible(false);
        setDescription({value: ''});
      });
  };
  const handleDeleteNotes = () => {
    db.collection('usersCollections')
      .doc(patient.index)
      .collection('notes')
      .add({
        description: description,
        date: moment().format('YYYY-MM-DD'),
      })
      .then(() => {
        Alert.alert('Notes Deleted');
      });
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };
  const getFilter1 = date => {
    //setLoading(true);

    setTab('');
    date = moment(date).format('DD/MM/YYYY');
    axios
      .post('https://us-central1-docker-347218.cloudfunctions.net/Data-API', {
        date: date,
        email: 'dereckjos12@gmail.com',
        password: 'Vigilance@001',
      })
      .then(function (response) {
        setChartData(response?.data);
        setTab('cough');
        cleanData(tab, chartData?.x_cough, chartData?.y_cough);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useLayoutEffect(() => {
    const unsubscribe = db
      .collection('usersCollections')
      .doc(patient.index)
      .collection('notes')
      .orderBy('date', 'desc')
      .onSnapshot(snapshot =>
        SetNotes(
          snapshot.docs.map((doc, index) => ({
            index: index.toString(),
            description: doc.data().description,
            date: moment(doc.data().date).format('LL'),
          })),
        ),
      );
    return unsubscribe;
  }, []);
  const showMode = currentMode => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };
  const showDatepicker = () => {
    showMode('date');
  };
  const handleGraph = (value, data) => {
    switch (value) {
      case 'cough':
      case 'drink':
        var chart = (
          <BarChart
            width={width - 130}
            height={220}
            barWidth={20}
            barBorderRadius={5}
            frontColor="#0075A9"
            data={data}
            yAxisThickness={1}
            xAxisThickness={1}
            onPress={() =>
              navigation.navigate('PatientDetail', {
                patient: patient,
                text: text,
              })
            }
          />
        );
        setText(chart);
        break;
      case 'fall':
        var chart = (
          <LineChart
            height={220}
            barWidth={10}
            barBorderRadius={5}
            yAxisThickness={1}
            xAxisThickness={1}
            thickness={3}
            strokeColor="#0075A9"
            curved="true"
            dataPointColor="0075A9"
            color="#0075A9"
            width={width - 100}
            data={data}
            onPress={() =>
              navigation.navigate('PatientDetail', {
                patient: patient,
                text: text,
              })
            }
          />
        );
        setText(chart);
        break;
      case 'sleep':
        var chart = (
          <VictoryChart
            theme={VictoryTheme.material}
            height={220}
            barWidth={190}
            barBorderRadius={30}
            yAxisThickness={1}
            xAxisThickness={1}
            domain={{y: [1, 3]}}
            domainPadding={7}
            width={width - 50}>
            <VictoryScatter
              style={{data: {fill: '#0075A9'}}}
              size={5}
              height={220}
              barWidth={100}
              barBorderRadius={5}
              yAxisThickness={1}
              xAxisThickness={1}
              data={data}
              onPress={() =>
                navigation.navigate('PatientDetail', {
                  patient: patient,
                  text: text,
                })
              }
            />
          </VictoryChart>
        );
        setText(chart);
        break;
    }
  };
  useEffect(() => {
    getFilter1(date);
  }, [date]);
  const cleanScatterData = (tab, sleeping_x, sleeping_y) => {
    var h = {};
    if (sleeping_x) {
      sleeping_x.forEach(function (v, i) {
        if (h.hasOwnProperty(v.split(':')[0] + v.slice(-2))) {
          h[v.split(':')[0] + v.slice(-2)] = h[v.split(':')[0] + v.slice(-2)] =
            sleeping_y[i];
        } else {
          h[v.split(':')[0] + v.slice(-2)] = sleeping_y[i];
        }
      });
      let data = Object.keys(h).map(date => {
        var day = date.replace(/^0+/, '');
        return {
          x: day,
          y: h[date],
        };
      });
      handleGraph(tab, data);
    }
  };
  const cleanData = (tab, hours, count) => {
    var h = {};
    if (hours) {
      hours.forEach(function (v, i) {
        if (h.hasOwnProperty(v.split(':')[0] + v.slice(-2))) {
          h[v.split(':')[0] + v.slice(-2)] = h[v.split(':')[0] + v.slice(-2)] +=
            count[i];
        } else {
          h[v.split(':')[0] + v.slice(-2)] = count[i];
        }
      });
      let data = Object.keys(h).map(date => {
        var day = date.replace(/^0+/, '');
        return {
          label: day,
          value: h[date],
        };
      });
      handleGraph(tab, data);
    } else {
      handleGraph(tab, []);
    }
  };
  useEffect(() => {
    let hours;
    let count;
    switch (tab) {
      case 'cough':
        hours = chartData?.x_cough;
        count = chartData?.y_cough;
        cleanData(tab, hours, count);
        break;
      case 'drink':
        hours = chartData?.x_drink;
        count = chartData?.y_drink;
        cleanData(tab, hours, count);
        break;
      case 'fall':
        hours = chartData?.fall_x_cord;
        count = chartData?.fall_y_cord;
        cleanData(tab, hours, count);
        break;
      case 'sleep':
        hours = chartData?.sleeping_x;
        count = chartData?.sleeping_y;
        cleanScatterData(tab, hours, count);
        break;
    }
  }, [tab]);
  return loading ? (
    <PageLoader />
  ) : (
    <SafeAreaView>
      <Layout style={styles.Container}>
        <ScrollView>
          <Image source={require('../../assets/colored-bg.jpeg')} />
          <Layout style={styles.Arrow}>
            <Icon
              style={styles.arrow}
              fill="#fff"
              name="arrow-back"
              onPress={() => navigation.navigate('DHome')}
            />
          </Layout>
          <Image
            style={styles.UserImg}
            source={require('../../assets/user2.png')}
            resizeMode="contain"
          />
          <Text style={styles.Name}>{patient.name}</Text>
          <Text style={styles.Role}>Patient</Text>
          <Layout style={styles.Button} level="1">
            <Button
              style={styles.buttontrn}
              appearance="outline"
              onPress={handleAlert}>
              {evaProps => (
                <Text {...evaProps} style={styles.Alert}>
                  Alert Now
                </Text>
              )}
            </Button>
            <Button
              style={styles.button}
              appearance="filled"
              onPress={() => navigation.navigate('DChat', {thread: patient})}>
              Message Now
            </Button>
            <Button
              style={styles.buttontrn}
              appearance="outline"
              onPress={() =>
                navigation.navigate('DDetails', {patient: patient})
              }>
              {evaProps => (
                <Text {...evaProps} style={styles.More}>
                  More
                </Text>
              )}
            </Button>
          </Layout>
          <Divider />
          <Layout style={styles.Details}>
            <Text style={styles.DetailsOne}>Filter Details of Patient</Text>
            <TouchableOpacity
              style={styles.ShowDP}
              onPress={() => showDatepicker()}>
              <Icon
                style={{height: 25, width: 25}}
                fill="#0075A9"
                name="calendar"
              />
              <Text style={styles.CalendarOne}>
                {moment(date).format('DD-MM-YYYY')}
              </Text>
            </TouchableOpacity>
            <ButtonGroup style={styles.btngroup}>
              <Button style={styles.btn} onPress={() => setTab('cough')}>
                Cough
              </Button>
              <Button style={styles.btn} onPress={() => setTab('drink')}>
                Drink
              </Button>
              <Button style={styles.btn} onPress={() => setTab('fall')}>
                Fall
              </Button>
              <Button style={styles.btn} onPress={() => setTab('sleep')}>
                Sleep
              </Button>
            </ButtonGroup>
            <Text style={styles.DataGraph}>{`${tab} data graph`}</Text>
            {text}
          </Layout>
          <Layout style={styles.Notes}>
            <Text style={styles.Recent}>
              Recent
              <Text style={styles.Notes}> Notes</Text>
            </Text>
            {notes.length === 0 ? (
              <Text>No Notes</Text>
            ) : (
              <FlatList
                style={styles.listStyle}
                keyExtractor={key => {
                  return key.index;
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={notes}
                renderItem={({item}) => {
                  return (
                    <>
                      <Layout style={styles.textStyle}>
                        <Layout style={styles.circle}></Layout>
                        {/*
                      <TouchableOpacity
                          onPress={() => navigation.navigate('DFilter')}>
                          <Icon
                            name="trash-2-outline"
                            fill="red"
                            style={styles.cross}
                          />
                  </TouchableOpacity> */}
                        <Text style={styles.Date}>Date:{item.date}</Text>
                        <Text style={styles.Desc}>{item.description}</Text>
                      </Layout>
                    </>
                  );
                }}
              />
            )}
            <TouchableOpacity onPress={() => setVisible(true)}>
              <Layout style={styles.add}>
                <Text style={styles.AddNew}>+ Add New</Text>
              </Layout>
            </TouchableOpacity>
          </Layout>
          <Modal
            style={styles.model}
            visible={visible}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => setVisible(false)}>
            <Layout style={styles.mainContainer}>
              <Layout style={styles.Head}>
                <DatePicker
                  modal
                  open={open}
                  date={date}
                  onConfirm={date => {
                    setOpen(false);
                    setDate(date);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
                <Icon
                  style={styles.icon}
                  fill="#0F7BAB"
                  name="file-add-outline"
                />
                <Text style={styles.AddNotes}>Add Notes</Text>
                <Icon
                  onPress={() => setVisible(false)}
                  style={styles.icon1}
                  fill="#8F9BB3"
                  name="close-outline"
                />
              </Layout>
              <Layout style={styles.notes}>
                {/* <Input
              label={evaProps => <Text {...evaProps} style={styles.Time}>Time</Text>}
              accessoryRight={ClockIcon}
              placeholder="hy"
              multiline={true}
              textStyle={{ minHeight: 40 }}
              date={date}
            />
            <TouchableOpacity style={styles.DateTwo} onPress={() => setOpen(true)}></TouchableOpacity> */}
                {/* <Datepicker
              label={evaProps => <Text {...evaProps} style={styles.DateOne}>Date</Text>}
              accessoryRight={CalendarIcon}
              size="large"
              date={date}
              onSelect={nextDate => setDate(nextDate)}
              style={styles.date}
            /> */}
                <Input
                  multiline={true}
                  value={description}
                  textStyle={{minHeight: 70}}
                  onChangeText={text => setDescription(text)}
                  label={evaProps => (
                    <Text {...evaProps} style={styles.TextNote}>
                      Text Note
                    </Text>
                  )}
                  style={styles.TextNote2}
                />
                <Button
                  onPress={handleNotes}
                  style={styles.button}
                  size="large">
                  Add Note
                </Button>
              </Layout>
            </Layout>
          </Modal>
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};
export default DFilter;
const styles = StyleSheet.create({
  Container: {
    height: '100%',
  },
  Name: {
    marginTop: 60,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Recoleta-Bold',
  },
  Arrow: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 20,
    left: 20,
  },
  Role: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 5,
    paddingBottom: 20,
    fontFamily: 'GTWalsheimPro-Bold',
    color: 'grey',
  },
  Alert: {
    color: '#0F7BAB',
    fontFamily: 'GTWalsheimPro-Bold',
  },
  DateTwo: {
    backgroundColor: 'transparent',
    height: 50,
    width: '100%',
    position: 'absolute',
    top: 25,
  },
  ShowDP: {
    marginTop: 5,
    flexDirection: 'row',
  },
  DateOne: {
    fontFamily: 'GTWalsheimPro-Bold',
    marginBottom: 5,
  },
  Time: {
    fontFamily: 'GTWalsheimPro-Bold',
    marginBottom: 5,
  },
  Notes: {
    fontSize: 20,
    color: '#0075A9',
    fontFamily: 'GTWalsheimPro-Bold',
    paddingTop: 15,
  },
  CalendarOne: {
    fontSize: 16,
    fontFamily: 'Recoleta-Bold',
    left: 15,
  },
  AddNew: {
    fontSize: 18,
    fontFamily: 'GTWalsheimPro-Regular',
    color: '#0075A9',
  },

  Desc: {
    fontSize: 14,
    paddingTop: 10,
    fontFamily: 'GTWalsheimPro-Regular',
  },
  AddNotes: {
    fontSize: 22,
    fontFamily: 'Recoleta-Bold',
    marginLeft: 60,
  },
  TextNote2: {
    marginTop: 30,
    marginBottom: 30,
  },
  Date: {
    fontSize: 14,
    marginLeft: 12,
    marginBottom: 20,
    fontFamily: 'GTWalsheimPro-Bold',
  },
  Recent: {
    fontSize: 20,
    fontFamily: 'GTWalsheimPro-Bold',
    paddingTop: 15,
  },
  More: {
    color: '#0F7BAB',
    fontFamily: 'GTWalsheimPro-Bold',
  },
  DetailsOne: {
    fontSize: 18,
    fontFamily: 'Recoleta-Bold',
    paddingBottom: 10,
  },
  TextNote: {
    fontFamily: 'GTWalsheimPro-Bold',
    marginBottom: 5,
    marginTop: -30,
  },
  arrow: {
    height: 30,
    width: 30,
  },
  UserImg: {
    height: 100,
    width: 100,
    position: 'absolute',
    marginTop: 50,
    left: 140,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#0F7BAB',
  },
  Button: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  buttontrn: {
    marginLeft: 20,
    backgroundColor: 'white',
    borderColor: '#0F7BAB',
    color: '#0F7BAB',
  },
  DataGraph: {
    fontSize: 17,
    fontFamily: 'Recoleta-Bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: -20,
  },

  button: {
    marginLeft: 20,
    backgroundColor: '#0F7BAB',
    borderColor: 'transparent',
  },
  Details: {
    marginHorizontal: 30,
    marginTop: 20,
  },
  btngroup: {
    marginTop: 20,
    marginBottom: 40,
  },
  btn: {
    backgroundColor: '#0F7BAB',
    borderColor: 'transparent',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  Notes: {
    marginHorizontal: 30,
  },
  textStyle: {
    backgroundColor: '#FFF3CE',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 30,
    width: 200,
  },
  circle: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    position: 'absolute',
    marginTop: 14,
    marginLeft: 5,
  },
  add: {
    marginTop: 20,
    left: 250,
    marginBottom: 30,
  },
  model: {
    height: '100%',
    width: '90%',
  },
  mainContainer: {
    height: '100%',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  Head: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    width: 32,
    height: 32,
  },
  icon1: {
    width: 32,
    height: 32,
    marginLeft: 60,
  },
  notes: {
    marginTop: 40,
  },
  date: {
    marginTop: 30,
  },
  cale: {
    heigth: 25,
    width: 25,
  },
  cross: {
    width: 18,
    height: 18,
    position: 'absolute',
    right: 0,
    bottom: -85,
  },
});
