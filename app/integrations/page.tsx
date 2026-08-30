'use client'

import React, { useState } from 'react'
import { useIntegrations } from './hooks/useIntegrations'
import IntegrationCard from './components/IntegrationCard'
import SetupForm from './components/SetupForm'
import { motion } from 'framer-motion'
import { Info, Key, X, ExternalLink } from 'lucide-react'
import { useUsage } from '../contexts/UsageContext'

function Integrations() {
  const { usage } = useUsage()
  const isFreePlan = !usage || usage.currentPlan === 'free' || usage.subscriptionStatus !== 'active'

  const {
    integrations,
    setupMode,
    setSetupMode,
    setupData,
    setSetupData,
    setupLoading,
    fetchSetupData,
    handleConnect,
    handleDisconnect,
    handleSetupSubmit,
    jiraConnectMode,
    setJiraConnectMode,
    jiraConnectError,
    handleJiraConnect,
  } = useIntegrations()

  const [jiraEmail, setJiraEmail] = useState('')
  const [jiraApiToken, setJiraApiToken] = useState('')
  const [jiraSiteUrl, setJiraSiteUrl] = useState('')

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="space-y-6"
      >
        {/* Header Section */}
        <div>
          <h2 className="text-2xl font-bold text-[#111111] tracking-[-0.03em] mb-1">
            App Integrations
          </h2>
          <p className="text-sm text-[#5A5A5A] font-normal tracking-[-0.01em] leading-[1.6]">
            Connect your workspace tools to automatically sync action items and post meeting summaries.
          </p>
        </div>

        {/* Info Banner */}
        <div className="rounded-[20px] border border-[#FF5A0A]/20 bg-[#FFF9F6] p-4 text-[#111111] shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FF5A0A]/10 text-[#FF5A0A] flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div className="space-y-1 text-xs leading-relaxed text-[#111111]">
              <h4 className="font-semibold text-sm text-[#FF5A0A] tracking-[-0.02em]">
                How Action Item Sync Works
              </h4>
              <p className="text-[#5A5A5A] font-normal tracking-[-0.01em] leading-[1.6]">
                When your AI bot processes a meeting, it extracts actionable tasks. Click{' '}
                <strong className="text-[#111111] font-semibold">"Add to [Platform]"</strong> on any meeting details page to instantly push action items directly to your connected Slack channel, Trello board, Jira backlog, or Asana project.
              </p>
            </div>
          </div>
        </div>

        {/* Jira API Token Connect Modal */}
        {jiraConnectMode && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[24px] border border-black/[0.08] p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[12px] bg-[#0052CC]/10 flex items-center justify-center">
                    <Key className="w-4 h-4 text-[#0052CC]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-[#111111] tracking-[-0.02em]">Connect Jira</h3>
                    <p className="text-[11px] text-[#808080]">Using API Token</p>
                  </div>
                </div>
                <button
                  onClick={() => setJiraConnectMode(false)}
                  className="w-8 h-8 rounded-full bg-[#F4F4F4] hover:bg-[#EBEBEB] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-[#5A5A5A]" />
                </button>
              </div>

              <div className="bg-[#F0F7FF] rounded-[14px] border border-[#0052CC]/10 p-3.5 mb-5">
                <p className="text-xs text-[#0052CC] leading-relaxed">
                  To get your API token, go to{' '}
                  <a
                    href="https://id.atlassian.com/manage-profile/security/api-tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline underline-offset-2 inline-flex items-center gap-0.5"
                  >
                    Atlassian API Tokens <ExternalLink className="w-3 h-3" />
                  </a>
                  {' '}→ click <strong>&quot;Create API token&quot;</strong>.
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1.5">Atlassian Email</label>
                  <input
                    type="email"
                    value={jiraEmail}
                    onChange={e => setJiraEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-10 rounded-[12px] border border-black/[0.12] bg-white px-3.5 text-sm text-[#111111] placeholder:text-[#AAAAAA] focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC]/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1.5">API Token</label>
                  <input
                    type="password"
                    value={jiraApiToken}
                    onChange={e => setJiraApiToken(e.target.value)}
                    placeholder="ATATT3xFfGF0..."
                    className="w-full h-10 rounded-[12px] border border-black/[0.12] bg-white px-3.5 text-sm text-[#111111] placeholder:text-[#AAAAAA] focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC]/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1.5">Jira Site URL</label>
                  <input
                    type="text"
                    value={jiraSiteUrl}
                    onChange={e => setJiraSiteUrl(e.target.value)}
                    placeholder="yoursite.atlassian.net"
                    className="w-full h-10 rounded-[12px] border border-black/[0.12] bg-white px-3.5 text-sm text-[#111111] placeholder:text-[#AAAAAA] focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC]/40 transition-all"
                  />
                </div>

                {jiraConnectError && (
                  <div className="bg-red-50 border border-red-200 rounded-[12px] px-3.5 py-2.5 text-xs text-red-600 font-medium">
                    {jiraConnectError}
                  </div>
                )}

                <div className="flex gap-2.5 pt-1">
                  <button
                    onClick={() => setJiraConnectMode(false)}
                    type="button"
                    className="flex-1 h-10 bg-white border border-black/[0.12] hover:bg-[#F8F6F1] text-[#111111] text-xs font-semibold rounded-[12px] transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleJiraConnect(jiraEmail, jiraApiToken, jiraSiteUrl)}
                    disabled={setupLoading || !jiraEmail || !jiraApiToken || !jiraSiteUrl}
                    type="button"
                    className="flex-1 h-10 bg-[#0052CC] hover:bg-[#0747A6] disabled:bg-[#AAAAAA] text-white text-xs font-semibold rounded-[12px] transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    {setupLoading ? 'Connecting...' : 'Connect Jira'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Setup Form Modal (for project selection after connect) */}
        {setupMode && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[24px] border border-black/[0.08] p-6 max-w-md w-full shadow-2xl"
            >
              <SetupForm
                platform={setupMode}
                data={setupData}
                onSubmit={handleSetupSubmit}
                onCancel={() => {
                  setSetupMode(null)
                  setSetupData(null)
                  window.history.replaceState({}, '', '/integrations')
                }}
                loading={setupLoading}
              />
            </motion.div>
          </div>
        )}

        {/* Integration Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.platform}
              integration={integration}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              isFreePlan={isFreePlan}
              onSetup={(platform) => {
                setSetupMode(platform)
                fetchSetupData(platform)
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Integrations
