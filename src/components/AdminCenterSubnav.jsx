import styled from 'styled-components';

const SubnavContainer = styled.aside`
  display: flex;
  flex-direction: column;
  width: 240px;
  height: 100%;
  background-color: #f8f9f9;
  padding: 8px;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 12px;
  width: 100%;
`;

const HeaderTitle = styled.h2`
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: -0.45px;
  color: #2f3941;
  margin: 0;
  padding: 4px 0;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: 12px;
  width: 100%;
`;

const SectionLabel = styled.p`
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: -0.0004px;
  color: #5c6970;
  margin: 0;
  padding: 12px 12px 4px;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  border: none;
  border-radius: 8px;
  background-color: ${(p) => (p.$isCurrent ? '#293239' : 'transparent')};
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${(p) => (p.$isCurrent ? '#293239' : 'rgba(92, 105, 112, 0.08)')};
  }

  &:active {
    background-color: ${(p) => (p.$isCurrent ? '#293239' : 'rgba(92, 105, 112, 0.16)')};
  }
`;

const NavLabel = styled.span`
  flex: 1;
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: ${(p) => (p.$isCurrent ? '#ffffff' : '#2f3941')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SECTIONS = [
  {
    label: 'Apps and integrations',
    isHeader: true,
    items: [
      { id: 'support-apps', label: 'Zendesk Support apps' },
      { id: 'channel-apps', label: 'Channel apps' },
      { id: 'app-builder', label: 'App builder' },
    ],
  },
  {
    label: 'Integrations',
    items: [
      { id: 'integrations', label: 'Integrations' },
      { id: 'conversations-integrations', label: 'Conversations integrations' },
      { id: 'logs', label: 'Logs' },
    ],
  },
  {
    label: 'Actions',
    items: [
      { id: 'custom-actions', label: 'Custom actions' },
      { id: 'action-flows', label: 'Action flows' },
      { id: 'code-flows', label: 'Code flows' },
      { id: 'mcp-connections', label: 'MCP connections' },
    ],
  },
  {
    label: 'APIs',
    items: [
      { id: 'conversations-api', label: 'Conversations API' },
      { id: 'api-configuration', label: 'API configuration' },
      { id: 'api-tokens', label: 'API tokens' },
      { id: 'oauth-clients', label: 'OAuth clients' },
      { id: 'external-oauth-clients', label: 'External OAuth clients' },
      { id: 'api-analytics', label: 'API analytics' },
    ],
  },
  {
    label: 'Connections',
    items: [
      { id: 'connections', label: 'Connections' },
      { id: 'connections-oauth', label: 'OAuth Clients' },
    ],
  },
  {
    label: 'Targets',
    items: [
      { id: 'targets', label: 'Targets' },
    ],
  },
];

export const AdminCenterSubnav = ({ currentItem = 'api-configuration', onSelect }) => {
  return (
    <SubnavContainer>
      <Header>
        <HeaderTitle>Apps and integrations</HeaderTitle>
      </Header>

      {SECTIONS.map((section, idx) => (
        <Section key={section.label}>
          {idx > 0 && <SectionLabel>{section.label}</SectionLabel>}
          {section.items.map((item) => (
            <NavItem
              key={item.id}
              $isCurrent={item.id === currentItem}
              onClick={() => onSelect?.(item.id)}
            >
              <NavLabel $isCurrent={item.id === currentItem}>{item.label}</NavLabel>
            </NavItem>
          ))}
        </Section>
      ))}
    </SubnavContainer>
  );
};

export default AdminCenterSubnav;
