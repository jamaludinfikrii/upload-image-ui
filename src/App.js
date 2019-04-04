import React, { Component } from 'react';
import './App.css';
import Axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class App extends Component {
  state = {selectedFile : null, data : [] , modal : false , dataEdit : {}, selectedFileEdit : null}

  componentDidMount(){
    this.getData()
  }
  getData = () => {
    Axios.get('http://localhost:4000/getAllData')
    .then((res) => this.setState({data:res.data}))
    .catch((err) => console.log(err))
  }
  onChangeHandler = (event) => {
    // UNTUK MENDAPATKAN FILE IMAGE
     this.setState({selectedFile : event.target.files[0]}) 

  }

  renderJsx = () => {
    var jsx = this.state.data.map((val,index) => {
      return(
        <tr>
          <td>{index + 1}</td>
          <td> {val.product_name} </td>
          <td> {val.product_price} </td>
          <td> <img src = {'http://localhost:4000/' + val.product_image} 
                width = '50px' />  
          </td>
          <td> <input type = 'button' className='btn btn-info' onClick={() => this.setState({modal:true, dataEdit :val})} value='edit' /> </td>
          <td> <input type = 'button' className='btn btn-danger' value='delete' /> </td>        
        </tr>
      )
    })
    return jsx
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

  onChangeHandlerEdit = (event) => {
    // UNTUK NGE GET VALUE FILES
    this.setState({selectedFileEdit : event.target.files[0]})
  }

  valueHandlerEdit =() => {
    var value = this.state.selectedFileEdit ? this.state.selectedFileEdit.name : 'Pick A Picture'
    return value 
  }

  onSaveBtnClick = () => {
    var newData = {
      product_name : this.refs.namaEdit.value ? this.refs.namaEdit.value : this.state.dataEdit.product_name,
      harga : this.refs.hargaEdit.value ? this.refs.hargaEdit.value : this.state.dataEdit.product_price
    }
    if(this.state.selectedFileEdit){
      var fd = new FormData()
      fd.append('edit' , this.state.selectedFileEdit)
      fd.append('data' ,JSON.stringify(newData))
      
      // UNTUK DAPETIN PATH IMAGE YANG MAU DIHAPUS
      fd.append('imageBefore' , this.state.dataEdit.product_image)
      Axios.put('http://localhost:4000/addProduct/' + this.state.dataEdit.id , fd)
      .then((res) => {
        alert(res.data)
        this.setState({modal : false})
        this.getData()
      })
    }else{
      Axios.put('http://localhost:4000/addProduct/' + this.state.dataEdit.id , newData)
      .then((res) => {
        alert(res.data)
        this.setState({modal : false})
        this.getData()
      })
    }
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
        <table className='table mt-5'>
          <tr>
            <td>NO</td>
            <td>NAMA</td>
            <td>HARGA</td>
            <td>IMAGE</td>
            <td>EDIT</td>
            <td>DELETE</td>
          </tr>
          {this.renderJsx()}
        </table>

        {/* =================== MODAL EDIT */}
        <div>
          <Modal isOpen={this.state.modal} toggle={() => this.setState({modal:false})} className={this.props.className}>
            <ModalHeader toggle={() => this.setState({modal:false})}>Edit Product ~ {this.state.dataEdit.product_name}</ModalHeader>
            <ModalBody>
              <div className='row'> 
                <div className='col-md-3'>
                  <img src={'http://localhost:4000/' + this.state.dataEdit.product_image} width='100%' alt='broken' />
                  <input type='file' onChange={this.onChangeHandlerEdit} style={{display:'none'}} ref='inputEdit' />
                  <input type='button' value={this.valueHandlerEdit()} className='btn btn-primary' 
                         onClick={ () =>this.refs.inputEdit.click()} />
                </div>
                <div className='col-md-9'> 
                  <input type='text' className='form-control' 
                  placeholder={this.state.dataEdit.product_name} ref='namaEdit' />
                  <input type='number' className='form-control mt-3' 
                  placeholder={this.state.dataEdit.product_price} ref='hargaEdit' />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.onSaveBtnClick}>Save</Button>{' '}
              <Button color="secondary" onClick={() => this.setState({modal:false})}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>

      </div>
    );
  }
}

export default App;
