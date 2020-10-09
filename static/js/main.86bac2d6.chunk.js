(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{16:function(e,t,a){e.exports=a(30)},21:function(e,t,a){},30:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),i=a(15),r=a.n(i),c=a(8),s=a(9),o=a(10),d=a(11),u=a(4),p=(a(21),a(3)),f=a(5);a(23),a(31),a(25);function h(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}();return function(){var a,n=Object(u.a)(e);if(t){var l=Object(u.a)(this).constructor;a=Reflect.construct(n,arguments,l)}else a=n.apply(this,arguments);return Object(d.a)(this,a)}}var m={apiKey:"AIzaSyDpcKnCM6_nrRXJ1hSLtteThHb9Txhb04M",authDomain:"prototyp-1fee0.firebaseapp.com",databaseURL:"https://prototyp-1fee0.firebaseio.com",projectId:"prototyp-1fee0",storageBucket:"gs://prototyp-1fee0.appspot.com/",messagingSenderId:"726974774495",appId:"1:726974774495:web:9295ebd10de056f9f6bd6a"},y=function(e){Object(o.a)(a,e);var t=h(a);function a(e){var n;return Object(c.a)(this,a),n=t.call(this,e),f.apps.length||f.initializeApp(m),n.state={storage:"",storageRef:"",storageFileListRef:"",firestore:"",firestoreFileCollection:"",newFile:{file:"",description:"",username:""}},n.storage=f.storage(),n.storageRef=n.storage.ref(),n.storageFileListRef=n.storageRef.child("files"),n.firestore=f.firestore(),n.firestoreFileCollection=n.firestore.collection("files"),n.fileInput=l.a.createRef(),n.handleUploadFileChange=n.handleUploadFileChange.bind(Object(p.a)(n)),n.handleUpload=n.handleUpload.bind(Object(p.a)(n)),n.handleDelete=n.handleDelete.bind(Object(p.a)(n)),n.resetInputKey=n.resetInputKey.bind(Object(p.a)(n)),n}return Object(s.a)(a,[{key:"UNSAFE_componentWillMount",value:function(){f.auth().signInAnonymously().then(function(e){console.log("signed in as anon")}),this.getFileList()}},{key:"getFileList",value:function(){var e=this;this.firestoreFileCollection.onSnapshot(function(t){var a=[];t.forEach(function(e){a.push({name:e.data().name,description:e.data().description,uploadedBy:e.data().uploadedBy,createdAt:e.data().createdAt,id:e.id,type:e.data().type,filePath:e.data().filePath})}),e.setState({data:a})})}},{key:"handleUploadFileChange",value:function(e){var t=this.state.newFile;switch(e.target.id){case"username":t.username=e.target.value;break;case"description":t.description=e.target.value}this.setState({newFile:t})}},{key:"handleUpload",value:function(e){var t=this;e.preventDefault();var a=this.fileInput.current.files[0];if(a){var n=this.state.newFile.username,l=this.state.newFile.description,i=this.fileInput.current.files[0].name,r=this.fileInput.current.files[0].type;this.storageRef.child("files/".concat(i)).put(a).then(function(e){var a=e.metadata.fullPath,c=e.metadata.updated;t.firestoreFileCollection.add({createdAt:c,filePath:a,name:i,description:l,type:r,uploadedBy:n}).then(function(e){t.resetInputKey(),t.setState({newFile:{file:"",description:"",username:""}})})})}}},{key:"handleDelete",value:function(e,t){var a=this;this.firestoreFileCollection.doc(e).delete().then(function(){a.storageRef.child(t).delete()})}},{key:"handleShowFile",value:function(e){this.storageRef.child(e).getDownloadURL().then(function(e){window.open(e,"_blank")})}},{key:"resetInputKey",value:function(){var e=Math.random().toString(36);this.setState({fileFieldKey:e})}},{key:"render",value:function(){var e=this;return l.a.createElement("div",{id:"data-table"},l.a.createElement("div",{className:"row"},l.a.createElement("div",{className:"col s12"},l.a.createElement("h1",{className:"center"},"File Manager"))),l.a.createElement("div",{className:"row"},l.a.createElement("div",{className:"col s12"},l.a.createElement("table",null,l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null),l.a.createElement("th",null,"Filename"),l.a.createElement("th",null,"Description"),l.a.createElement("th",null,"Uploaded by"),l.a.createElement("th",null,"Date"),l.a.createElement("th",null))),l.a.createElement("tbody",null,this.state.data?this.state.data.map(function(t){return l.a.createElement("tr",{key:t.id},l.a.createElement("td",null,"application/pdf"===t.type?l.a.createElement("i",{className:"material-icons"},"picture_as_pdf"):"","image/jpeg"===t.type?l.a.createElement("i",{className:"material-icons"},"image"):"","text/xml"===t.type?l.a.createElement("i",{className:"material-icons"},"description"):""),l.a.createElement("td",null,l.a.createElement("a",{href:"#",onClick:e.handleShowFile.bind(e,t.filePath)},t.name)),l.a.createElement("td",null,t.description),l.a.createElement("td",null,t.uploadedBy),l.a.createElement("td",null,t.createdAt.split("T")[0]),l.a.createElement("td",null,l.a.createElement("a",{href:"#",onClick:e.handleDelete.bind(e,t.id,t.filePath)},"Delete")))}):null)),this.state.data&&!this.state.data.length?l.a.createElement("p",null,"No entries, pls upload files."):"")),l.a.createElement("div",{className:"row"},l.a.createElement("form",{className:"col s12",action:"#"},l.a.createElement("div",{className:"row"},l.a.createElement("h6",{className:"center"},"Upload file"),l.a.createElement("div",{className:"input-field col s4"},l.a.createElement("input",{placeholder:"Username",id:"username",type:"text",className:"",value:this.state.newFile.username,onChange:this.handleUploadFileChange})),l.a.createElement("div",{className:"input-field col s4"},l.a.createElement("input",{placeholder:"Description",id:"description",type:"text",className:"",value:this.state.newFile.description,onChange:this.handleUploadFileChange})),l.a.createElement("div",{className:"file-field input-field col s4"},l.a.createElement("div",{className:"file-path-wrapper"},l.a.createElement("input",{type:"file",ref:this.fileInput,accept:".xml, .pdf, .jpeg"}),l.a.createElement("input",{className:"file-path ",id:"choose-file",type:"text",placeholder:"Choose file",key:this.state.fileFieldKey||""})))),l.a.createElement("div",{className:"row"},l.a.createElement("div",{className:"input-field col s12 center"},l.a.createElement("button",{className:"btn waves-effect waves-light",type:"submit",name:"action",onClick:this.handleUpload},"Upload"))))))}}]),a}(n.Component);function v(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}();return function(){var a,n=Object(u.a)(e);if(t){var l=Object(u.a)(this).constructor;a=Reflect.construct(n,arguments,l)}else a=n.apply(this,arguments);return Object(d.a)(this,a)}}var E=function(e){Object(o.a)(a,e);var t=v(a);function a(){return Object(c.a)(this,a),t.apply(this,arguments)}return Object(s.a)(a,[{key:"render",value:function(){return l.a.createElement("div",{className:"App container"},l.a.createElement(y,null))}}]),a}(n.Component);a(29);r.a.render(l.a.createElement(E,null),document.getElementById("root"))}},[[16,2,1]]]);
//# sourceMappingURL=main.86bac2d6.chunk.js.map