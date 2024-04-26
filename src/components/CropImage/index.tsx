import { useState } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import ReactDOM from 'react-dom'
import getCroppedImg from '../../utils/cropImage'

const CropImage = ({ imageUrl, setCroppedImage, handleClose }: any) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [areaPixel, setAreaPixel] = useState<Area | null>(null)
  const onCropComplete = async (_: Area, croppedAreaPixels: Area) => {
    setAreaPixel(croppedAreaPixels)
  }

  const handleDone = async () => {
    if (!areaPixel) {
      handleClose()
      return
    }
    try {
      const croppedImage = await getCroppedImg(imageUrl, areaPixel)
      console.log('donee', { croppedImage })
      setCroppedImage(croppedImage)
      handleClose()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      {ReactDOM.createPortal(
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={2 / 3}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          style={{
            containerStyle: { position: 'fixed', zIndex: 30 },
          }}
        />,
        document.body
      )}
      {ReactDOM.createPortal(
        <button
          onClick={handleDone}
          style={{
            position: 'absolute',
            bottom: `calc(((100vh - 500px) / 2) - 2rem)`,
            backgroundColor: '#0fba17',
            padding: '10px 20px',
            border: '2px solid #0e9815',
            cursor: 'pointer',
            color: 'white',
            textTransform: 'uppercase',
          }}
        >
          Salvar
        </button>,
        document.querySelector('div[data-testid="container"]') || document.body
      )}
    </>
  )
}

export default CropImage
