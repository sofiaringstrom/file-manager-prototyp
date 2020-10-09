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


class DataTable extends Component {

  constructor(props) {
    super (props)

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    }

    this.state = {
      storage: '',
      storageRef: '',
      storageFileListRef: '',
      firestore: '',
      firestoreFileCollection: '',
      newFile: {
        file: '',
        description: '',
        username: ''
      }
    }

    this.storage = firebase.storage()
    this.storageRef = this.storage.ref()
    this.storageFileListRef = this.storageRef.child('files')
    this.firestore = firebase.firestore()
    this.firestoreFileCollection = this.firestore.collection('files')

    this.fileInput = React.createRef();

    this.handleUploadFileChange = this.handleUploadFileChange.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.resetInputKey = this.resetInputKey.bind(this)
  }

  UNSAFE_componentWillMount() {

    firebase.auth().signInAnonymously().then( result => {
      console.log('signed in as anon')
    })

    this.getFileList()
  }

  getFileList() {
    
    this.firestoreFileCollection.onSnapshot( querySnapshot => {
      let filesData = []
      querySnapshot.forEach( doc => {
        filesData.push({
          name: doc.data().name,
          description: doc.data().description,
          uploadedBy: doc.data().uploadedBy,
          createdAt: doc.data().createdAt,
          id: doc.id,
          type: doc.data().type,
          filePath: doc.data().filePath
        })
      })
      //console.log('filesData', filesData)
      this.setState({
        data: filesData
      })
    })

    this.storageFileListRef.listAll().then( res => {
      res.prefixes.forEach( folderRef => {
        // All the prefixes under storageFileListRef.
        // You may call listAll() recursively on them.
      });
      res.items.forEach( itemRef => {
        // All the items under storageFileListRef.
        //console.log('itemRef', itemRef)
      });
      }).catch( error => {
        console.log(error.serverResponse_)
      // Uh-oh, an error occurred!
    })
  }

  handleUploadFileChange(e) {
    let newFileState = this.state.newFile

    switch (e.target.id) {
      case 'username':
        newFileState.username = e.target.value
        break
      case 'description':
        newFileState.description = e.target.value
        break
    }

    this.setState({
      newFile: newFileState
    })
  }

  handleUpload(e) {
    console.log('handleUpload')
    e.preventDefault()
    
    console.log(this.fileInput)

    const username = this.state.newFile.username
    const description = this.state.newFile.description
    const file = this.fileInput.current.files[0]
    const fileName = this.fileInput.current.files[0].name
    const fileType = this.fileInput.current.files[0].type

    const newFileRef = this.storageRef.child(fileName)
    const newFileCollectionRef = this.storageRef.child(`files/${fileName}`)
    // upload file first
    newFileCollectionRef.put(file).then( uploadedFile => {
      console.log('upload done', uploadedFile)
      const filePath = uploadedFile.metadata.fullPath
      const fileCreatedAt = uploadedFile.metadata.updated

      // upload metadata obj
      this.firestoreFileCollection.add({
        createdAt: fileCreatedAt,
        filePath: filePath,
        name: fileName,
        description: description,
        type: fileType,
        uploadedBy: username
      }).then( result => {
        console.log('firestore uploaded', result)

        this.resetInputKey()
        this.setState({
          newFile: {
            file: '',
            description: '',
            username: ''
          }
        })
      })

    })
  }

  handleDelete(docID, filePath) {
    // delete metadata in firestore
    this.firestoreFileCollection.doc(docID).delete().then( () => {
      // delete file 
      this.storageRef.child(filePath).delete().then( () => {
        console.log('all done!')
      })      
    })
  }

  // ugly handle but what the hell
  handleShowFile(filePath) {
    let path = this.storageRef.child(filePath).getDownloadURL().then( url => {
      window.open(url, '_blank');
    })
  }

  resetInputKey() {
    // force input field to reset
    let randomString = Math.random().toString(36);
    this.setState({
      fileFieldKey: randomString
    });
  }

  render() {
    return (
      <div className="">
        <div className="row">
          <div className="col s12">
            <h1 className="center">File Manager</h1>
          </div>
        </div>
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
                      <td>
                        {file.type === 'application/pdf' ? <i className="material-icons">picture_as_pdf</i> : ''}
                        {file.type === 'image/jpeg' ? <i className="material-icons">image</i> : ''}
                        {file.type === 'text/xml' ? <i className="material-icons">description</i> : ''}
                      </td>
                      <td><a href="#" onClick={this.handleShowFile.bind(this, file.filePath)}>{file.name}</a></td>
                      <td>{file.description}</td>
                      <td>{file.uploadedBy}</td>
                      <td>{file.createdAt.split('T')[0]}</td>
                      <td><a href="#" onClick={this.handleDelete.bind(this, file.id, file.filePath)}>Delete</a></td>
                    </tr>)
                }) : null}
              </tbody>
            </table>
            {this.state.data && !this.state.data.length ? <p>No entries, pls upload files.</p> : ''}
          </div>
        </div>
        <div className= "row">
          <form className="col s12" action="#">
              <div className="row">
                <h6 className="center">Upload file</h6>
                <div className="input-field col s4">
                  <input 
                    placeholder="Username" 
                    id="username" 
                    type="text" 
                    className="validate"
                    value={this.state.newFile.username}
                    onChange={this.handleUploadFileChange} 
                  />
                </div>
                <div className="input-field col s4">
                  <input 
                    placeholder="Description"
                    id="description"
                    type="text"
                    className="validate"
                    value={this.state.newFile.description}
                    onChange={this.handleUploadFileChange}
                  />
                </div>
                <div className="file-field input-field col s4">
                  <div className="file-path-wrapper">
                    <input 
                      type="file"
                      ref={this.fileInput}
                      accept=".xml, .pdf, .jpeg"
                    />
                    <input 
                      className="file-path validate"
                      id="choose-file"
                      type="text"
                      placeholder="Choose file"
                      key={this.state.fileFieldKey || '' }
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12 center">
                  <button 
                    className="btn waves-effect waves-light" 
                    type="submit" 
                    name="action"
                    onClick={this.handleUpload}
                  >
                    Upload
                  </button> 
                </div>
              </div>
            </form>
        </div>
      </div>
    )
  }

}

export default DataTable