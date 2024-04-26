import { Cross2Icon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'
import { ReactNode } from 'react'
import styles from './styles.module.css'

const PopoverComp = ({
  children,
  content,
}: {
  children: ReactNode
  content: ReactNode
}) => (
  <Popover.Root>
    <Popover.Trigger asChild>{children}</Popover.Trigger>
    <Popover.Portal>
      <Popover.Content className={styles.PopoverContent} sideOffset={5}>
        {content}
        <Popover.Close className={styles.PopoverClose} aria-label="Close">
          <Cross2Icon />
        </Popover.Close>
        <Popover.Arrow className={styles.PopoverArrow} />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
)

export default PopoverComp
