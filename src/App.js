import React, { Component } from 'react';
import './App.css';
import Axios from 'axios';

class App extends Component {
  state = {selectedFile : null}
  onChangeHandler = (event) => {
    // UNTUK MENDAPATKAN FILE IMAGE
     this.setState({selectedFile : event.target.files[0]}) 

  }
  valueHandler =() => {
    var value = this.state.selectedFile ? this.state.selectedFile.name : 'Pick A Picture'
    return value
  }
  addData = () => {
     var data = {
       product_name : this.refs.nama.value,
       product_price : this.refs.harga.value,
     }
     var fd = new FormData()
     fd.append('avatar',this.state.selectedFile)
     fd.append('product' ,JSON.stringify(data))
     Axios.post('http://localhost:4000/image' , fd)
     .then((res) => {
       alert(res.data)
     })
     .catch((err) => {
       console.log(err)
     })
  }

  render() {
    return (
      <div className="container">
        <div className='row mt-5'>
          <div className='col-md-3'>
            <input className='form-control' ref='nama' type='text' placeholder='masukan Nama Barang'/>
          </div>
          <div className='col-md-3'>
            <input className='form-control' ref='harga' type='number' placeholder='masukan Harga Barang'/>            
          </div>
          <div className='col-md-3'>
            <input style={{display :'none'}} ref='input' type='file' onChange={this.onChangeHandler}/>
            <input className='form-control btn-success' onClick={() => this.refs.input.click()} type='button' value={this.valueHandler()}/>            
          </div>
          <div className='col-md-3'>
            <input className='form-control btn-primary' type='button' onClick={this.addData} value='add Data'/>            
          </div>

        </div>
      </div>
    );
  }
}

export default App;
