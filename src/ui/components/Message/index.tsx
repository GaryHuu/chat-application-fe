import { ContentMessage } from 'domain/message'
import { UserName } from 'domain/user'
import LeftMessage from 'ui/components/LeftMessage'
import RightMessage from 'ui/components/RightMessage'

type Props = {
  content: ContentMessage
  createdAt: DateTimeString
  name: UserName
  avatarURL?: URLString
  isOwner?: boolean
}

function Message({ isOwner, ...otherProps }: Props) {
  if (isOwner) {
    return <RightMessage {...otherProps} />
  }

  return <LeftMessage {...otherProps} />
}

export default Message