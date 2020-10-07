import React, { Component } from 'react'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDpcKnCM6_nrRXJ1hSLtteThHb9Txhb04M',
  authDomain: 'prototyp-1fee0.firebaseapp.com',
  databaseURL: 'https://prototyp-1fee0.firebaseio.com',
  projectId: 'prototyp-1fee0',
  storageBucket: 'gs://prototyp-1fee0.appspot.com/',
  messagingSenderId: '726974774495',
  appId: '1:726974774495:web:9295ebd10de056f9f6bd6a'
}

var storage,
    storageRef,
    storageFileListRef,
    firestore,
    firestoreFileList


class DataTable extends Component {

  constructor(props) {
    super (props)

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    }

    this.state = {
      files: {}
    }
  }

  UNSAFE_componentWillMount() {

    firebase.auth().signInAnonymously().then( result => {
      console.log('signed in as anon')
    })

    storage = firebase.storage()
    storageRef = storage.ref()
    storageFileListRef = storageRef.child('files')
    firestore = firebase.firestore()
    firestoreFileList = firestore.collection('files')

    this.getFileList()

  }

  getFileList() {
    
    firestoreFileList.get().then((result) => {
      //each doc
      result.docs.map( doc => console.log(doc.data() ) )
    }).catch((error) => {
      console.log(error)
    })

    storageFileListRef.listAll().then( res {
      res.prefixes.forEach( folderRef => {
        // All the prefixes under storageFileListRef.
        // You may call listAll() recursively on them.
      });
      res.items.forEach( itemRef => {
        // All the items under storageFileListRef.
        console.log('itemRef', itemRef)
      });
      }).catch( error => {
        console.log(error.serverResponse_)
      // Uh-oh, an error occurred!
    })
  }

  render() {
    return (
      <div className="row">
        <div className="col s12">
          <table>
            <thead>
              <tr>
                  <th></th>
                  <th>Filename</th>
                  <th>Description</th>
                  <th>Uploaded by</th>
                  <th>Date</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Alvin</td>
                <td>Alvin</td>
                <td>Eclair</td>
                <td>$0.87</td>
                <td>Alvin</td>
              </tr>
              <tr>
                <td>Alan</td>
                <td>Jellybean</td>
                <td>$3.76</td>
                <td>Alvin</td>
                <td>Alvin</td>
              </tr>
              <tr>
                <td>Jonathan</td>
                <td>Lollipop</td>
                <td>$7.00</td>
                <td>Alvin</td>
                <td>Alvin</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

}

export default DataTable