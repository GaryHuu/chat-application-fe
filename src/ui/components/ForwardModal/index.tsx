import { Button, Checkbox, Dialog, FormControlLabel, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Friend } from 'domain/friend'
import { Group } from 'domain/group'
import styles from './styles'
import Avatar from '@mui/material/Avatar'
import { useState } from 'react'

type Props = {
  friends: Friend[]
  groups: Group[]
  isOpen: boolean
  onSent: (ids: string[]) => void
  onClose: () => void
}

function ForwardModalComponent({ friends, groups, isOpen, onClose, onSent }: Props) {
  const [idsConversationSelected, setIdConversationSelected] = useState<string[]>([])

  const isEmptySelected = idsConversationSelected.length === 0

  const checkboxChangeHandler = (conversationId: string) => () => {
    if (idsConversationSelected.includes(conversationId)) {
      const newValue = idsConversationSelected.filter((id) => id !== conversationId)
      setIdConversationSelected(newValue)
      return
    }

    const newValue = [...idsConversationSelected]
    newValue.push(conversationId)
    setIdConversationSelected(newValue)
  }

  const handleSubmit = () => {
    onSent(idsConversationSelected)
    handleClose()
  }

  const handleClose = () => {
    setIdConversationSelected([])
    onClose()
  }

  const renderFriends = () => {
    if (!friends || friends.length === 0) return null

    return (
      <Box>
        <Typography sx={styles.subtitle}>Friends</Typography>
        <Box sx={styles.list}>
          {friends.map((friend) => (
            <FormControlLabel
              key={friend.id}
              control={
                <Checkbox
                  checked={idsConversationSelected.includes(friend.conversationId)}
                  onChange={checkboxChangeHandler(friend.conversationId)}
                />
              }
              label={
                <Box sx={styles.name}>
                  <Avatar sx={styles.avatar} src={friend.avatarURL} />
                  {friend.name}
                </Box>
              }
            />
          ))}
        </Box>
      </Box>
    )
  }

  const renderGroups = () => {
    if (!groups || groups.length === 0) return null

    return (
      <Box>
        <Typography sx={styles.subtitle}>Groups</Typography>
        <Box sx={styles.list}>
          {groups.map((group) => (
            <FormControlLabel
              key={group.id}
              control={
                <Checkbox
                  checked={idsConversationSelected.includes(group.conversationId)}
                  onChange={checkboxChangeHandler(group.conversationId)}
                />
              }
              label={
                <Box sx={styles.name}>
                  <Avatar sx={styles.avatar} src={group.avatarURL} />
                  {group.name}
                </Box>
              }
            />
          ))}
        </Box>
      </Box>
    )
  }

  return (
    <Dialog onClose={handleClose} open={isOpen}>
      <Box sx={styles.wrapper}>
        <Typography sx={styles.title}>Share</Typography>
        <Box>
          {renderFriends()}
          {renderGroups()}
        </Box>
        <Box sx={styles.action}>
          <Button sx={styles.actionCancel} onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            disabled={isEmptySelected}
            sx={styles.actionSent}
            onClick={handleSubmit}
            variant="contained"
          >
            Sent
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}

export default ForwardModalComponent
