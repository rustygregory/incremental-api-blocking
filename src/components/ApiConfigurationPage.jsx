import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import { Checkbox, Field, Hint, Label } from '@zendeskgarden/react-forms'
import {
  Combobox,
  Field as ComboboxField,
  Label as ComboboxLabel,
  Option,
} from '@zendeskgarden/react-dropdowns'
import {
  Modal,
  Header as ModalHeader,
  Body as ModalBody,
  Footer as ModalFooter,
  FooterItem,
  Close,
} from '@zendeskgarden/react-modals'
import { Table } from '@zendeskgarden/react-tables'
import { Tag } from '@zendeskgarden/react-tags'
import { MD, SM } from '@zendeskgarden/react-typography'
import PartnersSavedToast from './PartnersSavedToast'
import { partnersForVersion } from '../data/partners'

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
]

function formatExpirationDate(date) {
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

function expirationDateIn60Days(from = new Date()) {
  const d = new Date(from)
  d.setDate(d.getDate() + 60)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Granted until end of expiration day; Expired after that. */
function extensionStatus(expiresAt) {
  const end = new Date(expiresAt)
  end.setHours(23, 59, 59, 999)
  return new Date() > end ? 'Expired' : 'Granted'
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: #ffffff;
  position: relative;
`

const ScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 24px 40px 32px 32px;
`

const Breadcrumbs = styled.nav`
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  color: #68737d;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;

  span,
  a {
    color: #68737d;
  }

  a {
    text-decoration: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`

const Separator = styled.span`
  color: #c2c8cc;
`

const PageTitle = styled.h1`
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  letter-spacing: -0.36px;
  color: #2f3941;
  margin: 0 0 8px;
`

const Description = styled.p`
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #2f3941;
  margin: 0 0 4px;
`

const InlineLink = styled.a`
  color: #1f73b7;
  text-decoration: underline;

  &:hover {
    color: #144a75;
  }
`

const ExternalArrow = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ marginLeft: 2, verticalAlign: 'baseline' }}
  >
    <path
      d="M3 3h6v6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 3 3 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Callout = styled.div`
  margin: 24px 0 28px;
  padding: 16px 20px;
  background: #f8f9f9;
  border-radius: 4px;
  border: 1px solid #e9ebed;
`

const CalloutTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #2f3941;
  margin-bottom: 8px;
`

const CalloutBody = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: #2f3941;

  p {
    margin: 0 0 8px;
  }

  ul {
    margin: 0 0 8px;
    padding-left: 20px;
  }

  li {
    margin-bottom: 2px;
  }
`

const SettingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 720px;
`

const SettingField = styled(Field)`
  margin: 0;
`

const PartnerExtensionsBlock = styled.div`
  margin-top: 24px;
`

const PartnerSetting = styled.div`
  max-width: 720px;
`

const PartnersPanel = styled.div`
  margin-top: 16px;
  /* Align with Garden checkbox label text; stretch to the scroll area’s right edge (40px pad). */
  margin-left: 28px;
`

const PartnersToolbar = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
`

const PartnersCount = styled(MD)`
  margin: 0;
  padding: 0;
  font-weight: 400;
  line-height: 20px;
  color: #2f3941;
`

const TableWrap = styled.div`
  /* Partners table is display-only — suppress Garden row hover. */
  [data-garden-id='tables.row']:hover {
    background-color: transparent !important;
  }
`

const EmptyCell = styled.div`
  padding: 40px 24px;
  text-align: center;
  color: #68737d;
`

const EmptyTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2f3941;
  margin-bottom: 4px;
`

/* Flora subtle status tags (tables) — Garden Tag hues are cool/emphasis, not Flora. */
const StatusTag = styled(Tag)`
  && {
    background-color: ${(p) => (p.$status === 'Granted' ? '#EFF9E6' : '#F7F7F7')};
    color: ${(p) => (p.$status === 'Granted' ? '#4B7D04' : '#646864')};
  }
`

const ComboboxWrap = styled.div`
  margin-top: 16px;

  /* Flora combobox + multiselect tags (forms use square subtle tags). */
  [data-garden-id='dropdowns.combobox.trigger'] {
    border-radius: 12px;
    border-color: #b7b7b3;
    color: #2f3130;

    &:hover {
      border-color: #8b8e89;
    }
  }

  [data-garden-id='dropdowns.combobox.tag'] {
    border-radius: 4px;
    background-color: #f7f7f7;
    color: #2f3130;
  }

  [data-garden-id='dropdowns.combobox.tags_button'] {
    color: #406cc4;
    font-weight: 600;

    &:hover {
      color: #284173;
      text-decoration: underline;
    }
  }

  [data-garden-id='dropdowns.combobox.label'] {
    color: #2f3130;
  }
`

const ModalEmptyState = styled.div`
  margin-top: 16px;
  padding: 40px 24px;
  text-align: center;
  border-top: 1px solid #eae9e8;
  color: #2f3130;
`

const PartnerList = styled.div`
  margin-top: 16px;
  border: 1px solid #eae9e8;
  border-radius: 8px;
  overflow: hidden;
`

const PartnerListHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 40px;
  padding: 8px 12px;
  background-color: #f7f7f7;
  border-bottom: 1px solid #eae9e8;
`

const PartnerListHeaderLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #646864;
  text-transform: none;
`

const PartnerOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 10px 12px;
  border-bottom: 1px solid #eae9e8;

  &:last-child {
    border-bottom: none;
  }
`

/* Flora outline (pill + neutral) — Garden defaults remain cool/blue. */
const FloraOutlineButton = styled(Button).attrs({ isPill: true, isNeutral: true })`
  && {
    border-radius: 100px;
    background-color: #ffffff;
    border-color: #b7b7b3;
    color: #2f3130;

    &:hover {
      background-color: #f7f7f7;
      border-color: #8b8e89;
      color: #2f3130;
    }

    &:active {
      background-color: #eae9e8;
      border-color: #646864;
      color: #2f3130;
    }
  }
`

/* Flora modal shell — warmer greys, larger radius, Flora commitment buttons. */
const FloraModal = styled(Modal)`
  && {
    border-radius: 16px;
    border-color: #dcdcda;
    background-color: #ffffff;
    color: #2f3130;
  }

  [data-garden-id='modals.header'] {
    border-bottom-color: #eae9e8;
    color: #2f3130;
    font-size: 18px;
    line-height: 24px;
    font-weight: 600;
  }

  [data-garden-id='modals.body'] {
    color: #2f3130;
  }

  [data-garden-id='modals.footer'] {
    border-top: 1px solid #eae9e8;
  }

  [data-garden-id='modals.close'] {
    color: #646864;

    &:hover {
      background-color: #f7f7f7;
      color: #2f3130;
    }
  }
`

const FloraModalCancel = styled(Button).attrs({ isBasic: true, isPill: true })`
  && {
    color: #2f3130;

    &:hover {
      background-color: #f7f7f7;
      color: #2f3130;
    }

    &:active {
      background-color: #eae9e8;
      color: #2f3130;
    }
  }
`

const FloraModalSave = styled(Button).attrs({ isPrimary: true, isPill: true })`
  && {
    border-radius: 100px;
    background-color: #2f3130;
    border-color: #2f3130;
    color: #ffffff;

    &:hover {
      background-color: #404241;
      border-color: #404241;
      color: #ffffff;
    }

    &:active {
      background-color: #202121;
      border-color: #202121;
      color: #ffffff;
    }
  }
`

const FloraFooterItem = styled(FooterItem)`
  && {
    margin-left: 12px;

    &:first-child {
      margin-left: 0;
    }
  }
`

const Footer = styled.footer`
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 12px 40px 12px 32px;
  border-top: 1px solid #d8dcde;
  background: #ffffff;
  position: relative;
  z-index: 1;
`

export const ApiConfigurationPage = ({ version = 'v1' }) => {
  const catalog = useMemo(() => partnersForVersion(version), [version])
  const isV2 = version === 'v2'

  const [passwordAccess, setPasswordAccess] = useState(true)
  const [endUserPasswordAccess, setEndUserPasswordAccess] = useState(true)
  const [apiTokenAccess, setApiTokenAccess] = useState(true)

  const [stateByVersion, setStateByVersion] = useState({
    v1: { partners: [], partnerExtensions: false },
    v2: { partners: [], partnerExtensions: false },
  })

  const { partners, partnerExtensions } = stateByVersion[version] ?? stateByVersion.v1

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [savedPartnerCount, setSavedPartnerCount] = useState(0)

  const updateVersionState = useCallback((versionId, patch) => {
    setStateByVersion((prev) => ({
      ...prev,
      [versionId]: {
        ...prev[versionId],
        ...patch,
      },
    }))
  }, [])

  const addedIds = useMemo(() => new Set(partners.map((p) => p.id)), [partners])
  const availableToAdd = useMemo(
    () => catalog.filter((p) => !addedIds.has(p.id)),
    [catalog, addedIds],
  )

  const openModal = () => {
    setSelectedIds([])
    setSearchValue('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedIds([])
    setSearchValue('')
  }

  const toggleSelected = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const allAvailableSelected =
    availableToAdd.length > 0 && availableToAdd.every((p) => selectedIds.includes(p.id))
  const someAvailableSelected =
    availableToAdd.some((p) => selectedIds.includes(p.id)) && !allAvailableSelected

  const toggleSelectAll = () => {
    if (allAvailableSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(availableToAdd.map((p) => p.id))
    }
  }

  const savePartners = () => {
    if (selectedIds.length === 0) {
      closeModal()
      return
    }

    const expiresAt = expirationDateIn60Days()
    const additions = catalog
      .filter((p) => selectedIds.includes(p.id) && !addedIds.has(p.id))
      .map((p) => ({
        id: p.id,
        name: p.name,
        expiresAt: expiresAt.toISOString(),
        expirationDate: formatExpirationDate(expiresAt),
      }))

    if (additions.length === 0) {
      closeModal()
      return
    }

    updateVersionState(version, {
      partners: [...partners, ...additions],
      partnerExtensions: true,
    })
    closeModal()
    setSavedPartnerCount(additions.length)
    setShowSavedToast(true)
  }

  const setPartnerExtensions = (next) => {
    updateVersionState(version, { partnerExtensions: next })
  }

  return (
    <Page>
      {showSavedToast && (
        <PartnersSavedToast
          count={savedPartnerCount}
          onClose={() => setShowSavedToast(false)}
        />
      )}
      <ScrollArea>
        <Breadcrumbs aria-label="Breadcrumb">
          <a href="#">Apps and integrations</a>
          <Separator>›</Separator>
          <a href="#">APIs</a>
          <Separator>›</Separator>
          <span>API configuration</span>
        </Breadcrumbs>

        <PageTitle>API configuration</PageTitle>
        <Description>
          Manage how users can access the Zendesk API.{' '}
          <InlineLink href="#" target="_blank" rel="noopener noreferrer">
            Learn about managing access
            <ExternalArrow />
          </InlineLink>
        </Description>
        <Description>
          View the{' '}
          <InlineLink href="#" target="_blank" rel="noopener noreferrer">
            Zendesk Developer Terms
            <ExternalArrow />
          </InlineLink>
          .
        </Description>

        <Callout>
          <CalloutTitle>Zendesk is removing API tokens</CalloutTitle>
          <CalloutBody>
            <p>Active API tokens will stop working on April 30, 2027. To avoid service interruptions:</p>
            <ul>
              <li>Find workflows that use API tokens</li>
              <li>Migrate those workflows to OAuth</li>
            </ul>
            <InlineLink href="#" target="_blank" rel="noopener noreferrer">
              Learn about transitioning from API tokens
            </InlineLink>
          </CalloutBody>
        </Callout>

        <SettingsList>
          <SettingField>
            <Checkbox checked={passwordAccess} onChange={() => setPasswordAccess((v) => !v)}>
              <Label>Password access</Label>
              <Hint>
                Activate API authentication using an agent&apos;s email address and password.
                Password access is deprecated, this option won&apos;t be available again if you
                disable it now
              </Hint>
            </Checkbox>
          </SettingField>

          <SettingField>
            <Checkbox
              checked={endUserPasswordAccess}
              onChange={() => setEndUserPasswordAccess((v) => !v)}
            >
              <Label>Allow password access for end users</Label>
              <Hint>
                Allow end users to authenticate API requests with their email and password. When
                off, end user access is considered anonymous.
              </Hint>
            </Checkbox>
          </SettingField>

          <SettingField>
            <Checkbox checked={apiTokenAccess} onChange={() => setApiTokenAccess((v) => !v)}>
              <Label>Allow API token access</Label>
              <Hint>
                Team members will authenticate API requests using their email address and a token.
              </Hint>
            </Checkbox>
          </SettingField>
        </SettingsList>

        <PartnerExtensionsBlock>
          <PartnerSetting>
            <SettingField>
              <Checkbox
                checked={partnerExtensions || partners.length > 0}
                disabled={partners.length > 0}
                onChange={() => setPartnerExtensions(!partnerExtensions)}
              >
                <Label>Incremental API partner extensions</Label>
                <Hint>
                  Extend partners&apos; time to migrate their apps from Incremental to Transactional
                  APIs for 60 days.
                </Hint>
              </Checkbox>
            </SettingField>
          </PartnerSetting>

          {(partnerExtensions || partners.length > 0) && (
            <PartnersPanel>
              <PartnersToolbar>
                <PartnersCount tag="div">
                  {partners.length} Partners with an extension
                </PartnersCount>
                <FloraOutlineButton onClick={openModal}>
                  Add partners
                </FloraOutlineButton>
              </PartnersToolbar>

              <TableWrap>
                <Table isReadOnly>
                  <Table.Head>
                    <Table.HeaderRow>
                      <Table.HeaderCell>Partner</Table.HeaderCell>
                      <Table.HeaderCell>Extension status</Table.HeaderCell>
                      <Table.HeaderCell>Extension expires</Table.HeaderCell>
                    </Table.HeaderRow>
                  </Table.Head>
                  <Table.Body>
                    {partners.length === 0 ? (
                      <Table.Row>
                        <Table.Cell colSpan={3}>
                          <EmptyCell>
                            <EmptyTitle>No partners with an extension</EmptyTitle>
                            <SM tag="div">
                              Add partners to extend Incremental API access for 60 days.
                            </SM>
                          </EmptyCell>
                        </Table.Cell>
                      </Table.Row>
                    ) : (
                      partners.map((partner) => {
                        const status = extensionStatus(partner.expiresAt)
                        return (
                          <Table.Row key={partner.id}>
                            <Table.Cell>{partner.name}</Table.Cell>
                            <Table.Cell>
                              <StatusTag isPill $status={status}>
                                {status}
                              </StatusTag>
                            </Table.Cell>
                            <Table.Cell>{partner.expirationDate}</Table.Cell>
                          </Table.Row>
                        )
                      })
                    )}
                  </Table.Body>
                </Table>
              </TableWrap>
            </PartnersPanel>
          )}
        </PartnerExtensionsBlock>
      </ScrollArea>

      <Footer>
        <Button isBasic>Cancel</Button>
        <Button isPrimary>Save</Button>
      </Footer>

      {modalOpen && (
        <FloraModal onClose={closeModal}>
          <ModalHeader tag="h2">Add partners</ModalHeader>
          <Close aria-label="Close modal" />
          <ModalBody>
            <MD tag="p" style={{ margin: 0 }}>
              Select the connected partners that will be allowed to use Incremental APIs for 60
              days. Once they are added they will not be removed until the 60 days is complete.
            </MD>
            {availableToAdd.length === 0 ? (
              <ModalEmptyState>
                <MD tag="p" style={{ margin: 0 }}>
                  All partners have been added.
                </MD>
              </ModalEmptyState>
            ) : isV2 ? (
              <ComboboxWrap>
                <ComboboxField>
                  <ComboboxLabel>Partners</ComboboxLabel>
                  <Combobox
                    isAutocomplete
                    isMultiselectable
                    maxTags={1}
                    renderExpandTags={(hiddenCount) =>
                      `+${hiddenCount} partner${hiddenCount === 1 ? '' : 's'}`
                    }
                    listboxAppendToNode={document.body}
                    listboxMaxHeight="400px"
                    listboxZIndex={12000}
                    listboxAriaLabel="Partners"
                    placeholder={selectedIds.length > 0 ? '' : 'Search partners'}
                    inputValue={searchValue}
                    selectionValue={selectedIds}
                    onChange={({ inputValue, selectionValue }) => {
                      if (inputValue !== undefined) setSearchValue(inputValue)
                      if (selectionValue !== undefined) {
                        setSelectedIds(
                          Array.isArray(selectionValue) ? selectionValue : [],
                        )
                      }
                    }}
                  >
                    {availableToAdd.length === 0 ? (
                      <Option isDisabled value="__no-matches" label="No matches found" />
                    ) : (
                      availableToAdd.map((partner) => {
                        const query = searchValue.trim().toLowerCase()
                        const matches =
                          !query || partner.name.toLowerCase().includes(query)
                        const isSelected = selectedIds.includes(partner.id)
                        // Keep selected options mounted (hidden) so tags / "+ N partners"
                        // still count them when search filters the list.
                        if (!matches && !isSelected) return null
                        return (
                          <Option
                            key={partner.id}
                            value={partner.id}
                            label={partner.name}
                            isHidden={!matches}
                            tagProps={{ isPill: false }}
                          />
                        )
                      })
                    )}
                  </Combobox>
                </ComboboxField>
              </ComboboxWrap>
            ) : (
              <PartnerList>
                <PartnerListHeader>
                  <Field>
                    <Checkbox
                      checked={allAvailableSelected}
                      indeterminate={someAvailableSelected}
                      onChange={toggleSelectAll}
                    >
                      <Label hidden>Select all partners</Label>
                    </Checkbox>
                  </Field>
                  <PartnerListHeaderLabel>Partners</PartnerListHeaderLabel>
                </PartnerListHeader>
                {availableToAdd.map((partner) => (
                  <PartnerOption key={partner.id}>
                    <Field>
                      <Checkbox
                        checked={selectedIds.includes(partner.id)}
                        onChange={() => toggleSelected(partner.id)}
                      >
                        <Label isRegular>{partner.name}</Label>
                      </Checkbox>
                    </Field>
                  </PartnerOption>
                ))}
              </PartnerList>
            )}
          </ModalBody>
          <ModalFooter>
            <FloraFooterItem>
              <FloraModalCancel onClick={closeModal}>Cancel</FloraModalCancel>
            </FloraFooterItem>
            <FloraFooterItem>
              <FloraModalSave onClick={savePartners}>Save</FloraModalSave>
            </FloraFooterItem>
          </ModalFooter>
        </FloraModal>
      )}
    </Page>
  )
}

export default ApiConfigurationPage
