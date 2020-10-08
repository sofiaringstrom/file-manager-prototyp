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

  uploadFile() {

  }

  getFileList() {
    
    firestoreFileList.get().then( result => {
      //each doc
      
      let filesData = []
      result.docs.map( doc => {
        console.log('doc.data', doc.data())
        filesData.push({
          name: doc.data().name,
          description: doc.data().description,
          uploadedBy: doc.data().uploadedBy,
          createdAt: doc.data().createdAt,
          id: doc.data().id,
          type: doc.data().type
        })
      })
      console.log('filesData', filesData)
      this.setState({
        data: filesData
      })
    }).catch((error) => {
      console.log(error)
    })

    storageFileListRef.listAll().then( res => {
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
                  <th></th>
              </tr>
            </thead>

            <tbody>
              {this.state.data ? this.state.data.map( file => {
                return (
                  <tr key={file.id}>
                    <td>{file.type}</td>
                    <td>{file.name}</td>
                    <td>{file.description}</td>
                    <td>{file.uploadedBy}</td>
                    <td>{file.createdAt.seconds}</td>
                    <td>Download | Edit | Delete</td>
                  </tr>)
              }) : null}
            </tbody>
          </table>
        </div>
        <form className="col s12" action="#">
            <div className="row">
              <h6>Upload file</h6>
              <div className="input-field col s3">
                <input placeholder="Username" id="username" type="text" className="validate" />
              </div>
              <div className="input-field col s3">
                <input placeholder="Description" id="description" type="text" className="validate" />
              </div>
              <div className="file-field input-field col s3">
                <div className="file-path-wrapper">
                  <input className="file-path validate" id="choose-file" type="text" placeholder="Choose file" />
                </div>
              </div>
              <div className="input-field col s3">
                <button className="btn waves-effect waves-light" type="submit" name="action">
                  Upload
                </button> 
              </div>
            </div>
          </form>
      </div>
    )
  }

}

export default DataTable