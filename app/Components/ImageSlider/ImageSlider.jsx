// "use client";

// import Image from 'next/image';
// import React, { memo, useState } from 'react';
// import styles from "./ImageSlider.module.css";

// const ImageSlider = ( { images = [ "/design.jpg", "/Ray.jpg" ], style } ) => {

//   const [ currentSlide, setCurrentSlide ] = useState( 0 );

//   function previous () {
//     setCurrentSlide( prev => {
//       if ( prev == 0 ) return images.length - 1;
//       return --prev;
//     } );
//   }

//   function next () {
//     setCurrentSlide( prev => {
//       if ( prev == images.length - 1 ) return 0;
//       return ++prev;
//     } );
//   }

//   return (
//     <div className={ styles[ "carousel" ] }>
//       <div className={ styles[ "imageContainer" ] } style={ style }>
//         <button type="button" className={ styles[ 'previous' ] }>{ "<" }</button>
//         <button type="button" className={ styles[ 'next' ] }>{ ">" }</button>
//         <div className={ styles[ "images" ] }>
//           { images.map( ( img, i ) => (
//             <div className={ styles[ "img" ] } key={ i }>
//               <Image
//                 width={ 100 }
//                 height={ 100 }
//                 alt='img'
//                 src={ img }
//                 className={ styles[ 'img' ] }
//               />
//             </div>
//           ) ) }
//         </div>
//       </div>
//     </div>
//   );
// };

// export default memo( ImageSlider );

"use client";

import Image from "next/image";

import { memo, useState, useEffect, useRef } from 'react';
import styles from "./ImageSlider.module.css";

const ImageComponent = ( {
  images = [ "/Ray.jpg", "/design.jpg" ],
  padding = 0,
  style = { top: 0, left: 0 },
  width = 550,
  height = 480,
  className,
} ) => {
  let numberOfImages = images.length - 1;
  let [ pictures, setPictures ] = useState( images?.length ? images : [] );
  const [ current, setCurrent ] = useState( 0 );
  const [ imageLoading, setLoading ] = useState( true );
  const [ previewVisible, setPreviewVisible ] = useState( false );

  const previewContainer = useRef();

  useEffect( () => {
    setPictures( images );
  }, [] );

  const next = () => {
    setCurrent( ( prev ) => ( prev == numberOfImages ? 0 : prev + 1 ) );
  };

  const previous = () => {
    setCurrent( ( prev ) => ( prev == 0 ? numberOfImages : prev - 1 ) );
  };

  const setSlide = ( i ) => {
    setCurrent( i );
  };

  useEffect( () => {
    if ( previewVisible ) {
      previewContainer.current.style.top = "0";
      previewContainer.current.style.zIndex = 10000;
      previewContainer.current.style.transform = "rotateX(0deg)";
      previewContainer.current.style.opacity = 1;
    } else {
      previewContainer.current.style.top = "100%";
      previewContainer.current.style.zIndex = 0;
      previewContainer.current.style.opacity = 0;
    }
  }, [ previewVisible ] );

  const handleImageClick = ( e ) => {

    if ( !e.target.src ) return;

    setPreviewVisible( true );

    // preview.current.src = src;
    // previewContainer.current.style.top = "0";
    // preview.current.style.transform = "translate(-50%, -50%) rotateX(0deg)";
    // overlay.style.display = "block"
  };

  // smooth
  return (
    <>
      <div className={ styles[ "preview-container" ] } ref={ previewContainer }>
        <button
          type="button"
          className={ styles[ "close" ] }
          onClick={ () => setPreviewVisible( false ) }
        >
          &times;
        </button>
        <div
          className={ styles[ "preview-image-container" ] }
          style={ {
            left: `calc(-${ current * 100 }% - ${ padding * current }px)`,
            width: `calc(${ pictures.length * 100 }% + ${ padding * ( pictures.length - 1 )
              }px)`,
          } }
        >
          { " " }
          {/* padding is the padding of css */ }
          { pictures.map( ( image, i ) => (
            <div className={ styles[ "preview-img" ] } key={ i }>
              <Image
                src={ image }
                width={ 530 }
                height={ 460 }
                alt="post Image"
                onLoadingComplete={ () => setLoading( false ) }
                style={ {
                  filter: imageLoading ? "blur(5px)" : "none",
                } }
                onClick={ handleImageClick }
                key={ image }
              />
            </div>
          ) ) }
        </div>

        <div className={ styles[ "preview-labels" ] }>
          { pictures.map( ( _, i ) => (
            <div
              className={ styles[ "preview-label" ] }
              key={ i }
              style={ {
                width: current == i ? 24 : 8,
              } }
              onClick={ () => setSlide( i ) }
            ></div>
          ) ) }
        </div>

        <button className={ styles[ "preview-previous" ] } onClick={ previous }>
          { "❮" }
        </button>
        <button className={ styles[ "preview-next" ] } onClick={ next }>
          { "❯" }
        </button>
      </div>

      <div
        className={ `${ styles[ "container" ] } ${ className }` }
        style={ { top: style.top, left: style.left, width, height } }
      >
        <div
          className={ styles[ "image-container" ] }
          style={ {
            left: `calc(-${ current * 100 }% - ${ padding * current }px)`,
            width: `calc(${ pictures.length * 100 }% + ${ padding * ( pictures.length - 1 )
              }px)`,
          } }
        >
          { pictures.map( ( image, i ) => (
            <div className={ styles[ "img" ] } key={ i }>
              <Image
                src={ image }
                width={ 530 }
                height={ 460 }
                alt="post Image"
                onLoadingComplete={ () => setLoading( false ) }
                style={ {
                  filter: imageLoading ? "blur(5px)" : "none",
                } }
                onClick={ handleImageClick }
                key={ image }
              />
            </div>
          ) ) }
        </div>

        <div className={ styles[ "labels" ] }>
          { pictures.map( ( _, i ) => (
            <div
              className={ styles[ "label" ] }
              key={ i }
              style={ {
                width: current == i ? 24 : 8,
              } }
              onClick={ () => setSlide( i ) }
            ></div>
          ) ) }
        </div>

        <button className={ styles[ "previous" ] } onClick={ previous }>
          { "❮" }
        </button>
        <button className={ styles[ "next" ] } onClick={ next }>
          { "❯" }
        </button>
      </div>
    </>
  );
};

export default memo( ImageComponent );
