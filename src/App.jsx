import { useState } from 'react'
import styled from 'styled-components'
import { ThemeProvider } from '@zendeskgarden/react-theming'
import { TopBar, MainNav } from 'zendesk-globalnav-template/chrome'
import PrototypeBar from './prototype-bar/PrototypeBar'
import CommentLayer from './comments/CommentLayer'
import { AdminCenterSubnav } from './components/AdminCenterSubnav'
import { ApiConfigurationPage } from './components/ApiConfigurationPage'
import { VERSIONS } from './data/partners'
import './App.css'

const OuterShell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  background-color: #f8f9f9;
  position: relative;
  isolation: isolate;
`

const AppShell = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
  position: relative;
  isolation: isolate;
`

const Workspace = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  z-index: 1;
  overflow: hidden;
  min-height: 0;
`

const NavRails = styled.div`
  display: flex;
`

const Main = styled.main`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: 4px;
  isolation: isolate;
  background: #ffffff;
  box-shadow: 0px 0px 4px rgba(10, 13, 14, 0.16);
  border-radius: 8px 0 0 0;
  flex: 1;
  align-self: stretch;
  overflow: hidden;
  min-width: 0;
`

function App() {
  const [activeNavItem, setActiveNavItem] = useState(7)
  const [isSubnavExpanded, setIsSubnavExpanded] = useState(false)
  const [currentSubnavItem, setCurrentSubnavItem] = useState('api-configuration')
  const [commentSlot, setCommentSlot] = useState(null)
  const [version, setVersion] = useState('v1')

  return (
    <ThemeProvider>
      <OuterShell>
        <PrototypeBar
          title="Incremental API blocking program"
          meta="Started Sept 2026"
          versions={VERSIONS}
          versionId={version}
          onVersionChange={setVersion}
          versionLabel="Version"
          commentSlotRef={setCommentSlot}
        />
        <AppShell>
          <TopBar currentProduct="admin-center" onProductChange={() => {}} />
          <Workspace>
            <NavRails>
              <MainNav
                currentProduct="admin-center"
                activeNavItem={activeNavItem}
                setActiveNavItem={setActiveNavItem}
                isSubnavExpanded={isSubnavExpanded}
                setIsSubnavExpanded={setIsSubnavExpanded}
              />
              <AdminCenterSubnav
                currentItem={currentSubnavItem}
                onSelect={setCurrentSubnavItem}
              />
            </NavRails>
            <Main data-comment-root="true">
              <ApiConfigurationPage version={version} />
            </Main>
          </Workspace>
        </AppShell>
        <CommentLayer
          toggleContainer={commentSlot}
          context={{ version }}
          onRestoreContext={(saved) => {
            if (saved.version === 'v1' || saved.version === 'v2') setVersion(saved.version)
          }}
        />
      </OuterShell>
    </ThemeProvider>
  )
}

export default App
