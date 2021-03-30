import React from 'react'
import {
  Modal,
  SafeAreaView,
} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer';
import FastImage from 'react-native-fast-image'

function ImageViewerModal({ visible, images, onCancel  }) {

  return (
    <Modal visible={visible} transparent={true}>
        <ImageViewer 
          onCancel={onCancel} 
          imageUrls={images} 
          enableSwipeDown={true}
          renderImage={(props) => <FastImage source={props.source} style={props.style}/>}
        />
    </Modal>  
  )
}

export { ImageViewerModal }