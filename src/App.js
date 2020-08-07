import React, { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { gql, useMutation } from '@apollo/client'

// write mutation here....
const EDIT_BRAND_LOGO = gql`
  mutation($id: ID!, $logo: Upload) {
    updateBrandLogo(id: $id, logo: $logo) {
      logo
    }
  }
`

const App = () => {
  useEffect(() => {
    localStorage.removeItem('token')
    setIsTokenPresent(false)
  }, [])

  // local state
  const [files, setFiles] = useState([])
  const [base64Files, setBase4Files] = useState([])
  const [isLaunchDisabled, setIsLaunchDisabled] = useState(true)
  const [isTokenPresent, setIsTokenPresent] = useState(false)

  // apollo mutation
  const [launchMutation] = useMutation(EDIT_BRAND_LOGO)

  // do something with the files after dropping
  const onDrop = useCallback((acceptedFiles) => {
    setIsLaunchDisabled(false)
    setFiles(acceptedFiles)

    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const base64Image = reader.result
        setBase4Files((prevFiles) => [...prevFiles, base64Image])
      }
      reader.readAsDataURL(file)
    })
  }, [])

  // when mutate gets clicked
  const onMutate = async () => {
    try {
      const result = await launchMutation({
        // assign required variables here
        variables: {
          id: '5f2a75178cfb4f39e8f45bed',
          logo: files[0] // change to 'files' for multiple upload
        }
      })
      if (result.data) {
        console.log(result.data)
        alert('Check the console nigga')
      }
    } catch (err) {
      console.log(err)
      alert('Check the console for errors nigga')
    }
  }

  const onClear = () => {
    setFiles([])
    setBase4Files([])
    setIsLaunchDisabled(true)
  }

  const onTextAreaChange = (e) => {
    localStorage.setItem('token', e.target.value)
    setIsTokenPresent(true)

    if (!e.target.value) {
      localStorage.removeItem('token')
      setIsTokenPresent(false)
    }
  }

  // dropzone hook
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <>
      <div className="App">
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
          {files.length > 0 && <div>{files.length} file(s) selected</div>}
          {base64Files.length > 0 &&
            base64Files.map((file, fileIndex) => (
              <img key={fileIndex} src={file} alt={fileIndex} height="200" width="200" />
            ))}
        </div>
        <button onClick={onMutate} disabled={isLaunchDisabled || !isTokenPresent}>
          LAUNCH MUTATION
        </button>
        <button onClick={onClear} disabled={isLaunchDisabled || !isTokenPresent}>
          CLEAR ALL IMAGES
        </button>
      </div>

      <br />
      <br />
      <textarea
        placeholder="Place token here..."
        onChange={onTextAreaChange}
        rows="5"
        cols="100"
      ></textarea>
    </>
  )
}

export default App
