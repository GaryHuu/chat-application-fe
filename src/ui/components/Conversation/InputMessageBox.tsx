import SendIcon from '@mui/icons-material/Send'
import { InputBase } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  onSent: (value: string) => void
}

function InputMessageBox({ onSent }: Props) {
  const [value, setValue] = useState('')
  const focusedRef = useRef(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleSubmit = useCallback(() => {
    onSent(value)
    setValue('')
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
    <Box
      sx={{
        height: '70px',
        display: 'flex',
        backgroundColor: '#FFF',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        borderTop: '1px solid #CCC',
      }}
    >
      <InputBase
        sx={{
          flex: 1,
          padding: '10px',
        }}
        placeholder='Enter your message'
        multiline
        minRows={2}
        maxRows={3}
        value={value}
        onFocus={() => (focusedRef.current = true)}
        onBlur={() => (focusedRef.current = false)}
        onChange={handleChange}
      />
      <IconButton
        sx={{
          height: '52px',
        }}
        aria-label='send'
        size='large'
        onClick={handleSubmit}
      >
        <SendIcon fontSize='inherit' />
      </IconButton>
    </Box>
  )
}

export default InputMessageBox
