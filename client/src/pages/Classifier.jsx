import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ClassifierImg from '../assets/classifier.png';
import CrossMark from '../assets/cross.png';
import AfterClassify from '../assets/after.png';
import { useEffect } from 'react';
import axios from 'axios'

function ClassifierPage (props) {
  const [fileImage, setFileImage] = useState('');
  const [fileData, setFileData] = useState();
  const [existImage, setExistImage] = useState(false);
  const [label, setLabel] = useState('');
  const [isThrowed, setIsThrowed] = useState(false);

  useEffect(() => {
    if (fileImage) {
      setExistImage(true);
    } else {
      setExistImage(false);
    }
  }, [fileImage])

  function handleSubmit (e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append('image', fileData);

    axios.post('https://cseht.loca.lt/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => {
      console.log(res.data.label);
      setLabel(res.data.label);
    })
    .catch((err) => {
      console.log(err)
   })
  }

  function handleThrowClick (e) {
    if (isThrowed) {
      window.alert('이미 포인트를 받았습니다!');
    } else {
      window.alert('행복 포인트 적립!');
      setIsThrowed(true);
    }
  }

  return (
    <div className='w-full h-fit min-h-screen flex flex-col gap-8 justify-between items-center'>
      <Navbar click={isThrowed}/>
      <div className='w-full h-fit max-w-md flex flex-col items-center gap-5'>
        {label == '' ?
        <img src={ClassifierImg} className='w-[250px]' /> :
        <img src={AfterClassify} className='w-[250px]' />}
        <form
          onSubmit={handleSubmit}
          className='w-full px-5 flex flex-col gap-5 items-center'>
          {existImage ?
            <label htmlFor='submit'>
              <div className='btn text-white'>분류하기</div>
            </label>
          : <label htmlFor='file'>
            <div className='btn text-white'>사진 업로드!</div>
          </label>
          }
          <input
            type='file'
            name='image'
            id='file'
            accept='image/*'
            className='hidden'
            onChange={(e) => {
              setFileImage(URL.createObjectURL(e.target.files[0]))
              setFileData(e.target.files[0])}} />
          <input 
            type='submit'
            name='submit'
            id='submit'
            className='hidden' />
          <img src={fileImage} className='w-full'/>
          {existImage && label == '' ?
            <div onClick={(e) => setFileImage('')}>
              <img src={CrossMark} className='w-4' />
            </div> :
            label != '' ?
            <div className='flex flex-col gap-6 items-center'>
              <div className='w-fit h-fit text-lg text-black'>
                {'이 쓰레기는 ' + label + '(으)로 버려 주세요!'}
              </div>
              <div className='flex gap-4 w-fit'>
                <button
                  onClick={handleThrowClick}
                  className='btn btn-primary text-white'>
                  버렸어요!
                </button>
                <Link to='/'>
                  <button className='btn btn-outline btn-primary'>
                    홈으로
                  </button>
                </Link>
              </div>
            </div>
             :
            <></>
          }
          
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default ClassifierPage;