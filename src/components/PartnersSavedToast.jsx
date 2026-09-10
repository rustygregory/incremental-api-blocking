import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import {
  Notification,
  Title,
  Close,
} from '@zendeskgarden/react-notifications'
import { BAR_HEIGHT } from '../prototype-bar/PrototypeBar'

const DISMISS_AFTER_MS = 5000

/* 70px below the product page top — PrototypeBar is excluded from that offset. */
const TOAST_TOP = BAR_HEIGHT + 70
const TOAST_RIGHT = 40

const Anchor = styled.div`
  position: fixed;
  top: ${TOAST_TOP}px;
  right: ${TOAST_RIGHT}px;
  z-index: 11000;
  max-width: 360px;
`

/**
 * Flora-style success confirmation in the top-right of the product page.
 * Modal Save owns persistence; this only confirms the save to the reviewer.
 */
export default function PartnersSavedToast({ count = 1, onClose }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, DISMISS_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [onClose])

  const title =
    count === 1
      ? 'Partner successfully added for 60 days'
      : 'Partners successfully added for 60 days'

  return createPortal(
    <Anchor role="status" aria-live="polite">
      <Notification type="success">
        <Title>{title}</Title>
        <Close aria-label="Close" onClick={onClose} />
      </Notification>
    </Anchor>,
    document.body,
  )
}
