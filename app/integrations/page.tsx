'use client'

import React from 'react'
import { useIntegrations } from './hooks/useIntegrations'
import IntegrationCard from './components/IntegrationCard'
import SetupForm from './components/SetupForm'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
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
    handleSaveSetup,
  } = useIntegrations()

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

        {/* Informational Banner: How Action Item Sync Works */}
        <div className="bg-[#FFF2EA] border border-[#FF5A0A]/20 rounded-[20px] p-5 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-[10px] bg-[#FF5A0A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
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

        {/* Modal setup form if active */}
        {setupMode && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[24px] border border-black/[0.08] p-6 max-w-md w-full shadow-2xl"
            >
              <SetupForm
                platform={setupMode}
                setupData={setupData}
                onSave={handleSaveSetup}
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
