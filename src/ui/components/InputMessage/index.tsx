import SendIcon from '@mui/icons-material/Send'
import { InputBase } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { ContentMessage } from 'domain/message'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './styles'

type Props = {
  onSent: (value: ContentMessage) => void
}

function InputMessage({ onSent }: Props) {
  const [value, setValue] = useState<ContentMessage>('')
  const focusedRef = useRef(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleSubmit = useCallback(() => {
    if (value) {
      onSent(value)
      setValue('')
    }
  }, [onSent, value])

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
      <InputBase
        sx={styles.input}
        placeholder='Enter your message'
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
      <IconButton
        sx={styles.icon}
        aria-label='send'
        size='large'
        onClick={handleSubmit}
      >
        <SendIcon fontSize='inherit' />
      </IconButton>
    </Box>
  )
}

export default InputMessage
