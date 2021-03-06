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

    // firebase
    this.storage = firebase.storage()
    this.storageRef = this.storage.ref()
    this.storageFileListRef = this.storageRef.child('files')
    this.firestore = firebase.firestore()
    this.firestoreFileCollection = this.firestore.collection('files')

    // file input ref
    this.fileInput = React.createRef()

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

    // listen for changes in collection and update
    // state if entries added or removed
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
      this.setState({
        data: filesData
      })
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
      default:
        break
    }

    this.setState({
      newFile: newFileState
    })
  }

  handleUpload(e) {
    e.preventDefault()

    const file = this.fileInput.current.files[0]
    if (!file)
      return
    
    const username = this.state.newFile.username
    const description = this.state.newFile.description
    const fileName = this.fileInput.current.files[0].name
    const fileType = this.fileInput.current.files[0].type
    const newFileCollectionRef = this.storageRef.child(`files/${fileName}`)

    // upload file first to storage to get file path
    newFileCollectionRef.put(file).then( uploadedFile => {
      const filePath = uploadedFile.metadata.fullPath
      const fileCreatedAt = uploadedFile.metadata.updated

      // upload metadata obj to firestore
      this.firestoreFileCollection.add({
        createdAt: fileCreatedAt,
        filePath: filePath,
        name: fileName,
        description: description,
        type: fileType,
        uploadedBy: username
      }).then( result => {
        // reset file input field
        // to clear input
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

  // delete metadata from filestore
  // and file from storage
  handleDelete(docID, filePath) {
    // delete metadata in firestore
    this.firestoreFileCollection.doc(docID).delete().then( () => {
      // delete file 
      this.storageRef.child(filePath).delete()  
    })
  }

  // ugly handle but what the hell
  // it's just a prototype ;)
  // path should be set as link in <a> but
  // choose to not do it cuz I didn't want to get stuck
  // solving the promise, hope it's ok!
  handleShowFile(filePath) {
    this.storageRef.child(filePath).getDownloadURL().then( url => {
      window.open(url, '_blank')
    })
  }

  // force input field to reset
  // and re-render
  resetInputKey() {
    const randomString = Math.random().toString(36)
    this.setState({
      fileFieldKey: randomString
    })
  }

  render() {
    return (
      <div id="data-table">
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
                        {file.type === 'application/pdf' ? 
                          <i className="material-icons">picture_as_pdf</i> : 
                        ''}
                        {file.type === 'image/jpeg' ? 
                          <i className="material-icons">image</i> : 
                        ''}
                        {file.type === 'text/xml' ? 
                          <i className="material-icons">description</i> : 
                        ''}
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
                    className=""
                    value={this.state.newFile.username}
                    onChange={this.handleUploadFileChange} 
                  />
                </div>
                <div className="input-field col s4">
                  <input 
                    placeholder="Description"
                    id="description"
                    type="text"
                    className=""
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
                      className="file-path "
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