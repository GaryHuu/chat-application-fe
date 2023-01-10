import PhotoCamera from '@mui/icons-material/PhotoCamera'
import SendIcon from '@mui/icons-material/Send'
import { InputBase } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { ContentMessage, ContentType } from 'domain/message'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './styles'

type Props = {
  onSent: (value: ContentMessage | File, type: ContentType) => void
}

function InputMessage({ onSent }: Props) {
  const [value, setValue] = useState<ContentMessage>('')
  const focusedRef = useRef(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleSubmit = useCallback(() => {
    if (value) {
      onSent(value, 'text')
      setValue('')
    }
  }, [onSent, value])

  const handleSentImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputFile = event?.target?.files?.[0] as File
    onSent(inputFile, 'image')
  }

  useEffect(() => {
    const enterPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && focusedRef.current) {
        e.preventDefault()
        handleSubmit()
      }
    }
    window.addEventListener('keypress', enterPress)
    return () => window.removeEventListener('keypress', enterPress)
  }, [handleSubmit])

  return (
    <Box sx={styles.wrapper}>
      <IconButton
        sx={styles.uploadIcon}
        color="primary"
        aria-label="upload picture"
        component="label">
        <input onChange={handleSentImage} hidden accept="image/*" type="file" />
        <PhotoCamera />
      </IconButton>
      <InputBase
        sx={styles.input}
        placeholder="Enter your message"
        multiline
        minRows={2}
        maxRows={3}
        value={value}
        onFocus={() => {
          focusedRef.current = true
        }}
        onBlur={() => {
          focusedRef.current = false
        }}
        onChange={handleChange}
      />
      <IconButton sx={styles.icon} aria-label="send" size="large" onClick={handleSubmit}>
        <SendIcon fontSize="inherit" />
      </IconButton>
    </Box>
  )
}

export default InputMessage
